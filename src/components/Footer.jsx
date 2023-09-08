import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Typography, Container, Link } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: '#deb887',
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
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerImageItem: {
    maxWidth: '210px',
    margin: '10px',
  },
}))

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container>
        <div className={classes.footerImage}>
          <div>
            <a href='https://www.makuake.com/project/shomacafe02/?from=keywordsearch&keyword=%E3%81%91%E3%82%82%E3%82%B5%E3%83%90&disp_order=6' target="_blank">
              <img src="/kemono.jpeg" alt="けもサバ" className={classes.footerImageItem} />
            </a>
          </div>
          <div>
            <a href='https://www.makuake.com/project/shomacafe/?from=keywordsearch&keyword=%E3%83%A9%E3%82%B9%E3%83%9C%E3%82%B9&disp_order=2' target="_blank">
              <img src="/lastBoss.png" alt="ラスボス" className={classes.footerImageItem} />
            </a>
          </div>
        </div>
        <Typography variant='body2' className={classes.footerText}>
          &copy; {new Date().getFullYear()} Shoma Cafe
        </Typography>
      </Container>
    </footer>
  )
}

export default Footer
