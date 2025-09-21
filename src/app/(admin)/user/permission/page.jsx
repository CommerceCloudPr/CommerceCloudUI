'use client'
import PageTItle from '@/components/PageTItle';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, FormCheck, FormSelect, Row, Spinner } from 'react-bootstrap';

const UserPermission = () => {
    const session = localStorage.getItem('session_token');
    const [modules, setModules] = useState([])
    const [roles, setRoles] = useState([])
    const [name, setName] = useState('')
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState("")
    const [userPermissionList, setUserPermissionList] = useState([])
    const [deleteId, setDeleteId] = useState("");
    const [modelLoading, setModelLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
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
            .then((res) => {
                function sortPermissionsByAction(modules) {
                    const order = ["READ", "CREATE", "UPDATE", "DELETE"];

                    return modules.map(module => {
                        const sortedPermissions = [...module.permissions].sort((a, b) => {
                            return order.indexOf(a.action) - order.indexOf(b.action);
                        });

                        return {
                            ...module,
                            permissions: sortedPermissions
                        };
                    });
                }
                setModules(sortPermissionsByAction(res.data))
                setModelLoading(true)
            })
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
                getUserPermissionList(res.data[0]?.uuid)
                setUserLoading(true);
            })
            .catch((err) => console.log(err))
    }, [])


    const handleCheck = (value, action) => {
        const userPermissionObj = {
            'permissionsUUID': `${action.uuid}`,
            'userUUID': `${selectedUser}`,
            'allow': true
        }
        if (value === true) {
            fetch(`http://api-dev.aykutcandan.com/user/user-permission/add`,
                {
                    headers: {
                        'Authorization': `Bearer ${decodeURIComponent(session)}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(userPermissionObj)
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    console.log(res.data)
                    getUserPermissionList(selectedUser)
                })
        } else {
            fetch(`http://api-dev.aykutcandan.com/user/user-permission/get/permissionUUID/${action.uuid}`,
                {
                    headers: {
                        'Authorization': `Bearer ${decodeURIComponent(session)}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'GET'
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    fetch(`http://api-dev.aykutcandan.com/user/user-permission/delete/${res.data[0].uuid}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${decodeURIComponent(session)}`,
                                'Content-Type': 'application/json'
                            },
                            method: 'DELETE',
                        }
                    )
                        .then((res) => res.json())
                        .then((res) => {
                            console.log(res.data)
                            getUserPermissionList(selectedUser)
                        })
                })
                .catch((err) => console.log(err))

        }


    }

    const getUserPermissionList = (user) => {
        let x = [];
        fetch(`http://api-dev.aykutcandan.com/user/user-permission/get/userUUID/${user}`,
            {
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`,
                },
                method: 'GET',
            }
        )
            .then((res) => res.json())
            .then((res) => {
                res.data.map((item) => {
                    if (item.permissionsUUID) {
                        x.push(item.permissionsUUID)
                    }
                })
                console.log(x)
                setUserPermissionList(x)
            })
            .catch((err) => console.log(err))
    }

    return (userLoading === false || modelLoading === false) ? <Spinner /> : <>
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
                                        <FormSelect onChange={(e) => {
                                            setSelectedUser(e.target.value);
                                            getUserPermissionList(e.target.value)
                                        }}>
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
                                <table cellPadding="5">
                                    <thead>
                                        <tr>
                                            <th>Permission</th>
                                            <th>Read</th>
                                            <th>Create</th>
                                            <th>Update</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modules.map((item, moduleKey) => (
                                            <tr key={moduleKey}>
                                                <td>{item.name}</td>
                                                {item.permissions.map((action) => {
                                                    return action.moduleUUID === item.uuid && <td key={action}>
                                                        <FormCheck
                                                            type="checkbox"
                                                            onChange={(e) => {
                                                                console.log(item)
                                                                console.log(action)
                                                                handleCheck(e.target.checked, action)
                                                            }}
                                                            checked={userPermissionList.includes(action.uuid)}
                                                        />
                                                    </td>
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* <div className='d-flex w-100 justify-content-between'>
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
                                                return <FormCheck key={key} defaultChecked={item.permissions} onChange={(e) => handleCheck("READ", item, e.target.checked)}></FormCheck>
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
                                </div> */}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </>;
};
export default UserPermission;