import React from 'react'
import { Link } from 'react-router-dom'

const Top = () => {
  return (
    <>
      <h1>トップページ</h1>
      <div>
        新規登録は<Link to='/signup_form'>こちら</Link>
      </div>
    </>
  )
}

export default Top
