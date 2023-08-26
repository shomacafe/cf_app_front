import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ReturnInfoContext } from './ReturnInfoContext'
import clientApi from '../../api/client';
import Cookies from 'js-cookie';
import { Button } from '@material-ui/core';
import Modal from '@mui/material/Modal';

const ReturnPurchaseConfirm = () => {
  const { project_id } = useParams();
  const { returnData } = useContext(ReturnInfoContext);
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const selectedReturnId = queryParams.get('return_id');
  const selectedProjectId = queryParams.get('project_id');
  const selectedReturn = returnData.find(item => item.id === parseInt(selectedReturnId));
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  console.log('project_id', selectedProjectId)
  const handleConfirm = async () => {
    const confirmResult = window.confirm('リターンを購入してもよろしいですか？');

    if (confirmResult) {
      try {
        const combinedData = {
          project_id: selectedProjectId,
          return_id: selectedReturn.id,
          quantity: 1,
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
      <div>
        <h2>応援購入するリターン</h2>
        <p>リターン名：{selectedReturn.name}</p>
        <p>説明: {selectedReturn.description}</p>
        <p>価格: {selectedReturn.price}</p>
        <img src={selectedReturn.return_image.url} alt={'selectedReturn.name'} style={{width: '300px'}} />
      </div>
      <Button variant="contained" color="primary" onClick={handleConfirm}>
        リターン購入を確定する
      </Button>
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
