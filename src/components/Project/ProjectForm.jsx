import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Grid, Button, TextField, IconButton } from '@material-ui/core';
import { ProjectDataContext } from '../../contexts/ProjectContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ja } from 'date-fns/locale';
import { convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import clientApi from '../../api/client';
import createImagePlugin from 'draft-js-image-plugin';
import { resizeProjectImages } from './ResizeProjectImages';

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

const ProjectForm = ({ handleNext }) => {
  const {
    projectFormData,
    setProjectFormData,
    imagePreviews,
    setImagePreviews,
    apiImageFiles,
    setApiImageFiles,
    editorState,
    setEditorState,
  } = useContext(ProjectDataContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: projectFormData,
  });
  const watchedFields = watch()
  const [descriptionError, setDescriptionError] = useState('');
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    reset(projectFormData);
  }, [projectFormData, reset]);

  const onSubmit = (data) => {
    const contentState = editorState.getCurrentContent();
    const isDescriptionEmpty = contentState.getPlainText().trim() === '';
    const isImageEmpty = apiImageFiles.length === 0;

    if (isDescriptionEmpty) {
      setDescriptionError('プロジェクト説明は必須です')
    } else {
      setDescriptionError('');
    }

    if (isImageEmpty) {
      setImageError('プロジェクト画像を選択してください');
    } else {
      setImageError('');
    }

    if (isDescriptionEmpty || isImageEmpty) {
      return;
    }

    data.description = convertToRaw(contentState);
    data.project_images = apiImageFiles;

    setProjectFormData(data);
    handleNext();
    console.log('プロジェクトフォーム「次へ」押下時', projectFormData)
  };

  // キャッチコピーのフィールド追加
  const addCatchCopyField = () => {
    const currentCatchCopies = watchedFields.catch_copies;
    if (currentCatchCopies.length < 3) {
      const newCatchCopies = [...currentCatchCopies, ''];
      setValue('catch_copies', newCatchCopies);
    }
  };

  const removeCatchCopy = (indexToRemove) => {
    const newCatchCopies = watchedFields.catch_copies.filter((_, index) => index !== indexToRemove);
    setValue('catch_copies', newCatchCopies);
  };

  // 画像選択時のハンドラー
  const addProjectImage = async (e) => {
    const files = e.target.files;
    const resizedApiImagePreviews = [];
    const resizedApiImageFiles = [];

    for (let i = 0; i < files.length; i++) {
      const resizedImage = await resizeProjectImages(files[i], 300, 200);
      resizedApiImagePreviews.push(URL.createObjectURL(resizedImage));
      resizedApiImageFiles.push(await resizeProjectImages(files[i], 900, 600));
    }

    setImagePreviews((prevImagePreviews) => [...prevImagePreviews, ...resizedApiImagePreviews]);
    setApiImageFiles((prevApiImageFiles) => [...prevApiImageFiles, ...resizedApiImageFiles]);
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

  // const handleImageUpload = async (file) => {
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   // formData.append('rich_text_editor_upload', true);

  //   try {
  //     const response = await clientApi.post('/upload_rich_text_image', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });

  //     if (response.status === 200) {
  //       const imageUrl = response.data;
  //       return { data: { link: imageUrl } };
  //     } else {
  //       throw new Error('画像のアップロードに失敗しました');
  //     }
  //   } catch (error) {
  //     throw new Error('画像のアップロードに失敗しました');
  //   }
  // };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* タイトル */}
          <Controller
            name="title"
            control={control}
            rules={{
              required:  'タイトルを入力してください',
              maxLength: {
                value: 30,
                message: 'タイトルは30文字以内で入力してください'
              }
            }}
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
              minLength: {
                value: 1,
                message: '少なくとも1つのキャッチコピーが必要です',
              },
              validate: (value) => {
                for (const copy of value) {
                  if (copy.length === 0) {
                    return 'キャッチコピーを入力してください';
                  }
                  if (copy.length > 30) {
                    return 'キャッチコピーは30文字までです';
                  }
                }
                return true;
              },
            }}
            render={({ field }) => (
              <div>
                {field.value.map((copy, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
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
                    {index > 0 && ( // 最初のキャッチコピー以外に削除ボタンを表示
                    <IconButton
                      onClick={() => removeCatchCopy(index)}
                      aria-label={`キャッチコピー${index + 1}を削除`}
                    >
                      削除
                    </IconButton>
                  )}
                </div>
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
            rules={{
              required: '目標金額は必須です',
              pattern: {
                value: /^[0-9]+$/,
                message: '整数を入力してください',
              },
              validate: (value) => {
                if (value <= 0) {
                  return '0より大きい数字で入力してください'
                }
                return true;
              },
            }}
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
            rules={{ required: '開始日を選択してください' }}
            render={({field}) => (
              <div>
                <h3>開始日</h3>
                <DatePicker
                  selected={watchedFields.start_date}
                  onChange={(date) => field.onChange(date)}
                  locale={ja}
                  dateFormat="yyyy/MM/dd HH:mm"
                  placeholderText="開始日を選択してください"
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={60}
                  minDate={new Date()}
                />
                {errors.start_date && <p style={{ color: 'red' }}>{errors.start_date.message}</p>}
              </div>
            )}
          />
          {/* 終了日 end_date */}
          <Controller
            name="end_date"
            control={control}
            rules={{ required: '終了日を選択してください' }}
            render={({field}) => (
              <div>
                <h3>終了日</h3>
                <DatePicker
                  selected={watchedFields.end_date}
                  onChange={(date) => field.onChange(date)}
                  locale={ja}
                  dateFormat="yyyy/MM/dd HH:mm"
                  placeholderText="終了日を選択してください"
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={60}
                  minDate={watchedFields.start_date}
                />
                {errors.end_date && <p style={{ color: 'red' }}>{errors.end_date.message}</p>}
              </div>
            )}
          />
          {/* プロジェクト画像 project_images */}
          <div>
            <h3>プロジェクト画像</h3>
            {imageError && <p style={{ color: 'red' }}>{imageError}</p>}
            <input
              type='file'
              multiple
              onChange={addProjectImage}
            />
            {errors.project_images && <p style={{ color: 'red' }}>{errors.project_images.message}</p>}
          </div>
          {imagePreviews.map((imageUrl, index) => (
            <div key={index}>
              <img src={imageUrl} alt={`プレビュー${index + 1}`} style={{ width: '300px'}} />
              <button type='button' onClick={() => removeProjectImage(index)}>削除</button>
            </div>
          ))}
          {/* プロジェクト説明 description */}
          <div className="editor-container">
            <h3>プロジェクトの説明</h3>
            {descriptionError && <p style={{ color: 'red' }}>{descriptionError}</p>}
            <div className="editor-content">
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                wrapperClassName='wrapper-class'
                editorClassName='editor-class'
                plugins={plugins}
                toolbar={{
                  options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'history'],
                  inline: { inDropdown: true },
                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                  history: { inDropdown: true },
                  blockType: { options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'], },
                  // image: {
                  //   uploadCallback: handleImageUpload,
                  //   previewImage: true,
                  // }
                }}
                localization={{
                  locale: "ja",
                }}
              />
            </div>
          </div>
          <Button type='submit' variant='contained' color='primary'>
            次へ
          </Button>
        </form>
    </div>
  )
}

export default ProjectForm
