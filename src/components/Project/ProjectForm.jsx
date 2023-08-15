import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Grid, Button, TextField } from '@material-ui/core';
import { ProjectDataContext } from './CreateProject';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ja } from 'date-fns/locale';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import clientApi from '../../api/client';

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';

const ProjectForm = ({ handleNext }) => {
  const {
    projectFormData,
    setProjectFormData,
    imagePreviews,
    setImagePreviews,
    apiImageFiles,
    setApiImageFiles,
  } = useContext(ProjectDataContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: projectFormData,
  });
  const watchedFields = watch()
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    setProjectFormData((prevProjectFormData) => ({
      ...prevProjectFormData,
      project_images: apiImageFiles,
    }));
  }, [apiImageFiles, setProjectFormData])

  const onSubmit = (data) => {
    data.description = convertToRaw(editorState.getCurrentContent());
    data.project_images = apiImageFiles;

    setProjectFormData(data);
    handleNext();
    console.log('プロジェクトフォーム「次へ」押下時', projectFormData)
  };

  // const onSubmit = (data) => {
  //   data.description = projectFormData.description;
  //   data.project_images = apiImageFiles;
  //   setProjectFormData(data)
  //   handleNext();
  //   console.log('プロジェクトフォーム「次へ」押下時', data)
  // };

  // キャッチコピーのフィールド追加
  const addCatchCopyField = () => {
    const currentCatchCopies = watchedFields.catch_copies;
    if (currentCatchCopies.length < 3) {
      const newCatchCopies = [...currentCatchCopies, ''];
      setValue('catch_copies', newCatchCopies);
    }
  };

  // 画像選択時のハンドラー
  const addProjectImage = (e) => {
    const files = e.target.files;
    const imageUrls = [];

    for (let i = 0; i < files.length; i++) {
      const imageUrl = URL.createObjectURL(files[i]);
      imageUrls.push(imageUrl);
    }

    setImagePreviews((prevImagePreviews) => [...prevImagePreviews, ...imageUrls]);
    setApiImageFiles((prevApiImageFiles) => [...prevApiImageFiles, ...files]);
  };

  // 画像削除時のハンドラー
  const removeProjectImage = (index) => {
    setImagePreviews((prevImagePreviews) => {
      return prevImagePreviews.filter((_, i) => i !== index);
    })

    setApiImageFiles((prevApiImageFiles) => {
      return prevApiImageFiles.filter((_, i) => i !== index);
    })
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await clientApi.post('/upload_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        console.log('urlが帰ってきたお', response.data)
        const imageUrl = response.data;
        return { data: { link: imageUrl } };
      } else {
        throw new Error('画像のアップロードに失敗しました');
      }
    } catch (error) {
      throw new Error('画像のアップロードに失敗しました');
    }
  };

  return (
    <Grid container spacing={10}>
      <Grid item sm={2} />
      <Grid item lg={8} sm={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* その他のフォーム */}
          {/* タイトル */}
          <Controller
            name="title"
            control={control}
            rules={{required:  'タイトルを入力してください'}}
            render={({field}) => (
              <TextField
                {...field}
                label='プロジェクトのタイトル'
                fullWidth
                margin='normal'
                error={!!errors.title}
                placeholder="プロジェクトのタイトルを入力してください"
                helperText={errors.title?.message}
              />
            )}
          />
          {/* キャッチコピー */}
          <Controller
            name="catch_copies"
            control={control}
            rules={{
              required: '少なくとも1つのキャッチコピーが必要です',
              validate: (value) => {
                if(value.length === 0) {
                  return 'キャッチコピー1は必須です';
                }
                if (value.length > 3) {
                  return 'キャッチコピーは最大3つまでです';
                }
                return true;
              },
            }}
            render={({ field }) => (
              <div>
                {field.value.map((copy, index) => (
                  <TextField
                    key={index}
                    value={copy}
                    onChange={(e) => {
                      const newCatchCopies = [...field.value];
                      newCatchCopies[index] = e.target.value;
                      field.onChange(newCatchCopies);
                    }}
                    label={`キャッチコピー${index + 1}`}
                    fullWidth
                    margin="normal"
                    placeholder={`キャッチコピー${index + 1}を入力してください`}
                    error={!!errors.catch_copies?.[index]}
                    helperText={errors.catch_copies?.[index]?.message}
                  />
                ))}
                {errors.catch_copies && <p style={{ color: 'red' }}>{errors.catch_copies.message}</p>}
                <Button type="button" disabled={field.value.length >= 3} onClick={addCatchCopyField} variant="contained" color="primary">
                  キャッチコピーを追加
                </Button>
              </div>
            )}
          />
          {/* 目標金額 goal_amount */}
          <Controller
            name="goal_amount"
            control={control}
            rules={{required: '目標金額は必須です'}}
            render={({field}) => (
              <TextField
                {...field}
                label="目標金額"
                type="number"
                error={!!errors.goal_amount}
                placeholder="目標金額を入力してください"
                helperText={errors.goal_amount?.message}
              />
            )}
          />
          {/* 開始日 start_date */}
          <Controller
            name="start_date"
            control={control}
            render={({field}) => (
              <div>
                <h3>開始日</h3>
                <DatePicker
                  selected={watchedFields.start_date}
                  onChange={(date) => field.onChange(date)}
                  locale={ja}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="開始日を選択してください"
                />
              </div>
            )}
          />
          {/* 終了日 end_date */}
          <Controller
            name="end_date"
            control={control}
            render={({field}) => (
              <div>
                <h3>終了日</h3>
                <DatePicker
                  selected={watchedFields.end_date}
                  onChange={(date) => field.onChange(date)}
                  locale={ja}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="終了日を選択してください"
                />
              </div>
            )}
          />
          {/* プロジェクト画像 roject_images */}
          <div>
            <h3>プロジェクト画像</h3>
            <input type='file' multiple onChange={addProjectImage} />
          </div>
          {imagePreviews.map((imageUrl, index) => (
            <div key={index}>
              <img src={imageUrl} alt={`プレビュー${index + 1}`} style={{ width: '200px', height: '200px' }} />
              <button type='button' onClick={() => removeProjectImage(index)}>削除</button>
            </div>
          ))}

          {/* プロジェクト説明 */}
          <div className="editor">
            <h3>プロジェクトの説明</h3>
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              wrapperClassName='demo-wrapper'
              editorClassName='demo-editor'
              toolbar={{
                image: {
                  uploadCallback: handleImageUpload
                }
              }}
              localization={{
                locale: "ja",
              }}
            />
          </div>
          <Button type='submit' variant='contained' color='primary'>
            次へ
          </Button>
        </form>
      </Grid>
    </Grid>
  )
}

export default ProjectForm