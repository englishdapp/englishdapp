import React, {useState, useEffect} from 'react';
import { Button, message, Layout, Row, Col , Input, Card, Select } from 'antd'
import SDK from 'apis/SDK';
import IconexConnect from 'apis/IconexConnect';
import CONST from './constants';
import ac1 from 'assets/images/ac-1.png'
import ac2 from 'assets/images/ac-2.png'
import ac3 from 'assets/images/ac-3.png'
import ac4 from 'assets/images/ac-4.png'
import ac5 from 'assets/images/ac-5.png'
import ac6 from 'assets/images/ac-6.jpg'
import './App.css';

import {
  IconConverter
} from 'icon-sdk-js'

const { Header , Content } = Layout;
const { Meta } = Card;
const { Option } = Select;

function App() {
  const [ mode, setMode ] = useState( CONST.MODE['LOG_OUT'])
  const [ myAddress, setMyAddress ] = useState('')
  const [ price1, setPrice1 ] = useState(0)
  const [ price2, setPrice2 ] = useState(0)
  const [ price3, setPrice3 ] = useState(0)
  const [ price4, setPrice4 ] = useState(0)
  const [ price5, setPrice5 ] = useState(0)
  const [ price6, setPrice6 ] = useState(0)
  const [ priceToUpdate, setPriceToUpdate ] = useState(0)
  const [ selectedAcademy, setSelectedAcademy] = useState(1)

  useEffect(()=> {
    callGoodPice(1, setPrice1)
    callGoodPice(2, setPrice2)
    callGoodPice(3, setPrice3)
    callGoodPice(4, setPrice4)
    callGoodPice(5, setPrice5)
    callGoodPice(6, setPrice6)
  },[])

  async function callGoodPice(id, objSetPrice){
    const price = await SDK.iconService.call(
      SDK.callBuild({
        methodName: 'get_good_price',
        params: {
          id: IconConverter.toHex(Number(id))
        },
        to: window.CONTRACT_ADDRESS,
      })
    ).execute()
    objSetPrice(Number(price))
  }

  async function getAddress()  { 
    const { iconService, callBuild } = SDK
    const myAddress = await IconexConnect.getAddress()
    setMyAddress(myAddress)
    setMode(CONST.MODE['LOG_IN'])
  }

  async function updatePrice() {
    console.log(selectedAcademy, priceToUpdate)
    if(myAddress == ''){
      alert("지갑을 연동하세요.")
      return
    }

    const txObj = SDK.sendTxBuild({
      from: myAddress,
      to: window.CONTRACT_ADDRESS,
      methodName: 'renew_good_price',
      params: {
        id: IconConverter.toHex(Number(selectedAcademy)), 
        price: IconConverter.toHex(Number(priceToUpdate))
      },
    })

    const tx = await IconexConnect.sendTransaction(txObj)
    console.log(tx)
    if (tx == null){
      alert("트랜잭션 실패입니다.")
    }else{
      if(selectedAcademy === 1 && price1 == 0 || price1 > Number(priceToUpdate) ) {
        setPrice1(Number(priceToUpdate))
      }
      if(selectedAcademy === 2 && price1 == 0 || price2 > Number(priceToUpdate)) {
        setPrice2(Number(priceToUpdate))
      }
      if(selectedAcademy === 3 && price1 == 0 || price3 > Number(priceToUpdate)) {
        setPrice3(Number(priceToUpdate))
      }
      if(selectedAcademy === 4 && price1 == 0 || price4 > Number(priceToUpdate)) {
        setPrice4(Number(priceToUpdate))
      }
      if(selectedAcademy === 5 && price1 == 0 || price5 > Number(priceToUpdate)) {
        setPrice5(Number(priceToUpdate))
      }
      if(selectedAcademy === 6 && price1 == 0 || price6 > Number(priceToUpdate)) {
        setPrice6(Number(priceToUpdate))
      }
    }
  }
  return (
    <Layout>
      <Header>
        <Button size="large" onClick={getAddress} type="primary">Access to My Wallet</Button>
      </Header>
      <Content>
        <Row type="flex" justify="center" align="middle" className={`page-wrap`}>
          <Col>
            <h1>How much is the English Class?</h1>
            <Row gutter={30} style={{marginBottom: 15}}>
              <Col span={8} >
                <Card  cover={<div className="card-img" style={{backgroundImage: `url(${ac1})`}} />}>
                  <Meta title="Sydney English Academy" description={price1.toString()} />
                </Card>
              </Col>
              <Col span={8}>
                <Card  cover={<div className="card-img" style={{backgroundImage: `url(${ac2})`}} />}>
                  <Meta title="Oxford English Academy" description={price2.toString()} />
                </Card>
              </Col>
              <Col span={8}>
                <Card cover={<div className="card-img" style={{backgroundImage: `url(${ac3})`}} />}>
                  <Meta title="Santa Monica English Academy" description={price3.toString()} />
                </Card>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={8}>
                <Card cover={<div className="card-img" style={{backgroundImage: `url(${ac4})`}} />}>    
                  <Meta title="English Academy of Cape Town" description={price4.toString()} />
                </Card>
              </Col>
              <Col span={8}>
                <Card cover={<div className="card-img" style={{backgroundImage: `url(${ac5})`}} />}>
                  <Meta title="NY English Academy" description={price5.toString()} />
                </Card>
              </Col>
              <Col span={8}>
                <Card cover={<div className="card-img" style={{backgroundImage: `url(${ac6})`}} />}>    
                  <Meta title="Lott English Academy" description={price6.toString()} />
                </Card>
              </Col>
            </Row>
            <div className="instruction-text">
              Choose a academy to update the price.
            </div>
            <div className="form-wrap">
              <Select size="large" style={{width: 250}} value={selectedAcademy} onChange={(value)=>setSelectedAcademy(value)}>
                <Option value={1}>Sydney English Academy</Option>
                <Option value={2}>Oxford English Academy</Option>
                <Option value={3}>Santa Monica English Academy</Option>
                <Option value={4}>English Academy of Cape Town</Option>
                <Option value={5}>NY English Academy</Option>
                <Option value={6}>Lott English Academy</Option>
              </Select>
              <Input 
                size="large"
                style={{width: 150}}
                value={priceToUpdate} 
                onChange={(e)=>{setPriceToUpdate(e.target.value)}}
              />
              <Button type="primary" size="large" onClick={updatePrice}>Confirm</Button>
            </div>
          </Col>
        </Row>
    </Content>
    </Layout>
  );
}

export default App;
