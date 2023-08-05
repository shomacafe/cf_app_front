import React from 'react'
import { Grid } from '@material-ui/core'
import { Route, Routes } from 'react-router-dom';
import Top from '../components/Top';
import SignUpForm from '../components/Auth/SignUpForm';

const Content = () => {
  return (
    <Grid container spacing={10}>
      <Grid item sm={2} />
      <Grid item lg={8} sm={8}>
        <Routes>
          <Route index element={<Top />} />
          <Route path='/signup_form' element={<SignUpForm />} />
        </Routes>
      </Grid>
    </Grid>
  )
}

export default Content
