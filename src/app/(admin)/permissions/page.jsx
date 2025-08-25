'use client'
import React, { useEffect, useState } from 'react';
import PageTItle from '@/components/PageTItle';
import Table from '@/components/table';

const PermissionsPage = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const session = localStorage.getItem('session_token');

  const columns = [
    {
      label: 'Id',
      value: 'uuid'
    },
    {
      label: 'Action',
      value: 'action'
    },
    {
      label: 'Module Id',
      value: 'moduleUUID'
    },
    {
      label: 'Create Date',
      value: 'createdAt'
    },
    {
      label: 'Update Date',
      value: 'updatedAt'
    }
  ]

  useEffect(() => {
    fetch('http://api-dev.aykutcandan.com/user/permission/get-all',
      {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${decodeURIComponent(session)}`
        }
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(true);
      })
      .catch((err) => console.log(err))
  },[])



  return <>
    <PageTItle title="PERMISSIONS" />
    {
      loading === true && <Table data={data} columns={columns} ></Table>
    }
    {/* <PermissionsCard />
    <PermissionsList /> */}
  </>;
};
export default PermissionsPage;