import React, { createContext, useState, useEffect } from 'react'
import { Stepper, Step, StepLabel } from '@material-ui/core'
import ProjectForm from './ProjectForm'
import ReturnForm from './ReturnForm'
import ProjectConfirm from './ProjectConfirm'

export const ProjectDataContext = createContext();
export const ReturnDataContext = createContext();

const CreateProject = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    catch_copies: [''],
    goal_amount: 0,
    start_date: '',
    end_date: '',
    project_images: [''],
    description: '',
  });
  const [returnFormData, setReturnFormData] = useState({
    returns: [
      {
        name: '',
        description: '',
        price: 0,
        stock_count: 0
      }
    ]
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [apiImageFiles, setApiImageFiles] = useState([]);
  const [returnImagePreviews, setReturnImagePreviews] = useState([]);
  const [apiReturnImageFiles, setAipReturnImageFiles] = useState([]);
  const [published, setPublished] = useState(false);


  useEffect(() => {
    console.log('formDataが更新されました:', projectFormData);
  }, [projectFormData]);

  const getSteps = () => {
    return ['プロジェクト登録', 'リターン登録', '確認'];
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
      <h1>プロジェクト登録</h1>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <ProjectDataContext.Provider value={{
        projectFormData,
        setProjectFormData,
        imagePreviews,
        setImagePreviews,
        apiImageFiles,
        setApiImageFiles,
        published,
        setPublished,
      }}>
        <ReturnDataContext.Provider value={{
        returnFormData,
        setReturnFormData,
        apiReturnImageFiles,
        setAipReturnImageFiles,
        returnImagePreviews,
        setReturnImagePreviews
        }}>
          {renderStepContent(activeStep)}
        </ReturnDataContext.Provider>
      </ProjectDataContext.Provider>
    </>
  )
}

export default CreateProject
