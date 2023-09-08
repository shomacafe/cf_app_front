import React, { useEffect, useState } from 'react'
import clientApi from '../../api/client';
import { Grid, CircularProgress } from '@material-ui/core';
import { parseISO } from 'date-fns'
import ProjectCard from './ProjectCard';
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/css'
import '@splidejs/splide/dist/css/themes/splide-default.min.css'

const RecommendedProject = ({ criteria, currentProjectId, useSlideshow }) => {
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProjects = async () => {
      try {
        const params = { criteria };
        console.log('currentProjectId', currentProjectId)
        if (currentProjectId) {
          params.current_project_id = currentProjectId;
        }

        const response = await clientApi.get('/projects/recommended', {
          params,
        });

        console.log('API レスポンス', response.data)

        setRecommendedProjects(response.data.map((projectItem) =>({
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
      } finally {
        setLoading(false)
      }
    };

    fetchRecommendedProjects();
  }, [criteria, currentProjectId]);

  return (
    <>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : useSlideshow ? (
          <Splide
            options={{
              type: 'loop',
              perPage: 4,
              gap: '16px',
              focus: 'center',
              autoplay: true,
              interval: 3000,
              width: '100%',
              breakpoints: {
                768: {
                  perPage: 1.5,
                },
              },
            }}
          >
            {recommendedProjects.map((projectData, index) => (
              <SplideSlide key={index} style={{ padding: '20px 0', width: '100%' }}>
                  <ProjectCard projectData={projectData} />
              </SplideSlide>
            ))}
          </Splide>
        ) : (
          <Grid container>
            {recommendedProjects.map((projectData, index) => (
              <Grid item key={index} xs={6} sm={4} md={3} lg={3}>
                <ProjectCard projectData={projectData} />
              </Grid>
            ))}
          </Grid>
      )}
    </>
  )
}

export default RecommendedProject
