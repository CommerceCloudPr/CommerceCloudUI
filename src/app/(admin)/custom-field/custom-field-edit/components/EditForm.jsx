'use client';

import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { fetchCustomFieldDetail, updateCustomField } from '@/utils/customFieldApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const searchParams = useSearchParams();
  const uuid = searchParams.get('id');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fieldType, setFieldType] = useState('text');
  const [entityType, setEntityType] = useState('product');
  const [isRequired, setIsRequired] = useState('no');
  const [isActive, setIsActive] = useState(true);
  const [code, setCode] = useState('');

  const messageSchema = yup.object({
    name: yup.string().required('Please enter Field Name'),
    label: yup.string().required('Please enter Display Label')
  });

  const { handleSubmit, control, reset, setValue } = useForm({
    resolver: yupResolver(messageSchema)
  });

  useEffect(() => {
    const loadCustomField = async () => {
      // UUID yoksa listeye yönlendir
      if (!uuid) {
        toastify({
          message: 'Düzenlenecek custom field seçilmedi. Lütfen listeden bir kayıt seçin.',
          props: { type: 'warning', position: 'top-right' }
        });
        router.push('/custom-field/custom-field-list');
        return;
      }

      try {
        const response = await fetchCustomFieldDetail(uuid);
        if (response.success && response.customField) {
          const cf = response.customField;
          setValue('name', cf.name || '');
          setValue('label', cf.label || cf.name || '');
          setCode(cf.code || cf.name || '');
          setValue('placeholder', cf.placeholder || '');
          setValue('defaultValue', cf.defaultValue || '');
          setValue('options', Array.isArray(cf.options) && cf.options.length > 0 ? cf.options.join(', ') : '');
          setFieldType(cf.type || 'text');
          setEntityType(cf.entityType || 'product');
          setIsRequired(cf.isRequired ? 'yes' : 'no');
          setIsActive(cf.isActive !== undefined ? cf.isActive : true);
        } else {
          toastify({
            message: 'Custom field bulunamadı',
            props: { type: 'error', position: 'top-right' }
          });
          router.push('/custom-field/custom-field-list');
        }
      } catch (error) {
        console.error('Error loading custom field:', error);
        toastify({
          message: 'Custom field yüklenirken hata oluştu',
          props: { type: 'error', position: 'top-right' }
        });
        router.push('/custom-field/custom-field-list');
      } finally {
        setFetching(false);
      }
    };

    loadCustomField();
  }, [uuid, setValue, router]);

  const onSubmit = async (data) => {
    if (!uuid) {
      toastify({
        message: 'Custom field ID bulunamadı',
        props: { type: 'error', position: 'top-right' }
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: data.name,
        code: code || data.name, // code field'ını da gönder
        label: data.label,
        type: fieldType,
        entityType: entityType,
        placeholder: data.placeholder || '',
        defaultValue: data.defaultValue || '',
        options: data.options ? data.options.split(',').map(opt => opt.trim()) : [],
        isRequired: isRequired === 'yes',
        isActive: isActive
      };

      const response = await updateCustomField(uuid, payload);
      if (response.success) {
        toastify({
          message: 'Custom field başarıyla güncellendi',
          props: { type: 'success', position: 'top-right' }
        });
        router.push('/custom-field/custom-field-list');
      } else {
        toastify({
          message: response.message || 'Custom field güncellenemedi',
          props: { type: 'error', position: 'top-right' }
        });
      }
    } catch (error) {
      console.error('Error updating custom field:', error);
      toastify({
        message: 'Custom field güncellenirken hata oluştu',
        props: { type: 'error', position: 'top-right' }
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Row>
      <Col lg={12}>
        <Card>
          <CardBody className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 mb-0">Yükleniyor...</p>
          </CardBody>
        </Card>
      </Col>
    </Row>;
  }

  return <Row>
      <Col lg={12}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle as={'h4'}>Edit Custom Field</CardTitle>
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
                    <label htmlFor="code" className="form-label">
                      Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      className="form-control"
                      placeholder="Enter Code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
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
                      defaultValue={fieldType}
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
                      defaultValue={entityType}
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
                      defaultValue={isRequired}
                      onChange={(val) => setIsRequired(val)}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </ChoicesFormInput>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      {' '}
                      Status
                    </label>
                    <ChoicesFormInput 
                      className="form-control" 
                      id="status" 
                      data-choices 
                      data-choices-groups 
                      data-placeholder="Select Status"
                      defaultValue={isActive ? 'active' : 'inactive'}
                      onChange={(val) => setIsActive(val === 'active')}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
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
                  <Col lg={12}>
                    <div>
                      <TextFormInput control={control} type="text" name="options" label="Options (comma separated)" placeholder="Option 1, Option 2, Option 3" />
                    </div>
                  </Col>
                )}
              </Row>
            </CardBody>
            <CardFooter className="border-top">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <><Spinner size="sm" className="me-2" />Saving...</> : 'Update Custom Field'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Col>
    </Row>;
};
export default EditForm;
