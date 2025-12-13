'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle, Row, Spinner, Col } from "react-bootstrap";
import { toast } from "react-toastify";

const toastify = ({ props, message }) =>
    toast(message, { ...props, hideProgressBar: true, theme: 'colored', icon: false });
const AttributeAdd = () => {
    const [data, setData] = useState({
        attributeName: null,
        attributeType: null
    });
    const router = useRouter()
    const session = localStorage.getItem('session_token');
    const params = useSearchParams()
    const [attributeId, setAttributeId] = useState(params.get('id'))
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (attributeId !== null) {
            setLoading(false);
            fetch('https://api-dev.aykutcandan.com/product/attributes-definitions/get/' + attributeId, {
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`
                }
            })
                .then((res) => res.json())
                .then((res) => {
                    setData(res.data)
                    setLoading(true);
                })
                .catch((err) => console.log(err))
        }
    }, [])

    const handleSaveAttribute = () => {

        const myObj = {
            'attributeName': data.attributeName,
            'attributeType': data.attributeType
        }

        if (attributeId === null) {
            fetch('https://api-dev.aykutcandan.com/product/attributes-definitions/add', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myObj)
            })
                .then((res) => res.json())
                .then((res) => {
                    toastify({
                        message: res?.message,
                        props: {
                            type: res?.success === true ? 'success' : 'error',

                        }
                    })
                    if (res.success === true) {
                        router.push('/attribute/attribute-list')
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            fetch('https://api-dev.aykutcandan.com/product/attributes-definitions/update/' + attributeId, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myObj)
            })
                .then((res) => res.json())
                .then((res) => {
                    toastify({
                        message: res?.message,
                        props: {
                            type: res?.success === true ? 'success' : 'error',

                        }
                    })
                    if (res.success === true) {
                        router.push('/attribute/attribute-list')
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    return <div>
        {loading === false ? <Spinner></Spinner> : <Row xl={12} lg={10}>
            <div className="p-3 mb-3 rounded">
                <Row className="justify-content-end g-2">
                    <Col lg={2}>
                        <Button
                            variant="primary"
                            type='submit'
                            size="md"
                            onClick={() => handleSaveAttribute()}
                        >
                            {attributeId === null ? 'Create' : 'Update'}
                        </Button>
                    </Col>
                </Row>
            </div>
            <Col>
                <Card>
                    <CardHeader>
                        <CardTitle>Attribute</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <label htmlFor="attribute-name" className="form-label">
                                        Attribute Name
                                    </label>
                                    <input type="text" name="name" label="Attribute Name" className="form-control" placeholder="Enter Attribute Name" defaultValue={data.attributeName} onChange={(e) => {
                                        setData({ ...data, attributeName: e.target.value })
                                    }} />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <label htmlFor="attribute-value" className="form-label">
                                        Attribute Type
                                    </label>
                                    <input type="text" name="name" label="Attribute Value" className="form-control" placeholder="Enter Attribute Type" defaultValue={data.attributeType} onChange={(e) => {
                                        setData({ ...data, attributeType: e.target.value })
                                    }} />
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>}
    </div>
}

export default AttributeAdd