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
  },
  errorText: {
    color: 'red',
  },
}))

const SignUpForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    name: '',
    password: '',
    passwordConfirmation: '',
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true)

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
      if (error.response && error.response.data && error.response.data.errors) {
        const apiErrors = error.response.data.errors
        console.log(apiErrors)

        setErrorMessages({
          name: apiErrors.name ?　apiErrors.name[0] : '',
          password: apiErrors.password ? apiErrors.password.find((e) => e.includes('パスワード')) || '' : '',
          passwordConfirmation: apiErrors.passwordConfirmation ? apiErrors.passwordConfirmation.find((e) => e.includes('確認用パスワード')) || '' : '',
        })
      }
      console.log(error);
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
              helperText={
                ((isFormSubmitted && name === '') && <span className={classes.errorText}>名前を入力してください。</span>) ||
                <span className={classes.errorText}>{errorMessages.name}</span>
              }
            />
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
              helperText={
                (isFormSubmitted && password === '' && <span className={classes.errorText}>パスワードを入力してください。</span>) ||
                <span className={classes.errorText}>{errorMessages.password}</span>
              }
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
              helperText={
                ((isFormSubmitted && passwordConfirmation ) === '' && <span className={classes.errorText}>パスワード確認を入力してください。</span>) ||
                isFormSubmitted && <span className={classes.errorText}>{errorMessages.passwordConfirmation}</span>
              }
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
