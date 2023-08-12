import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { signUp } from '../../api/auth';
import { AuthContext } from '../../lib/AuthContext';


const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { authenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(authenticated) {
      navigate('/');
      alert('すでにログインしています。');
    }
  }, []);

  const handleSignUp = async () => {
    try {
      const data = {
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      };

      const response = await signUp(data);

      alert("新規登録しました。");
      console.log('ユーザー登録成功', response.data);
    } catch (error) {
      console.log('ユーザー登録失敗:', error.response.data)
    }
  }

  return (
    <>
      <h1>新規登録</h1>
      <p><input type='email' placeholder='メールアドレス' onChange={(e) => setEmail(e.target.value)} /></p>
      <p><input type="password" placeholder='パスワード' onChange={(e) => setPassword(e.target.value)} /></p>
      <p><input type="password" placeholder='パスワード確認' onChange={(e) => setPasswordConfirmation(e.target.value)} /></p>
      <div>
        <button onClick={handleSignUp}>登録する</button>
      </div>
      <div>
        ログインは<Link to='/signin_form'>こちら</Link>
      </div>
      <div>
        <Link to='/'>ホームに戻る</Link>
      </div>
    </>
  )
}

export default SignUpForm
