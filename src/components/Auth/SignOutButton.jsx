import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../../api/auth'
import { AuthContext } from '../../lib/AuthContext'

const SignOutButton = () => {
  const navigate = useNavigate();
  const { authenticated, setAuthenticated } = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthenticated(false);

      alert('ログアウトしました。');
      navigate('/');
    } catch (error) {
      alert('ログアウトに失敗しました。');
      console.error('ログアウトエラー:', error.message);
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>ログアウト</button>
    </div>
  )
}

export default SignOutButton
