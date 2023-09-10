import React, { useEffect, useState } from 'react'
import clientApi from '../../api/client'
import { Grid, TextField, Button, ButtonGroup, CircularProgress, makeStyles } from '@material-ui/core'
import { parseISO } from 'date-fns'
import ProjectCard from './ProjectCard'

const useStyles = makeStyles((theme) => ({
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '10px',
      flexDirection: 'column',
      alignItems: 'none',
    },
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
  },
  sortButtonGroup: {
    marginLeft: '10px',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginTop: '10px',
    },
    '& button': {
      [theme.breakpoints.down('xs')]: {
        padding: '6px 12px',
      },
    }
  },
  sortButton: {
    color: '#4169e1',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.5rem',
    }
  },
  activeSortButton: {
    color: '#000080',
  },
}));

const IndexProject = () => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest')
  const classes = useStyles();

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
      <div className={classes.searchContainer}>
        <div className={classes.searchForm}>
          <TextField
            label='キーワードで検索'
            value={searchQuery}
            style={{ width: '200px' }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant='contained' color='primary' onClick={() => fetchProjects()}>
            検索
          </Button>
        </div>
        <ButtonGroup className={classes.sortButtonGroup} color='primary' aria-label='outlined primary button group'>
          <Button onClick={() => setSortOption('newest')} className={sortOption === 'newest' ? `${classes.sortButton} ${classes.activeSortButton}` : classes.sortButton}>新着順</Button>
          <Button onClick={() => setSortOption('endingSoon')} className={sortOption === 'endingSoon' ? `${classes.sortButton} ${classes.activeSortButton}` : classes.sortButton}>終了日が近い順</Button>
          <Button onClick={() => setSortOption('totalAmount')} className={sortOption === 'totalAmount' ? `${classes.sortButton} ${classes.activeSortButton}` : classes.sortButton}>支援総額順</Button>
          <Button onClick={() => setSortOption('supportCount')} className={sortOption === 'supportCount' ? `${classes.sortButton} ${classes.activeSortButton}` : classes.sortButton}>支援者順</Button>
        </ButtonGroup>
      </div>
      <div style={{ marginTop: '20px' }}>
        {loading ? (
          <div className={ classes.spinnerContainer}>
            <CircularProgress />
          </div>
        ) : (
            <Grid container>
              {projectData.map((projectData, index) => (
                <Grid item key={index} xs={6} sm={4} md={3} lg={3}>
                  <ProjectCard projectData={projectData} />
                </Grid>
              ))}
            </Grid>
        )}
      </div>
    </div>
  )
}

export default IndexProject
