import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUserId } from "@/redux/features/userSlice";

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded?.id) {
            dispatch(setUserId(decoded.id));
          }
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    }
  }, [dispatch]);
};

export default useAuth;
