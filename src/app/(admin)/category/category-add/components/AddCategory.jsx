'use client';

import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormSelect, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { categoryData } from '../../category-list/data';

const AddCategory = () => {

  const session = localStorage.getItem('session_token');
  const [category, setCategory] = useState({
    name: null,
    description: null,
    parentUUID: null
  })

  const [categoryList, setCategoryList] = useState([]);

  const messageSchema = yup.object({
    title: yup.string().required('Please enter title'),
    stock: yup.string().required('Please enter stock'),
    tag: yup.string().required('Please enter tag'),
    description: yup.string().required('Please enter description'),
    description2: yup.string().required('Please enter description'),
    meta: yup.string().required('Please enter meta title'),
    metaTag: yup.string().required('Please enter meta tag')
  });
  const {
    reset,
    handleSubmit,
    control
  } = useForm({
    resolver: yupResolver(messageSchema)
  });

  const handleSaveCategory = () => {
    const myObj = {
      name: category.name,
      description: category.description
    };
    if (category.parentUUID !== null) {
      Object.assign(myObj, { parentUUID: category.parentUUID })
    }

    fetch('https://api-dev.aykutcandan.com/product/category/add',
      {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${decodeURIComponent(session)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(myObj)

      })
  }

  useEffect(() => {
    fetch('https://api-dev.aykutcandan.com/product/category/get-all',
      {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${decodeURIComponent(session)}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => setCategoryList(res.data.content))
      .catch((err) => console.log(err))
  }, [])

  return <form onSubmit={handleSubmit(() => {
    handleSaveCategory()
  })}>
    <Card>
      <CardHeader>
        <div className="mb-3 rounded">
          <Row className="justify-content-end g-2">
            <Col lg={2}>
              <Button variant="primary" type="submit" className=" w-100" onClick={handleSaveCategory}>
                Save
              </Button>
            </Col>
          </Row>
        </div>
      </CardHeader>
      <CardBody>
        <Row>
          <Col lg={6}>
            <form>
              <div className="mb-3">
                <label htmlFor="category-name" className="form-label">
                  Category Name
                </label>
                <input type="text" id="category-name" className="form-control" placeholder="Enter Name" defaultValue={category.name} onChange={(e) => {
                  setCategory({ ...category, name: e.target.value })
                }} />
              </div>
            </form>

          </Col>
          <Col lg={6}>
            <form>
              <div className="mb-3">
                <label htmlFor="category-description" className="form-label">
                  Category Description
                </label>
                <input type="text" id="category-description" className="form-control" placeholder="Enter Description" defaultValue={category.description} onChange={(e) => {
                  setCategory({ ...category, description: e.target.value })
                }} />
              </div>
            </form>
          </Col>
          <Col lg={6}>
            <label htmlFor="crater" className="form-label">
              Parent Category
            </label>
            <form >
              <FormSelect onChange={(e) => setCategory({ ...category, parentUUID: e.target.value })}>
                {
                  categoryList?.map((item, key) => {
                    return <option value={item?.uuid} key={key}>{item?.name}</option>
                  })
                }
              </FormSelect>
            </form>
          </Col>
        </Row>
      </CardBody>
    </Card>


  </form>;
};
export default AddCategory;