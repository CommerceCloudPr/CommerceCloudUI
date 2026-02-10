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
  FormSelect,
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { orderStatusOptions, paymentTypeOptions, cargoOptions, orderSourceOptions } from '../data';

const defaultValues = {
  searchQuery: '',
  status: '',
  paymentType: '',
  cargo: '',
  source: '',
  dateFrom: '',
  dateTo: '',
  minAmount: '',
  maxAmount: '',
  phone: '',
  customerName: ''
};

const OrdersFilter = ({ show, onHide, onFilter }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    // Remove empty values
    const payload = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== '' && data[key] !== 'all') {
        payload[key] = data[key];
      }
    });

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
          Order Filters
        </OffcanvasTitle>
      </OffcanvasHeader>

      <OffcanvasBody className="p-0">
        <div className="p-3">
          <ComponentContainerCard
            title="Filter Criteria"
            description="Use the criteria below to filter the order list."
          >
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                {/* Search Query */}
                <Col md={12} className="mb-3">
                  <FormLabel>Search</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Order ID, Reference ID..."
                    {...register('searchQuery')}
                  />
                </Col>

                {/* Customer Name */}
                <Col md={6} className="mb-3">
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Customer name"
                    {...register('customerName')}
                  />
                </Col>

                {/* Phone */}
                <Col md={6} className="mb-3">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Phone number"
                    {...register('phone')}
                  />
                </Col>

                {/* Order Status */}
                <Col md={6} className="mb-3">
                  <FormLabel>Order Status</FormLabel>
                  <FormSelect {...register('status')}>
                    {orderStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Payment Type */}
                <Col md={6} className="mb-3">
                  <FormLabel>Payment Type</FormLabel>
                  <FormSelect {...register('paymentType')}>
                    {paymentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Cargo */}
                <Col md={6} className="mb-3">
                  <FormLabel>Cargo Company</FormLabel>
                  <FormSelect {...register('cargo')}>
                    {cargoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Order Source */}
                <Col md={6} className="mb-3">
                  <FormLabel>Order Source</FormLabel>
                  <FormSelect {...register('source')}>
                    {orderSourceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Min Amount */}
                <Col md={6} className="mb-3">
                  <FormLabel>Min Amount</FormLabel>
                  <FormControl
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    {...register('minAmount')}
                  />
                </Col>

                {/* Max Amount */}
                <Col md={6} className="mb-3">
                  <FormLabel>Max Amount</FormLabel>
                  <FormControl
                    type="number"
                    placeholder="10000"
                    min="0"
                    step="0.01"
                    {...register('maxAmount')}
                  />
                </Col>

                {/* Start Date */}
                <Col md={6} className="mb-3">
                  <FormLabel>Start Date</FormLabel>
                  <FormControl
                    type="date"
                    {...register('dateFrom')}
                  />
                </Col>

                {/* End Date */}
                <Col md={6} className="mb-3">
                  <FormLabel>End Date</FormLabel>
                  <FormControl
                    type="date"
                    {...register('dateTo')}
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
                  Clear
                </Button>
                <Button type="submit" variant="success" className="flex-fill" disabled={isSubmitting}>
                  <IconifyIcon icon="bx:search" className="me-1" />
                  Apply Filters
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </div>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default OrdersFilter;
