import { Grid, CssBaseline, Paper, makeStyles } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import Header from "./components/Header";
import Content from "./pages/Content";

const useStyles = makeStyles((theme) => ({
  root: {
    // minHeight: '300vh',
    backgroundColor: '#f7f7f7',
    padding: theme.spacing(2),
    // [theme.breakpoints.down('sm')]: {
    //   padding: '0',
    // },
  },
  mainContainer: {
    padding: theme.spacing(3),
    // [theme.breakpoints.down('sm')]: {
    //   padding: '0',
    // },
  },
  paper: {
    backgroundColor: 'white',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: '1300px',
    // minHeight: '500px',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'white',
      boxShadow: 'none',
      padding: '',
    },
  }
}));

function App() {
  const classes = useStyles();

  return (
    <Grid container direction='column' className={classes.root}>
      <AuthProvider>
        <CssBaseline />
        <BrowserRouter>
          <Header />
          <Grid container justifyContent='center' className={classes.mainContainer}>
            <Paper elevation={3} className={classes.paper}>
              <Content />
            </Paper>
          </Grid>
        </BrowserRouter>
      </AuthProvider>
    </Grid>
  );
}

export default App;
