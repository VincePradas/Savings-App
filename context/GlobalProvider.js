
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, signOut } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsLogged(false);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setIsLogged(true);
          setUser(currentUser);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setIsLogged(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, []); 

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        setLoading,
        handleLogout, 
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
