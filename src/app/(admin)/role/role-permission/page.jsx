'use client'
import PageTItle from '@/components/PageTItle';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, FormCheck, FormSelect, Row } from 'react-bootstrap';

const RolePermission = () => {
    const session = localStorage.getItem('session_token');
    const [modules, setModules] = useState([])
    const [roles, setRoles] = useState([])
    const [selectedRole, setSelectedRole] = useState("");
    // permission/add ve user/role-permission a istek atacaksın
    useEffect(() => {
        fetch('http://api-dev.aykutcandan.com/user/module/get-all',
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`
                }
            }
        )
            .then((res) => res.json())
            .then((res) => setModules(res.data))
            .catch((err) => console.log(err))

        fetch('http://api-dev.aykutcandan.com/user/role/get-all',
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`
                }
            }
        )
            .then((res) => res.json())
            .then((res) => setRoles(res.data))
            .catch((err) => console.log(err))
    }, [])

    const handleCheck = (type, permission, checked) => {
        const permissionObj = {
            'moduleUUID': `${permission?.uuid}`,
            'action': `${type}`
        }
        fetch('http://api-dev.aykutcandan.com/user/permission/add',
            {
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(permissionObj)
            }
        )
            .then((res) => res.json())
            .then((res) => {
                const userPermissionObj = {
                    'permissionsUUID': `${res.data?.uuid}`,
                    'roleUUID': `${selectedRole}`,
                    'allow': checked
                }
                fetch('http://api-dev.aykutcandan.com/user/role-permission/add',
                    {
                        headers: {
                            'Authorization': `Bearer ${decodeURIComponent(session)}`,
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify(userPermissionObj)
                    }
                )
            })

    }

    return <>
        <PageTItle title="ROLE PERMISSION" />
        <Row>
            <Col lg={12}>
                <Card>
                    <CardHeader>
                        <CardTitle as={'h4'}>Roles Permission</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col lg={6}>
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="roles-name" className="form-label">
                                            Roles Name
                                        </label>
                                        <FormSelect onChange={(e) => setSelectedRole(e)}>
                                            {
                                                roles.map((item, key) => {
                                                    return <option key={key} value={item.uuid}>{item.name}</option>
                                                })
                                            }
                                        </FormSelect>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <div className='d-flex w-100 justify-content-between'>
                                    <div className='d-flex flex-column justify-content-center '>
                                        <span>Modules</span>
                                        {
                                            modules.map((item, key) => {
                                                return <span key={key}>{item.name}</span>
                                            })
                                        }
                                    </div>
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <span>Read</span>
                                        {
                                            modules.map((item, key) => {
                                                return <FormCheck key={key} onChange={(e) => handleCheck("VIEW", item, e.target.checked)}></FormCheck>
                                            })
                                        }
                                    </div>
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <span>Create</span>
                                        {
                                            modules.map((item, key) => {
                                                return <FormCheck key={key} onChange={(e) => handleCheck("VIEW", item, e.target.checked)}></FormCheck>
                                            })
                                        }
                                    </div>
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <span>Edit</span>
                                        {
                                            modules.map((item, key) => {
                                                return <FormCheck key={key} onChange={(e) => handleCheck("VIEW", item, e.target.checked)}></FormCheck>
                                            })
                                        }
                                    </div>
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <span>Delete</span>
                                        {
                                            modules.map((item, key) => {
                                                return <FormCheck key={key} onChange={(e) => handleCheck("VIEW", item, e.target.checked)}></FormCheck>
                                            })
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </>;
};
export default RolePermission;