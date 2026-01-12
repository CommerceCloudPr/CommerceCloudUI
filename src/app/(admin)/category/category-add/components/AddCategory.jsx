'use client';

import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormSelect, Row, Spinner } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCategories, createCategory } from '@/utils/categoryApi';

const toastify = ({ props, message }) =>
  toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });

const AddCategory = () => {
  const router = useRouter();
  const session = localStorage.getItem('session_token');
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const categorySchema = yup.object({
    name: yup.string().required('Kategori adı gereklidir'),
    description: yup.string().nullable(),
    parentUUID: yup.string().nullable()
  });

  const {
    reset,
    handleSubmit,
    control
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      parentUUID: ''
    }
  });

  const handleSaveCategory = async (data) => {
    setLoading(true);
    try {
      const response = await createCategory(data);

      if (response.success) {
        toastify({
          message: response.message || 'Kategori başarıyla oluşturuldu',
          props: { type: 'success' }
        });
        reset();
        router.push('/category/category-list');
      } else {
        toastify({
          message: response.message || 'Kategori oluşturulurken hata oluştu',
          props: { type: 'error' }
        });
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toastify({
        message: error.message || 'Kategori oluşturulurken bir hata oluştu',
        props: { type: 'error' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories({
          page: 0,
          size: 100
        });
        if (response.success && response.items) {
          setCategoryList(response.items);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, [])

  return (
    <form onSubmit={handleSubmit(handleSaveCategory)}>
      <Card>
        <CardHeader>
          <CardTitle as="h4">Kategori Ekle</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput 
                  control={control} 
                  type="text" 
                  name="name" 
                  label="Kategori Adı" 
                  placeholder="Kategori adını giriniz" 
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="parentCategory" className="form-label">
                  Üst Kategori (Opsiyonel)
                </label>
                <Controller
                  name="parentUUID"
                  control={control}
                  render={({ field }) => (
                    <FormSelect 
                      id="parentCategory"
                      {...field}
                    >
                      <option value="">Üst kategori seçiniz</option>
                      {categoryList.map((item) => (
                        <option key={item.uuid} value={item.uuid}>
                          {item.name}
                        </option>
                      ))}
                    </FormSelect>
                  )}
                />
              </div>
            </Col>
            <Col lg={12}>
              <div className="mb-3">
                <TextAreaFormInput 
                  control={control} 
                  name="description" 
                  label="Kategori Açıklaması (Opsiyonel)" 
                  placeholder="Kategori açıklamasını giriniz"
                  rows={4}
                />
              </div>
            </Col>
          </Row>
        </CardBody>
        <div className="p-3 bg-light mb-3 rounded">
          <Row className="justify-content-end g-2">
            <Col lg={2}>
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Kaydediliyor...
                  </>
                ) : (
                  'Kaydet'
                )}
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
    </form>
  );
};
export default AddCategory;