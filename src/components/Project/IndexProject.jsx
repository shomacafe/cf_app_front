import React, { useEffect, useState } from 'react'
import clientApi from '../../api/client';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const IndexProject = () => {
  const [projects, setProjects] = useState([]);

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
        setProjects(response.data)
      } catch (error) {
        console.error('API レスポンスの取得に失敗しました', error);
      }
    };

    fetchProjects();
  }, []);


  return (
    <div>
    {projects.map((project) => (
      <div key={project.id}>
        <h2>{project.title}</h2>
        <h2>プロジェクトID:{project.id}</h2>
        {project.projectImages && project.projectImages[0] ? (
          <img src={project.projectImages[0].url} alt={project.title} style={{width: '300px'}} />
        ) : (
          <p>プロジェクト画像がありません</p>
        )}
        <Link to={`/projects/${project.id}`}>プロジェクトページへ</Link>
      </div>
    ))}
  </div>
  )
}

export default IndexProject
