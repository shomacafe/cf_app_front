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
          <Route path='/new/project' element={<CreateProjectWrapper />} />
          <Route path='/projects' element={<CreatedProjectList />} />
          <Route path='/projects/edit/:project_id' element={<EditProjectWrapper />} />
        </Routes>
      </Grid>
    </Grid>
  )
}

export default Content
