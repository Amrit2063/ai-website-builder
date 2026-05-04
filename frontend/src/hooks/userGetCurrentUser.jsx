import { useEffect, useState } from "react";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const useGetCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get("/api/user/me", { withCredentials: true });
        setUser(res.data);
        dispatch(setUserData(res.data));
      } catch (err) {
        setError(err.response?.data?.message || "Unauthorized");
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, [dispatch]);

  return { user, loading, error };
};

export default useGetCurrentUser;
