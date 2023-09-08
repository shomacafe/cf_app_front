import React, { createContext, useState, useEffect } from 'react'
import { getCurrentUser, getGuestUser } from '../api/auth';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  const initialIsGuest = Cookies.get('isGuest') === 'true';
  const [isGuest, setIsGuest] = useState(initialIsGuest);

  const handleGetCurrentUser = async () => {
    try {
      const response = await getCurrentUser();

      if (response?.data.isLogin === true) {
        setIsSignedIn(true);
        setCurrentUser(response?.data.data);
      }

      // Cookies.set("isGuest", "false");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };

  // const handleGetGuestUser = async () => {
  //   try {
  //     const response = await getGuestUser();

  //     if (response?.data) {
  //       setIsSignedIn(true);
  //       setCurrentUser(response?.data.data);
  //     }

  //     setIsGuest(true);
  //     console.log('currentUser', currentUser)

  //     Cookies.set("isGuest", "true");
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  // useEffect(() => {
  //   if(isGuest) {
  //     handleGetGuestUser();
  //   } else {
  //     handleGetCurrentUser();
  //   }
  // }, [isGuest, setCurrentUser])

  // console.log('isGuest', isGuest)

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        isSignedIn,
        setIsSignedIn,
        currentUser,
        setCurrentUser,
        isGuest,
        setIsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
