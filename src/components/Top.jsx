import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../lib/AuthContext'
import RecommendedProject from './Project/RecommendedProject'
import '@splidejs/splide/css'
import '@splidejs/splide/dist/css/themes/splide-default.min.css'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  heroInner: {
    width: '100%',
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      padding: '0',
    },
  },
  recommendedInner: {
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: '1300px',
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      padding: '0',
    },
  }
}));

const Top = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext);
  const classes = useStyles();

  return (
    <>
      <div className={classes.heroInner}>
        <RecommendedProject criteria={'newestSlideshow'} useSlideshow={'useSlideshow'} />
      </div>
      <div className={classes.recommendedInner}>
        <div>
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
        </div>
        <div>
          <h2>新着のプロジェクト</h2>
          <RecommendedProject criteria={'newest'}/>
        </div>
        <div>
          <h2>人気のプロジェクト</h2>
          <RecommendedProject criteria={'supportCount'}/>
        </div>
        <div>
          <h2>応援総額が高いプロジェクト</h2>
          <RecommendedProject criteria={'totalAmount'}/>
        </div>
        <div>
          <h2>終了間近なプロジェクト</h2>
          <RecommendedProject criteria={'endingSoon'}/>
        </div>
      </div>
    </>
  )
}

export default Top
