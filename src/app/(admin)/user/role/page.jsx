'use client'
import PageTItle from '@/components/PageTItle';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, FormSelect, Row } from 'react-bootstrap';

const UserRole = () => {
    const session = localStorage.getItem('session_token');
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    useEffect(() => {
        fetch('http://api-dev.aykutcandan.com/user/role/get-all',
            {
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`,
                },
                method: 'GET',
            }
        )
            .then((res) => res.json())
            .then((res) => setRoles(res.data))

        fetch('http://api-dev.aykutcandan.com/user/info/get-all',
            {
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`,
                },
                method: 'GET',
            }
        )
            .then((res) => res.json())
            .then((res) => setUsers(res.data))
    }, [])

    return <>
        <PageTItle title="USER ROLE" />
        <Row>
            <Col lg={12}>
                <Card>
                    <CardHeader>
                        <CardTitle as={'h4'}>User Role</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <label htmlFor="roles-name" className="form-label">
                                        Role
                                    </label>
                                    <FormSelect onChange={(e) => setSelectedRole(e.target.value)}>
                                        {
                                            roles.map((item, key) => <option key={key} value={item.uuid}>{item.name}</option>)
                                        }
                                    </FormSelect>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <label htmlFor="user" className="form-label">
                                        User
                                    </label>
                                    <FormSelect onChange={(e) => {
                                        console.log(e.target.value)
                                        setSelectedUser(e.target.value)
                                    }}>
                                        {
                                            users.map((item, key) => <option key={key} value={item.uuid}>{item.username}</option>)
                                        }
                                    </FormSelect>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter className="border-top">
                        <Button variant={'primary'} className='primary-ff6c2fc' color='#ff6c2fc' type="button" key={0} onClick={() => {
                            const obj = {
                                'userUUID': `${selectedUser}`,
                                'roleUUID': `${selectedRole}`
                            }
                            fetch('http://api-dev.aykutcandan.com/user/user-role/add',
                                {
                                    headers: {
                                        'Authorization': `Bearer ${decodeURIComponent(session)}`,
                                        'Content-Type': 'application/json'
                                    },
                                    method: 'POST',
                                    body: JSON.stringify(obj)
                                }
                            )
                        }}>
                            Create
                        </Button>
                    </CardFooter>
                </Card>
            </Col>
        </Row>
    </>;
}

export default UserRole