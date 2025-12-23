'use client';

import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { createCustomField } from '@/utils/customFieldApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';

const toastify = ({ props, message }) => {
  toast(message, {
    ...props,
    hideProgressBar: true,
    theme: 'colored',
    icon: false
  });
};

const EditForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldType, setFieldType] = useState('text');
  const [entityType, setEntityType] = useState('product');
  const [isRequired, setIsRequired] = useState('no');

  const messageSchema = yup.object({
    name: yup.string().required('Please enter Field Name'),
    label: yup.string().required('Please enter Display Label')
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(messageSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        label: data.label,
        type: fieldType,
        entityType: entityType,
        placeholder: data.placeholder || '',
        defaultValue: data.defaultValue || '',
        options: data.options ? data.options.split(',').map(opt => opt.trim()) : [],
        isRequired: isRequired === 'yes',
        isActive: true
      };

      const response = await createCustomField(payload);
      if (response.success) {
        toastify({
          message: 'Custom field başarıyla oluşturuldu',
          props: { type: 'success', position: 'top-right' }
        });
        router.push('/custom-field/custom-field-list');
      } else {
        toastify({
          message: response.message || 'Custom field oluşturulamadı',
          props: { type: 'error', position: 'top-right' }
        });
      }
    } catch (error) {
      console.error('Error creating custom field:', error);
      toastify({
        message: 'Custom field oluşturulurken hata oluştu',
        props: { type: 'error', position: 'top-right' }
      });
    } finally {
      setLoading(false);
    }
  };

  return <Row>
      <Col lg={12}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle as={'h4'}>Add Custom Field</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <TextFormInput control={control} type="text" name="name" label="Field Name" placeholder="Enter Field Name" />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <TextFormInput control={control} type="text" name="label" label="Display Label" placeholder="Enter Display Label" />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="fieldType" className="form-label">
                      {' '}
                      Field Type
                    </label>
                    <ChoicesFormInput 
                      className="form-control" 
                      id="fieldType" 
                      data-choices 
                      data-choices-groups 
                      data-placeholder="Select Field Type"
                      onChange={(val) => setFieldType(val)}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="select">Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="textarea">Textarea</option>
                    </ChoicesFormInput>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="entity" className="form-label">
                      {' '}
                      Entity
                    </label>
                    <ChoicesFormInput 
                      className="form-control" 
                      id="entity" 
                      data-choices 
                      data-choices-groups 
                      data-placeholder="Select Entity"
                      onChange={(val) => setEntityType(val)}
                    >
                      <option value="product">Product</option>
                      <option value="category">Category</option>
                      <option value="order">Order</option>
                      <option value="customer">Customer</option>
                      <option value="user">User</option>
                    </ChoicesFormInput>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="required" className="form-label">
                      {' '}
                      Required
                    </label>
                    <ChoicesFormInput 
                      className="form-control" 
                      id="required" 
                      data-choices 
                      data-choices-groups 
                      data-placeholder="Select Option"
                      onChange={(val) => setIsRequired(val)}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </ChoicesFormInput>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <TextFormInput control={control} type="text" name="placeholder" label="Placeholder Text" placeholder="Enter Placeholder Text" />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <TextFormInput control={control} type="text" name="defaultValue" label="Default Value" placeholder="Enter Default Value" />
                  </div>
                </Col>
                {(fieldType === 'select' || fieldType === 'checkbox') && (
                  <Col lg={6}>
                    <div>
                      <TextFormInput control={control} type="text" name="options" label="Options (comma separated)" placeholder="Option 1, Option 2, Option 3" />
                    </div>
                  </Col>
                )}
              </Row>
            </CardBody>
            <CardFooter className="border-top">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <><Spinner size="sm" className="me-2" />Saving...</> : 'Save Custom Field'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Col>
    </Row>;
};
export default EditForm;
