# クラウドファンディングシミュレーションアプリ（フロントエンド側）
フロントエンドはReact、バックエンドはRails（APIモード）でを制作しました。
<p></p>
<img src="https://github.com/shomacafe/crowd_funding_app/assets/97627380/54299a1a-5b28-4349-85c6-4f063826d8e2" width="200" /> 

## 制作背景
私は以前クラウドファンディングサイト「Makuake」にてプロジェクトを実施した経験があるのですが、その際にいきなりプロジェクトを始めることに少し不安を感じておりました。
ですので、そういった本番プロジェクトを始める前に「クラウドファンディングのシミュレーションができるアプリ」があれば良いと思い制作しました。
## アプリの使い方
気軽にクラウドファンディングを体験できるクラウドファンディングシミュレーションアプリです。
プロジェクトを始めたいユーザー向けの「プロジェクト作成機能」、応援したいユーザー向けの「プロジェクト応援機能」があります。

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


