/* eslint-disable @next/next/no-img-element */
'use client'
import DropzoneFormInput from '@/components/form/DropzoneFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormCheck, FormSelect, Nav, NavItem, NavLink, Row, TabContainer, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCustomFieldsByEntity, createCustomField } from '@/utils/customFieldApi';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useModal from '@/hooks/useModal';

const toastify = ({ props, message }) =>
  toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });
const AddProduct = () => {

  const router = useRouter()
  const session = localStorage.getItem('session_token');
  const params = useSearchParams()
  const [productId, setProductId] = useState(params.get('id'))
  const [loading, setLoading] = useState(false);
  const [changedData, setChangedData] = useState();
  const [eventKey, setEventKey] = useState('1')
  const [brand, setBrand] = useState([])
  const [category, setCategory] = useState(null);
  const [categoryList, setCategoryList] = useState([])
  const [customFields, setCustomFields] = useState([])
  const [customFieldValues, setCustomFieldValues] = useState({})
  const [product, setProduct] = useState({
    productName: null,
    productSku: null,
    originalPrice: null,
    sellPrice: null,
    productDescription: null,
    productShortDescription: null,
    totalStock: null,
    productBarcode: null,
    productImageUrlList: [],
    isActive: true,
    isDeleted: false,
    vatRate: null,
    currencyCode: null, //string
    brandUUID: null,//string
    vatIncluded: false,//boolean
    showProduct: false,//boolean
    salesUnit: null, //string
    desi1: null, //number
    desi2: null, //number
    fixedShippingPrice: null, //number
    freeShipping: false //boolean
  })
  const [attributeList, setAttributeList] = useState([]);
  const [attribute, setAttribute] = useState(null);
  
  // Custom Field Modal States
  const { isOpen: isCustomFieldModalOpen, toggleModal: toggleCustomFieldModal } = useModal();
  const [customFieldLoading, setCustomFieldLoading] = useState(false);
  const [customFieldType, setCustomFieldType] = useState('text');
  const [customFieldRequired, setCustomFieldRequired] = useState('no');

  const customFieldSchema = yup.object({
    name: yup.string().required('Field Name gereklidir'),
    label: yup.string().required('Display Label gereklidir')
  });

  const { handleSubmit: handleCustomFieldSubmit, control: customFieldControl, reset: resetCustomFieldForm } = useForm({
    resolver: yupResolver(customFieldSchema)
  });
  const handleSaveProduct = () => {
    let temp = [];
    product.productImageUrlList?.map((item) => {
      temp.push(item?.preview)
    })
    const myObj = {
      "productName": product.productName,
      "productSku": product.productSku,
      "originalPrice": Number(product.originalPrice),
      "sellPrice": Number(product.sellPrice),
      "productDescription": product.productDescription,
      "productShortDescription": product.productShortDescription,
      "totalStock": Number(product.totalStock),
      "productBarcode": product.productBarcode,
      "productImageUrlList": temp,
      "isActive": product.isActive,
      "isDeleted": product.isDeleted,
      "vatRate": Number(product.vatRate),
      "brandUUID": product.brandUUID,
      "vatIncluded": product.vatIncluded,
      "currencyCode": product.currencyCode,
      "showProduct": product.showProduct,
      "salesUnit": product.salesUnit,
      "desi1": Number(product.desi1),
      "desi2": Number(product.desi2),
      "fixedShippingPrice": Number(product.fixedShippingPrice),
      "freeShipping": product.freeShipping,
      "customFieldValues": customFieldValues
    }
    if (productId === null) {
      fetch('https://api-dev.aykutcandan.com/product/add',
        {

          method: "POST",
          headers: {
            'Authorization': `Bearer ${decodeURIComponent(session)}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(myObj)

        }
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          if (category !== null) {
            fetch('https://api-dev.aykutcandan.com/product/product-category/add',
              {
                method: "POST",
                headers: {
                  'Authorization': `Bearer ${decodeURIComponent(session)}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  'productId': res.data.uuid,
                  'categoryId': category
                })

              })
          }
          if (attribute !== null) {
            fetch('https://api-dev.aykutcandan.com/product/product-attributes/add',
              {
                method: "POST",
                headers: {
                  'Authorization': `Bearer ${decodeURIComponent(session)}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  'productUUID': res.data.uuid,
                  'attributeDefinitionUUID': attribute
                })

              })
          }
          if (res.errors.length > 0) {
            res.errors.map((item) => {
              toastify({
                message: item?.field + " " + item.message,
                props: {
                  type: res?.success === true ? 'success' : 'error',
                }
              })
            })

          } else {
            toastify({
              message: res?.message,
              props: {
                type: res?.success === true ? 'success' : 'error',
              }
            })
          }


          if (res.success === true) {
            router.push('/products/product-list')

          }
        })
        .catch((err) => console.log("err" + "err"))
    } else {
      fetch('https://api-dev.aykutcandan.com/product/update/' + productId,
        {

          method: "PUT",
          headers: {
            'Authorization': `Bearer ${decodeURIComponent(session)}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(changedData)

        }
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          if (res.errors.length > 0) {
            res.errors.map((item) => {
              toastify({
                message: item?.field + " " + item.message,
                props: {
                  type: res?.success === true ? 'success' : 'error',
                }
              })
            })

          } else {
            toastify({
              message: res?.message,
              props: {
                type: res?.success === true ? 'success' : 'error',
              }
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
      if (category !== null) {
        fetch('https://api-dev.aykutcandan.com/product/product-category/add',
          {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${decodeURIComponent(session)}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'productId': productId,
              'categoryId': category
            })

          })
      }
      if (attribute !== null) {
        fetch('https://api-dev.aykutcandan.com/product/product-attributes/add',
          {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${decodeURIComponent(session)}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'productUUID': productId,
              'attributeDefinitionUUID': attribute
            })

          })
      }

    }
  }

  const getBrands = () => {
    fetch('https://api-dev.aykutcandan.com/product/brand/get-all', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${decodeURIComponent(session)}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setBrand(res.data.content))
      .catch((err) => console.log(err))
  }

  const getCustomFields = async () => {
    try {
      const response = await fetchCustomFieldsByEntity('product', {
        page: 0,
        size: 100,
        isActive: true
      });
      if (response && response.success && response.items && Array.isArray(response.items)) {
        setCustomFields(response.items);
      } else {
        setCustomFields([]);
      }
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      setCustomFields([]);
    }
  }

  const handleCreateCustomField = async (data) => {
    setCustomFieldLoading(true);
    try {
      const payload = {
        name: data.name,
        label: data.label,
        type: customFieldType,
        entityType: 'product',
        placeholder: data.placeholder || '',
        defaultValue: data.defaultValue || '',
        options: data.options ? data.options.split(',').map(opt => opt.trim()) : [],
        isRequired: customFieldRequired === 'yes',
        isActive: true
      };

      const response = await createCustomField(payload);
      if (response && response.success) {
        toastify({
          message: 'Custom field başarıyla oluşturuldu',
          props: { type: 'success', position: 'top-right' }
        });
        resetCustomFieldForm();
        setCustomFieldType('text');
        setCustomFieldRequired('no');
        toggleCustomFieldModal();
        // Custom fields'ı yeniden yükle
        await getCustomFields();
      } else {
        toastify({
          message: (response && response.message) || 'Custom field oluşturulamadı',
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
      setCustomFieldLoading(false);
    }
  };

  const renderCustomFieldInput = (field) => {
    if (!field || !field.uuid) return null;
    
    const fieldId = `custom-field-${field.uuid}`;
    const fieldType = field.type || field.fieldType || 'text';
    let fieldValue = customFieldValues[field.uuid];
    
    // Eğer değer yoksa default value kullan
    if (fieldValue === undefined || fieldValue === null) {
      fieldValue = field.defaultValue || '';
    }

    const handleChange = (value) => {
      setCustomFieldValues(prev => ({
        ...prev,
        [field.uuid]: value
      }));
    };

    switch (fieldType) {
      case 'text':
        return (
          <input
            type="text"
            id={fieldId}
            className="form-control"
            placeholder={field.placeholder || ''}
            value={fieldValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.isRequired}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            id={fieldId}
            className="form-control"
            placeholder={field.placeholder || ''}
            value={fieldValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            min={field.minValue}
            max={field.maxValue}
            required={field.isRequired}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            id={fieldId}
            className="form-control"
            value={fieldValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.isRequired}
          />
        );
      
      case 'select':
        return (
          <FormSelect
            id={fieldId}
            value={fieldValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.isRequired}
          >
            <option value="">Seçiniz</option>
            {field.options && Array.isArray(field.options) && field.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        );
      
      case 'checkbox':
        const checkboxValue = fieldValue === true || fieldValue === 'true' || fieldValue === 1 || fieldValue === '1';
        return (
          <FormCheck
            type="checkbox"
            id={fieldId}
            checked={checkboxValue}
            onChange={(e) => handleChange(e.target.checked)}
            required={field.isRequired}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            className="form-control"
            rows={4}
            placeholder={field.placeholder || ''}
            value={fieldValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.isRequired}
          />
        );
      
      default:
        return (
          <input
            type="text"
            id={fieldId}
            className="form-control"
            placeholder={field.placeholder || ''}
            value={fieldValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={field.isRequired}
          />
        );
    }
  };

  useEffect(() => {

    if (productId !== null) {
      fetch('https://api-dev.aykutcandan.com/product/detail/' + productId,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${decodeURIComponent(session)}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          const response = res.data?.product;
          setProduct({
            ...product,
            productName: response.productName,
            productSku: response.productSku,
            originalPrice: response.originalPrice,
            sellPrice: response.sellPrice,
            productDescription: response.productDescription,
            productShortDescription: response.productShortDescription,
            totalStock: response.totalStock,
            productBarcode: response.productBarcode,
            productImageUrlList: response.productImageUrlList,
            isActive: response.isActive,
            isDeleted: response.isDeleted,
            vatRate: response.vatRate,
            currencyCode: response.currencyCode, //string
            brandUUID: response.brandUUID,//string
            vatIncluded: response.vatIncluded,//boolean
            showProduct: response.showProduct,//boolean
            salesUnit: response.salesUnit, //string
            desi1: response.desi1, //number
            desi2: response.desi2, //number
            fixedShippingPrice: response.fixedShippingPrice, //number
            freeShipping: response.freeShipping //boolean

          })
          setChangedData({
            ...product,
            productName: response.productName,
            productSku: response.productSku,
            originalPrice: response.originalPrice,
            sellPrice: response.sellPrice,
            productDescription: response.productDescription,
            productShortDescription: response.productShortDescription,
            totalStock: response.totalStock,
            productBarcode: response.productBarcode,
            productImageUrlList: response.productImageUrlList,
            isActive: response.isActive,
            isDeleted: response.isDeleted,
            vatRate: response.vatRate,
            currencyCode: response.currencyCode, //string
            brandUUID: response.brandUUID,//string
            vatIncluded: response.vatIncluded,//boolean
            showProduct: response.showProduct,//boolean
            salesUnit: response.salesUnit, //string
            desi1: response.desi1, //number
            desi2: response.desi2, //number
            fixedShippingPrice: response.fixedShippingPrice, //number
            freeShipping: response.freeShipping //boolean
          })
          setLoading(true)
        })
        .catch((err) => console.log(err))
    } else {
      setLoading(true)
    }
    getBrands()
    getCustomFields()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return loading === true && <Row xl={12} lg={10}>
    <div className="p-3 mb-3 rounded">
      <Row className="justify-content-end g-2">
        <Col lg={2}>
          <Button
            variant="primary"
            type='submit'
            size="md"
            onClick={() => handleSaveProduct()}
          >
            Create
          </Button>
        </Col>
      </Row>
    </div>
    <div>
      <TabContainer defaultActiveKey={eventKey}>
        <Nav as="ul" variant='pills' justify >
          <NavItem as="li" onClick={() => setEventKey('1')}>
            <NavLink eventKey={eventKey} active={eventKey === '1'}>
              <span>Genel Özellikler</span>
            </NavLink>
          </NavItem>
          <NavItem as="li" onClick={() => setEventKey('2')}>
            <NavLink eventKey={eventKey} active={eventKey === '2'} >
              <span>Medya</span>
            </NavLink>
          </NavItem>
          <NavItem as="li" onClick={() => setEventKey('3')}>
            <NavLink eventKey={eventKey} active={eventKey === '3'}>
              <span>Ürün Detayı</span>
            </NavLink>
          </NavItem>
          <NavItem as="li" onClick={() => setEventKey('4')}>
            <NavLink eventKey={eventKey} active={eventKey === '4'}>
              <span>Kargo</span>
            </NavLink>
          </NavItem>
          <NavItem as="li" onClick={() => setEventKey('5')}>
            <NavLink eventKey={eventKey} active={eventKey === '5'}>
              <span>Diğer Özellikler</span>
            </NavLink>
          </NavItem>
          <NavItem as="li" onClick={() => setEventKey('6')}>
            <NavLink eventKey={eventKey} active={eventKey === '6'}>
              <span>Arama Motoru Bilgileri</span>
            </NavLink>
          </NavItem>
          <NavItem as="li" onClick={() => setEventKey('7')}>
            <NavLink eventKey={eventKey} active={eventKey === '7'}>
              <span>Custom Fields</span>
            </NavLink>
          </NavItem>
        </Nav>
      </TabContainer>
    </div>
    <Col xl={12}>
      <form className='mt-4'>
        {
          eventKey === '1' && <Card>
            <CardHeader>
              <CardTitle as={'h4'}>Product Information</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Product Name
                    </label>
                    <input type="text" name="name" label="Product Name" className="form-control" placeholder="Enter Product Name" defaultValue={product.productName} onChange={(e) => {
                      setProduct({ ...product, productName: e.target.value })
                      setChangedData({ ...changedData, productName: e.target.value })
                    }} />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="product-sku" className="form-label">
                      Product Sku
                    </label>
                    <input name="sku" type="text" label="Product Sku" className="form-control" placeholder="Enter Product Sku" defaultValue={product.productSku} onChange={(e) => {
                      setProduct({ ...product, productSku: e.target.value })
                      setChangedData({ ...changedData, productSku: e.target.value })
                    }} />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <label htmlFor="product-stock" className="form-label">
                      Product Stock
                    </label>
                    <input type="number" label={"Product Stock"} name="stock" className="form-control" placeholder="Enter Product Stock" defaultValue={product.totalStock} onChange={(e) => {
                      setProduct({ ...product, totalStock: e.target.value })
                      setChangedData({ ...changedData, totalStock: e.target.value })
                    }} />
                  </div>
                </Col>
                <Col lg={4}>

                  <label className="form-label">Para Birimi</label>
                  <FormSelect >
                    <option value="tl">TL</option>
                    <option value="dollar">dolar</option>
                  </FormSelect>

                </Col>
                <Col lg={4}>

                  <label className="form-label">Satış Birimi</label>
                  <FormSelect >
                    <option value="adet">Adet</option>
                  </FormSelect>

                </Col>
              </Row>
              <Row>
                <Col lg={6}>

                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Brand
                    </label>
                    <FormSelect onChange={(e) => {
                      setProduct({ ...product, brandUUID: e.target.value })
                      setChangedData({ ...changedData, brandUUID: e.target.value })
                    }}>
                      {
                        brand?.map((item, key) => {
                          return <option key={key} value={item.uuid}>{item.brandName}</option>
                        })
                      }
                    </FormSelect>
                  </div>

                </Col>
                <Col lg={6}>

                  <div className="mb-3">
                    <label htmlFor="product-barcode" className="form-label">
                      Barcode
                    </label>
                    <input type="text" id="product-barcode" className="form-control" placeholder="Barcode" defaultValue={product.productBarcode} onChange={(e) => {
                      setProduct({ ...product, productBarcode: e.target.value })
                      setChangedData({ ...changedData, productBarcode: e.target.value })
                    }} />
                  </div>

                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Category
                    </label>
                    <FormSelect defaultValue={category} onChange={(e) => {
                      setCategory(e.target.value)
                    }}>
                      {
                        categoryList?.map((item, key) => {
                          return <option key={key} value={item.uuid}>{item.name}</option>
                        })
                      }
                    </FormSelect>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Attributes
                    </label>
                    <FormSelect defaultValue={attribute} onChange={(e) => {
                      setAttribute(e.target.value)
                    }}>
                      {
                        attributeList?.map((item, key) => {
                          return <option key={key} value={item.uuid}>{item.attributeName}</option>
                        })
                      }
                    </FormSelect>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>

                  <label htmlFor="product-price" className="form-label">
                    Original Price
                  </label>
                  <div className="input-group mb-3">
                    <span className="input-group-text fs-20">
                      <IconifyIcon icon="bx:dollar" />
                    </span>
                    <input type="number" id="product-price" className="form-control" defaultValue={product.originalPrice} onChange={(e) => {
                      setProduct({ ...product, originalPrice: e.target.value })
                      setChangedData({ ...changedData, originalPrice: e.target.value })
                    }} />
                  </div>

                </Col>
                <Col lg={4}>

                  <label htmlFor="product-discount" className="form-label">
                    Sell Price
                  </label>
                  <div className="input-group mb-3">
                    <span className="input-group-text fs-20">
                      <IconifyIcon icon="bxs:discount" />
                    </span>
                    <input type="number" id="product-discount" className="form-control" defaultValue={product.sellPrice} onChange={(e) => {
                      setProduct({ ...product, sellPrice: e.target.value })
                      setChangedData({ ...changedData, sellPrice: e.target.value })
                    }} />
                  </div>

                </Col>
              </Row>
              <Row className='mt-2'>
                <Col lg={4}>
                  <label className='form-label'>Currency Code</label>
                  <input className='form-control' defaultValue={product.currencyCode} onChange={((e) => {
                    setProduct({ ...product, currencyCode: e.target.value })
                    setChangedData({ ...changedData, currencyCode: e.target.value })
                  })}></input>
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col lg={4}>

                  <label className="form-label">KDV</label>
                  <FormSelect defaultValue={product.salesUnit} onChange={(e) => {
                    setProduct({ ...product, salesUnit: e.target.value })
                    setChangedData({ ...changedData, salesUnit: e.target.value })
                  }}>
                    <option value="PIECE">PIECE</option>
                  </FormSelect>

                </Col>
                <Col lg={4}>
                  <label className="form-label">KDV Oranı (%)</label>
                  <input id="product-discount" className="form-control" defaultValue={product.salesUnit} onChange={(e) => {
                    setProduct({ ...product, salesUnit: e.target.value })
                    setChangedData({ ...changedData, salesUnit: e.target.value })
                  }} />

                </Col>
                <Col lg={4}>

                  <label htmlFor="product-id" className="form-label">
                    Rate
                  </label>
                  <input type="number" id="product-id" className="form-control" defaultValue={product.vatRate} onChange={(e) => {
                    setProduct({ ...product, vatRate: e.target.value })
                    setChangedData({ ...changedData, vatRate: e.target.value })
                  }} />

                </Col>
              </Row>
              <Row className='mt-2'>
                <Col lg={2}>

                  <label htmlFor="product-active" className="form-label">
                    Active
                  </label>
                  <FormCheck type="switch" defaultChecked={product.isActive} onChange={(e) => {
                    setProduct({ ...product, isActive: e.target.checked })
                    setChangedData({ ...changedData, isActive: e.target.checked })
                  }} ></FormCheck>

                </Col>
                <Col lg={2}>

                  <label htmlFor="product-deleted" className="form-label">
                    Deleted
                  </label>
                  <FormCheck type="switch" defaultChecked={product.isDeleted} onChange={(e) => {
                    setProduct({ ...product, isDeleted: e.target.checked })
                    setChangedData({ ...changedData, isDeleted: e.target.checked })
                  }} ></FormCheck>

                </Col>
                <Col lg={8}>
                  <label htmlFor="product-deleted" className="form-label">
                    Ürün Listede Gösterilsin mi?
                  </label>
                  <FormCheck type="switch" defaultChecked={product.vatIncluded} onChange={(e) => setProduct({ ...product, vatIncluded: e.target.checked })} ></FormCheck>
                </Col>
              </Row>
            </CardBody>
          </Card>
        }
        {
          eventKey === '2' && <Card>
            <CardHeader>
              <CardTitle as={'h4'}>Medya</CardTitle>
            </CardHeader>
            <CardBody>
              <DropzoneFormInput iconProps={{
                icon: 'bx:cloud-upload',
                height: 48,
                width: 48,
                className: 'mb-4 text-primary'
              }}
                text="Drop your images here, or click to browse"
                helpText={<span className="text-muted fs-13 ">(1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed )</span>}
                showPreview
                deleteData={(data) => {
                  const newFiles = [...product.productImageUrlList];
                  newFiles.splice(newFiles.indexOf(data), 1);
                  setProduct({
                    ...product,
                    productImageUrlList: newFiles
                  })
                  console.log(newFiles)
                }}
                onFileUpload={(e) => {
                  setProduct(prev => ({
                    ...prev,
                    productImageUrlList: e
                  }))

                }}
              />
            </CardBody>
          </Card>
        }
        {
          eventKey === '3' && <Card>
            <CardHeader>
              <CardTitle as={'h4'}>Product Detail</CardTitle>
            </CardHeader>
            <CardBody>

              <Row>
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea className="form-control bg-light-subtle" id="description" rows={7} placeholder="Description about the product" defaultValue={product.productDescription} onChange={(e) => {
                      setProduct({ ...product, productDescription: e.target.value })
                      setChangedData({ ...changedData, productDescription: e.target.value })
                    }} />
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Short Description
                    </label>
                    <textarea className="form-control bg-light-subtle" id="description" rows={4} placeholder="Short description about the product" defaultValue={product.productShortDescription} onChange={(e) => {
                      setProduct({ ...product, productShortDescription: e.target.value })
                      setChangedData({ ...changedData, productShortDescription: e.target.value })
                    }} />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        }
        {
          eventKey === '4' && <Card>
            <CardHeader>
              <CardTitle as={'h4'}>Kargo</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={6}>

                  <div className="mb-3">
                    <label htmlFor="product-brand" className="form-label">
                      Sabit Kargo Ücreti (₺)
                    </label>
                    <input type="text" id="product-brand" className="form-control" placeholder="" defaultValue={product.fixedShippingPrice} onChange={(e) => {
                      setProduct({ ...product, fixedShippingPrice: e.target.value })
                      setChangedData({ ...changedData, fixedShippingPrice: e.target.value })
                    }} />
                  </div>

                </Col>
                <Col lg={6}>

                  <label htmlFor="product-deleted" className="form-label">
                    Ücretsiz Kargo
                  </label>
                  <FormCheck type="switch" defaultChecked={product.freeShipping} onChange={(e) => {
                    setProduct({ ...product, freeShipping: e.target.checked })
                    setChangedData({ ...changedData, freeShipping: e.target.checked })
                  }} ></FormCheck>

                </Col>
              </Row>
              <Row>
                <Col lg={6}>

                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Desi 1
                    </label>
                    <input type="text" id="product-name" className="form-control" defaultValue={product.desi1} onChange={(e) => {
                      setProduct({ ...product, desi1: e.target.value })
                      setChangedData({ ...changedData, desi2: e.target.value })
                    }} />
                  </div>

                </Col>
                <Col lg={6}>

                  <div className="mb-3">
                    <label htmlFor="product-brand" className="form-label">
                      Desi 2
                    </label>
                    <input type="text" id="product-brand" className="form-control" defaultValue={product.desi2} onChange={(e) => {
                      setProduct({ ...product, desi2: e.target.value })
                      setChangedData({ ...changedData, desi2: e.target.value })
                    }} />
                  </div>

                </Col>
              </Row>

            </CardBody>

          </Card>
        }
        {
          eventKey === '5' && <Card>
            <CardHeader>
              <CardTitle as={'h4'}>Product Detail</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Tahmini Teslim Süresi Göster
                    </label>
                    <FormCheck type="switch"  ></FormCheck>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Tüm Varyasyon Tahmini Teslim
                    </label>
                    <FormCheck type="switch"  ></FormCheck>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Vitrinde Göster
                    </label>
                    <FormCheck type="switch"  ></FormCheck>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Fırsat Ürünü
                    </label>
                    <FormCheck type="switch"  ></FormCheck>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Yeni Ürün Logosu
                    </label>
                    <FormCheck type="switch"  ></FormCheck>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Kapıda Ödeme Yasaklı Ürün
                    </label>
                    <FormCheck type="switch"  ></FormCheck>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      İade Yasaklı Ürün
                    </label>
                    <FormCheck type="switch"  ></FormCheck>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        }
        {
          eventKey === '6' && <Card>
            <CardHeader>
              <CardTitle as={'h4'}>Arama Motoru Bilgileri</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      Google Kelime Öneri Aracı
                    </label>
                    <FormCheck type="switch"  ></FormCheck>
                  </div>
                </Col>

              </Row>
              <Row>
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      SEO Title
                    </label>
                    <textarea maxLength={255} className="form-control bg-light-subtle"></textarea>
                  </div>
                </Col>

              </Row>
              <Row>
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      SEO Keywords
                    </label>
                    <textarea maxLength={255} className="form-control bg-light-subtle"></textarea>
                  </div>
                </Col>

              </Row>
              <Row>
                <Col lg={12}>
                  <div className="mb-3">
                    <label htmlFor="product-name" className="form-label">
                      SEO Description
                    </label>
                    <textarea maxLength={320} className="form-control bg-light-subtle"></textarea>
                  </div>
                </Col>

              </Row>
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <label className="form-label">SEO No Index</label>
                    <FormSelect >
                      <option value="index">Index</option>
                    </FormSelect>
                  </div>

                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <label className="form-label">SEO No Follow</label>
                    <FormSelect >
                      <option value="follow">Follow</option>
                    </FormSelect>
                  </div>

                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <label className="form-label">Örnek google Görüntüsü</label>
                    <a href='#' className='ms-5'>Link</a>
                  </div>

                </Col>
              </Row>
            </CardBody>
          </Card>
        }
        {
          eventKey === '7' && <Card>
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle as={'h4'}>Custom Fields</CardTitle>
                <Button variant="primary" size="sm" onClick={toggleCustomFieldModal}>
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Yeni Custom Field Ekle
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {customFields && customFields.length > 0 ? (
                <Row>
                  {customFields.map((field, idx) => {
                    if (!field || !field.uuid) return null;
                    return (
                      <Col lg={6} key={field.uuid || `field-${idx}`}>
                        <div className="mb-3">
                          <label htmlFor={`custom-field-${field.uuid}`} className="form-label">
                            {field.label || field.name || 'Unnamed Field'}
                            {field.isRequired && <span className="text-danger ms-1">*</span>}
                          </label>
                          {renderCustomFieldInput(field)}
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <div className="text-center text-muted py-4">
                  <p>Henüz custom field tanımlanmamış</p>
                  <Button variant="outline-primary" onClick={toggleCustomFieldModal}>
                    İlk Custom Field&apos;ı Oluştur
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        }
      </form>
    </Col>
    
    {/* Custom Field Add Modal */}
    <Modal 
      className="fade"
      show={isCustomFieldModalOpen} 
      onHide={() => {
        resetCustomFieldForm();
        setCustomFieldType('text');
        setCustomFieldRequired('no');
        toggleCustomFieldModal();
      }} 
      size="lg"
    >
      <form onSubmit={handleCustomFieldSubmit(handleCreateCustomField)}>
        <ModalHeader onHide={toggleCustomFieldModal} closeButton>
          <ModalTitle as="h5">Yeni Custom Field Ekle</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput 
                  control={customFieldControl} 
                  type="text" 
                  name="name" 
                  label="Field Name" 
                  placeholder="Field Name giriniz" 
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput 
                  control={customFieldControl} 
                  type="text" 
                  name="label" 
                  label="Display Label" 
                  placeholder="Display Label giriniz" 
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="customFieldType" className="form-label">
                  Field Type
                </label>
                <ChoicesFormInput 
                  className="form-control" 
                  id="customFieldType" 
                  data-choices 
                  data-choices-groups 
                  data-placeholder="Field Type seçiniz"
                  onChange={(val) => setCustomFieldType(val)}
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
                <label htmlFor="customFieldRequired" className="form-label">
                  Required
                </label>
                <ChoicesFormInput 
                  className="form-control" 
                  id="customFieldRequired" 
                  data-choices 
                  data-choices-groups 
                  data-placeholder="Seçiniz"
                  onChange={(val) => setCustomFieldRequired(val)}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </ChoicesFormInput>
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput 
                  control={customFieldControl} 
                  type="text" 
                  name="placeholder" 
                  label="Placeholder Text" 
                  placeholder="Placeholder Text giriniz" 
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput 
                  control={customFieldControl} 
                  type="text" 
                  name="defaultValue" 
                  label="Default Value" 
                  placeholder="Default Value giriniz" 
                />
              </div>
            </Col>
            {(customFieldType === 'select' || customFieldType === 'checkbox') && (
              <Col lg={12}>
                <div className="mb-3">
                  <TextFormInput 
                    control={customFieldControl} 
                    type="text" 
                    name="options" 
                    label="Options (virgülle ayrılmış)" 
                    placeholder="Option 1, Option 2, Option 3" 
                  />
                </div>
              </Col>
            )}
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="secondary" 
            onClick={() => {
              resetCustomFieldForm();
              setCustomFieldType('text');
              setCustomFieldRequired('no');
              toggleCustomFieldModal();
            }}
          >
            İptal
          </Button>
          <Button variant="primary" type="submit" disabled={customFieldLoading}>
            {customFieldLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Kaydediliyor...
              </>
            ) : (
              'Kaydet'
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  </Row>;
};
export default AddProduct;