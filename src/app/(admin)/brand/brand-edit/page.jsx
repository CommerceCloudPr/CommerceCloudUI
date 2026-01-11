'use client';

import { useState, useEffect } from 'react';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, FormCheck, Row, Spinner } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';
import { fetchBrandDetail, updateBrand } from '@/utils/brandApi';
import PageTItle from '@/components/PageTItle';

const toastify = ({ props, message }) =>
  toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });

const BrandEdit = () => {
  const router = useRouter();
  const params = useSearchParams();
  const brandId = params.get('uuid');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const brandSchema = yup.object({
    brandName: yup.string().required('Brand adı gereklidir'),
    brandCode: yup.string().nullable(),
    brandDescription: yup.string().nullable(),
    brandLogoUrl: yup.string().nullable(),
    isActive: yup.boolean(),
  });

  const {
    reset,
    handleSubmit,
    control
  } = useForm({
    resolver: yupResolver(brandSchema),
    defaultValues: {
      brandName: '',
      brandCode: '',
      brandDescription: '',
      brandLogoUrl: '',
      isActive: true,
    }
  });

  useEffect(() => {
    const loadBrand = async () => {
      if (!brandId) {
        toastify({
          message: 'Brand ID bulunamadı',
          props: { type: 'error' }
        });
        router.push('/brand/brand-list');
        return;
      }

      try {
        const response = await fetchBrandDetail(brandId);
        if (response.success && response.brand) {
          reset({
            brandName: response.brand.brandName || '',
            brandCode: response.brand.brandCode || '',
            brandDescription: response.brand.brandDescription || '',
            brandLogoUrl: response.brand.brandLogoUrl || '',
            isActive: response.brand.isActive !== false,
          });
        } else {
          toastify({
            message: 'Brand bulunamadı',
            props: { type: 'error' }
          });
          router.push('/brand/brand-list');
        }
      } catch (error) {
        console.error('Error loading brand:', error);
        toastify({
          message: error.message || 'Brand yüklenirken hata oluştu',
          props: { type: 'error' }
        });
        router.push('/brand/brand-list');
      } finally {
        setInitialLoading(false);
      }
    };

    loadBrand();
  }, [brandId, reset, router]);

  const handleUpdateBrand = async (data) => {
    if (!brandId) {
      toastify({
        message: 'Brand ID bulunamadı',
        props: { type: 'error' }
      });
      return;
    }

    setLoading(true);
    try {
      const response = await updateBrand(brandId, data);

      if (response.success) {
        toastify({
          message: response.message || 'Brand başarıyla güncellendi',
          props: { type: 'success' }
        });
        router.push('/brand/brand-list');
      } else {
        toastify({
          message: response.message || 'Brand güncellenirken hata oluştu',
          props: { type: 'error' }
        });
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      toastify({
        message: error.message || 'Brand güncellenirken bir hata oluştu',
        props: { type: 'error' }
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <PageTItle title="BRAND EDIT" />
      <form onSubmit={handleSubmit(handleUpdateBrand)}>
        <Card>
          <CardHeader>
            <CardTitle as="h4">Edit Brand</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <TextFormInput 
                    control={control} 
                    type="text" 
                    name="brandName" 
                    label="Brand Name" 
                    placeholder="Enter Brand Name" 
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <TextFormInput 
                    control={control} 
                    type="text" 
                    name="brandCode" 
                    label="Brand Code" 
                    placeholder="Enter Brand Code (Optional)" 
                  />
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <TextAreaFormInput 
                    control={control} 
                    name="brandDescription" 
                    label="Brand Description" 
                    placeholder="Enter Brand Description (Optional)"
                    rows={4}
                  />
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <TextFormInput 
                    control={control} 
                    type="text" 
                    name="brandLogoUrl" 
                    label="Brand Logo URL" 
                    placeholder="Enter Brand Logo URL (Optional)" 
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <label htmlFor="isActive" className="form-label">
                    Active
                  </label>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <FormCheck
                        type="switch"
                        id="isActive"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                </div>
              </Col>
            </Row>
          </CardBody>
          <div className="p-3 bg-light mb-3 rounded">
            <Row className="justify-content-end g-2">
              <Col lg={2}>
                <Button 
                  type="button"
                  variant="secondary" 
                  className="w-100"
                  onClick={() => router.push('/brand/brand-list')}
                >
                  İptal
                </Button>
              </Col>
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
                      Güncelleniyor...
                    </>
                  ) : (
                    'Güncelle'
                  )}
                </Button>
              </Col>
            </Row>
          </div>
        </Card>
      </form>
    </>
  );
};

export default BrandEdit;
