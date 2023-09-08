import React, { useState, useContext, useEffect } from 'react'
import { Stepper, Step, StepLabel } from '@material-ui/core'
import ProjectForm from './ProjectForm'
import ReturnForm from './ReturnForm'
import ProjectConfirm from './ProjectConfirm'
import { ProjectDataContext, ReturnDataContext } from '../../contexts/ProjectContext';
import { useParams } from 'react-router-dom'
import clientApi from '../../api/client'
import Cookies from 'js-cookie'
import { parseISO } from 'date-fns'
import { convertFromRaw, EditorState } from 'draft-js';

const createEditorStateFormDescription = (descriptionData) => {
  const contentState = convertFromRaw({
    blocks: descriptionData.blocks,
    entityMap: descriptionData.entityMap,
  });

  return EditorState.createWithContent(contentState);
}

const EditProject = () => {
  const { project_id } = useParams();
  const { setProjectFormData, setImagePreviews, setApiImageFiles, setEditorState, setPublished, setIsEdit } = useContext(ProjectDataContext);
  const { setReturnFormData, setReturnImagePreviews, setApiReturnImageFiles, returnFormData } = useContext(ReturnDataContext);
  const [activeStep, setActiveStep] = useState(0);
  setIsEdit(true);

  // 登録済のプロジェクト情報を取得しステートにセットする。
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const headers = {
          'access-token': Cookies.get('_access_token'),
          'client': Cookies.get('_client'),
          'uid': Cookies.get('_uid'),
        };

        const response = await clientApi.get(`/projects/${project_id}`, {
          headers: headers,
        });

        const projectData = response.data.project;

        let catchCopiesArray = [];
        catchCopiesArray = JSON.parse(projectData.catchCopies);

        const start_date = parseISO(projectData.startDate);
        const end_date = parseISO(projectData.endDate);

        const projectImagesArray = projectData.projectImages.map(image => image.url);

        const projectImagesBlobs = await Promise.all(
          projectImagesArray.map(async (imageUrl) => {
            const imageResponse = await fetch(imageUrl);
            const blob = await imageResponse.blob();
            return blob;
          })
        )

        console.log('projectImagesBlobs', projectImagesBlobs)

        const descriptionData = JSON.parse(projectData.description);
        const descriptionEditorState = createEditorStateFormDescription(descriptionData);

        setProjectFormData({
          title: projectData.title,
          catch_copies: catchCopiesArray,
          goal_amount: projectData.goalAmount,
          start_date: start_date,
          end_date: end_date,
        })

        console.log('projectImagesArray', projectImagesArray)

        setImagePreviews(projectImagesArray);
        setApiImageFiles(projectImagesBlobs);

        setEditorState(descriptionEditorState);

        console.log('descriptionData', descriptionData)

        const initialReturns = projectData.returns.map(returnData => ({
          name: returnData.name,
          description: returnData.description,
          price: returnData.price,
          stock_count: returnData.stockCount,
          id: returnData.id,
        }));

        setReturnFormData({
          returns: initialReturns
        });

        const initialReturnImagePreviews = projectData.returns.map(returnData =>
          returnData.returnImage.url
        );
        setReturnImagePreviews(initialReturnImagePreviews);

        setPublished(projectData.isPublished)

        console.log('API レスポンス', projectData)
      } catch (error) {
        console.error('API レスポンスの取得に失敗しました', error);
      }
    };

    fetchProjectData();
  }, [])

  const getSteps = () => {
    return ['プロジェクト情報の編集', 'リターンの編集', '確認'];
  }
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <ProjectForm  handleNext={handleNext}/>;
      case 1:
        return <ReturnForm handleNext={handleNext} handleBack={handleBack} />;
      case 2:
        return <ProjectConfirm handleBack={handleBack} />;
      default:
        return 'ステップが見つかりません。';
    }
  };

  return (
    <>
      <h1>プロジェクト編集</h1>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {renderStepContent(activeStep)}
    </>
  )
}

export default EditProject
