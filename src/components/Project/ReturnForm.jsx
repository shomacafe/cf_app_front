import React, { useContext, useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Grid, Button, TextField, Tooltip } from '@material-ui/core';
import { ReturnDataContext } from '../../contexts/ProjectContext';
import { resizeProjectImages } from './ResizeProjectImages';

const ReturnForm = ({ handleNext, handleBack }) => {
  const {
    returnFormData,
    setReturnFormData,
    apiReturnImageFiles,
    setApiReturnImageFiles,
    returnImagePreviews,
    setReturnImagePreviews
  } = useContext(ReturnDataContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
    register,
  } = useForm({
    defaultValues: returnFormData,
  });
  const watchedFields = watch();
  const [returnImageErrors, setReturnImageErrors] = useState([]);


  useEffect(() => {
    setReturnFormData((prevReturnFormData) => ({
      ...prevReturnFormData,
      ...watchedFields,
    }));
  }, [watchedFields]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'returns',
  });

  useEffect(() => {
    setReturnFormData((prevReturnFormData) => ({
      ...prevReturnFormData,
      returns: fields,
    }));
  }, [fields, setReturnFormData]);

  const onSubmit = (data) => {
    const newErrors = Array(fields.length).fill('');
    fields.forEach((_, index) => {
      if (!returnImagePreviews[index]) {
        newErrors[index] = 'リターン画像を選択してください';
      }
    });
    setReturnImageErrors(newErrors);

    if (newErrors.some((error) => error !== '')) {
      return;
    }

    handleNext()
    console.log('リターンフォーム「次へ」押下時）：', returnFormData, apiReturnImageFiles);
  }

  const handleRemove = (index) => {
    if (fields.length === 1) {
      return;
    }
    remove(index);
  }

  const addReturnImage = async (e, index) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);

    const resizedApiReturnImage = await resizeProjectImages(file, 600, 400);
    const resizedReturnImage = await resizeProjectImages(file, 300, 200);

    setApiReturnImageFiles((prevApiReturnImageFiles) => {
      const newApiReturnImageFiles = [...prevApiReturnImageFiles];
      newApiReturnImageFiles[index] = resizedApiReturnImage;
      return newApiReturnImageFiles;
    });
    setReturnImagePreviews((prevReturnImagePreviews) => {
      const newReturnImagePreviews = [...prevReturnImagePreviews];
      newReturnImagePreviews[index] = URL.createObjectURL(resizedReturnImage);
      return newReturnImagePreviews;
    });

    setReturnImageErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = '';
      return newErrors;
    })
  };

  const removeReturnImage = (index) => {
    setReturnImagePreviews((prevReturnImagePreviews) => {
      const newReturnImagePreviews = [...prevReturnImagePreviews];
      newReturnImagePreviews[index] = null;
      return newReturnImagePreviews;
    });

    setApiReturnImageFiles((prevApiReturnImageFiles) => {
      const newApiReturnImageFiles = [...prevApiReturnImageFiles];
      newApiReturnImageFiles[index] = null;
      return newApiReturnImageFiles;
    });
  };

  return (
    <Grid container spacing={10}>
    <Grid item sm={2} />
    <Grid item lg={8} sm={8}>
     <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((returnData, index) => (
          <div key={returnData.id}>
            {/* リターン名 */}
            <Controller
              name={`returns.${index}.name`}
              control={control}
              defaultValue={returnData.name}
              rules={{ required: 'リターンの名前は必須です' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={`リターン${index + 1}の名前`}
                  fullWidth
                  margin="normal"
                  error={!!errors?.returns?.[index]?.name}
                  helperText={errors?.returns?.[index]?.name?.message}
                />
              )}
            />
            {/* リターン画像 */}
            <div>
              <h3>リターンの画像</h3>
              <input type='file' onChange={(e) => addReturnImage(e, index)} />
            </div>
            {returnImageErrors[index] && (
              <p style={{ color: 'red' }}>{returnImageErrors[index]}</p>
            )}
            {returnImagePreviews[index] && (
              <div>
                <img src={returnImagePreviews[index]} alt={`プレビュー${index + 1}`} style={{ width: '300px'}} />
                <button type='button' onClick={() => removeReturnImage(index)}>削除</button>
              </div>
            )}
            {/* リターンの説明 */}
            <Controller
                name={`returns.${index}.description`}
                control={control}
                rules={{ required: 'リターンの説明は必須です' }}
                render={({ field }) => (
                  <Tooltip title="自由に記入することができます" placement="top-start" arrow>
                    <TextField
                      {...field}
                      label={`リターン${index + 1}の説明`}
                      fullWidth
                      margin="normal"
                      minRows={4}
                      multiline
                      variant="outlined"
                      placeholder="リターンの説明を入力してください。"
                      error={!!errors?.returns?.[index]?.description}
                      helperText={errors?.returns?.[index]?.description?.message}
                    />
                  </Tooltip>
                )}
              />
              {/* リターン価格 */}
              <Controller
                name={`returns.${index}.price`}
                control={control}
                rules={{required: 'リターン価格は必須です'}}
                render={({field}) => (
                  <TextField
                    {...field}
                    label={`リターン${index + 1}の価格`}
                    fullWidth
                    type="number"
                    margin="normal"
                    error={!!errors?.returns?.[index]?.price}
                    helperText={errors?.returns?.[index]?.price?.message}
                  />
                )}
              />
              {/* 在庫数 */}
              <Controller
                name={`returns.${index}.stock_count`}
                control={control}
                rules={{required: '在庫数は必須です'}}
                render={({field}) => (
                  <TextField
                    {...field}
                    label={`在庫${index + 1}`}
                    fullWidth
                    type="number"
                    margin="normal"
                    error={!!errors?.returns?.[index]?.stock_count}
                    helperText={errors?.returns?.[index]?.stock_count?.message}
                  />
                )}
              />
          <Button variant="contained" color="secondary" onClick={() => handleRemove(index)}>
            リターン{index + 1}を削除
          </Button>
          </div>
        ))}
        <Button variant="contained" color="primary" onClick={() => append({})} style={{ margin: '5px 0' }}>
          リターンを追加
        </Button>
        <div>
          <Button variant="contained" color="primary" onClick={handleBack}>
            戻る
          </Button>
          <Button type='submit' variant="contained" color="primary" style={{ marginLeft: '10px' }}>
            次へ
          </Button>
        </div>
      </form>
    </Grid>
  </Grid>
  );
};

export default ReturnForm
