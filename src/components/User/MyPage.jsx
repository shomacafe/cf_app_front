import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../lib/AuthContext'
import { Link } from 'react-router-dom'
import {Typography, makeStyles, CircularProgress, Button, Card, CardContent, CardHeader, Avatar } from '@material-ui/core'
import Cookies from 'js-cookie'
import clientApi from '../../api/client'
import { UserDataContext } from '../../contexts/UserDataContext'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(6),
    maxWidth: 800,
    width: '100%',
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
  },
  box: {
    marginTop: "2rem"
  },
  link: {
    textDecoration: "none"
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    fontWeight: 'bold',
    margin: '10px 0',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 0),
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: theme.spacing(2),
  },
  value: {
    flex: 2,
  },
  avatar: {
    width: '120px',
    height: '120px',
    marginBottom: '1rem'
  },
  headline: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '3rem'
  },
}));

const MyPage = () => {
  const { userData, setUserData, loading } = useContext(UserDataContext);
  const { isGuest } = useContext(AuthContext);
  const classes = useStyles();

  console.log('isGuest', isGuest)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const headers = {
          'access-token': Cookies.get('_access_token'),
          'client': Cookies.get('_client'),
          'uid': Cookies.get('_uid'),
        };

        const userId = userData.id
        const response = await clientApi.get(`/users/${userId}`, {
          headers: headers,
        });

        setUserData(response.data);
        console.log('ユーザー', response.data);
      } catch (error) {
        console.error('API レスポンスの取得に失敗しました', error);
      }
    };

    fetchUserData();
  }, [])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <div className={classes.container}>
      <Card>
        <CardHeader className={classes.header} title="アカウント" />
        <CardContent>
          <div className={classes.box}>
            <div className={classes.headline}>
              <h2>プロフィール</h2>
              <Button
                variant='contained'
                size='large'
                color='primary'
                component={Link}
                to={'/profile/edit'}
                disabled={isGuest}
              >
                変更
              </Button>
            </div>
            <div className={classes.infoRow}>
              <Typography className={classes.label}>アイコン</Typography>
              <Typography className={classes.value}>
                {userData.userImage.url ? (
                  <Avatar className={classes.avatar} alt='ユーザーアイコン' src={userData.userImage.url} />
                ) : (
                  <img src="/default_user_icon.png" alt="Default User Icon" style={{ width: '100px' }} />
                )}
              </Typography>
            </div>
            <div className={classes.infoRow}>
              <Typography className={classes.label}>名前</Typography>
              <Typography className={classes.value}>{userData.name}</Typography>
            </div>
            <div className={classes.infoRow}>
              <Typography className={classes.label}>自己紹介</Typography>
              <Typography className={classes.value}>{userData.profile}</Typography>
            </div>
            <div className={classes.headline}>
              <h2>アカウント</h2>
              <Button
                variant='contained'
                size='large'
                color='primary'
                component={Link}
                to={`/account/edit`}
                disabled={isGuest}
              >
                変更
              </Button>
            </div>
            <div className={classes.infoRow}>
              <Typography className={classes.label}>メールアドレス</Typography>
              <Typography className={classes.value}>{userData.email}</Typography>
            </div>
            <div className={classes.infoRow}>
              <Typography className={classes.label}>パスワード</Typography>
              <Typography className={classes.value}>**********</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MyPage
