import { useState } from "react";
import { useFormik } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import getValidationSchema from "../../validationSchema/ValidationSchema";
import {useMutation} from "@tanstack/react-query"
import config from "../../../Config/config";

export default function AuthSwitcherWithFormik() {
  const [isSignup, setIsSignup] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const toggleMode = () => setIsSignup((prev) => !prev);
  const { mutate, data, loading, error } = useMutation({
    mutationFn: async (formValues) => {
      return isSignup
      ? await config.createUser(formValues)
      : await config.loginUser(formValues);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setProfileImage(URL.createObjectURL(file));
  //     setImageFile(file);
  //   }
  // };

  const handleSubmit = (values) => {
    if (isSignup && values.password !== values.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // alert(authMode === "signin" ? "Signed In" : "Account Created");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-white p-4">
      <div className="relative w-full max-w-3xl h-[520px] bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Switcher Panel */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleMode}
            className="text-sm bg-white text-black px-4 py-1 rounded hover:bg-gray-200 transition"
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
            transition={{ duration: 0.4 }}
            onSubmit={formik.handleSubmit}
            className="absolute inset-0 p-10 flex flex-col justify-center gap-4"
          >
            <h2 className="text-3xl font-bold">
              {isSignup ? "Create Account" : "Sign In"}
            </h2>

            {isSignup && (
              <>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-sm text-red-500">
                    {formik.errors.username}
                  </p>
                )}
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}

            {isSignup && (
              <>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </>
            )}

            <button
              type="submit"
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}
