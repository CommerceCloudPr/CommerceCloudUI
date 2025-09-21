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

const UserFilter = ({ show, onHide }) => {
  const router = useRouter();
  const { control, handleSubmit, reset, watch } = useForm();
  const [memberDate, setMemberDate] = useState('');
  const [lastLoginDate, setLastLoginDate] = useState('');

  // Options for select fields
  const memberGroupOptions = [
    { label: 'Seçiniz', value: '' },
    { label: 'Premium', value: 'premium' },
    { label: 'Standard', value: 'standard' },
    { label: 'VIP', value: 'vip' }
  ];

  const countryOptions = [
    { label: 'Ülke Seçiniz', value: '' },
    { label: 'Türkiye', value: 'TR' },
    { label: 'ABD', value: 'US' },
    { label: 'Almanya', value: 'DE' },
    { label: 'Fransa', value: 'FR' }
  ];

  const cityOptions = [
    { label: 'Şehir Seçiniz', value: '' },
    { label: 'İstanbul', value: 'istanbul' },
    { label: 'Ankara', value: 'ankara' },
    { label: 'İzmir', value: 'izmir' },
    { label: 'Bursa', value: 'bursa' }
  ];

  const statusOptions = [
    { label: 'Seçiniz', value: '' },
    { label: 'Aktif', value: 'active' },
    { label: 'Pasif', value: 'inactive' }
  ];

  const permissionOptions = [
    { label: 'Seçiniz', value: '' },
    { label: 'İzinli', value: 'allowed' },
    { label: 'İzinsiz', value: 'not_allowed' }
  ];

  const agreementOptions = [
    { label: 'Seçiniz', value: '' },
    { label: 'Kabul Edildi', value: 'accepted' },
    { label: 'Kabul Edilmedi', value: 'not_accepted' }
  ];

  const onSubmit = (data) => {
    // Add date fields to form data
    const filterData = {
      ...data,
      memberDate,
      lastLoginDate
    };
    
    console.log('Filter Data:', filterData);
    
    // Close the filter modal
    onHide();
    
    // Navigate to user list page with filter parameters
    // For now, just navigate to the list page
    // Later, when API is ready, you can pass filter parameters as query params
    router.push('/user/list');
  };

  const handleReset = () => {
    reset();
    setMemberDate('');
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
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                {/* Üye ID */}
                <Col md={6} className="mb-3">
                  <FormLabel>Üye ID</FormLabel>
                  <FormControl
                    type="number"
                    placeholder="0"
                    {...control.register('memberId')}
                  />
                </Col>

                {/* Telefon */}
                <Col md={6} className="mb-3">
                  <FormLabel>Telefon</FormLabel>
                  <InputGroup>
                    <FormSelect {...control.register('phoneCountryCode')} style={{ maxWidth: '80px' }}>
                      <option value="+90">🇹🇷 +90</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+49">🇩🇪 +49</option>
                    </FormSelect>
                    <FormControl
                      type="tel"
                      placeholder=""
                      {...control.register('phone')}
                    />
                  </InputGroup>
                </Col>

                {/* Üye Grubu */}
                <Col md={6} className="mb-3">
                  <FormLabel>Üye Grubu</FormLabel>
                  <FormSelect {...control.register('memberGroup')}>
                    <option value="">Seçiniz</option>
                    {memberGroupOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Onay Durumu */}
                <Col md={6} className="mb-3">
                  <FormLabel>Onay Durumu</FormLabel>
                  <FormSelect {...control.register('approvalStatus')}>
                    <option value="">Seçiniz</option>
                    {statusOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Ülke */}
                <Col md={6} className="mb-3">
                  <FormLabel>Ülke</FormLabel>
                  <FormSelect {...control.register('country')}>
                    <option value="">Ülke Seçiniz</option>
                    {countryOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                {/* SMS İzni */}
                <Col md={6} className="mb-3">
                  <FormLabel>SMS İzni</FormLabel>
                  <FormSelect {...control.register('smsPermission')}>
                    <option value="">Seçiniz</option>
                    {permissionOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                {/* İsim */}
                <Col md={6} className="mb-3">
                  <FormLabel>İsim</FormLabel>
                  <FormControl
                    type="text"
                    placeholder=""
                    {...control.register('firstName')}
                  />
                </Col>

                {/* E-Mail İzni */}
                <Col md={6} className="mb-3">
                  <FormLabel>E-Mail İzni</FormLabel>
                  <FormSelect {...control.register('emailPermission')}>
                    <option value="">Seçiniz</option>
                    {permissionOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Soyad */}
                <Col md={6} className="mb-3">
                  <FormLabel>Soyad</FormLabel>
                  <FormControl
                    type="text"
                    placeholder=""
                    {...control.register('lastName')}
                  />
                </Col>

                {/* Üyelik Sözleşmesi */}
                <Col md={6} className="mb-3">
                  <FormLabel>Üyelik Sözleşmesi</FormLabel>
                  <FormSelect {...control.register('membershipAgreement')}>
                    <option value="">Seçiniz</option>
                    {agreementOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Şehir */}
                <Col md={6} className="mb-3">
                  <FormLabel>Şehir</FormLabel>
                  <FormSelect {...control.register('city')}>
                    <option value="">Şehir Seçiniz</option>
                    {cityOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Kişisel Verilerin Korunması */}
                <Col md={6} className="mb-3">
                  <FormLabel>Kişisel Verilerin Korunması</FormLabel>
                  <FormSelect {...control.register('dataProtection')}>
                    <option value="">Seçiniz</option>
                    {agreementOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Üyelik Tarihi */}
                <Col md={6} className="mb-3">
                  <FormLabel>Üyelik Tarihi</FormLabel>
                  <div className="d-flex gap-2">
                    <CustomFlatpickr
                      className="form-control"
                      value={memberDate}
                      onChange={(date) => setMemberDate(date)}
                      options={{
                        dateFormat: 'd.m.Y',
                        locale: 'tr'
                      }}
                      placeholder="Başlangıç"
                    />
                    <CustomFlatpickr
                      className="form-control"
                      value={memberDate}
                      onChange={(date) => setMemberDate(date)}
                      options={{
                        dateFormat: 'd.m.Y',
                        locale: 'tr'
                      }}
                      placeholder="Bitiş"
                    />
                  </div>
                </Col>

                {/* Son Giriş Tarihi */}
                <Col md={6} className="mb-3">
                  <FormLabel>Son Giriş Tarihi</FormLabel>
                  <div className="d-flex gap-2">
                    <CustomFlatpickr
                      className="form-control"
                      value={lastLoginDate}
                      onChange={(date) => setLastLoginDate(date)}
                      options={{
                        dateFormat: 'd.m.Y',
                        locale: 'tr'
                      }}
                      placeholder="Başlangıç"
                    />
                    <CustomFlatpickr
                      className="form-control"
                      value={lastLoginDate}
                      onChange={(date) => setLastLoginDate(date)}
                      options={{
                        dateFormat: 'd.m.Y',
                        locale: 'tr'
                      }}
                      placeholder="Bitiş"
                    />
                  </div>
                </Col>

                {/* Müşteri Kodu */}
                <Col md={12} className="mb-3">
                  <FormLabel>Müşteri Kodu</FormLabel>
                  <FormControl
                    type="text"
                    placeholder=""
                    {...control.register('customerCode')}
                  />
                </Col>

                {/* Aktif */}
                <Col md={12} className="mb-3">
                  <FormLabel>Aktif</FormLabel>
                  <FormSelect {...control.register('status')}>
                    <option value="">Seçiniz</option>
                    {statusOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </FormSelect>
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
              onClick={handleSubmit(onSubmit)} 
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
