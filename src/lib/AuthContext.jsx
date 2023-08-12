import React, { createContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../api/auth';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [uid, setUid] = useState('');

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const user = await getCurrentUser();
        setAuthenticated(!!user);

        if (user && user.data.id) {
          setUid(user.data.uid);
        }
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
    console.log('ログイン状態:', authenticated);
  }, [authenticated]);

  if (loading) {
    return <div>ロード中</div>
  }

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, uid, setUid }}>
      {children}
    </AuthContext.Provider>
  )
}

export {AuthContext, AuthProvider};
