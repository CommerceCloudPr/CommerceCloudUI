"use client"
import React from 'react';
import Category from './components/Category';
import CategoryList from './components/CategoryList';
import PageTItle from '@/components/PageTItle';
import { Button, Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useRouter } from 'next/navigation';

const CategoryListPage = () => {

  const router = useRouter();

  return <>
    <PageTItle title="CATEGORIES LIST" />
    <div className="p-3 mb-3 rounded">
      <Row className="justify-content-end g-2">
        <Col lg={2}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/category/category-add')}
          >
            <IconifyIcon icon="bx:plus" className="me-1" />
            Add Category
          </Button>
        </Col>
      </Row>
    </div>
    <CategoryList />
  </>;
};
export default CategoryListPage;