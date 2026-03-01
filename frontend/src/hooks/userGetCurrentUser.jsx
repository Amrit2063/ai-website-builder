import { useEffect, useState } from "react";
import axios from "axios";

const useGetCurrentUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get("/api/user/me", { withCredentials: true });
        setUser(res.data);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    getCurrentUser();
  }, []);

  return user;
};

export default useGetCurrentUser;