import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import clientApi from '../../api/client'
import { parseISO, format } from 'date-fns'
import { Editor, convertFromRaw, EditorState } from 'draft-js'
import ReturnInfo from './ReturnInfo'
import { ReturnInfoContext } from './ReturnInfoContext'
import { AuthContext } from '../../lib/AuthContext'
import {Typography, makeStyles, CircularProgress, Avatar, CardContent } from '@material-ui/core'
import ProjectImageSlideshow from './ProjectImageSlideshow'
import RecommendedProject from './RecommendedProject'

const useStyles = makeStyles((theme) => ({
  heroContainer: {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    }
  },
  heroImage: {
    width: '100%',
    maxWidth: '650px',
    marginRight: theme.spacing(3),
  },
  mainContainer: {
    display: 'flex',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    }
  },
  mainContent: {
    flexGrow: 1,
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      margin: 0,
    }
  },
  sideBar: {
    flexShrink: 0,
    width: '350px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      padding: '0 8px'
    }
  },
  projectTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    fontWeight: 'bold',
    margin: '40px 0',
    [theme.breakpoints.down('xs')]: {
      fontSize: '20px',
    },
  },
  projectInfo: {
    marginLeft: '80px',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      margin: '10px'
    },
  },
  totalAmount: {
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      padding: '0 50px',
      fontWeight: 'normal',
      fontSize: '40px',
    },
  },
  goalAmount: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  supporterAndGorl: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  supporter: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
    },
  },
  timeLimit: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
    },
  },
  goalAmountText: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '13px',
    },
  },
  projectInfoText: {
    marginTop: '20px',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      fontSize: '13px',
    },
  },
  projectInfoTextItem: {
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      fontWeight: 'normal',
      lineHeight: '1.5',
      fontSize: '13px',
    },
  },
  descriptionEditor: {
    marginBottom: theme.spacing(3),
  },
  splideContainer: {
    width: '100%',
    maxWidth: '650px',
  },

  // メインコンテンツ
  avatar: {
    width: '80px',
    height: '80px',
    marginBottom: '1rem'
  },
  presenterCard: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
    backgroundColor: '#f7f7f7',
    padding: '10px',
    borderRadius: '10px'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '20px',
  },
  normalCard: {
    marginTop: '10px',
    backgroundColor: '#f7f7f7',
    padding: '10px 20px',
    borderRadius: '10px'
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
}));

