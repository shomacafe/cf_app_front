import React, { useContext } from 'react'
import Button from "@material-ui/core/Button"
import { Link, useNavigate } from 'react-router-dom';
import { ReturnInfoContext } from './ReturnInfoContext';

const ReturnInfo = ({ project_id, isPurchaseDisabled }) => {
  const {returnData} = useContext(ReturnInfoContext);

  return (
    <>
      <h2>リターン情報</h2>
      {returnData.map((returnItem, index) => {
        return(
          <div key={index}>
            {console.log(returnItem)}
            <p>リターン名:{returnItem.name}</p>
            <p>説明: {returnItem.description}</p>
            <p>価格: {returnItem.price}</p>
            <p>{returnItem.stock_count === 0 ? '売り切れました' : `残り${returnItem.stock_count}個`}</p>
            <p>支援者：{returnItem.supporter_count}人</p>
            <img src={returnItem.return_image.url} alt={`${returnItem.name} - 画像${index + 1}`} style={{width: '300px'}} />
            {/* <Link to={`/purchase/confirm?return_id=${returnItem.id}&project_id=${project_id}`}>購入する</Link> */}
            <Button
              variant='contained'
              size='large'
              color='primary'
              component={Link}
              to={`/purchase/confirm?return_id=${returnItem.id}&project_id=${project_id}`}
              disabled={returnItem.stock_count === 0 || isPurchaseDisabled}
            >
              このリターンを応援購入する
            </Button>
          </div>
        )
      })}
    </>
  )
}

export default ReturnInfo
