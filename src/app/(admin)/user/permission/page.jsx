'use client'
import PageTItle from '@/components/PageTItle';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, FormCheck, FormSelect, Row } from 'react-bootstrap';

const UserPermission = () => {
    const session = localStorage.getItem('session_token');
    const [modules, setModules] = useState([])
    const [roles, setRoles] = useState([])
    const [name, setName] = useState('')
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState("")
    const [selectedPermission, setSelectedPermission] = useState("")

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

        fetch('http://api-dev.aykutcandan.com/user/info/get-all',
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`
                }
            }
        )
            .then((res) => res.json())
            .then((res) => {
                setUsers(res.data)
                setSelectedUser(res.data[0]?.uuid)
            })
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
                    'userUUID': `${selectedUser}`,
                    'allow': checked
                }
                fetch('http://api-dev.aykutcandan.com/user/user-permission/add',
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
        <PageTItle title="USER PERMISSION" />
        <Row>
            <Col lg={12}>
                <Card>
                    <CardHeader>
                        <CardTitle as={'h4'}>USER PERMISSION</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col lg={6}>
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="roles-name" className="form-label">
                                            Users
                                        </label>
                                        <FormSelect onChange={(e) => console.log(e)}>
                                            {
                                                users.map((item, key) => {
                                                    return <option value={item.uuid}>{item.username}</option>
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
                                        <span>Permission</span>
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
                                                return <FormCheck key={key} onChange={(e) => handleCheck("CREATE", item, e.target.checked)}></FormCheck>
                                            })
                                        }
                                    </div>
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <span>Edit</span>
                                        {
                                            modules.map((item, key) => {
                                                return <FormCheck key={key} onChange={(e) => handleCheck("UPDATE", item, e.target.checked)}></FormCheck>
                                            })
                                        }
                                    </div>
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <span>Delete</span>
                                        {
                                            modules.map((item, key) => {
                                                return <FormCheck key={key} onChange={(e) => handleCheck("DELETE", item, e.target.checked)}></FormCheck>
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
export default UserPermission;