const ShowProject = () => {
  const { project_id } = useParams();
  const { setReturnData } = useContext(ReturnInfoContext)
  const {isSignedIn, currentUser, loading} = useContext(AuthContext);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectData, setProjectData] = useState({
    title: '',
    catch_copies: [''],
    goal_amount: '',
    start_date: '',
    end_date: '',
    project_images: [''],
  });
  const [descriptionEditorState, setDescriptionEditorState] = useState(EditorState.createEmpty());
  const [isPurchaseDisabled, setIsPurchaseDisabled] =useState(false);
  const classes = useStyles();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await clientApi.get(`/projects/${project_id}`)

        const resData = response.data
        const resProjectData = response.data.project;

        if (resProjectData.isPublished || (isSignedIn && resProjectData.userId === currentUser.id)) {
          const parsedStartDate = parseISO(resProjectData.startDate);
          const parsedEndDate = parseISO(resProjectData.endDate);

          const now = new Date();
          const isProjectStarted = parsedStartDate <= now;
          const isProjectEnded = parsedEndDate < now;
          setIsPurchaseDisabled(!isProjectStarted || isProjectEnded);

          const descriptionData = JSON.parse(resProjectData.description);
          const contentState = convertFromRaw({
            blocks: descriptionData.blocks,
            entityMap: descriptionData.entityMap,
          });
          const editorState = EditorState.createWithContent(contentState);
          setDescriptionEditorState(editorState);

          const successRate = Math.floor(resData.totalAmount / resProjectData.goalAmount * 100)

          setProjectData({
            title: resProjectData.title,
            goal_amount: resProjectData.goalAmount,
            start_date: parsedStartDate,
            end_date: parsedEndDate,
            catch_copies: JSON.parse(resProjectData.catchCopies),
            project_images: resProjectData.projectImages,
            description: descriptionEditorState,
            total_amount: resData.totalAmount,
            support_count: resData.supportCount,
            success_rate: successRate,
            is_published: resProjectData.isPublished,
            user: resData.user
          })

          setReturnData(resProjectData.returns.map(returnItem => ({
            id: returnItem.id,
            name: returnItem.name,
            description: returnItem.description,
            price: returnItem.price,
            stock_count: returnItem.stockCount,
            return_image: returnItem.returnImage,
            supporter_count: returnItem.supporterCount,
          })))
        } else {
          setProjectData(null)
        }

        console.log('API レスポンス', response.data)
      } catch (error) {
        console.error('API レスポンスの取得に失敗しました', error);
      } finally {
        setProjectLoading(false);
      }
    }

    fetchProjectData();
  }, [loading, project_id])

  if (loading) {
    return (
      <div className={ classes.spinnerContainer}>
        <CircularProgress />
      </div>
    )
  }

  // 開始日と終了日を適切に表示
  const formattedStartDate = projectData ? (projectData.start_date ? format(projectData.start_date, 'yyyy年MM月dd日 HH:mm') : '') : '';
  const formattedEndDate = projectData ? (projectData.end_date ? format(projectData.end_date, 'yyyy年MM月dd日 HH:mm') : '') : '';

  // プロジェクトの残り日時を計算
  const now = new Date();
  const remainingTime = Math.max(projectData && projectData.end_date - now, 0);
  const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 *24));
  const remainingHours = Math.floor(remainingTime % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  const remainingMinutes = Math.floor(remainingTime % (1000 * 60 * 60 * 24) / (1000 * 60));

  // 実施期間によるテキストの表示
  let remainingText = '';
  if (projectData && projectData.start_date > new Date()) {
    remainingText = `${formattedStartDate}に開始予定です。`;
  } else if (remainingDays > 0) {
    remainingText = `${remainingDays}日`;
  } else if (remainingHours > 0) {
    remainingText = `${remainingHours}時間`;
  } else if (remainingMinutes > 0) {
    remainingText = `${remainingMinutes}分`;
  } else {
    remainingText = '終了しました'
  }

  // プログレスバーと達成の有無
  const progress = projectData ? Math.min((projectData.total_amount / projectData.goal_amount) * 100, 100) : 0;

  return (
    <>
      {projectLoading ? (
        <div className={classes.spinnerContainer}>
          <CircularProgress />
        </div>
      ) : projectData !== null ? (
        <>
          <Typography className={classes.projectTitle} variant='h4'>{projectData.title}</Typography>
          <div className={classes.heroContainer}>
            <div className={classes.splideContainer}>
              <ProjectImageSlideshow projectData={projectData} />
            </div>

            <div className={classes.projectInfo}>
              <Typography variant='h6'>応援購入総額</Typography>
              <Typography variant='h3' className={classes.totalAmount} style={{ fontWeight: 'bold' }}>{projectData.total_amount && projectData.total_amount.toLocaleString()}円</Typography>
              <progress style={{ width: '100%' }} value={progress} max='100'></progress>
              <div className={classes.projectInfoItem}>
                <div className={classes.goalAmount}>
                  <Typography className={classes.goalAmountText}>達成率{projectData.success_rate}%</Typography>
                  <Typography className={classes.goalAmountText}>目標金額は{projectData.goal_amount && projectData.goal_amount.toLocaleString()}円</Typography>
                </div>
                <div className={classes.supporterAndGorl}>
                  <div className={classes.supporter}>
                    <Typography variant='h6' className={classes.projectInfoText}>支援者数</Typography>
                    <Typography variant='h3' className={classes.projectInfoTextItem}>{projectData.support_count}人</Typography>
                  </div>
                  <div className={classes.timeLimit}>
                    {projectData.start_date > new Date() || projectData.end_date < new Date() ? (
                      <p></p>
                    ) : (
                      <Typography variant='h6' className={classes.projectInfoText}>終了まで残り</Typography>
                    )
                    }
                    <Typography variant='h3' className={classes.projectInfoTextItem}>{remainingText}</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.mainContainer}>
            <div className={classes.mainContent}>
              <Typography variant='h5' style={{ fontWeight: 'bold', marginTop: '40px' }}>プレゼンター</Typography>
              <div className={classes.presenterCard}>
                <div className={classes.userDetails}>
                  {projectData.user && projectData.user.userImage.url ? (
                    <Avatar className={classes.avatar} alt='ユーザーアイコン（プレゼンター）' src={projectData.user.userImage.url} />
                  ) : (
                    <img src="/default_user_icon.png" alt="デフォルトユーザーアイコン (プレゼンター)" style={{ width: '80px' }} />
                  )}
                  <p>{projectData.user && projectData.user.name ? projectData.user.name : ''}</p>
                </div>
                <p>{projectData.user && projectData.user.profile ? projectData.user.profile : ''}</p>
              </div>
              <Typography variant='h5' style={{ fontWeight: 'bold', marginTop: '30px' }}>ピックアップ</Typography>
              <div className={classes.normalCard}>
                {projectData.catch_copies.map((catchCopy, index) => (
                  <p key={index}>{catchCopy}</p>
                ))}
              </div>
              <Typography variant='h5' style={{ fontWeight: 'bold', marginTop: '30px' }}>プロジェクト概要</Typography>
              <div className={classes.normalCard}>
                <Editor editorState={descriptionEditorState} readOnly />
              </div>
              <p>
                このプロジェクトの実施期間は
                {formattedStartDate}〜
                {formattedEndDate}
                です
              </p>
            </div>
            <div className={classes.sideBar}>
              <ReturnInfo project_id={project_id} isPurchaseDisabled={isPurchaseDisabled} />
            </div>
          </div>
          <div>
            <h2>おすすめのプロジェクト</h2>
            <RecommendedProject criteria={'endingSoon'} currentProjectId={project_id}/>
          </div>
        </>
      ) : (
        <p>このプロジェクトは非公開です。</p>
      )
    }
    </>
  )
}

export default ShowProject
