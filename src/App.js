import { Grid } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import Header from "./components/Header";
import Content from "./pages/Content";

function App() {
  return (
    <Grid container direction='column'>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <div style={{ padding: 30 }}>
            <Content />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </Grid>
  )
}

export default App;
