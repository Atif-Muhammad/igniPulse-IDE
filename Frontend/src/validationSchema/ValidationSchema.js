import * as Yup from "yup";

const getValidationSchema = (isSignup)=>{
  return Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Min 6 characters").required("Required"),
  ...(isSignup && {
    username: Yup.string().min(3, "Min 3 characters").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  }),
});
}

export default getValidationSchema;