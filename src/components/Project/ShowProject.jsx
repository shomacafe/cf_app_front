import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import clientApi from '../../api/client'
import { parseISO, format } from 'date-fns'
import { Editor, convertFromRaw, EditorState } from 'draft-js';
import ReturnInfo from './ReturnInfo'
import { ReturnInfoContext } from './ReturnInfoContext'
import { AuthContext } from '../../lib/AuthContext'

const ShowProject = () => {
  const { project_id } = useParams();
  const { setReturnData } = useContext(ReturnInfoContext)
  const {isSignedIn, currentUser, loading} = useContext(AuthContext);
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
      }
    }

    fetchProjectData();
  }, [loading])

  if (loading) {
    return <p>ロード中...</p>
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
    remainingText = `あと${remainingDays}日`;
  } else if (remainingHours > 0) {
    remainingText = `あと${remainingHours}時間`;
  } else if (remainingMinutes > 0) {
    remainingText = `あと${remainingMinutes}分`;
  } else {
    remainingText = '終了しました'
  }

  // プログレスバーと達成の有無
  const progress = projectData ? Math.min((projectData.total_amount / projectData.goal_amount) * 100, 100) : 0;
  const isAchived = projectData ? (progress === 100) : false;

  console.log('購入できません', isPurchaseDisabled)
  // console.log('公開状態', projectData.is_published)

  return (
    <>
      <h2>プロジェクトページ</h2>
      {console.log(projectData)}
      {projectData !== null ? (
        <>
          <h2>{projectData.title}</h2>
          {projectData.project_images ? (
            projectData.project_images.map((projectImage, index) => {
              return (
                <img
                  key={index}
                  src={projectImage.url}
                  alt={`${projectData.title} - 画像${index + 1}`}
                  style={{width: '300px'}}
                />
              );
            })
          ) : (
            <p>プロジェクト画像がありません</p>
          )}
          <p>応援購入総額{projectData.total_amount}円</p>
          <p>目標金額{projectData.goal_amount}円</p>
          <p>達成率{projectData.success_rate}%</p>
          <progress value={progress} max='100'></progress>
          {isAchived ? <p>Success!</p> : <p>未達成</p>}
          <p>サポーター{projectData.support_count}人</p>
          {projectData.catch_copies.map((catchCopy, index) => (
            <p key={index}>{catchCopy}</p>
          ))}
          <p>{remainingText}</p>
          <p>
            このプロジェクトの実施期間は
            {formattedStartDate}〜
            {formattedEndDate}
            です
          </p>
          <div>
            <p>プロジェクト作成者：{projectData.user && projectData.user.name ? projectData.user.name : ''}</p>
          </div>
          <Editor editorState={descriptionEditorState} readOnly />
          <div>
            <ReturnInfo project_id={project_id} isPurchaseDisabled={isPurchaseDisabled} />
          </div>
        </>
      ) : (
        <p>このプロジェクトは非公開です。</p>
      )}
    </>
  )
}

export default ShowProject
