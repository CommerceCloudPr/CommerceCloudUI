'use client';

import { useState, useEffect } from 'react';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row, Spinner } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';
import { fetchAttributeDetail, updateAttribute } from '@/utils/attributeApi';

const toastify = ({ props, message }) =>
  toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });

const EditForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const attributeId = params.get('id');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const attributeSchema = yup.object({
    attributeName: yup.string().required('Attribute adı gereklidir'),
    attributeType: yup.string().required('Attribute tipi gereklidir'),
  });

  const {
    reset,
    handleSubmit,
    control
  } = useForm({
    resolver: yupResolver(attributeSchema),
    defaultValues: {
      attributeName: '',
      attributeType: 'TEXT',
    }
  });

  useEffect(() => {
    const loadAttribute = async () => {
      if (!attributeId) {
        setInitialLoading(false);
        return;
      }

      try {
        const response = await fetchAttributeDetail(attributeId);
        if (response.success && response.attribute) {
          reset({
            attributeName: response.attribute.name || '',
            attributeType: response.attribute.type || 'TEXT',
          });
        }
      } catch (error) {
        console.error('Error loading attribute:', error);
        toastify({
          message: error.message || 'Attribute yüklenirken hata oluştu',
          props: { type: 'error' }
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadAttribute();
  }, [attributeId, reset]);

  const handleSaveAttribute = async (data) => {
    if (!attributeId) {
      toastify({
        message: 'Attribute ID bulunamadı',
        props: { type: 'error' }
      });
      return;
    }

    setLoading(true);
    try {
      const response = await updateAttribute(attributeId, data);

      if (response.success) {
        toastify({
          message: response.message || 'Attribute başarıyla güncellendi',
          props: { type: 'success' }
        });
        router.push('/attributes/attributes-list');
      } else {
        toastify({
          message: response.message || 'Attribute güncellenirken hata oluştu',
          props: { type: 'error' }
        });
      }
    } catch (error) {
      console.error('Error updating attribute:', error);
      toastify({
        message: error.message || 'Attribute güncellenirken bir hata oluştu',
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
    <Row>
      <Col lg={12}>
        <form onSubmit={handleSubmit(handleSaveAttribute)}>
          <Card>
            <CardHeader>
              <CardTitle as={'h4'}>Edit Attribute</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <TextFormInput 
                      control={control} 
                      type="text" 
                      name="attributeName" 
                      label="Attribute Name" 
                      placeholder="Enter Attribute Name" 
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="attributeType" className="form-label">
                      Attribute Type
                    </label>
                    <Controller
                      name="attributeType"
                      control={control}
                      render={({ field }) => (
                        <ChoicesFormInput 
                          className="form-control" 
                          id="attributeType" 
                          data-choices 
                          data-choices-groups 
                          data-placeholder="Select Attribute Type"
                          {...field}
                        >
                          <option value="TEXT">TEXT</option>
                          <option value="NUMBER">NUMBER</option>
                          <option value="BOOLEAN">BOOLEAN</option>
                          <option value="DATE">DATE</option>
                        </ChoicesFormInput>
                      )}
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="border-top">
              <div className="d-flex justify-content-end gap-2">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => router.push('/attributes/attributes-list')}
                >
                  İptal
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Güncelleniyor...
                    </>
                  ) : (
                    'Güncelle'
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Col>
    </Row>
  );
};

export default EditForm;