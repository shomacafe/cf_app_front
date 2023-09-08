import React, { useEffect, useState } from 'react'
import clientApi from '../../api/client';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Grid, CircularProgress } from '@material-ui/core';
import { parseISO } from 'date-fns'
import ProjectCard from './ProjectCard';

const styles = {
  spinnerContainer: {
    display: 'grid',
    placeItems: 'center',
    minHeight: '100vh',
  },
};


const CreatedProjectList = () => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const headers = {
          'access-token': Cookies.get('_access_token'),
          'client': Cookies.get('_client'),
          'uid': Cookies.get('_uid'),
        };

        const response = await clientApi.get('/projects/index_by_user', {
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
          is_published: projectItem.project.isPublished
        })))

      } catch (error) {
        console.error('API レスポンスの取得に失敗しました', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);


  return (
    <>
      <h2>作成したプロジェクト</h2>
      {loading ? (
        <div style={styles.spinnerContainer}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container>
          {projectData.map((projectData, index) => (
            <Grid item key={index} xs={6} sm={4} md={3} lg={3}>
              <ProjectCard projectData={projectData} useEdit={'useEdit'} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}

export default CreatedProjectList
