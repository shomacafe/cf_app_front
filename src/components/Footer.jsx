import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Typography, Container, Link } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '10px 16px',
    [theme.breakpoints.down('xs')]: {
      padding: '10px 0'
    }
  },
  footerText: {
    textAlign: 'center',
    marginTop: '10px'
  },
  footerImage: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  footerImageItem: {
    flexBasis: '100%',
    maxWidth: '250px',
    margin: '10px',
  },
}))

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container>
        <div className={classes.footerImage}>
          <img
            src="/kemosava.jpeg"
            alt="プロジェクトをはじめる"
            className={classes.footerImageItem}
          />
          <img
            src="/lastBoss.png"
            alt="プロジェクトをはじめる"
            className={classes.footerImageItem}
          />
        </div>
        <Typography variant='body2' className={classes.footerText}>
          &copy; {new Date().getFullYear()} Shoma Cafe
        </Typography>
      </Container>
    </footer>
  )
}

export default Footer
