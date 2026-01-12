'use client';

import { useState } from 'react';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row, Spinner } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';
import { createAttribute } from '@/utils/attributeApi';

const toastify = ({ props, message }) =>
  toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });

const EditForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const handleSaveAttribute = async (data) => {
    setLoading(true);
    try {
      const response = await createAttribute(data);

      if (response.success) {
        toastify({
          message: response.message || 'Attribute başarıyla oluşturuldu',
          props: { type: 'success' }
        });
        reset();
        router.push('/attributes/attributes-list');
      } else {
        toastify({
          message: response.message || 'Attribute oluşturulurken hata oluştu',
          props: { type: 'error' }
        });
      }
    } catch (error) {
      console.error('Error creating attribute:', error);
      toastify({
        message: error.message || 'Attribute oluşturulurken bir hata oluştu',
        props: { type: 'error' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col lg={12}>
        <form onSubmit={handleSubmit(handleSaveAttribute)}>
          <Card>
            <CardHeader>
              <CardTitle as={'h4'}>Add Attribute</CardTitle>
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
                      Kaydediliyor...
                    </>
                  ) : (
                    'Kaydet'
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