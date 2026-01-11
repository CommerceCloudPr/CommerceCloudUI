'use client';

import { useMemo } from 'react';
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
  FormControl,
  FormLabel,
  FormSelect,
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';

/**
 * Sabit seçenekler
 */
const ATTRIBUTE_TYPE_OPTIONS = [
  { label: 'Attribute Type Seçiniz', value: '' },
  { label: 'TEXT', value: 'TEXT' },
  { label: 'NUMBER', value: 'NUMBER' },
  { label: 'BOOLEAN', value: 'BOOLEAN' },
  { label: 'DATE', value: 'DATE' },
];

const defaultValues = {
  attributeName: '',
  attributeType: '',
};

const AttributeFilter = ({ show, onHide, onFilter }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  const onSubmit = (raw) => {
    const payload = {};

    if (raw.attributeName && raw.attributeName.trim() !== '') {
      payload.attributeName = raw.attributeName.trim();
    }

    if (raw.attributeType && raw.attributeType !== '') {
      payload.attributeType = raw.attributeType;
    }

    if (onFilter) onFilter(payload);
    onHide?.();
  };

  const handleReset = () => {
    reset(defaultValues);
    onFilter?.({});
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" className="border-0" style={{ width: '650px' }}>
      <OffcanvasHeader closeButton className="d-flex align-items-center bg-primary p-3">
        <OffcanvasTitle as="h5" className="text-white m-0">
          <IconifyIcon icon="bx:filter-alt" className="me-2" />
          Attribute Filtreleme
        </OffcanvasTitle>
      </OffcanvasHeader>

      <OffcanvasBody className="p-0">
        <div className="p-3">
          <ComponentContainerCard
            title="Filtre Kriterleri"
            description="Aşağıdaki kriterleri kullanarak attribute listesini filtreleyebilirsiniz."
          >
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                {/* Attribute Name */}
                <Col md={6} className="mb-3">
                  <FormLabel>Attribute Name</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Attribute adı giriniz"
                    {...register('attributeName')}
                  />
                </Col>

                {/* Attribute Type */}
                <Col md={6} className="mb-3">
                  <FormLabel>Attribute Type</FormLabel>
                  <FormSelect {...register('attributeType')}>
                    {ATTRIBUTE_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </FormSelect>
                </Col>
              </Row>

              {/* Footer buttons */}
              <div className="border-top pt-3 mt-1 d-flex gap-2">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={handleReset}
                  className="flex-fill"
                  disabled={isSubmitting}
                >
                  <IconifyIcon icon="bx:refresh" className="me-1" />
                  Temizle
                </Button>
                <Button type="submit" variant="success" className="flex-fill" disabled={isSubmitting}>
                  <IconifyIcon icon="bx:search" className="me-1" />
                  Sonuçları Listele
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </div>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default AttributeFilter;
