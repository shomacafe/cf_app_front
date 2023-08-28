import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../lib/AuthContext'

const Top = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext);

  return (
    <>
      <h1>トップページ</h1>
      {
        isSignedIn && currentUser ? (
          <>
            <h1>サインインしています</h1>
            <h2>メールアドレス: {currentUser?.email}</h2>
            <h2>名前: {currentUser?.name}</h2>
          </>
        ) : (
          <h1>サインインしていません。</h1>
        )
      }
      <div>
        <Link to={`/new/project`}>プロジェクトをはじめる</Link>
      </div>
      <div>
        <Link to={`/my_projects`}>作成したプロジェクト一覧</Link>
      </div>
      <div>
        <Link to={`/projects`}>全てのプロジェクト一覧</Link>
      </div>
    </>
  )
}

export default Top
