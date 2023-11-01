/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/config";
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isUserFetched, setIsUserFetched] = useState(false);

  const saveUser = (userData) => {
    setUser(userData);
    setIsUserFetched(true);
  };

  const removeUser = () => {
    setUser(null);
    setIsUserFetched(true);
  };

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const fetchUser = async () => {
    if (!isUserFetched) {
      try {
        const { data } = await axios.get(`${BASE_URL}/users/showMe`,{withCredentials:true});
        saveUser(data.user);
      } catch (error) {
        removeUser();
      }
    }
    setIsLoading(false);
  };

  const logoutUser = async () => {
    try {
      await axios.delete(`${BASE_URL}/auth/logout`,{withCredentials:true});
      removeUser();
      toast.success("Logout Successfully")
    } catch (error) {
      toast.error(error.response.data.msg)
    }
  };

  useEffect(() => {
    fetchUser();
  }, [isUserFetched]);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        user,
        saveUser,
        logoutUser,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
