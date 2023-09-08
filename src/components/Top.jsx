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
    margin: '20px 0 10px',
    [theme.breakpoints.down('xs')]: {
      margin: '20px 0 0',
    },
  },
  bannerInner: {
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
  },
  bannerLine: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: '20px 0',
    maxWidth: '1200px',
    [theme.breakpoints.down('md')]: {
      padding: '10px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '5px',
    },
  },
  bannerImageContainer: {
    flex: '1 1 calc(25% - 20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px',
    [theme.breakpoints.down('xs')]: {
      flex: '1 1 calc(50% - 20px)',
    },
  },
  bannerImage: {
    border: '1px solid #ccc',
    maxWidth: '100%',
    height: 'auto',
  },
  bannerText: {
    fontSize: '16px',
    color: '#555',
    textDecoration: 'none',
    '&:hover': {
      color: '#555',
      textDecoration: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
    },
  },
}));

const Top = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.heroInner}>
        <RecommendedProject criteria={'newestSlideshow'} useSlideshow={'useSlideshow'} />
      </div>

      <div className={classes.bannerInner}>
        <div className={classes.bannerLine}>
          <div className={classes.bannerImageContainer}>
            <Link to={'/new/project'}>
              <img src='/project_start.png' alt='プロジェクトをはじめる' className={classes.bannerImage}  />
            </Link>
          </div>
          <div className={classes.bannerImageContainer}>
            <Link to={'/projects'}>
              <img src='/project_search.png' alt='プロジェクトをさがす' className={classes.bannerImage} />
            </Link>
          </div>
          <div className={classes.bannerImageContainer}>
            <Link to={'https://github.com/shomacafe/cf_app_front'} target='_blank'>
              <img src='/github.jpeg' alt='github' className={classes.bannerImage}  />
            </Link>
          </div>
          <div className={classes.bannerImageContainer}>
            <Link to={'https://www.makuake.com/project/shomacafe02/?from=keywordsearch&keyword=%E3%81%91%E3%82%82%E3%82%B5%E3%83%90&disp_order=6'} target='_blank'>
              <img src='/kemono.jpeg' alt='ケモサバ' className={classes.bannerImage} />
            </Link>
          </div>
        </div>
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
