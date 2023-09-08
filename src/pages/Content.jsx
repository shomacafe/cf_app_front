import React from 'react'
import { Grid, makeStyles, Paper } from '@material-ui/core'
import { Route, Routes } from 'react-router-dom';
import Top from '../components/Top';
import SignUpForm from '../components/Auth/SignUpForm';
import SignInForm from '../components/Auth/SignInForm';
import CreateProject from '../components/Project/CreateProject';
import CreatedProjectList from '../components/Project/CreatedProjectList';
import EditProject from '../components/Project/EditProject';
import { ProjectDataProvider, ReturnDataProvider } from '../contexts/ProjectContext';
import { ReturnInfoProvider } from '../components/Project/ReturnInfoContext';
import { UserDataProvider } from '../contexts/UserDataContext';
import IndexProject from '../components/Project/IndexProject';
import ShowProject from '../components/Project/ShowProject';
import ReturnPurchaseConfirm from '../components/Project/ReturnPurchaseConfirm';
import PurchaseHistory from '../components/Project/PurchaseHistory';
import PrivateRoute from '../lib/PrivateRoute';
import MyPage from '../components/User/MyPage';
import EditAccount from '../components/User/EditAccount';
import EditProfile from '../components/User/EditProfile';
import ScrollToTop  from './ScrollToTop';

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: 'white',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: '1300px',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'white',
      boxShadow: 'none',
      padding: 0,
    },
  },
  nomalPaper: {
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: '1300px',
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      padding: '0',
    },
  }
}));

const CreateProjectWrapper = () => {
  return (
    <ProjectDataProvider>
      <ReturnDataProvider>
        <CreateProject />
      </ReturnDataProvider>
    </ProjectDataProvider>
  );
};

const EditProjectWrapper = () => {
  return (
    <ProjectDataProvider>
      <ReturnDataProvider>
        <EditProject />
      </ReturnDataProvider>
    </ProjectDataProvider>
  );
};

const Content = () => {
  const classes = useStyles();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route index element={<Top />} />
        <Route path='/signup_form' element={<SignUpForm />} />
        <Route path='/signin_form' element={<SignInForm />} />
        <Route path='/account' element={<PrivateRoute element={<MyPage />} />} />
        <Route path='/account/edit' element={<PrivateRoute element={<EditAccount />} />} />
        <Route path='/profile/edit' element={<PrivateRoute element={<EditProfile />} />} />
        <Route path='/new/project' element={<Paper elevation={3} className={classes.paper}><PrivateRoute element={<CreateProjectWrapper />} /></Paper>} />
        <Route path='/projects/edit/:project_id' element={<Paper elevation={3} className={classes.paper}><EditProjectWrapper /></Paper>} />
        <Route path='/my_projects' element={<PrivateRoute element={<div className={classes.nomalPaper}><CreatedProjectList /></div>} />} />
        <Route path='/projects' element={<Paper elevation={3} className={classes.paper}><IndexProject /></Paper>} />
        <Route path='/projects/:project_id' element={<Paper elevation={3} className={classes.paper}><ReturnInfoProvider><ShowProject /></ReturnInfoProvider></Paper>} />
        <Route path='/purchase/confirm' element={<Paper elevation={3} className={classes.paper}><ReturnInfoProvider><ReturnPurchaseConfirm /></ReturnInfoProvider></Paper>} />
        <Route path='/purchases' element={<Paper elevation={3} className={classes.paper}><PrivateRoute element={<PurchaseHistory />} /></Paper>} />
      </Routes>
    </>
  )
}


export default Content
