import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, FormControlLabel, Checkbox, makeStyles } from '@material-ui/core';
import { ProjectDataContext } from '../../contexts/ProjectContext';
import { ReturnDataContext } from '../../contexts/ProjectContext';
import clientApi from '../../api/client';
import Cookies from 'js-cookie';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import Modal from '@mui/material/Modal';
import { useParams } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  confirmCard: {
    maxWidth: '800px',
    margin: '20px auto',
  },
  projectInfo: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    margin: '20px',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
    },
  },
  infoContent: {
    padding: '10px',
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
  },
  image: {
    maxWidth: '400px',
    width: '100%',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
  },
  projectDescription: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px',
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      border: 'none',
    },
  },
  projectDate: {
    display: 'flex',
    paddingTop: '10px',
  },
  header: {
    backgroundColor: '#f5f5f5',
    borderRadius: '10px 10px 0 0',
    borderBottom: '1px solid #ccc',
  }
}));

const ProjectConfirm = ({ handleBack }) => {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const { projectFormData, apiImageFiles, imagePreviews, published, setPublished, editorState, isEdit } = useContext(ProjectDataContext);
  const { returnFormData, apiReturnImageFiles, returnImagePreviews } = useContext(ReturnDataContext);
  const projectDescriptionHtml = draftToHtml(projectFormData.description);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const classes = useStyles();

  const formatDate = (date) => {
    return date.toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  const handleConfirm = async () => {
    const confirmResult = window.confirm(isEdit ? 'プロジェクトを更新してよろしいですか？' : 'プロジェクトを登録してよろしいですか？');

    if (confirmResult) {
      try {
        const combinedData = new FormData();
        combinedData.append('title', projectFormData.title);
        combinedData.append('goal_amount', projectFormData.goal_amount);
        combinedData.append('start_date', projectFormData.start_date.toISOString());
        combinedData.append('end_date', projectFormData.end_date.toISOString());

        const editorStateContent = convertToRaw(editorState.getCurrentContent());
        combinedData.append('description', JSON.stringify(editorStateContent));

        combinedData.append('is_published', published);

        projectFormData.catch_copies.forEach((catchCopy) => {
          combinedData.append('catch_copies[]', catchCopy);
        })

        projectFormData.project_images.forEach((image) => {
          combinedData.append('project_images[]', image);
        })

        returnFormData.returns.forEach((returnData, index) => {
          combinedData.append(`returns_attributes[${index}][name]`, returnData.name);
          combinedData.append(`returns_attributes[${index}][price]`, returnData.price);
          combinedData.append(`returns_attributes[${index}][description]`, returnData.description);
          combinedData.append(`returns_attributes[${index}][stock_count]`, returnData.stock_count);

          if (apiReturnImageFiles[index]) {
            combinedData.append(`returns_attributes[${index}][return_image]`, apiReturnImageFiles[index]);
          }

          if (isEdit && returnData.id) {
            combinedData.append(`returns_attributes[${index}][id]`, returnData.id);
          }
        });

        const headers = {
          'access-token': Cookies.get('_access_token'),
          'client': Cookies.get('_client'),
          'uid': Cookies.get('_uid'),
          'expiry': Cookies.get('_expiry'),
          'token-type': Cookies.get('_token-type'),
        };

        const url = isEdit ? `/projects/${project_id}` : '/projects'
        const method = isEdit ? 'put' : 'post';

        const response = await clientApi.request({
          url,
          method,
          data: combinedData,
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('API レスポンス', response.data);
        setShowSuccessModal(true)
      } catch (error) {
        console.error('データの送信に失敗しました', error);
      }
    }
  };

  return (
    <>
      <div className={classes.confirmCard}>
        <div className={classes.projectInfo}>
          <div className={classes.header}>
            <Typography variant="h5" style={{ padding: '10px', textAlign: 'center' }}>プロジェクト</Typography>
          </div>
          <div className={classes.infoContent}>
            <div className={classes.infoItem}>
              <Typography>タイトル</Typography>
              <Typography variant="h5">{projectFormData.title}</Typography>
            </div>
            <div className={classes.projectImage}>
              {imagePreviews.map((image, index) => (
                <div>
                  <Typography>プロジェクト画像{index + 1}</Typography>
                  <img src={image} alt={`プロジェクト${index + 1}の画像`} className={classes.image} />
                </div>
              ))}
            </div>
            {projectFormData.catch_copies.map((catchCopy, index) => (
              <div key={catchCopy.id} className={classes.infoItem}>
                <Typography>キャッチコピー{index + 1}</Typography>
                <Typography variant="h6">{catchCopy}</Typography>
              </div>
            ))}
            <div className={classes.infoItem}>
              <Typography style={{ paddingTop: '10px' }}>目標金額</Typography>
              <Typography variant="h6">
                {projectFormData.goal_amount}円
              </Typography>
            </div>
            <div className={classes.projectDate}>
              <div className={classes.infoItem}>
                <Typography>開始日</Typography>
                <Typography variant="h6">{formatDate(projectFormData.start_date)}</Typography>
              </div>
              <div className={classes.infoItem}>
                <Typography>終了日</Typography>
                <Typography variant="h6">{formatDate(projectFormData.end_date)}</Typography>
              </div>
            </div>
            <div className={classes.infoItem}>
              <div className={classes.projectDescription}>
                <Typography>プロジェクトの説明</Typography>
                <div dangerouslySetInnerHTML={{ __html: projectDescriptionHtml }} />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.projectInfo}>
          <div className={classes.header}>
            <Typography variant="h5" style={{ padding: '10px', textAlign: 'center' }}>リターン</Typography>
          </div>
          <div className={classes.InfoContent}>
            {returnFormData.returns.map((returnData, index) => (
              <div key={returnData.id} style={{ marginBottom: '30px' }}>
                <div className={classes.infoItem}>
                  <Typography>リターン{index + 1}</Typography>
                  <Typography variant="h5">{returnData.name}</Typography>
                </div>
                {returnImagePreviews[index] && (
                  <div>
                    <img src={returnImagePreviews[index]} alt={`リターン${index + 1}の画像`} className={classes.image} />
                  </div>
                )}
                <div className={classes.infoItem}>
                  <Typography>価格</Typography>
                  <Typography variant="h6">{returnData.price}円</Typography>
                </div>
                <div className={classes.infoItem}>
                  <Typography>在庫数</Typography>
                  <Typography variant="h6">{returnData.stock_count}個</Typography>
                </div>
                <div className={classes.infoItem}>
                  <Typography>リターンの説明</Typography>
                  <Typography>{returnData.description}</Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '30px' }}>
          <h3>このプロジェクトを公開しますか？</h3>
          <p>後からもプロジェクト編集で変更できます。</p>
          <FormControlLabel
            control={<Checkbox checked={published} onChange={(e) => setPublished(e.target.checked)} />}
            label="公開する"
          />
        </div>
        <Button variant="contained" color="primary" onClick={handleBack}>
          戻る
        </Button>
        <Button variant="contained" color="primary" onClick={handleConfirm} style={{ marginLeft: '10px' }}>
          {isEdit ? 'プロジェクトを更新する' : 'プロジェクトを登録する'}
        </Button>
      </div>
      <Modal open={showSuccessModal} onClose={() => navigate('/')}>
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2 className='modal-title'>
              {isEdit ? 'プロジェクトを更新しました' : 'プロジェクトを作成しました'}
            </h2>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ProjectConfirm
