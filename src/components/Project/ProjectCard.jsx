import React from 'react'
import { Link } from 'react-router-dom';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns'

const useStyles = makeStyles((theme) => ({
  projectCard: {
    textDecoration: 'none',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    },
    height: '95%',
    minHeight: '210px',
    margin: '10px',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      margin: '12px 6px',
    },
  },
  projectLink: {
    textDecoration: 'none',
    color: '#555',
  },
  projectImage: {
    width: '100%',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  },
  projectInfo: {
    padding: '10px',
  },
  projectTitle: {
    marginBottom: '20px',
    fontSize: '1.25rem',
    [theme.breakpoints.down('md')]: {
      marginBottom: '10px',
      fontSize: '1rem',
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: '5px',
      fontSize: '0.7rem',
    },
  },
  totalAmount: {
    fontSize: '0.875rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '0.75rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.625rem',
    },
  },
  supportCount: {
    fontSize: '0.875rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '0.75rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.625rem',
    },
  },
  remainingTime: {
    fontSize: '0.875rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '0.75rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.625rem',
    },
  }
}));

const ProjectCard = ({ projectData, useEdit }) => {
  const classes = useStyles();

  const formatRemainingTime = (endDate) => {
    const now = new Date();
    const remainingTime = Math.max(endDate - now, 0);
    const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

    if (endDate > now && remainingDays > 0) {
      return `残り ${remainingDays}日`;
    } else if (remainingHours > 0) {
      return `残り ${remainingHours}時間`;
    } else if (remainingMinutes > 0) {
      return `残り ${remainingMinutes}分`;
    } else {
      return '終了しました';
    }
  }

  return (
    <div className={classes.projectCard}>
      <Link to={`/projects/${projectData.id}`} className={classes.projectLink}>
        {projectData.project_images && projectData.project_images[0] ? (
          <img src={projectData.project_images[0].url} alt={projectData.title}  className={classes.projectImage}/>
        ) : (
          <p>プロジェクト画像がありません</p>
        )}
        <div className={classes.projectInfo}>
          <Typography className={classes.projectTitle} variant='h5'>
            {projectData.title}
          </Typography>
          <div className={classes.projectDate}>
            {projectData.start_date > new Date ? (
              <Typography>{`${format(projectData.start_date, 'yyyy年MM月dd日 HH:mm')}開始予定`}</Typography>
            ): (
              <>
                <Typography className={classes.totalAmount}>現在 {projectData.total_amount.toLocaleString()}円</Typography>
                <Typography className={classes.supportCount}>支援者 {projectData.support_count}人</Typography>
                <Typography className={classes.remainingTime}>{formatRemainingTime(projectData.end_date)}</Typography>
                {useEdit && <Typography className={classes.totalAmount}>{projectData.is_published ? '公開中' : '非公開'}</Typography>}
              </>
            )}
          </div>
        </div>
      </Link>
      {useEdit &&
        <>
          <Button
            variant='contained'
            size='large'
            color='primary'
            component={Link}
            to={`/projects/edit/${projectData.id}`}
            style={{ margin: '10px' }}
          >
            編集する
          </Button>
        </>
      }
    </div>
  )
}

export default ProjectCard
