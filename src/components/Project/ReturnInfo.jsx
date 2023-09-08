import React, { useContext, useState } from 'react'
import { Link} from 'react-router-dom';
import { ReturnInfoContext } from './ReturnInfoContext';
import { Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

const ReturnInfo = ({ project_id, isPurchaseDisabled }) => {
  const {returnData} = useContext(ReturnInfoContext);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setSelectedQuantity(e.target.value);
  }

  return (
    <div>
      <h2>リターン</h2>
      {returnData.map((returnItem, index) => {
        return(
          <div key={index} style={{backgroundColor: '#f7f7f7', padding: '20px', margin: '10px 0'}}>
            <img src={returnItem.return_image.url} alt={`${returnItem.name} - 画像${index + 1}`} style={{width: '100%'}} />
            <Typography variant='h6'>{returnItem.name}</Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
              <Typography variant='h6'>{returnItem.price.toLocaleString()}円</Typography>
              <Typography variant='h6'>{returnItem.stock_count === 0 ? '売り切れました' : `残り${returnItem.stock_count}個`}</Typography>
            </div>
            <p>{returnItem.description}</p>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <FormControl style={{ margin: '10px' }}>
                <InputLabel>数量</InputLabel>
                <Select value={selectedQuantity} onChange={handleQuantityChange}>
                  {Array.from({ length: 10 }, (_, index) => index + 1).map(quantity => (
                    <MenuItem key={quantity} value={quantity}>{quantity}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant='contained'
                color='primary'
                component={Link}
                to={`/purchase/confirm?return_id=${returnItem.id}&project_id=${project_id}&quantity=${selectedQuantity}`}
                disabled={returnItem.stock_count === 0 || isPurchaseDisabled}
              >
                このリターンを応援購入する
              </Button>
            </div>
            <Typography style={{display: 'flex', justifyContent: 'right'}}>支援者：{returnItem.supporter_count}人</Typography>
          </div>
        )
      })}
    </div>
  )
}

export default ReturnInfo
