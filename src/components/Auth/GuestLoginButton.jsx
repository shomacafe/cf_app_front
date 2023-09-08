import React, { useContext } from 'react';
import { AuthContext } from '../../lib/AuthContext';
import { guestSignIn } from '../../api/auth';
import { Button } from '@material-ui/core'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const GuestLoginButton = () => {
  const { setIsSignedIn, setCurrentUser, setIsGuest } = useContext(AuthContext);
  const navigate = useNavigate();

  // セッション情報の有効期限が切れると同時にCookieに保存したisGuest（ゲストフラグ）を削除する
  const monitorAuthExpiration = () => {
    const expiryTimestamp = parseInt(Cookies.get('_expiry'), 10) * 1000;

    const timeUntilExpiration = expiryTimestamp - Date.now();
    console.log('timeUntilExpiration', timeUntilExpiration)

    if (timeUntilExpiration > 0) {
      setTimeout(() => {
        Cookies.remove('isGuest');
      }, timeUntilExpiration);
    }
  };

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
        Cookies.set("_expiry", response.headers["expiry"]);
        Cookies.set("_token-type", response.headers["token-type"]);

        monitorAuthExpiration();

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
