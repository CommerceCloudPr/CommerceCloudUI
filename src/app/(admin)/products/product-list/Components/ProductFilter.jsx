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
  InputGroup,
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

const parseNumberOrEmpty = (v) => (v === '' || v === null || v === undefined ? '' : Number(v));

/**
 * Sabit seçenekler
 */
const CATEGORY_OPTIONS = [
  { label: 'Kategori Seçiniz', value: '' },
  { label: 'Fashion', value: 'Fashion' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Shoes', value: 'Shoes' },
  { label: 'Cap', value: 'Cap' },
  { label: 'Wallet', value: 'Wallet' },
  { label: 'Sunglass', value: 'Sunglass' },
];

const STOCK_STATUS_OPTIONS = [
  { label: 'Stok Durumu Seçiniz', value: '' },
  { label: 'Stokta Var', value: 'in_stock' },
  { label: 'Stokta Yok', value: 'out_of_stock' },
  { label: 'Az Stok', value: 'low_stock' },
];

const STATUS_OPTIONS = [
  { label: 'Durum Seçiniz', value: '' },
  { label: 'Aktif', value: 'active' },   // isActive: true
  { label: 'Pasif', value: 'inactive' }, // isActive: false
];

const SALES_UNIT_OPTIONS = [
  { label: 'Satış Birimi Seçiniz', value: '' },
  { label: 'Adet', value: 'PIECE' },
  { label: 'Kilogram', value: 'KILOGRAM' },
  { label: 'Litre', value: 'LITER' },
  { label: 'Metre', value: 'METER' },
  { label: 'Paket', value: 'PACKAGE' },
  { label: 'Kutu', value: 'BOX' },
  { label: 'Set', value: 'SET' },
  { label: 'Çift', value: 'PAIR' },
  { label: 'Takım', value: 'SUIT' },
];

const SHOW_PRODUCT_OPTIONS = [
  { label: 'Tümü', value: '' },
  { label: 'Gösterilen Ürünler', value: 'true' },
  { label: 'Gösterilmeyen Ürünler', value: 'false' },
];

const FREE_SHIPPING_OPTIONS = [
  { label: 'Tümü', value: '' },
  { label: 'Ücretsiz Kargolu', value: 'true' },
  { label: 'Ücretli Kargo', value: 'false' },
];

const defaultValues = {
  productName: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  stockStatus: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: '',
  productCode: '',
  status: '',
  salesUnit: '',
  showProduct: '',
  freeShipping: '',
  brandName: '',
};

const ProductFilter = ({ show, onHide, onFilter }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  // Flatpickr'a value sağlamak için memo’lar (string ISO yerine Date göstermek istersen dönüştürebilirsin)
  const createdFrom = watch('createdFrom');
  const createdTo = watch('createdTo');
  const updatedFrom = watch('updatedFrom');
  const updatedTo = watch('updatedTo');

  const flatpickrOpts = useMemo(
    () => ({
      dateFormat: 'd.m.Y',
      locale: 'tr',
      // allowInput: true // istersen manual yazım
    }),
    []
  );

  const onSubmit = (raw) => {
    const payload = {
      ...raw,
      minPrice: parseNumberOrEmpty(raw.minPrice),
      maxPrice: parseNumberOrEmpty(raw.maxPrice),
    };

    // Boş stringleri kaldır (0/false hariç)
    Object.keys(payload).forEach((k) => {
      if (payload[k] === '') delete payload[k];
    });

    // UI status -> isActive (opsiyonel; backend bekliyorsa)
    if (payload.status) {
      payload.isActive = payload.status === 'active';
      delete payload.status;
    }

    // showProduct -> boolean
    if (payload.showProduct !== '') {
      payload.showProduct = payload.showProduct === 'true';
    }

    // freeShipping -> boolean
    if (payload.freeShipping !== '') {
      payload.freeShipping = payload.freeShipping === 'true';
    }

    // Tarihler ISO string (YYYY-MM-DD)
    if (payload.createdFrom) payload.createdFrom = toISODate(payload.createdFrom);
    if (payload.createdTo) payload.createdTo = toISODate(payload.createdTo);
    if (payload.updatedFrom) payload.updatedFrom = toISODate(payload.updatedFrom);
    if (payload.updatedTo) payload.updatedTo = toISODate(payload.updatedTo);

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
          Ürün Filtreleme
        </OffcanvasTitle>
      </OffcanvasHeader>

      <OffcanvasBody className="p-0">
        <div className="p-3">
          <ComponentContainerCard
            title="Filtre Kriterleri"
            description="Aşağıdaki kriterleri kullanarak ürün listesini filtreleyebilirsiniz."
          >
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                {/* Ürün Adı */}
                <Col md={6} className="mb-3">
                  <FormLabel>Ürün Adı</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Ürün adı giriniz"
                    {...register('productName')}
                  />
                </Col>

                {/* Kategori */}
                <Col md={6} className="mb-3">
                  <FormLabel>Kategori</FormLabel>
                  <FormSelect {...register('category')}>
                    {CATEGORY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Min Fiyat */}
                <Col md={6} className="mb-3">
                  <FormLabel>Min Fiyat</FormLabel>
                  <InputGroup>
                    <InputGroup.Text>₺</InputGroup.Text>
                    <FormControl
                      type="number"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      {...register('minPrice', {
                        setValueAs: (v) => (v === '' ? '' : Number(v)),
                      })}
                    />
                  </InputGroup>
                </Col>

                {/* Max Fiyat */}
                <Col md={6} className="mb-3">
                  <FormLabel>Max Fiyat</FormLabel>
                  <InputGroup>
                    <InputGroup.Text>₺</InputGroup.Text>
                    <FormControl
                      type="number"
                      placeholder="1000"
                      min="0"
                      step="0.01"
                      {...register('maxPrice', {
                        setValueAs: (v) => (v === '' ? '' : Number(v)),
                      })}
                    />
                  </InputGroup>
                </Col>

                {/* Stok Durumu */}
                <Col md={6} className="mb-3">
                  <FormLabel>Stok Durumu</FormLabel>
                  <FormSelect {...register('stockStatus')}>
                    {STOCK_STATUS_OPTIONS.map((o) => (
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

                {/* Ürün Kodu */}
                <Col md={6} className="mb-3">
                  <FormLabel>Ürün Kodu</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Ürün kodu giriniz"
                    {...register('productCode')}
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

                {/* Marka Adı */}
                <Col md={6} className="mb-3">
                  <FormLabel>Marka Adı</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Marka adı giriniz"
                    {...register('brandName')}
                  />
                </Col>

                {/* Satış Birimi */}
                <Col md={6} className="mb-3">
                  <FormLabel>Satış Birimi</FormLabel>
                  <FormSelect {...register('salesUnit')}>
                    {SALES_UNIT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Ürün Gösterimi */}
                <Col md={6} className="mb-3">
                  <FormLabel>Ürün Gösterimi</FormLabel>
                  <FormSelect {...register('showProduct')}>
                    {SHOW_PRODUCT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </FormSelect>
                </Col>

                {/* Kargo Durumu */}
                <Col md={6} className="mb-3">
                  <FormLabel>Kargo Durumu</FormLabel>
                  <FormSelect {...register('freeShipping')}>
                    {FREE_SHIPPING_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </FormSelect>
                </Col>
              </Row>

              {/* Footer buttons form içinde olsun ki Enter ile çalışsın */}
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

export default ProductFilter;