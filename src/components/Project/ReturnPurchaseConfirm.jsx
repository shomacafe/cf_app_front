import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ReturnInfoContext } from './ReturnInfoContext'
import clientApi from '../../api/client';
import Cookies from 'js-cookie';
import { Button, makeStyles } from '@material-ui/core';
import Modal from '@mui/material/Modal';

const useStyles = makeStyles((theme) => ({
  purchaseConfirmInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  purchaseInfo: {
    display: 'flex',
    flexDirection: 'column',
  }
}));

const ReturnPurchaseConfirm = () => {
  const { returnData } = useContext(ReturnInfoContext);
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const selectedReturnId = queryParams.get('return_id');
  const selectedProjectId = queryParams.get('project_id');
  const selectedQuantity = queryParams.get('quantity');
  const selectedReturn = returnData.find(item => item.id === parseInt(selectedReturnId));
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const classes = useStyles();

  const handleConfirm = async () => {
    const confirmResult = window.confirm('リターンを購入してもよろしいですか？');

    if (confirmResult) {
      try {
        const combinedData = {
          project_id: selectedProjectId,
          return_id: selectedReturn.id,
          quantity: parseInt(selectedQuantity),
          amount: selectedReturn.price
        }

        const response = await clientApi.post('/purchases', combinedData, {
          headers: {
            'access-token': Cookies.get('_access_token'),
            'client': Cookies.get('_client'),
            'uid': Cookies.get('_uid'),
          }
        });

        console.log('API レスポンス', response.data);
        setShowSuccessModal(true)
      } catch (error) {
        console.error('データの送信に失敗しました', error);
      }
    }
  }

  if (!selectedReturn) {
    return <div>画面がリロードされました。リターンの購入からやり直してください。</div>;
  }

  return (
    <>
      <h2>応援購入するリターン</h2>
      <div className={classes.purchaseConfirmInfo}>
        <div className={classes.purchaseInfo}>
          <img src={selectedReturn.return_image.url} alt={'selectedReturn.name'} style={{width: '300px'}} />
          <h3>{selectedReturn.name}</h3>
          <p>{selectedReturn.description}</p>
          <p>{selectedReturn.price.toLocaleString()}円　×　 {selectedQuantity}個　= {(selectedReturn.price * selectedQuantity).toLocaleString()}円</p>
        </div>
        <Button variant="contained" color="primary" style={{ maxWidth: '200px', margin: '20px 0' }} onClick={handleConfirm}>
          リターン購入を確定する
        </Button>
      </div>
      <Modal open={showSuccessModal} onClose={() => navigate(`/projects/${selectedProjectId}`)}>
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2 className='modal-title'>リターンを購入しました</h2>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ReturnPurchaseConfirm
