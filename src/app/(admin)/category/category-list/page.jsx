"use client"
import React from 'react';
import CategoryList from './components/CategoryList';
import { Col, Row } from 'react-bootstrap';

const CategoryListPage = () => {
  return <>
    <Row>
      <Col xl={12}>
        <CategoryList />
      </Col>
    </Row>
  </>;
};
export default CategoryListPage;