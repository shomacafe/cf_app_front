import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../../api/auth';
import { AuthContext } from '../../lib/AuthContext';


const SignInForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState('');
  const { authenticated, setAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if(authenticated) {
      navigate('/');
      alert('すでにログインしています。');
    }
  }, [authenticated, navigate]);

  const handleSignIn = async () => {
    try {
      const data = {
        email: email,
        password: password,
      };

      const response = await signIn(data);
      setAuthenticated(true);

      navigate('/');
      alert('ログインしました。');
    } catch (error) {
      if (error.response) {
        alert('ログイン失敗しました。')
        console.log('ログイン失敗：', error.response.data);
      } else {
        alert('ログイン失敗しました。')
        console.log('ログイン失敗：', error.message);
      }
    }
  };

  return (
    <>
      <div>
        <h1>ログインページ</h1>
        <p><input type="email" placeholder='メールアドレス' onChange={(e) => setEmail(e.target.value)} /></p>
        <p><input type="password" placeholder='パスワード' onChange={(e) => setPassword(e.target.value)} /></p>
        <div>
          <button onClick={handleSignIn}>ログイン</button>
        </div>
      </div>
      <div>
        新規登録ページは<Link to={`/signup_form/`}>こちら</Link>
      </div>
      <Link to={`/`}>ホームに戻る</Link>
    </>
  )
}

export default SignInForm
