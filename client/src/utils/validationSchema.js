import * as Yup from "yup";
import { countryList } from "./countryList";

export const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .matches(
      /^[A-Za-z ]{5,}$/,
      "Name must contain at least 5 alphabetic characters"
    ),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  gender: Yup.string()
    .required("Gender is required")
    .oneOf(["male", "female"], "Invalid gender"),
  phoneNo: Yup.string().required("Phone Number is required"),
  role: Yup.string()
    .required("Role is required")
    .oneOf(["tourist", "vendor"], "Invalid role"),
  country: Yup.string()
    .required("Country is required")
    .oneOf(countryList, "Invalid country"),
});
