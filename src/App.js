import { Grid, CssBaseline, Paper, makeStyles } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import Header from "./components/Header";
import Content from "./pages/Content";
import { UserDataProvider } from "./contexts/UserDataContext";
import Footer from "./components/Footer";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f7f7f7',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  mainContainer: {
    flex: '1',
    justifyContent: 'center',
    padding: '20px 10px',
    [theme.breakpoints.down('sm')]: {
      padding: '10px 0 20px 0',
    },
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Grid container direction='column' className={classes.root}>
      <AuthProvider>
        <UserDataProvider>
          <CssBaseline />
          <BrowserRouter>
            <Header />
            <Grid container className={classes.mainContainer}>
              <Content  />
            </Grid>
            <Footer />
          </BrowserRouter>
        </UserDataProvider>
      </AuthProvider>
    </Grid>
  );
}

export default App;
