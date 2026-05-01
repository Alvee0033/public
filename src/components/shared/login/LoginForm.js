import axios from "@/lib/axios"; // Import the configured Axios instance
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner"; // Import the toast function from sonner
import * as Yup from "yup";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string().required("Username or email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("/auth/login", values);
      const token = response.data?.data?.access_token;
      localStorage.setItem("auth-token", token);
      document.cookie = `auth-token=${token}; path=/; secure; HttpOnly; SameSite=Strict`;
      toast.success("User logged in successfully!");
      window.location.href = params.get("redirect") || "/";
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        if (error.response.status === 401) {
          toast.error("Invalid credentials. Please try again.");
        } else if (error.response.status === 500) {
          toast.error("Server error. Please try again later.");
        } else if (error.response.status === 404) {
          toast.error("User not found. Please sign up.");
        } else if (error.response.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Please check your network.");
      } else {
        // Something else happened while setting up the request
        toast.error("An error occurred. Please try again.");
      }
      console.error("Error logging in:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="opacity-100 transition-opacity duration-150 ease-linear">
      {/* heading */}
      <div className="text-center">
        <h3 className="text-size-32 font-bold text-blackColor  mb-2 leading-normal">
          Login
        </h3>
        <p className="text-contentColor  mb-15px">
          Already have an account?{" "}
          <Link
            href="/register"
            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            Sign up for free
          </Link>
        </p>
      </div>

      <Formik
        initialValues={{ email: "sayem@khan.com", password: "Sayem@1234" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="pt-25px">
            <div className="mb-25px">
              <label className="text-contentColor  mb-10px block">
                Username or email
              </label>
              <Field
                type="text"
                name="email"
                placeholder="Your username or email"
                className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor  border border-borderColor  placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-25px">
              <label className="text-contentColor  mb-10px block">
                Password
              </label>
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor  border border-borderColor  placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="text-contentColor  flex items-center justify-between">
              <div className="flex items-center">
                <Field type="checkbox" name="rememberMe" className="mr-2" />
                <label className="text-sm">Remember me</label>
              </div>
              <a
                href="forgot-password.html"
                className="text-sm hover:text-primaryColor"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full h-52px leading-52px bg-primaryColor text-white font-medium rounded mt-25px"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
