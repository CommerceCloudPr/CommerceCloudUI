'use client';

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
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';

const defaultValues = {
  brandName: '',
};

const BrandFilter = ({ show, onHide, onFilter }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  const onSubmit = (raw) => {
    const payload = {};

    if (raw.brandName && raw.brandName.trim() !== '') {
      payload.brandName = raw.brandName.trim();
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
          Brand Filtreleme
        </OffcanvasTitle>
      </OffcanvasHeader>

      <OffcanvasBody className="p-0">
        <div className="p-3">
          <ComponentContainerCard
            title="Filtre Kriterleri"
            description="Aşağıdaki kriterleri kullanarak brand listesini filtreleyebilirsiniz."
          >
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                {/* Brand Name */}
                <Col md={12} className="mb-3">
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Brand adı giriniz"
                    {...register('brandName')}
                  />
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

export default BrandFilter;
