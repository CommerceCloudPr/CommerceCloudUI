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
import CustomFlatpickr from '@/components/CustomFlatpickr';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';

/**
 * Yardımcılar
 */
const toISODate = (val) => {
  // Flatpickr çoğunlukla Date veya [Date] döner -> ISO (YYYY-MM-DD)
  if (!val) return '';
  const d = Array.isArray(val) ? val[0] : val;
  if (!(d instanceof Date) || isNaN(d)) return '';
  return d.toISOString().slice(0, 10);
};

/**
 * Sabit seçenekler
 */
const STATUS_OPTIONS = [
  { label: 'Durum Seçiniz', value: '' },
  { label: 'Aktif', value: 'active' },
  { label: 'Pasif', value: 'inactive' },
];

const defaultValues = {
  categoryName: '',
  status: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: '',
};

const CategoryFilter = ({ show, onHide, onFilter }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  // Flatpickr'a value sağlamak için memo'lar
  const createdFrom = watch('createdFrom');
  const createdTo = watch('createdTo');
  const updatedFrom = watch('updatedFrom');
  const updatedTo = watch('updatedTo');

  const flatpickrOpts = useMemo(
    () => ({
      dateFormat: 'd.m.Y',
      locale: 'tr',
    }),
    []
  );

  const onSubmit = (raw) => {
    const payload = {};

    // Sadece API'de desteklenen filtreleri gönder
    // categoryName, isActive, parentCategoryUUID
    
    if (raw.categoryName && raw.categoryName.trim() !== '') {
      payload.categoryName = raw.categoryName.trim();
    }

    // UI status -> isActive
    if (raw.status && raw.status !== '') {
      payload.isActive = raw.status === 'active';
    }

    // Tarih filtreleri API'de desteklenmiyor, bu yüzden göndermiyoruz
    // if (payload.createdFrom) payload.createdFrom = toISODate(payload.createdFrom);
    // if (payload.createdTo) payload.createdTo = toISODate(payload.createdTo);
    // if (payload.updatedFrom) payload.updatedFrom = toISODate(payload.updatedFrom);
    // if (payload.updatedTo) payload.updatedTo = toISODate(payload.updatedTo);

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
          Kategori Filtreleme
        </OffcanvasTitle>
      </OffcanvasHeader>

      <OffcanvasBody className="p-0">
        <div className="p-3">
          <ComponentContainerCard
            title="Filtre Kriterleri"
            description="Aşağıdaki kriterleri kullanarak kategori listesini filtreleyebilirsiniz."
          >
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                {/* Kategori Adı */}
                <Col md={6} className="mb-3">
                  <FormLabel>Kategori Adı</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Kategori adı giriniz"
                    {...register('categoryName')}
                  />
                </Col>

                {/* Durum */}
                <Col md={6} className="mb-3">
                  <FormLabel>Durum</FormLabel>
                  <FormSelect {...register('status')}>
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Oluşturulma Tarihi (Başlangıç/Bitiş) */}
                <Col md={6} className="mb-3">
                  <FormLabel>Oluşturulma Tarihi</FormLabel>
                  <div className="d-flex gap-2">
                    <CustomFlatpickr
                      className="form-control"
                      value={createdFrom}
                      onChange={(date) => setValue('createdFrom', date, { shouldDirty: true })}
                      options={flatpickrOpts}
                      placeholder="Başlangıç"
                    />
                    <CustomFlatpickr
                      className="form-control"
                      value={createdTo}
                      onChange={(date) => setValue('createdTo', date, { shouldDirty: true })}
                      options={flatpickrOpts}
                      placeholder="Bitiş"
                    />
                  </div>
                </Col>

                {/* Güncellenme Tarihi (Başlangıç/Bitiş) */}
                <Col md={6} className="mb-3">
                  <FormLabel>Güncellenme Tarihi</FormLabel>
                  <div className="d-flex gap-2">
                    <CustomFlatpickr
                      className="form-control"
                      value={updatedFrom}
                      onChange={(date) => setValue('updatedFrom', date, { shouldDirty: true })}
                      options={flatpickrOpts}
                      placeholder="Başlangıç"
                    />
                    <CustomFlatpickr
                      className="form-control"
                      value={updatedTo}
                      onChange={(date) => setValue('updatedTo', date, { shouldDirty: true })}
                      options={flatpickrOpts}
                      placeholder="Bitiş"
                    />
                  </div>
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

export default CategoryFilter;

