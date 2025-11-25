'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import { Button, Col, Container, FormCheck, FormControl, Row } from "react-bootstrap"

const BrandAdd = () => {

    const session = localStorage.getItem('session_token');
    const params = useSearchParams();
    const [brandId, setBrandId] = useState(params.get('uuid'))
    const [brand, setBrand] = useState({
        brandName: null,
        brandCode: null,
        brandDescription: null,
        brandLogoUrl: null,
        isActive: true
    })

    useEffect(() => {
        if (brandId !== null) {
            fetch('https://api-dev.aykutcandan.com/product/brand/get/' + brandId,
                {

                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${decodeURIComponent(session)}`,
                    },
                }
            )
                .then((res) => res.json())
                .then((res) => setBrand(res.data))
                .catch((err) => console.log(err))
        }
    }, [])

    const handleSaveBrand = () => {

        const myObj = {
            "brandName": brand.brandName,
            "brandCode": brand.brandCode,
            "brandDescription": brand.brandDescription,
            "brandLogoUrl": brand.brandLogoUrl,
            "isActive": brand.isActive
        }
        if (brandId === null) {
            fetch('https://api-dev.aykutcandan.com/product/brand/add',
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
        } else {
            fetch('https://api-dev.aykutcandan.com/product/brand/update/' + brandId,
                {

                    method: "PUT",
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

    }

    return <Container>
        <div className='d-flex justify-content-end w-100'>
            <Button variant="primary" size="sm" className="d-flex justify-content-end" onClick={() => handleSaveBrand()}>Save</Button>
        </div>
        <Row className="p-4">

            <Col xl={5}>
                <div className="d-flex flex-column justify-content-start gap-4">
                    <div className="d-flex flex-column justify-content-start gap-1">
                        <label className="fs-6">Brand Name</label>
                        <FormControl defaultValue={brand.brandName} onChange={(e) => {
                            setBrand({ ...brand, brandName: e.target.value })
                        }} size="sm"></FormControl>
                    </div>
                    <div className="d-flex flex-column justify-content-start gap-1">
                        <label className="fs-6">Brand Code</label>
                        <FormControl defaultValue={brand.brandCode} onChange={(e) => {
                            setBrand({ ...brand, brandCode: e.target.value })
                        }} size="sm"></FormControl>
                    </div>
                    <div className="d-flex flex-column justify-content-start gap-1">
                        <label className="fs-6">Brand Description</label>
                        <FormControl defaultValue={brand.brandDescription} as={"textarea"} onChange={(e) => {
                            setBrand({ ...brand, brandDescription: e.target.value })
                        }} size="sm"></FormControl>
                    </div>
                    <div className="d-flex flex-column justify-content-start gap-1">
                        <label className="fs-6">Brand Logo Url</label>
                        <FormControl defaultValue={brand.brandLogoUrl} onChange={(e) => {
                            setBrand({ ...brand, brandLogoUrl: e.target.value })
                        }} size="sm"></FormControl>
                    </div>
                    <div className="d-flex flex-column justify-content-start gap-1">
                        <label className="fs-6">Active</label>
                        <FormCheck onChange={(e) => {
                            setBrand({ ...brand, isActive: e.target.checked })
                        }} defaultChecked={brand.isActive} checked={brand.isActive} type="switch"></FormCheck>
                    </div>
                </div>
            </Col>

        </Row>
    </Container>
}

export default BrandAdd
