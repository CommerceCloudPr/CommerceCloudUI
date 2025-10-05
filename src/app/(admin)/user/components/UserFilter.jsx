'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { 
  Offcanvas, 
  OffcanvasHeader, 
  OffcanvasBody, 
  OffcanvasTitle, 
  Button, 
  Row, 
  Col, 
  Form,
  Card,
  CardBody,
  CardTitle,
  FormControl,
  FormLabel,
  FormSelect,
  InputGroup
} from 'react-bootstrap';
import TextFormInput from '@/components/form/TextFormInput';
import SelectFormInput from '@/components/form/SelectFormInput';
import CustomFlatpickr from '@/components/CustomFlatpickr';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import useToggle from '@/hooks/useToggle';

const UserFilter = ({ show, onHide, onFilter }) => {
  const router = useRouter();
  const { control, handleSubmit, reset, watch, register } = useForm();
  const [birthDate, setBirthDate] = useState('');
  const [lastLoginDate, setLastLoginDate] = useState('');

  const enabledOptions = [
    { label: 'Seçiniz', value: '' },
    { label: 'Aktif', value: 'true' },
    { label: 'Pasif', value: 'false' }
  ];

  const permissionOptions = [
    { label: 'Seçiniz', value: '' },
    { label: 'Evet', value: 'true' },
    { label: 'Hayır', value: 'false' }
  ];

  const agreementOptions = [
    { label: 'Seçiniz', value: '' },
    { label: 'Kabul Edildi', value: 'true' },
    { label: 'Kabul Edilmedi', value: 'false' }
  ];

  const onSubmit = (data) => {
    const filterData = {};
    
    if (data.firstName && data.firstName.trim()) filterData.firstName = data.firstName.trim();
    if (data.lastName && data.lastName.trim()) filterData.lastName = data.lastName.trim();
    if (data.username && data.username.trim()) filterData.username = data.username.trim();
    if (data.email && data.email.trim()) filterData.email = data.email.trim();
    if (data.enabled !== '' && data.enabled !== undefined) filterData.enabled = data.enabled === 'true';
    if (data.smsPermission !== '' && data.smsPermission !== undefined) filterData.smsPermission = data.smsPermission === 'true';
    if (data.emailPermission !== '' && data.emailPermission !== undefined) filterData.emailPermission = data.emailPermission === 'true';
    if (data.agreementAccepted !== '' && data.agreementAccepted !== undefined) filterData.agreementAccepted = data.agreementAccepted === 'true';
    
    // User detail fields
    if (data.phoneNumber) filterData.userDetailEntity_phoneNumber = data.phoneNumber;
    if (birthDate) filterData.userDetailEntity_birthDate = birthDate;
    if (lastLoginDate) filterData.lastLoginAt = new Date(lastLoginDate).getTime();
    
    // Call the filter callback
    if (onFilter) {
      onFilter(filterData);
    }
    
    onHide();
  };

  const handleReset = () => {
    reset();
    setBirthDate('');
    setLastLoginDate('');
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" className="border-0" style={{ width: '650px' }}>
      <OffcanvasHeader closeButton className="d-flex align-items-center bg-primary p-3">
        <OffcanvasTitle as="h5" className="text-white m-0">
          <IconifyIcon icon="bx:filter-alt" className="me-2" />
          Üye Filtreleme
        </OffcanvasTitle>
      </OffcanvasHeader>
      
      <OffcanvasBody className="p-0">
        <div className="p-3">
          <ComponentContainerCard 
            title="Filtre Kriterleri" 
            description="Aşağıdaki kriterleri kullanarak üye listesini filtreleyebilirsiniz."
          >
            <Form id="user-filter-form" onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md={6} className="mb-3">
                  <FormLabel>İsim</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="İsim giriniz"
                    {...register('firstName')}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormLabel>Soyisim</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Soyisim giriniz"
                    {...register('lastName')}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Kullanıcı adı giriniz"
                    {...register('username')}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormLabel>E-posta</FormLabel>
                  <FormControl
                    type="email"
                    placeholder="E-posta giriniz"
                    {...register('email')}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormLabel>Durum</FormLabel>
                  <FormSelect {...register('enabled')}>
                    <option value="">Seçiniz</option>
                    {enabledOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                <Col md={6} className="mb-3">
                  <FormLabel>SMS İzni</FormLabel>
                  <FormSelect {...register('smsPermission')}>
                    <option value="">Seçiniz</option>
                    {permissionOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                <Col md={6} className="mb-3">
                  <FormLabel>E-posta İzni</FormLabel>
                  <FormSelect {...register('emailPermission')}>
                    <option value="">Seçiniz</option>
                    {permissionOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                <Col md={6} className="mb-3">
                  <FormLabel>Sözleşme Onayı</FormLabel>
                  <FormSelect {...register('agreementAccepted')}>
                    <option value="">Seçiniz</option>
                    {agreementOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                <Col md={6} className="mb-3">
                  <FormLabel>Telefon Numarası</FormLabel>
                  <FormControl
                    type="tel"
                    placeholder="Telefon numarası giriniz"
                    {...register('phoneNumber')}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormLabel>Doğum Tarihi</FormLabel>
                  <CustomFlatpickr
                    className="form-control"
                    value={birthDate}
                    onChange={(date) => setBirthDate(date)}
                    options={{
                      dateFormat: 'Y-m-d',
                      locale: 'tr'
                    }}
                    placeholder="Doğum tarihi seçiniz"
                  />
                </Col>

                {/* Last Login Date */}
                <Col md={6} className="mb-3">
                  <FormLabel>Son Giriş Tarihi</FormLabel>
                  <CustomFlatpickr
                    className="form-control"
                    value={lastLoginDate}
                    onChange={(date) => setLastLoginDate(date)}
                    options={{
                      dateFormat: 'Y-m-d',
                      locale: 'tr'
                    }}
                    placeholder="Son giriş tarihi seçiniz"
                  />
                </Col>
              </Row>
            </Form>
          </ComponentContainerCard>
        </div>
      </OffcanvasBody>

      {/* Footer with buttons */}
      <div className="offcanvas-footer border-top p-3 bg-light">
        <Row className="g-2">
          <Col md={6}>
            <Button 
              variant="outline-secondary" 
              onClick={handleReset} 
              className="w-100"
            >
              <IconifyIcon icon="bx:refresh" className="me-1" />
              Temizle
            </Button>
          </Col>
          <Col md={6}>
            <Button 
              variant="success" 
              type="submit"
              form="user-filter-form"
              className="w-100"
            >
              <IconifyIcon icon="bx:search" className="me-1" />
              Sonuçları Listele
            </Button>
          </Col>
        </Row>
      </div>
    </Offcanvas>
  );
};

export default UserFilter;
