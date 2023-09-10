import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie"

import { makeStyles, AppBar, Toolbar, Typography, Button, IconButton, MenuItem, Avatar } from "@material-ui/core"
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import { AuthContext } from '../lib/AuthContext';

import { signOut } from '../api/auth';
import GuestLoginButton from './Auth/GuestLoginButton';
import { UserDataContext } from '../contexts/UserDataContext';

const useStyles = makeStyles((theme) => ({
  iconButton: {
    marginRight: theme.spacing(2),
  },
  appBar: {
    padding: '10px 30px',
    backgroundColor: '#deb887',
    [theme.breakpoints.down('xs')]: {
      padding: '5px'
    }
  },
  headerImageArea: {
    margin: 'auto',
    [theme.breakpoints.down('xs')]: {
      margin: 'auto',
    }
  },
  headerImage: {
    maxWidth: '200px',
    height: '50px',
  },
  avatar: {
    marginLeft: '10px',
    cursor: 'pointer',
  },
  linkBtn: {
    textTransform: "none"
  },
  menuLinks: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginRight: theme.spacing(2),
      textDecoration: 'none',
      color: 'inherit',
    }
  },
  signOutHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    }
  },
  singInHeader: {
    display: 'flex',
  },
  signInUserInfo: {
    position: 'absolute',
    top: '12px',
    right: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  signOutUserInfo: {
    position: 'absolute',
    top: '20px',
    right: '10px',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      position: 'static',
      margin: '10px auto',
    }
  },
  currentUserName: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    }
  }
}))

const Header = () => {
  const { loading, isSignedIn, setIsSignedIn, currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  console.log('loading', loading)
  console.log('isSignedIn', isSignedIn)

  const handleSignOut = async () => {
    try {
      const response = await signOut();

      if (response.data.success === true) {
        Cookies.remove('_access_token')
        Cookies.remove('_client')
        Cookies.remove('_uid')
        Cookies.remove('_expiry')
        Cookies.remove('_token-type')
        Cookies.remove('isGuest')

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
      if (!isSignedIn) {
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
            <GuestLoginButton />
          </>
        )
      }
    }
  };

  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <div className={isSignedIn ? classes.singInHeader : classes.signOutHeader}>
          <div className={classes.headerImageArea}>
            <Link to='/'>
              <img
                src="/shomacafe_logo.png"
                alt="ヘッダーロゴ"
                className={classes.headerImage}
              />
            </Link>
          </div>
          <div className={isSignedIn ? classes.signInUserInfo : classes.signOutUserInfo}>
            <AuthButtons />
            <p className={classes.currentUserName}>{isSignedIn ? currentUser && currentUser.name : '' }</p>
            {isSignedIn &&
              <Avatar
                className={classes.avatar}
                alt='ユーザーアイコン'
                src={currentUser && currentUser.userImage.url || '/default_user_icon.png'}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              />
            }
          </div>
        </div>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        style={{ margin: '40px auto' }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        { isSignedIn ? (
          <>
            <MenuItem component={Link} to='/new/project' onClick={() => setAnchorEl(null)}>
              プロジェクトをはじめる
            </MenuItem>
            <MenuItem component={Link} to="/my_projects" onClick={() => setAnchorEl(null)}>
              作成したプロジェクト一覧
            </MenuItem>
            <MenuItem component={Link} to="/projects" onClick={() => setAnchorEl(null)}>
              プロジェクトをさがす
            </MenuItem>
            <MenuItem component={Link} to="/purchases" onClick={() => setAnchorEl(null)}>
              購入履歴
            </MenuItem>
            <MenuItem component={Link} to="/account" onClick={() => setAnchorEl(null)}>
              アカウント
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleSignOut();
              }}
            >
              ログアウト
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} to='/new/project' onClick={() => setAnchorEl(null)}>
              プロジェクトをはじめる
            </MenuItem>
            <MenuItem component={Link} to="/projects" onClick={() => setAnchorEl(null)}>
              プロジェクトをさがす
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  )
}

export default Header
