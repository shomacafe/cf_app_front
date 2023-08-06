import React, { useContext } from 'react'
import { AppBar, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { AuthContext } from '../lib/AuthContext';
import SignOutButton from './Auth/SignOutButton';


const Header = () => {
  const { authenticated, uid } = useContext(AuthContext);

  return (
    <AppBar position='static' style={{ background: "pink" }}>
      <Toolbar>
        {authenticated ? (
        <div>
          <p>ログイン中</p>
          <p>ログインユーザー：{uid}</p>
          <SignOutButton />
          <Link to={`/`}>ホームへ</Link>
        </div>
        ):(
          <div>
            <Link to="/signup_form">新規登録</Link>
            <Link to="/signin_form">ログイン</Link>
            <Link to={`/`}>ホームへ</Link>
          </div>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
