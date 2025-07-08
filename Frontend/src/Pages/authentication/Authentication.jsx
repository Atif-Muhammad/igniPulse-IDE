import { useState } from "react";
import { useFormik } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import getValidationSchema from "../../validationSchema/ValidationSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../../../Config/config";
import { useTheme } from "../../context/ThemeContext";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function AuthSwitcherWithFormik() {
  const [isSignup, setIsSignup] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toggleMode = () => setIsSignup((prev) => !prev);
  const { darkTheme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (formValues) => {
      return isSignup
        ? await config.createUser(formValues)
        : await config.loginUser(formValues);
    },
    onSuccess: (data, variables, context) => {
      if (data?.status === 200) {
        queryClient.invalidateQueries(["currentUser"]);
        navigate("/");
        toast.success(
          isSignup ? "Account created successfully!" : "Logged in successfully!"
        );
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (values) => {
    if (isSignup && values.password !== values.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    if (isSignup) {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("name", values.username);
      formData.append("role", "User");
      if (imageFile) {
        formData.append("image", imageFile);
      }
      mutate(formData);
    } else {
      const data = {
        email: values.email,
        password: values.password,
      };
      mutate(data);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: getValidationSchema(isSignup),
    onSubmit: handleSubmit,
  });

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${
        darkTheme ? " text-white" : " text-black"
      }`}
    >
      {/* React Hot Toast Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          style: {
            border: "1px solid",
            padding: "16px",
            color: darkTheme ? "#fff" : "#000",
            background: darkTheme ? "#1f2937" : "#fff",
            borderColor: darkTheme ? "#374151" : "#e5e7eb",
          },
        }}
      />

      <div
        className={`relative w-full max-w-2xl h-[600px] rounded-3xl shadow-2xl transition-all duration-300 border overflow-hidden ${
          darkTheme
            ? "bg-gray-900 border-blue-500 text-white"
            : "bg-white border-sky-700 text-black"
        }`}
      >
        {/* Switcher */}
        <div className="absolute top-5 right-5 z-10">
          <button
            onClick={toggleMode}
            className="text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-500 transition"
          >
            {isSignup ? "Go to Sign In" : "Create Account"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isSignup ? "signup" : "signin"}
            initial={{ x: isSignup ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: isSignup ? "-100%" : "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onSubmit={formik.handleSubmit}
            className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center gap-6 overflow-y-hidden"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-1">
                {isSignup ? "Create Account" : "Sign In"}
              </h2>
              <p className="text-sm text-gray-400">
                {isSignup ? "Join us today!" : "Welcome back 👋"}
              </p>
            </div>

            {/* Username */}
            {isSignup && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`pl-10 pr-4 py-3 w-full text-sm rounded-md border outline-none transition focus:ring-2 focus:ring-blue-500 ${
                    darkTheme
                      ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                      : "bg-gray-100 text-black border-gray-300 placeholder-gray-500"
                  }`}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.username}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`pl-10 pr-4 py-3 w-full text-sm rounded-md border outline-none transition focus:ring-2 focus:ring-blue-500 ${
                  darkTheme
                    ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                    : "bg-gray-100 text-black border-gray-300 placeholder-gray-500"
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`pl-10 pr-4 py-3 w-full text-sm rounded-md border outline-none transition focus:ring-2 focus:ring-blue-500 ${
                  darkTheme
                    ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                    : "bg-gray-100 text-black border-gray-300 placeholder-gray-500"
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            {isSignup && (
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`pl-10 pr-4 py-3 w-full text-sm rounded-md border outline-none transition focus:ring-2 focus:ring-blue-500 ${
                    darkTheme
                      ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                      : "bg-gray-100 text-black border-gray-300 placeholder-gray-500"
                  }`}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md text-sm font-semibold transition ${
                loading
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              {loading
                ? isSignup
                  ? "Signing up..."
                  : "Signing in..."
                : isSignup
                ? "Sign Up"
                : "Sign In"}
            </button>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}
