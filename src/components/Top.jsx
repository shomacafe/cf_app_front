import React, { useContext } from 'react'
import { AuthContext } from '../lib/AuthContext'
import RecommendedProject from './Project/RecommendedProject'
import '@splidejs/splide/css'
import '@splidejs/splide/dist/css/themes/splide-default.min.css'
import { makeStyles, Card } from '@material-ui/core'
import { Link } from 'react-router-dom'

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
  },
  recommendedHeader: {
    textAlign: 'center',
    margin: '70px 0 30px',
    [theme.breakpoints.down('xs')]: {
      margin: '20px 0 10px',
    },
  },
  bannerLine: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: '20px 50px',
    flexWrap: 'wrap',
    [theme.breakpoints.down('xs')]: {
      padding: '10px',
    },
  },
  banner: {
    maxWidth: '200px',
    width: '100%',
    height: '80px',
    margin: '10px 20px 10px',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 0 rgba(0, 0, 0, 0.2)',
    fontSize: '16px',
    textDecoration: 'none',
    color: '#555',
    '&:hover': {
      textDecoration: 'none',
      color: '#555',
    },
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0 3px 0 rgba(0, 0, 0, 0.4)',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
      height: 'auto',
    },
  },
}));

const Top = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext);
  const classes = useStyles();

  return (
    <>
      <div className={classes.heroInner}>
        <RecommendedProject criteria={'newestSlideshow'} useSlideshow={'useSlideshow'} />
      </div>
      <div className={classes.bannerLine}>
        <Card component={Link} to='new/project' className={classes.banner}>
          <p>プロジェクトをはじめる</p>
        </Card>
        <Card component={Link} to='/projects' className={classes.banner}>
          <p>プロジェクトをさがす</p>
        </Card>
        <Card
          component={Link}
          to='https://github.com/shomacafe/cf_app_front'
          target='_blank'
          className={classes.banner}
        >
          <p>Github</p>
        </Card>
        <Card
          component={Link}
          to='https://www.makuake.com/project/shomacafe02/?from=keywordsearch&keyword=%E3%81%91%E3%82%82%E3%82%B5%E3%83%90&disp_order=6'
          target='_blank'
          className={classes.banner}
        >
          <img src='/kemosava.jpeg' alt='ケモサバ' style={{ maxWidth: '100%', maxHeight: '100px' }} />
        </Card>
      </div>
      <div className={classes.recommendedInner}>
        <div>
          <h2 className={classes.recommendedHeader}>新着のプロジェクト</h2>
          <RecommendedProject criteria={'newest'}/>
        </div>
        <div>
          <h2 className={classes.recommendedHeader}>人気のプロジェクト</h2>
          <RecommendedProject criteria={'supportCount'}/>
        </div>
        <div>
          <h2 className={classes.recommendedHeader}>応援総額が高いプロジェクト</h2>
          <RecommendedProject criteria={'totalAmount'}/>
        </div>
        <div>
          <h2 className={classes.recommendedHeader}>終了間近なプロジェクト</h2>
          <RecommendedProject criteria={'endingSoon'}/>
        </div>
      </div>
    </>
  )
}

export default Top
