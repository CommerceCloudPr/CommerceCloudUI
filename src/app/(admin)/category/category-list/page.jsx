import React from 'react';
import Category from './components/Category';
import CategoryList from './components/CategoryList';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Category List'
};
const CategoryListPage = () => {
  return <>
      <PageTItle title="CATEGORIES LIST" />
      <Category />
      <CategoryList />
    </>;
};
export default CategoryListPage;