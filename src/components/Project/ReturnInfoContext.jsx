import React, { createContext, useState } from 'react'

export const ReturnInfoContext = createContext();

export const ReturnInfoProvider = ({ children }) => {
  const [returnData, setReturnData] = useState([]);

  return (
    <ReturnInfoContext.Provider value={{returnData, setReturnData}}>
      {children}
    </ReturnInfoContext.Provider>
  )
}
