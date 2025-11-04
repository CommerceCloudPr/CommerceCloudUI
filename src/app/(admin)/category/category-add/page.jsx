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
        <Col xl={12} lg={8}>
          <AddCategory />
        </Col>
    
    </>;
};
export default CategoryAddPage;