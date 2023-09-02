import React, { useContext } from 'react';
import { AuthContext } from '../../lib/AuthContext';
import { guestSignIn } from '../../api/auth';
import { Button } from '@material-ui/core'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const GuestLoginButton = () => {
  const { setIsSignedIn, setCurrentUser, setIsGuest } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGuestLogin = async (e) => {
    try {
      const response = await guestSignIn();

      if (response.status === 200) {
        setIsSignedIn(true);
        setCurrentUser(response.data.data);
        setIsGuest(true);

        Cookies.set('isGuest', 'true');

        Cookies.set('_access_token', response.headers['access-token']);
        Cookies.set('_client', response.headers['client']);
        Cookies.set('_uid', response.headers['uid']);

        console.log('ゲストユーザーの情報がセットされました')
        alert('ゲストログインしました。')
        navigate('/')
      } else {
        // ゲストログインに失敗した場合の処理
        console.error('ゲストログインに失敗しました');
      }
    } catch (error) {
      console.error('ゲストログインエラー:', error);
    }
  };

  return (
    <Button
      variant='contained'
      color='info'
      onClick={handleGuestLogin}
    >
      ゲストログイン
    </Button>
  );
};

export default GuestLoginButton;
