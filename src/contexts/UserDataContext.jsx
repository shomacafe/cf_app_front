import React, { createContext, useContext, useState } from 'react'
import { AuthContext } from '../lib/AuthContext';

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState(currentUser);

  return (
    <UserDataContext.Provider value={{userData, setUserData, loading}}>
      {children}
    </UserDataContext.Provider>
  )
}
