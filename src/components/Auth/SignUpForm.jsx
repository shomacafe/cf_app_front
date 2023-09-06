import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie"

import { makeStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import TextField from "@material-ui/core/TextField"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"

import { signUp } from '../../api/auth';
import { AuthContext } from '../../lib/AuthContext';

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
  }
}))

const SignUpForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    const params = {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
    }

    try {
      const response = await signUp(params);

      if (response.status === 200) {
        Cookies.set("_access_token", response.headers["access-token"]);
        Cookies.set("_client", response.headers["client"]);
        Cookies.set("_uid", response.headers["uid"]);
        Cookies.set("_expiry", response.headers["expiry"]);
        Cookies.set("_token-type", response.headers["token-type"]);

        setIsSignedIn(true);
        setCurrentUser(response.data.data);

        navigate('/');
        alert('新規登録しました');
      } else {
        alert('新規登録できませんでした')
      }
    } catch (error) {
      console.log(error);
      alert('新規登録できませんでした')
    }
  };

  return (
    <div className={classes.container}>
      <form noValidate autoComplete='off'>
        <Card className={classes.card}>
          <CardHeader className={classes.header} title='新規登録' />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="名前"
              value={name}
              margin="dense"
              onChange={event => setName(event.target.value)}
            />
            <TextField
              variant='outlined'
              required
              fullWidth
              label='メールアドレス'
              value={email}
              margin='dense'
              onChange={(e) => setEmail(e.target.value)}
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
            />
            <TextField
              variant='outlined'
              required
              fullWidth
              label='パスワード確認'
              type='password'
              value={passwordConfirmation}
              margin='dense'
              autoComplete='current-password'
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <Button
              type='submit'
              variant='contained'
              size='large'
              fullWidth
              color='default'
              dasabled={!name || !email || !password || !passwordConfirmation ? true : false}
              className={classes.submitBtn}
              onClick={handleSignUp}
            >
              登録
            </Button>
            <Box textAlign='center' className={classes.box}>
              <Typography valiant='body2'>
                ログインは<Link to='/signin_form' className={classes.link}>こちら</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default SignUpForm
