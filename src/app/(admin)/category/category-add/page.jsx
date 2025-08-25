import React from 'react';
import { Col, Row } from 'react-bootstrap';
import CategoryEditCard from './components/CategoryEditCard';
import FileUpload from '@/components/FileUpload';
import AddCategory from './components/AddCategory';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Category Add'
};
const CategoryAddPage = () => {
  return <>
      <PageTItle title="CREATE CATEGORY" />
      <Row>
        <CategoryEditCard />
        <Col xl={9} lg={8}>
          <FileUpload title="Add Thumbnail Photo" />
          <AddCategory />
        </Col>
      </Row>
    </>;
};
export default CategoryAddPage;