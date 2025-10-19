'use client'
import DropzoneFormInput from '@/components/form/DropzoneFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import React, {  useState } from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormCheck, Row } from 'react-bootstrap';
const AddProduct = () => {

  const session = localStorage.getItem('session_token');

  const [product, setProduct] = useState({
    productName: "string",
    productSku: "string",
    originalPrice: 0,
    sellPrice: 0,
    productDescription: "string",
    productShortDescription: "string",
    totalStock: 1073741824,
    productBarcode: "string",
    productImageUrlList: [],
    isActive: true,
    isDeleted: false,
    vatRate: 0.1
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
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err))
  }


  return <Col xl={12} lg={10}>
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
                <input type="text" id="product-name" className="form-control" placeholder="Items Name" defaultValue={product.productName} onChange={(e) => setProduct({ ...product, productName: e.target.value })} />
              </div>
            </form>
          </Col>
          <Col lg={4}>
            <form>
              <div className="mb-3">
                <label htmlFor="product-brand" className="form-label">
                  Barcode
                </label>
                <input type="text" id="product-brand" className="form-control" placeholder="Brand Name" defaultValue={product.productBarcode}  onChange={(e) => setProduct({ ...product, productBarcode: e.target.value })} />
              </div>
            </form>
          </Col>
          {/* <Col lg={6}>
            <form>
              <label htmlFor="product-categories" className="form-label">
                Product Categories
              </label>
              <select className="form-control" id="product-categories" data-choices data-choices-groups data-placeholder="Select Categories" name="choices-single-groups">
                <option>Choose a categories</option>
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Footwear">Footwear</option>
                <option value="Sportswear">Sportswear</option>
                <option value="Watches">Watches</option>
                <option value="Furniture">Furniture</option>
                <option value="Appliances">Appliances</option>
                <option value="Headphones">Headphones</option>
                <option value="Other Accessories">Other Accessories</option>
              </select>
            </form>
          </Col> */}
        </Row>
        <Row>

          <Col lg={2}>
            <form>
              <div className="mb-3">
                <label htmlFor="product-active" className="form-label">
                  Active
                </label>
                <FormCheck type="switch" defaultChecked={product.isActive} onChange={(e) => setProduct({ ...product, isActive: e.target.checked })} ></FormCheck>
              </div>
            </form>
          </Col>
          <Col lg={2}>
            <form>
              <div className="mb-3">
                <label htmlFor="product-deleted" className="form-label">
                  Deleted
                </label>
                <FormCheck type="switch" defaultChecked={product.isDeleted}  onChange={(e) => setProduct({ ...product, isDeleted: e.target.checked })} ></FormCheck>
              </div>
            </form>
          </Col>
          <Col lg={4}>
            <form>
              <div className="mb-3">
                <label htmlFor="product-id" className="form-label">
                  Rate
                </label>
                <input type="number" id="product-id" className="form-control" defaultValue={product.vatRate} onChange={(e) => setProduct({ ...product, vatRate: e.target.value })} />
              </div>
            </form>
          </Col>
          {/* <Col lg={4}>
              <form>
                <div className="mb-3">
                  <label htmlFor="product-weight" className="form-label">
                    Weight
                  </label>
                  <input type="text" id="product-weight" className="form-control" placeholder="In gm & kg" />
                </div>
              </form>
            </Col>
            <Col lg={4}>
              <form>
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <select className="form-control" id="gender" data-choices data-choices-groups data-placeholder="Select Gender">
                  <option>Select Gender</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Other">Other</option>
                </select>
              </form>
            </Col> */}
        </Row>
        {/* <Row className="mb-4">
            <Col lg={4}>
              <div className="mt-3">
                <h5 className="text-dark fw-medium">Size :</h5>
                <div className="d-flex flex-wrap gap-2" role="group" aria-label="Basic checkbox toggle button group">
                  <input type="checkbox" className="btn-check" id="size-xs1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="size-xs1">
                    XS
                  </label>
                  <input type="checkbox" className="btn-check" id="size-s1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="size-s1">
                    S
                  </label>
                  <input type="checkbox" className="btn-check" id="size-m1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="size-m1">
                    M
                  </label>
                  <input type="checkbox" className="btn-check" id="size-xl1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="size-xl1">
                    Xl
                  </label>
                  <input type="checkbox" className="btn-check" id="size-xxl1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="size-xxl1">
                    XXL
                  </label>
                  <input type="checkbox" className="btn-check" id="size-3xl1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="size-3xl1">
                    3XL
                  </label>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              <div className="mt-3">
                <h5 className="text-dark fw-medium">Colors :</h5>
                <div className="d-flex flex-wrap gap-2" role="group" aria-label="Basic checkbox toggle button group">
                  <input type="checkbox" className="btn-check" id="color-dark1" defaultChecked />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-dark1">
                    {' '}
                    <span>
                      {' '}
                      <IconifyIcon icon="bxs:circle" className="fs-18 text-dark" />
                    </span>
                  </label>
                  <input type="checkbox" className="btn-check" id="color-yellow1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-yellow1">
                    {' '}
                    <span>
                      {' '}
                      <IconifyIcon icon="bxs:circle" className="fs-18 text-warning" />
                    </span>
                  </label>
                  <input type="checkbox" className="btn-check" id="color-white1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-white1">
                    {' '}
                    <span>
                      {' '}
                      <IconifyIcon icon="bxs:circle" className="fs-18 text-white" />
                    </span>
                  </label>
                  <input type="checkbox" className="btn-check" id="color-red1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-red1">
                    {' '}
                    <span>
                      {' '}
                      <IconifyIcon icon="bxs:circle" className="fs-18 text-primary" />
                    </span>
                  </label>
                  <input type="checkbox" className="btn-check" id="color-green1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-green1">
                    {' '}
                    <span>
                      {' '}
                      <IconifyIcon icon="bxs:circle" className="fs-18 text-success" />
                    </span>
                  </label>
                  <input type="checkbox" className="btn-check" id="color-blue1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-blue1">
                    {' '}
                    <span>
                      {' '}
                      <IconifyIcon icon="bxs:circle" className="fs-18 text-danger" />
                    </span>
                  </label>
                  <input type="checkbox" className="btn-check" id="color-sky1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-sky1">
                    {' '}
                    <span>
                      {' '}
                      <IconifyIcon icon="bxs:circle" className="fs-18 text-info" />
                    </span>
                  </label>
                  <input type="checkbox" className="btn-check" id="color-gray1" />
                  <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-gray1">
                    {' '}
                    <span>
                      {' '}
                      <IconifyIcon icon="bxs:circle" className="fs-18 text-secondary" />
                    </span>
                  </label>
                </div>
              </div>
            </Col>
          </Row> */}
        <Row>
          <Col lg={12}>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea className="form-control bg-light-subtle" id="description" rows={7} placeholder="Description about the product" defaultValue={product.productDescription}  onChange={(e) => setProduct({ ...product, productDescription: e.target.value })} />
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Short Description
              </label>
              <textarea className="form-control bg-light-subtle" id="description" rows={4} placeholder="Short description about the product" defaultValue={product.productShortDescription} onChange={(e) => setProduct({ ...product, productShortDescription: e.target.value })} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={4}>
            <form>
              <div className="mb-3">
                <label htmlFor="product-id" className="form-label">
                  Product Sku
                </label>
                <input type="string" id="product-id" className="form-control" defaultValue={product.productSku} onChange={(e) => setProduct({ ...product, productSku: e.target.value })} />
              </div>
            </form>
          </Col>
          <Col lg={4}>
            <form>
              <div className="mb-3">
                <label htmlFor="product-stock" className="form-label">
                  Stock
                </label>
                <input type="number" id="product-stock" className="form-control" placeholder="Quantity" defaultValue={product.totalStock} onChange={(e) => setProduct({ ...product, totalStock: e.target.value })}  />
              </div>
            </form>
          </Col>
          {/* <Col lg={4}>
            <label htmlFor="product-stock" className="form-label">
              Tag
            </label>
            <ChoicesFormInput defaultValue="Fashion" className="form-control" data-choices data-choices-removeitem options={{
              removeItemButton: true
            }}>
              <option value="Fashion">Fashion</option>
              <option value="Electronics">Electronics</option>
              <option value="Watches">Watches</option>
              <option value="Headphones">Headphones</option>
            </ChoicesFormInput>
          </Col> */}
        </Row>
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle as={'h4'}>Pricing Details</CardTitle>
      </CardHeader>
      <CardBody>
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
                <input type="number" id="product-price" className="form-control" defaultValue={product.originalPrice} onChange={(e) => setProduct({ ...product, originalPrice: e.target.value })} />
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
                <input type="number" id="product-discount" className="form-control" defaultValue={product.sellPrice} onChange={(e) => setProduct({ ...product, sellPrice: e.target.value })} />
              </div>
            </form>
          </Col>
          {/* <Col lg={4}>
            <form>
              <label htmlFor="product-tex" className="form-label">
                Tex
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text fs-20">
                  <IconifyIcon icon="bxs:file-txt" />
                </span>
                <input type="number" id="product-tex" className="form-control" placeholder="000" defaultValue={'000'} />
              </div>
            </form>
          </Col> */}
        </Row>
      </CardBody>
    </Card>

  </Col>;
};
export default AddProduct;