import React, { useEffect, useState } from 'react'
import clientApi from '../../api/client';
import Cookies from 'js-cookie';
import { Grid } from '@material-ui/core';
import { parseISO } from 'date-fns'
import ProjectCard from './ProjectCard';


const IndexProject = () => {
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const headers = {
          'access-token': Cookies.get('_access_token'),
          'client': Cookies.get('_client'),
          'uid': Cookies.get('_uid'),
        };

        const response = await clientApi.get('/projects', {
          headers: headers,
        });

        console.log('API レスポンス', response.data)
        setProjectData(response.data.map((projectItem) =>({
          id: projectItem.project.id,
          title: projectItem.project.title,
          start_date: parseISO(projectItem.project.startDate),
          end_date: parseISO(projectItem.project.endDate),
          project_images: projectItem.project.projectImages,
          total_amount: projectItem.totalAmount,
          support_count: projectItem.supportCount,
        })))
      } catch (error) {
        console.error('API レスポンスの取得に失敗しました', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className={classes.projectList}>
      <h2>プロジェクト</h2>
      <Grid container spacing={2}>
        {projectData.map((projectData, index) => (
          <Grid item key={index} xs={6} sm={4} md={3} lg={3}>
            <ProjectCard projectData={projectData} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default IndexProject
