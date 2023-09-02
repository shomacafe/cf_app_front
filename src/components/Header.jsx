import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie"

import { makeStyles, Theme } from "@material-ui/core/styles"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"

import { AuthContext } from '../lib/AuthContext';

import { signOut } from '../api/auth';

const useStyles = makeStyles((theme) => ({
  iconButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textDecoration: "none",
    color: "inherit"
  },
  linkBtn: {
    textTransform: "none"
  }
}))

const Header = () => {
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const classes = useStyles();
  const navigate = useNavigate();

  console.log('loading', loading)
  console.log('isSignedIn', isSignedIn)

  const handleSignOut = async () => {
    try {
      const response = await signOut();

      if (response.data.success === true) {
        Cookies.remove('_access_token')
        Cookies.remove('_client')
        Cookies.remove('_uid')
        Cookies.remove('_expiry');
        Cookies.remove('_token-type');

        setIsSignedIn(false);
        navigate('/');

        alert('ログアウトしました。');
      } else {
        alert('ログアウトに失敗しました。');
      }
    } catch (error) {
      console.error('ログアウトエラー:', error.message);
    }
  };

  const AuthButtons = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <Button
            color='inherit'
            className={classes.linkBtn}
            onClick={handleSignOut}
          >
            ログアウト
          </Button>
        )
      } else {
        return (
          <>
            <Button
              component={Link}
              to='/signin_form'
              color='inherit'
              className={classes.linkBtn}
            >
              ログイン
            </Button>
            <Button
              component={Link}
              to='/signup_form'
              color="inherit"
              className={classes.linkBtn}
            >
              新規登録
            </Button>
          </>
        );
      }
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.iconButton}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            className={classes.title}
          >
            クラウドファンディングアプリ
          </Typography>
          <div>
            <Link to={`/new/project`}>プロジェクトをはじめる</Link>
          </div>
          <div>
            <Link to={`/my_projects`}>作成したプロジェクト一覧</Link>
          </div>
          <div>
            <Link to={`/projects`}>全てのプロジェクト一覧</Link>
          </div>
          <div>
            <Link to={'/purchases'}>購入履歴</Link>
          </div>
          <div>
            <Link to={'/account'}>　アカウント</Link>
          </div>
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
