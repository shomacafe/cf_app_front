import React from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/css'
import '@splidejs/splide/dist/css/themes/splide-default.min.css'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  heroImage: {
    maxWidth: '600px',
  },
}));

const ProjectImageSlideshow = ({ projectData }) => {
  const projectImages =projectData.project_images ? projectData.project_images : '';
  const classes = useStyles();

  return (
    <Splide
      options={{
        type: 'slide',
        perPage: 1,
        pagination: true,
        arrows: true,
      }}
    >
      {projectImages.map((projectImage, index) => (
        <SplideSlide key={index}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <img
              src={projectImage.url}
              alt={`${projectImage.title} - 画像${index + 1}`}
              style={{ margin: 0 }}
            />
          </div>
        </SplideSlide>
      ))}
    </Splide>
  )
}

export default ProjectImageSlideshow
