import React, { useEffect, useState } from 'react'
import clientApi from '../../api/client';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const PurchaseHistory = () => {
  const [projects, setProjects] = useState();
  const [returns, setReturns] = useState();
  const [purchasesData, setPurchasesData] = useState();


  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const headers = {
          'access-token': Cookies.get('_access_token'),
          'client': Cookies.get('_client'),
          'uid': Cookies.get('_uid'),
        };

        const response = await clientApi.get('/purchases', {
          headers: headers,
        });

        console.log('API Purchase レスポンス', response.data);
        setPurchasesData(response.data)
      } catch (error) {
        console.error('API レスポンスの取得に失敗しました', error);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <>
      <h2>購入履歴</h2>
      {purchasesData &&
      <>
        {console.log('purchasesData', purchasesData)}
        {purchasesData.map((purchase) => (
          <div key={purchase.id}>
            <p>購入ID:{purchase.id}</p>
            <p>購入日時:{purchase.createdAt}</p>
            <h2>{purchase.return.name}</h2>
            {purchase.return.returnImage &&
              <img src={purchase.return.returnImage.url} aria-colcount={`購入履歴 - ${purchase.return.name}`} style={{width: '250px'}} />
            }
            <p>{`リターン単価:${purchase.return.price}円`}</p>
            <p>{`数量:${purchase.quantity}個`}</p>
            <h3>{`合計 ${purchase.amount}円`}</h3>
            <p>プロジェクト名:{purchase.project.title}</p>
            {purchase.project.projectImages &&
              <img src={purchase.project.projectImages[0].url} aria-colcount={`購入履歴 - ${purchase.project.title}`} style={{width: '250px'}} />
            }
          </div>
        ))}
      </>
      }
    </>
  )
}

export default PurchaseHistory
