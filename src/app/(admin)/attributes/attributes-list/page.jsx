"use client"
import React from 'react';
import AttributesList from './components/AttributesList';
import { Col, Row } from 'react-bootstrap';

const AttributesListPage = () => {
  return <>
    <Row>
      <Col xl={12}>
        <AttributesList />
      </Col>
    </Row>
  </>;
};
export default AttributesListPage;