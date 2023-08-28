import React from 'react'
import { Grid } from '@material-ui/core'
import { Route, Routes } from 'react-router-dom';
import Top from '../components/Top';
import SignUpForm from '../components/Auth/SignUpForm';
import SignInForm from '../components/Auth/SignInForm';
import CreateProject from '../components/Project/CreateProject';
import CreatedProjectList from '../components/Project/CreatedProjectList';
import EditProject from '../components/Project/EditProject';
import { ProjectDataProvider, ReturnDataProvider } from '../contexts/ProjectContext';
import IndexProject from '../components/Project/IndexProject';
import ShowProject from '../components/Project/ShowProject';
import ReturnPurchaseConfirm from '../components/Project/ReturnPurchaseConfirm';
import { ReturnInfoProvider } from '../components/Project/ReturnInfoContext';
import PrivateRoute from '../lib/PrivateRoute';

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
  return (
    <Grid container spacing={10}>
      <Grid item sm={2} />
      <Grid item lg={8} sm={8}>
        <Routes>
          <Route index element={<Top />} />
          <Route path='/signup_form' element={<SignUpForm />} />
          <Route path='/signin_form' element={<SignInForm />} />
          <Route path='/new/project' element={<PrivateRoute element={<CreateProjectWrapper />} />} />
          <Route path='/projects/edit/:project_id' element={<EditProjectWrapper />} />
          <Route path='/my_projects' element={<PrivateRoute element={<CreatedProjectList />} />} />
          <Route path='/projects' element={<IndexProject />} />
          <Route path='/projects/:project_id' element={<ReturnInfoProvider><ShowProject /></ReturnInfoProvider>} />
          <Route path='/purchase/confirm' element={<ReturnInfoProvider><ReturnPurchaseConfirm /></ReturnInfoProvider>} />
        </Routes>
      </Grid>
    </Grid>
  )
}

export default Content
