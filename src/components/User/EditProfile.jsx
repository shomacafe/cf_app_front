import React, { useState, useContext, useEffect } from 'react'
import { TextField, Button, makeStyles, Card, CardHeader, CardContent, Avatar } from '@material-ui/core';
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
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  avatar: {
    width: '120px',
    height: '120px',
    marginBottom: '1rem'
  },
  avatarButton: {
    margin: '1rem',
  },
}))

const EditProfile = () => {
  const { handleSubmit, control, setValue, getValues } = useForm();
  const { userData, loading } = useContext(UserDataContext);
  const [avatarPreview, setAvatarPreview] = useState(userData.userImage?.url || '/default_user_icon.png')
  const [userImage, setUserImage] = useState();
  const classes = useStyles();
  const navigate = useNavigate();

  console.log('userData', userData)

  const onSubmit = async (data) => {
    const confirmResult = window.confirm('プロフィールを更新してよろしいですか？');

    if (confirmResult) {
      try {
        const headers = {
          'access-token': Cookies.get('_access_token'),
          'client': Cookies.get('_client'),
          'uid': Cookies.get('_uid'),
        };

        const requestData = new FormData();
        requestData.append('user[name]', data.name);
        requestData.append('user[profile]', data.profile);

        if (userImage) {
          requestData.append('user[user_image]', userImage);
        }

        const response = await clientApi.put(`/profile/update`, requestData, {
          headers: headers,
        });

        console.log('API レスポンス', response.data)
        navigate('/account');
      } catch (error) {
        console.error('API レスポンスの取得に失敗しました', error);
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setValue('avatar', file)
      setUserImage(file);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className={classes.card}>
          <CardHeader className={classes.header} title='プロフィール編集' />
          <CardContent>
            <div className={classes.avatarContainer}>
              <Avatar className={classes.avatar} alt='ユーザーアイコン' src={avatarPreview} />
              <input
                accept='image/*'
                className={classes.input}
                id='avatarInput'
                type='file'
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <label htmlFor='avatarInput'>
                <Button
                  className={classes.avatarButton}
                  variant='contained'
                  color='primary'
                  component='span'
                >
                  画像を選択
                </Button>
              </label>
            </div>
            <Controller
              name='name'
              control={control}
              defaultValue={userData.name}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='名前'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
            <div className={classes.form}>
              <Controller
                name="profile"
                control={control}
                defaultValue={userData.profile}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='プロフィール'
                    fullWidth
                    margin="normal"
                    minRows={4}
                    multiline
                    variant="outlined"
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

export default EditProfile
