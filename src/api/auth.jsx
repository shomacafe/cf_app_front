import clientApi from './client';
import Cookies from 'js-cookie';

// サインアップ
export const signUp = (params) => {
  return clientApi.post('auth', params)
};

// サインイン
export const signIn = (params) => {
  return clientApi.post('auth/sign_in', params);
}

// サインアウト
export const signOut = () => {
  return clientApi.delete('auth/sign_out', {
    headers: {
      'access_token': Cookies.get('_access_token'),
      'client': Cookies.get('_client'),
      'uid': Cookies.get('_uid')
    },
  });
}

// ログイン済みユーザーを取得
export const getCurrentUser = () => {
  if (!Cookies.get('_access_token') || !Cookies.get('_client') || !Cookies.get('_uid')) return;
  return clientApi.get('/auth/sessions', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      'client': Cookies.get('_client'),
      'uid': Cookies.get('_uid'),
    }
  })
};
