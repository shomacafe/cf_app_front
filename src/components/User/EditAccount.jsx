import React, { useState, useContext } from 'react'
import { TextField, Button, makeStyles, Card, CardHeader, CardContent } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom';
import { UserDataContext } from '../../contexts/UserDataContext';
import clientApi from '../../api/client';
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
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
  },
  form: {
    marginTop: '2rem',
  }
}))

const EditAccount = () => {
  const { userData, loading } = useContext(UserDataContext);
  const { handleSubmit, control } = useForm();
  const classes = useStyles();
  const navigate = useNavigate();

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
        console.error('API レスポンスの取得に失敗しました', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className={classes.card}>
          <CardHeader className={classes.header} title='アカウント編集' />
          <CardContent>
            <Controller
              name='email'
              control={control}
              defaultValue={userData.email}
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
