import clientApi from './client';
import Cookies from 'js-cookie';

// サインアップ
export const signUp = (params) => {
  return clientApi.post('auth', params)
};

// サインイン
export const signIn = async (params) => {
  try {
    const response = await clientApi.post('auth/sign_in', params);

    // 認証情報をクッキーに保存
    const { accessToken, client, uid, expiry, tokenType } = response.headers;
    Cookies.set('access_token', accessToken, { path: '/' })
    Cookies.set('client', client, { path: '/' });
    Cookies.set('uid', uid, { path: '/' });
    Cookies.set('expiry', expiry, { path: '/' });
    Cookies.set('token-type', tokenType, { path: '/' });

    return response;
  } catch (error) {
    throw error;
  }
};

// サインアウト

export const signOut = async () => {
  try {
    await  clientApi.delete('auth/sign_out', {
      headers: {
        'access_token': Cookies.get('access_token'),
        'client': Cookies.get('client'),
        'uid': Cookies.get('uid')
      },
    });

    Cookies.remove('access_token', { pass: '/' })
    Cookies.remove('client', { pass: '/' })
    Cookies.remove('uid', { pass: '/' })
    Cookies.remove('expiry', { path: '/' });
    Cookies.remove('token-type', { path: '/' });
  } catch (error) {
    throw error;
  }
};

// ログイン済みユーザーを取得
export const getCurrentUser = async () => {
  if (!Cookies.get('access_token') || !Cookies.get('client') || !Cookies.get('uid')) return null;
  try {
    const response = await clientApi.get('/auth/sessions', {
      headers: {
        'access-token': Cookies.get('access_token'),
        'client': Cookies.get('client'),
        'uid': Cookies.get('uid')
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
