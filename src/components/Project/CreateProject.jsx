import React, { useState } from 'react'
import { Stepper, Step, StepLabel } from '@material-ui/core'
import ProjectForm from './ProjectForm'
import ReturnForm from './ReturnForm'
import ProjectConfirm from './ProjectConfirm'

const CreateProject = () => {
  const [activeStep, setActiveStep] = useState(0);

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
        return <ProjectForm />;
      case 1:
        return <ReturnForm />;
      case 2:
        return <ProjectConfirm />;
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
      {renderStepContent(activeStep, handleNext, handleBack)}
    </>
  )
}

export default CreateProject
