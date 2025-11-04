'use client'
import DropzoneFormInput from '@/components/form/DropzoneFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Carousel, CarouselItem, Col, FormCheck, FormSelect, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import product1 from '@/assets/images/product/p-1.png';
import product10 from '@/assets/images/product/p-10.png';
import product13 from '@/assets/images/product/p-13.png';
import product14 from '@/assets/images/product/p-14.png';
import clsx from 'clsx';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
const toastify = ({ props, message }) =>
  toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });
const AddProduct = () => {


  const router = useRouter()
  const session = localStorage.getItem('session_token');
  const params = useSearchParams()
  const [productId, setProductId] = useState(params.get('id'))
  const [loading, setLoading] = useState(false);
  const [changedData, setChangedData] = useState();
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
    vatRate: null
  })

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
      "vatRate": Number(product.vatRate)
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
          console.log(res.data)
          toastify({
            message: res?.message,
            props: {
              type: res?.success === true ? 'success' : 'error',

            }
          })
          if (res.success === true) {
            router.push('/products/product-list')

          }
        })
        .catch((err) => console.log(err))
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
          toastify({
            message: res?.message,
            props: {
              type: res?.success === true ? 'success' : 'error',

            }
          })

        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

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
            vatRate: response.vatRate

          })
          setLoading(true)
        })
        .catch((err) => console.log(err))
    } else {
      setLoading(true)
    }
  }, [])
  const products = [product1, product10, product13, product14];
  const [activeIndex, setActiveIndex] = useState(0);
  const handleSelect = selectedIndex => {
    setActiveIndex(selectedIndex);
  };
  const handleThunkSelect = index => {
    setActiveIndex(index);
  };
  const [quantity, setQuantity] = useState(1);
  const increment = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };
  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    } else {
      setQuantity(1);
    }
  };
  return loading === true && <Row xl={12} lg={10}>
    <div className="p-3 mb-3 rounded">
      <Row className="justify-content-end g-2">
        <Col lg={2}>
          <Button
            variant="primary"
            size="md"
            onClick={() => handleSaveProduct()}
          >
            Create
          </Button>
        </Col>
      </Row>
    </div>
    {
      productId !== null && <Col xl={4}>
        <Card>
          <CardBody>
            <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
              <Carousel activeIndex={activeIndex} onSelect={handleSelect} indicators={false} className="carousel-inner" role="listbox">
                {product.productImageUrlList.map((item, idx) => <CarouselItem key={idx}>
                  <img src={item} alt="productImg" className="img-fluid bg-light rounded" />
                </CarouselItem>)}
              </Carousel>
              <div className="carousel-indicators m-0 mt-2 d-lg-flex d-none position-static h-100">
                {product.productImageUrlList.map((item, idx) => <button key={idx} type="button" onClick={() => handleThunkSelect(idx)} data-bs-target="#carouselExampleFade" data-bs-slide-to={0} aria-current="true" id="Slide-1" className={clsx('w-auto h-auto rounded bg-light', {
                  active: activeIndex === idx
                })}>
                  <img src={item} className="d-block avatar-xl" alt="swiper-indicator-img" />
                </button>)}
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    }
    <Col xl={productId !== null ? 8 : 12}>

      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>Product Information</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6}>
              <form>
                <div className="mb-3">
                  <label htmlFor="product-name" className="form-label">
                    Product Name
                  </label>
                  <input type="text" id="product-name" className="form-control" placeholder="Items Name" defaultValue={product.productName} onChange={(e) => {
                    setProduct({ ...product, productName: e.target.value })
                    setChangedData({ ...changedData, productName: e.target.value })

                  }} />
                </div>
              </form>
            </Col>
            <Col lg={6}>
              <form>
                <div className="mb-3">
                  <label htmlFor="product-id" className="form-label">
                    Product Sku
                  </label>
                  <input type="string" id="product-id" className="form-control" defaultValue={product.productSku} onChange={(e) => {
                    setProduct({ ...product, productSku: e.target.value })
                    setChangedData({ ...changedData, productSku: e.target.value })
                  }} />
                </div>
              </form>
            </Col>

          </Row>
          <Row>
            <Col lg={4}>
              <form>
                <div className="mb-3">
                  <label htmlFor="product-stock" className="form-label">
                    Stok
                  </label>
                  <input type="number" id="product-stock" className="form-control" placeholder="Quantity" defaultValue={product.totalStock} onChange={(e) => {
                    setProduct({ ...product, totalStock: e.target.value })
                    setChangedData({ ...changedData, totalStock: e.target.value })
                  }} />
                </div>
              </form>
            </Col>
            <Col lg={4}>
              <form >
                <label className="form-label">Para Birimi</label>
                <FormSelect >
                  <option value="tl">TL</option>
                  <option value="dollar">dolar</option>
                </FormSelect>
              </form>
            </Col>
            <Col lg={4}>
              <form >
                <label className="form-label">Satış Birimi</label>
                <FormSelect >
                  <option value="adet">Adet</option>
                </FormSelect>
              </form>
            </Col>
          </Row>
          <Row>
            <Col lg={4}>
              <form>
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
              </form>
            </Col>
            <Col lg={4}>
              <form>
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
              </form>
            </Col>
            <Col lg={4}>
              <form>
                <label htmlFor="product-discount" className="form-label">
                  Alış Fiyatı
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text fs-20">
                    <IconifyIcon icon="bxs:discount" />
                  </span>
                  <input type="number" id="product-discount" className="form-control" />
                </div>
              </form>
            </Col>
          </Row>
          <Row>
            <Col lg={4}>
              <form >
                <label className="form-label">KDV Dahil/Hariç</label>
                <FormSelect >
                  <option value="dahil">KDV Dahil</option>
                  <option value="haric">KDV Hariç</option>
                </FormSelect>
              </form>
            </Col>
            <Col lg={4}>
              <form >
                <label className="form-label">KDV Oranı (%)</label>
                <input type="number" id="product-discount" className="form-control" />
              </form>
            </Col>
            <Col lg={4}>
              <form>
                <label htmlFor="product-id" className="form-label">
                  Rate
                </label>
                <input type="number" id="product-id" className="form-control" defaultValue={product.vatRate} onChange={(e) => {
                  setProduct({ ...product, vatRate: e.target.value })
                  setChangedData({ ...changedData, vatRate: e.target.value })
                }} />
              </form>
            </Col>
          </Row>
          <Row className='mt-2'>
            <Col lg={2}>
              <form>
                <label htmlFor="product-active" className="form-label">
                  Active
                </label>
                <FormCheck type="switch" defaultChecked={product.isActive} onChange={(e) => {
                  setProduct({ ...product, isActive: e.target.checked })
                  setChangedData({ ...changedData, isActive: e.target.checked })
                }} ></FormCheck>
              </form>
            </Col>
            <Col lg={2}>
              <form>
                <label htmlFor="product-deleted" className="form-label">
                  Deleted
                </label>
                <FormCheck type="switch" defaultChecked={product.isDeleted} onChange={(e) => {
                  setProduct({ ...product, isDeleted: e.target.checked })
                  setChangedData({ ...changedData, isDeleted: e.target.checked })
                }} ></FormCheck>
              </form>
            </Col>
            <Col lg={8}>
              <form>
                <label htmlFor="product-deleted" className="form-label">
                  Ürün Listede Gösterilsin mi?
                </label>
                <FormCheck type="switch" defaultChecked={product.isActive} onChange={(e) => setProduct({ ...product, isActive: e.target.checked })} ></FormCheck>
              </form>
            </Col>

          </Row>


        </CardBody>
      </Card>
      <Card>
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
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>Product Detail</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6}>
              <form>
                <div className="mb-3">
                  <label htmlFor="product-name" className="form-label">
                    Brand
                  </label>
                  <input type="text" id="product-brand" className="form-control" placeholder="Brand Name" />
                </div>
              </form>
            </Col>
            <Col lg={6}>
              <form>
                <div className="mb-3">
                  <label htmlFor="product-barcode" className="form-label">
                    Barcode
                  </label>
                  <input type="text" id="product-barcode" className="form-control" placeholder="Barcode" defaultValue={product.productBarcode} onChange={(e) => {
                    setProduct({ ...product, productBarcode: e.target.value })
                    setChangedData({ ...changedData, productBarcode: e.target.value })
                  }} />
                </div>
              </form>
            </Col>
          </Row>
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
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>Kargo</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6}>
              <form>
                <div className="mb-3">
                  <label htmlFor="product-brand" className="form-label">
                    Sabit Kargo Ücreti (₺)
                  </label>
                  <input type="text" id="product-brand" className="form-control" placeholder="" />
                </div>
              </form>
            </Col>
            <Col lg={6}>
              <form>
                <label htmlFor="product-deleted" className="form-label">
                  Ücretsiz Kargo
                </label>
                <FormCheck type="switch"  ></FormCheck>
              </form>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <form>
                <div className="mb-3">
                  <label htmlFor="product-name" className="form-label">
                    Desi 1
                  </label>
                  <input type="text" id="product-name" className="form-control" />
                </div>
              </form>
            </Col>
            <Col lg={6}>
              <form>
                <div className="mb-3">
                  <label htmlFor="product-brand" className="form-label">
                    Desi 2
                  </label>
                  <input type="text" id="product-brand" className="form-control" />
                </div>
              </form>
            </Col>
          </Row>
        </CardBody>
      </Card>

    </Col>

  </Row>;
};
export default AddProduct;