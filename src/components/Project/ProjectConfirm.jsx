import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Button, Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import { ProjectDataContext } from '../../contexts/ProjectContext';
import { ReturnDataContext } from '../../contexts/ProjectContext';
import clientApi from '../../api/client';
import Cookies from 'js-cookie';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import Modal from '@mui/material/Modal';
import { useParams } from 'react-router-dom'

const ProjectConfirm = ({ handleBack }) => {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const { projectFormData, apiImageFiles, imagePreviews, published, setPublished, editorState, isEdit } = useContext(ProjectDataContext);
  const { returnFormData, apiReturnImageFiles, returnImagePreviews } = useContext(ReturnDataContext);
  const projectDescriptionHtml = draftToHtml(projectFormData.description);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  const handleConfirm = async () => {
    const confirmResult = window.confirm(isEdit ? 'プロジェクトを更新してもよろしいですか？' : 'プロジェクトを登録してよろしいですか？');

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
      <Grid container spacing={10}>
        <Grid item sm={2} />
        <Grid item lg={8} sm={8}>
          <Typography variant="h4">プロジェクト情報</Typography>
          <section style={{ marginBottom: '50px' }}>
            <h2>{projectFormData.title}</h2>
            {imagePreviews.map((image, index) => (
              <div>
                <h3>プロジェクト画像{index + 1}</h3>
                <img src={image} alt={`プロジェクト${index + 1}の画像`} style={{ maxWidth: '400px' }} />
              </div>
            ))}
            {projectFormData.catch_copies.map((catchCopy, index) => (
              <div key={catchCopy.id}>
                <h3>キャッチコピー{index + 1}</h3>
                <p>{catchCopy}</p>
              </div>
            ))}
            <div>
              <h3>目標金額</h3>
              <p>{projectFormData.goal_amount}円</p>
            </div>
            <div>
              <h3>開始日</h3>
              <p>{formatDate(projectFormData.start_date)}</p>
            </div>
            <div>
              <h3>終了日</h3>
              <p>{formatDate(projectFormData.end_date)}</p>
            </div>
            <div style={{ marginBottom: '60px' }}>
              <h3>プロジェクトの説明</h3>
              <div dangerouslySetInnerHTML={{ __html: projectDescriptionHtml }} />
            </div>
          </section>
          <Typography variant="h4">リターン情報</Typography>
          {returnFormData.returns.map((returnData, index) => (
            <div key={returnData.id} style={{ marginBottom: '30px' }}>
              <h3>リターン{index + 1}</h3>
              <h2>{returnData.name}</h2>
              {returnImagePreviews[index] && (
                <div>
                  <img src={returnImagePreviews[index]} alt={`リターン${index + 1}の画像`} style={{ maxWidth: '400px' }} />
                </div>
              )}
              <div>
                <h3>価格</h3>
                <p>{returnData.price}円</p>
              </div>
              <div>
                <h3>在庫数</h3>
                <p>{returnData.stock_count}個</p>
              </div>
              <div>
                <h3>リターンの説明</h3>
                <p>{returnData.description}</p>
              </div>
            </div>
          ))}
          <div style={{ marginBottom: '30px' }}>
            <h3>このプロジェクトを公開しますか？</h3>
            <p>後からも公開できます。</p>
            <FormControlLabel
              control={<Checkbox checked={published} onChange={(e) => setPublished(e.target.checked)} />}
              label="公開する"
            />
          </div>
          <Button variant="contained" color="primary" onClick={handleBack}>
            戻る
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            {isEdit ? 'プロジェクトを更新する' : 'プロジェクトを登録する'}
          </Button>
        </Grid>
      </Grid>
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
