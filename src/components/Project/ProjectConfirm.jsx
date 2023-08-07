import React, { useContext, useEffect } from 'react';
import { Grid, Button, Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import { ProjectDataContext } from './CreateProject';
import { ReturnDataContext } from './CreateProject';
import axios from 'axios';
import clientApi from '../../api/client';
import Cookies from 'js-cookie';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProjectConfirm = ({ handleBack }) => {
  const { projectFormData, imagePreviews, published, setPublished } = useContext(ProjectDataContext);
  const { returnFormData, apiReturnImageFiles, returnImagePreviews } = useContext(ReturnDataContext);

  console.log('API用プロジェクト画像', projectFormData.project_images);
  console.log('プレビュー用プロジェクト画像', imagePreviews);
  console.log('API用リターン画像', apiReturnImageFiles);
  console.log('プレビュー用リターン画像', returnImagePreviews);
  console.log('プロジェクト情報', projectFormData);
  console.log('リターン情報', returnFormData);
  console.log('アクセストークン：',Cookies.get("access_token"));

  const formatDate = (date) => {
    return date.toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  const handleConfirm = async () => {
    console.log(projectFormData.project_images)
    try {
      const combinedData = {
        "title": projectFormData.title,
        "catch_copies": projectFormData.catch_copies,
        "goal_amount": projectFormData.goal_amount,
        "start_date": formatDate(projectFormData.start_date),
        "end_date": formatDate(projectFormData.end_date),
        "project_images": ['プロジェクト画像'],
        "description": projectFormData.description,
        "is_published": published,
        "returns_attributes": returnFormData.returns.map((returnData, index) => ({
          "name": returnData.name,
          "price": returnData.price,
          "return_image": 'リターン画像',
          "description": returnData.description,
          "stock_count": returnData.stock_count,
        }))
      }

      const response = await clientApi.post('/projects', combinedData, {
        headers: {
          'access-token': Cookies.get('access_token'),
          'client': Cookies.get('client'),
          'uid': Cookies.get('uid'),
          'expiry': Cookies.get('expiry'),
          'token-type': Cookies.get('token-type'),
        }
      })

      console.log('データの送信に成功しました', combinedData);
    } catch (error) {
      console.error('データの送信に失敗しました', error);
    }
  }
  return (
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
          {/* <div>
            <h3>プロジェクトの説明</h3>
            <div dangerouslySetInnerHTML={{ __html: projectFormData.description }} style={{ maxWidth: '500px' }} />
          </div> */}
          <div style={{ marginBottom: '60px' }}>
            <h3>プロジェクトの説明</h3>
            <ReactQuill
              theme="snow"
              value={projectFormData.description}
              readOnly
              modules={{
                toolbar: false,
              }}
            />
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
          プロジェクトを登録する
        </Button>
      </Grid>
    </Grid>
  )
}

export default ProjectConfirm
