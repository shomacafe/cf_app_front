import React from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/css'
import '@splidejs/splide/dist/css/themes/splide-default.min.css'

const ProjectImageSlideshow = ({ projectData }) => {
  const projectImages =projectData.project_images ? projectData.project_images : '';

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
        <SplideSlide key={index} style={{ padding: '0 10px' }}>
          <img
            src={projectImage.url}
            alt={`${projectImage.title} - 画像${index + 1}`}
            style={{ width: '100%'}}
          />
        </SplideSlide>
      ))}
    </Splide>
  )
}

export default ProjectImageSlideshow
