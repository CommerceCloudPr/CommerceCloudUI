"use client"
import React from 'react';
import BrandList from './components/BrandList';
import { Col, Row } from 'react-bootstrap';

const BrandListPage = () => {
  return <>
    <Row>
      <Col xl={12}>
        <BrandList />
      </Col>
    </Row>
  </>;
};
export default BrandListPage;