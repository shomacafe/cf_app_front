# クラウドファンディングシミュレーションアプリ（フロントエンド側）
フロントエンドはReact、バックエンドはRails（APIモード）で制作しました。
<p></p>
<img src="https://github.com/shomacafe/crowd_funding_app/assets/97627380/d87b65dd-0323-49ac-9958-54f5cd2672ab" width="300" /> 

## 制作背景
私は以前クラウドファンディングサイト「Makuake」にてプロジェクトを実施した経験があるのですが、その際にいきなりプロジェクトを始めることに少し不安を感じておりました。
ですので、そういった本番プロジェクトを始める前に「クラウドファンディングのシミュレーションができるアプリ」があれば良いと思い制作しました。
## アプリの使い方
気軽にクラウドファンディングを体験できるクラウドファンディングシミュレーションアプリです。
プロジェクトを始めたいユーザー向けの「プロジェクト作成機能」、応援したいユーザー向けの「プロジェクト応援機能」があります。
### トップ画面
<img src="https://github.com/shomacafe/crowd_funding_app/assets/97627380/0ce5e13a-f8d6-47d9-9d45-e25765624155" width="700" />
  
### プロジェクトをはじめる
<img src="https://github.com/shomacafe/crowd_funding_app/assets/97627380/e7e104ad-5abe-4865-87dd-7b32e3861850" width="700" />

### プロジェクトをさがす
<img src="https://github.com/shomacafe/crowd_funding_app/assets/97627380/801098a5-2244-4ba4-97fc-6635f1185d45" width="700" />

### リターン（返礼品）を応援購入する
<img src="https://github.com/shomacafe/crowd_funding_app/assets/97627380/c8b35901-14a3-429d-a296-8dd379c30ed0" width="700" />

## 機能一覧
* ユーザー登録・ログイン機能（railsのgemのdevise_token_authでトークン発行後ReactでCookieに保存）
* ゲストログイン機能
* プロジェクト作成機能
* プロジェクト編集機能
* プロジェクト一覧表示機能
* プロジェクト詳細表示機能
* 作成済プロジェクト一覧表示機能
* リターン応援機能
* 応援済リターン一覧表示機能
* 検索機能
* ソート機能
* ユーザーアカウント詳細表示機能
* ユーザーアカウント編集機能

## API一覧
●プロジェクト関連
* GET /api/v1/projects: 全てのプロジェクト一覧の取得（プロジェクト一覧）
* GET /api/v1/projects/index_by_user: 作成済プロジェクト一覧の取得
* POST /api/v1/projects: プロジェクトの作成（プロジェクト作成画面）
* GET /api/v1/projects/{project_id}: 特定のプロジェクトの詳細情報の取得（プロジェクト詳細画面）
* PUT /api/v1/projects/{project_id}: プロジェクトの更新（プロジェクト編集画面）

●応援購入関連
* POST /api/v1/purchases: リターンの応援購入（購入機能）
* GET /api/v1/purchases: 購入済みリターン情報の取得（購入履歴）

●ユーザー関連
* POST /api/v1/auth: ユーザーの作成（ユーザー登録画面）
* POST /api/v1/auth/sign_in: メールアドレスとパスワードによる認証（ログイン画面）
* DELETE /api/v1/auth/sign_out: ログアウト
* GET /api/v1/auth/settions_user: ログイン中のユーザー情報の取得
* GET /api/v1/auth/users/{user_id}: ユーザーアカウント情報の取得
* PUT/api/v1/account/update: アカウントの更新
* PUT/api/v1/profile/update: プロフィールの更新

## テーブル設計書
[テーブル設計書（Excel）](https://docs.google.com/spreadsheets/d/1KHc1_DgovkktnAECN8qxKHghyw0acoN-LTr3VdNvrBM/edit#gid=0)

## ER図
<img src="https://github.com/shomacafe/crowd_funding_app/assets/97627380/8f2c68c5-acbd-483f-94e2-bb015d6a30d2" width="600" /> 

## バックエンド側の実装
https://github.com/shomacafe/cf_app_back

