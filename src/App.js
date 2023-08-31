import { Grid, CssBaseline, Paper, makeStyles } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import Header from "./components/Header";
import Content from "./pages/Content";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f7f7f7',
  },
  mainContainer: {
    padding: '25px 0',
    [theme.breakpoints.down('sm')]: {
      padding: '0',
    },
  },
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
            <Content />
          </Grid>
        </BrowserRouter>
      </AuthProvider>
    </Grid>
  );
}

export default App;
