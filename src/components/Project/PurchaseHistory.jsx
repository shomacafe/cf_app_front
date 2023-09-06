import React, { useEffect, useState } from 'react'
import clientApi from '../../api/client';
import Cookies from 'js-cookie';
import { Typography, makeStyles } from '@material-ui/core';
import { parseISO, format } from 'date-fns';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  purchaseCard: {
    maxWidth: '800px',
    margin: '20px auto',
    border: '1px solid #ccc',
    borderRadius: '10px',
    position: 'relative',
  },
  purchaseMain: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #ccc',
    padding: '15px',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    }
  },
  returnInfo: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    }
  },
  projectInfo: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    border: '1px solid #ccc',
    padding: '5px',
    backgroundColor: '#f5f5f5',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    }
  },
  purchaseInfo: {
    display: 'flex',
    alignItems: 'flex',
    padding: '15px',
    borderRadius: '10px 10px 0 0',
    backgroundColor: '#f5f5f5',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    }
  },
  purchaseInfoItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 20px',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '10px',
    }
  },
  projectLink: {
    '&:hover': {
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    },
  }
}))

const PurchaseHistory = () => {
  const [purchasesData, setPurchasesData] = useState();
  const classes = useStyles();


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
    {console.log('purchasesData', purchasesData)}
      <h2>購入履歴</h2>
        {purchasesData &&
        <>
          {purchasesData.map((purchase) => (
            <div key={purchase.id} className={classes.purchaseCard}>
              <div className={classes.purchaseInfo}>
                <div className={classes.purchaseInfoItem}>
                  <span>購入日時</span>
                  <span>{format(parseISO(purchase.createdAt), 'yyyy/MM/dd/ HH:mm')}</span>
                </div>
                <div className={classes.purchaseInfoItem}>
                  <span>リターン単価</span>
                  <span>{`${purchase.return.price}円`}</span>
                </div>
                <div className={classes.purchaseInfoItem}>
                  <span>個数</span>
                  <span>{`${purchase.quantity}個`}</span>
                </div>
                <div className={classes.purchaseInfoItem}>
                  <span>合計</span>
                  <span>{`${purchase.amount}円`}</span>
                </div>
              </div>
              <div className={classes.purchaseMain}>
                <div className={classes.returnInfo}>
                  {purchase.return.returnImage &&
                    <img src={purchase.return.returnImage.url} aria-colcount={`購入履歴 - ${purchase.return.name}`} style={{width: '250px'}} />
                  }
                  <h2 style={{ margin: '20px' }}>{purchase.return.name}</h2>
                </div>
                <Link to={`/projects/${purchase.project.id}`} className={classes.projectLink}>
                  <div className={classes.projectInfo}>
                    <span>{purchase.project.title}</span>
                    {purchase.project.projectImages &&
                      <img src={purchase.project.projectImages[0].url} aria-colcount={`購入履歴 - ${purchase.project.title}`} style={{width: '200px'}} />
                    }
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </>
        }
    </>
  )
}

export default PurchaseHistory
