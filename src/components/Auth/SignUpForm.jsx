import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { signUp } from '../../api/auth';


const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSignUp = async () => {
    try {
      const data = {
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      };

      const response = await signUp(data);

      console.log('ユーザー登録成功', response.data);
    } catch (error) {
      console.log('ユーザー登録失敗:', error.response.data)
    }
  }

  return (
    <>
      <h1>新規登録</h1>
      <div>
        <input type='email' placeholder='メールアドレス' onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <input type="password" placeholder='パスワード' onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <input type="password" placeholder='パスワード確認' onChange={(e) => setPasswordConfirmation(e.target.value)} />
      </div>
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
