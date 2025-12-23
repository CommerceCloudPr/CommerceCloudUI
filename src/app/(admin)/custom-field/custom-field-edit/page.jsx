import React from 'react';
import EditForm from './components/EditForm';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Custom Field Edit'
};
const page = () => {
  return <>
      <PageTItle title="CUSTOM FIELD EDIT" />
      <EditForm />
    </>;
};
export default page;
