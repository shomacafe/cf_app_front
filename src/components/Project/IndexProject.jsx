import React, { useEffect, useState } from 'react'
import clientApi from '../../api/client'
import { Grid, TextField, Button, ButtonGroup, CircularProgress } from '@material-ui/core'
import { parseISO } from 'date-fns'
import ProjectCard from './ProjectCard'

const styles = {
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
};

const IndexProject = () => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest')

  const fetchProjects = async () => {
    try {
      const queryParams = {};
      if (searchQuery) {
        queryParams.search = searchQuery;
      }

      const response = await clientApi.get('/projects', {
        params: queryParams,
      });

      const sortedData = sortProjectData(response.data);

      console.log('API レスポンス', response.data)
      setProjectData(sortedData.map((projectItem) =>({
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

  useEffect(() => {
    fetchProjects();
  }, [searchQuery, sortOption]);

  const sortProjectData = (data) => {
    const now = new Date();

    return data.sort((a, b) => {
      const endDateA = new Date(a.project.endDate);
      const endDateB = new Date(b.project.endDate);

      // プロジェクトが実施中かどうか判定
      const priorityA = endDateA > now ? 1 : 2;
      const priorityB = endDateB > now ? 1 : 2;

      // 終了プロジェクトがソートの上位に来る
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      switch (sortOption) {
        case 'newest':
          return new Date(b.project.startDate) - new Date(a.project.startDate);
        case 'endingSoon':
          return endDateA - endDateB;
        case 'totalAmount':
          return b.totalAmount - a.totalAmount;
        case 'supportCount':
          return b.supportCount - a.supportCount;
        default:
          return 0;
      }
    });
  };

  return (
    <div>
      <h2>プロジェクトをさがす</h2>
      <div style={{display: 'flex'}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label='キーワードで検索'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant='contained' color='primary' onClick={() => fetchProjects()}>
              検索
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup color='primary' aria-label='outlined primary button group'>
            <Button onClick={() => setSortOption('newest')}>新着順</Button>
            <Button onClick={() => setSortOption('endingSoon')}>終了日が近い順</Button>
            <Button onClick={() => setSortOption('totalAmount')}>支援総額順</Button>
            <Button onClick={() => setSortOption('supportCount')}>支援者順</Button>
          </ButtonGroup>
        </Grid>
      </div>
      {loading ? (
        <div style={styles.spinnerContainer}>
          <CircularProgress />
        </div>
      ) : (
          <Grid container spacing={2}>
            {projectData.map((projectData, index) => (
              <Grid item key={index} xs={6} sm={4} md={3} lg={3}>
                <ProjectCard projectData={projectData} />
              </Grid>
            ))}
          </Grid>
      )}
    </div>
  )
}

export default IndexProject
