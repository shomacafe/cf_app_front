import React from 'react'
import { Grid } from '@material-ui/core'
import { Route, Routes } from 'react-router-dom';
import Top from '../components/Top';
import SignUpForm from '../components/Auth/SignUpForm';
import SignInForm from '../components/Auth/SignInForm';
import CreateProject from '../components/Project/CreateProject';
import CreatedProjectList from '../components/Project/CreatedProjectList';

const Content = () => {
  return (
    <Grid container spacing={10}>
      <Grid item sm={2} />
      <Grid item lg={8} sm={8}>
        <Routes>
          <Route index element={<Top />} />
          <Route path='/signup_form' element={<SignUpForm />} />
          <Route path='/signin_form' element={<SignInForm />} />
          <Route path='/new/project' element={<CreateProject />} />
          <Route path='/projects' element={<CreatedProjectList />} />
        </Routes>
      </Grid>
    </Grid>
  )
}

export default Content
