import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from "js-cookie"

import { makeStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import TextField from "@material-ui/core/TextField"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"

import { signIn } from '../../api/auth';
import { AuthContext } from '../../lib/AuthContext'
import GuestLoginButton from './GuestLoginButton'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtn: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    textTransform: "none"
  },
  header: {
    textAlign: "center"
  },
  card: {
    padding: theme.spacing(2),
    maxWidth: 400
  },
  box: {
    marginTop: "2rem"
  },
  link: {
    textDecoration: "none"
  },
  errorText: {
    color: 'red',
  },
}))


const SignInForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true)

    const params = {
      email: email,
      password: password
    }

    try {
      const response = await signIn(params);
      console.log(response);

      if (response.status === 200) {
        Cookies.set("_access_token", response.headers["access-token"]);
        Cookies.set("_client", response.headers["client"]);
        Cookies.set("_uid", response.headers["uid"]);
        Cookies.set("_expiry", response.headers["expiry"]);
        Cookies.set("_token-type", response.headers["token-type"]);

        setIsSignedIn(true);
        setCurrentUser(response.data.data);

        navigate('/');
        alert('ログインしました。');
      } else {
        alert('ログイン失敗しました。')
      }
    } catch (error) {
      setErrorMessages(error.response.data.errors && error.response.data.errors[0])
    }
  };

  return (
    <div className={classes.container}>
      <form noValidate autoComplete='off'>
        <Card className={classes.card}>
          <CardHeader className={classes.header} title='ログイン' />
          <CardContent>
            {isFormSubmitted && <span className={classes.errorText}>{errorMessages}</span>}
            <TextField
              variant='outlined'
              required
              fullWidth
              label='メールアドレス'
              value={email}
              margin='dense'
              onChange={(e) => setEmail(e.target.value)}
              helperText={isFormSubmitted && email === '' ? <span className={classes.errorText}>メールアドレスを入力してください。</span> : ''}
            />
            <TextField
              variant='outlined'
              required
              fullWidth
              label='パスワード'
              type='password'
              value={password}
              margin='dense'
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
              helperText={isFormSubmitted && password === '' ? <span className={classes.errorText}>パスワードを入力してください。</span> : ''}
            />
            <Button
              type='submit'
              variant='contained'
              size='large'
              fullWidth
              color='default'
              dasabled={!email || !password ? true : false}
              className={classes.submitBtn}
              onClick={handleSignIn}
            >
              ログイン
            </Button>
            <Box textAlign='center' className={classes.box}>
              <Typography valiant='body2'>
                新規登録ページは<Link to='/signup_form' className={classes.link}>こちら</Link>
              </Typography>
              <Typography style={{ marginTop: '15px' }}>ゲストログインはこちら</Typography>
              <GuestLoginButton />
            </Box>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default SignInForm
