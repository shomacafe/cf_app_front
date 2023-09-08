import React, { useState, useContext } from 'react'
import { TextField, Button, makeStyles, Card, CardHeader, CardContent } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../lib/AuthContext';
import clientApi from '../../api/client';
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    width: '100%',
    maxWidth: '800px',
    margin: 'auto',
    [theme.breakpoints.down('xs')]: {
      padding: '0',
    },
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
    padding: theme.spacing(6),
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    }
  },
  form: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
  },
}))

const EditAccount = () => {
  const { currentUser } = useContext(AuthContext);
  const { handleSubmit, control } = useForm();
  const classes = useStyles();
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({
    password: '',
  });

  const onSubmit = async (data) => {
    const confirmResult = window.confirm('アカウントを更新してよろしいですか？');

    if (confirmResult) {
      try {
        const headers = {
          'access-token': Cookies.get('_access_token'),
          'client': Cookies.get('_client'),
          'uid': Cookies.get('_uid'),
        };

        const requestData = {
          email: data.email,
          current_password: data.currentPassword,
          password: data.password,
          password_confirmation: data.confirmPassword,
        };

        const response = await clientApi.put(`/account/update`, requestData, {
          headers: headers,
        });

        console.log('API レスポンス', response.data)
        alert('アカウントを更新しましたので、再度ログインをお願いいたします。')
        navigate('/signin_form');
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          const apiErrors = error.response.data.errors

          setErrorMessages({
            password: apiErrors.find((e) => e.includes('パスワード')) || '',
          })
        }

        console.log(errorMessages)
        console.error('API レスポンスの取得に失敗しました', error);
      }
    }
  };

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className={classes.card}>
          <CardHeader className={classes.header} title='アカウント編集' />
          <CardContent>
            <Controller
              name='email'
              control={control}
              defaultValue={currentUser.email}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='メールアドレス'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
            <div className={classes.form}>
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="現在のパスワード"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className={classes.form}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="新しいパスワード"
                    variant="outlined"
                    fullWidth
                    helperText={<span className={classes.errorText}>{errorMessages.password}</span>}
                  />
                )}
              />
            </div>
            <div className={classes.form}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="新しいパスワード（確認用）"
                    variant="outlined"
                    fullWidth
                    helperText={<span className={classes.errorText}>{errorMessages.password}</span>}
                  />
                )}
              />
            </div>
            <div className={classes.form}>
              <Button variant="contained" color="primary" component={Link} to={'/account'}>
                戻る
              </Button>
              <Button type="submit" variant="contained" color="primary">
                変更する
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default EditAccount
