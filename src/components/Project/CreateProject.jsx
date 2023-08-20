import React, { createContext, useState } from 'react'
import { Stepper, Step, StepLabel } from '@material-ui/core'
import ProjectForm from './ProjectForm'
import ReturnForm from './ReturnForm'
import ProjectConfirm from './ProjectConfirm'
import { ProjectDataProvider, ReturnDataProvider } from '../../contexts/ProjectContext';

const CreateProject = () => {
  const [activeStep, setActiveStep] = useState(0);

  const getSteps = () => {
    return ['プロジェクト情報の入力', 'リターンの追加', '確認'];
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
      <ProjectDataProvider>
        <ReturnDataProvider>
          {renderStepContent(activeStep)}
        </ReturnDataProvider>
      </ProjectDataProvider>
    </>
  )
}

export default CreateProject
