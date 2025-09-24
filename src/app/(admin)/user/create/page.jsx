'use client'
import { useForm } from "react-hook-form";
import TextAreaFormInput from "../../../../components/form/TextAreaFormInput"
import { Button, Col, Container, FormCheck, FormControl, FormSelect, Row, Spinner } from "react-bootstrap"
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
const toastify = ({
    props,
    message
}) => {
    toast(message, {
        ...props,
        hideProgressBar: true,
        theme: 'colored',
        icon: false
    });
};

const UserCreate = () => {
    const router = useRouter()
    const params = useSearchParams()
    const session = localStorage.getItem('session_token');
    const [userId, setUserId] = useState(params.get('uuid'))

    console.log(userId)
    const [loadingUser, setLoadingUser] = useState(false);
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        emailPermission: true,
        smsPermission: true,
        phoneNumber: '',
        birthDate: '',
        gender: '',
        bio: '',
        status: true
    })

    useEffect(()=>{
        console.log(userId,"changed")
    },[userId])
    useEffect(() => {
        if (userId !== null) {
            fetch('http://api-dev.aykutcandan.com/user/info/get/' + userId,
                {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${decodeURIComponent(session)}`
                    }
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    console.log(res.data)
                    setUser({
                        ...user,
                        firstName: res.data.firstName,
                        lastName: res.data.lastName,
                        username: res.data.username,
                        email: res.data.email,
                        smsPermission: res.data.smsPermission,
                        emailPermission: res.data.emailPermission,
                        status: res.data.enabled,
                    })
                    setLoadingUser(true)
                    fetch('http://api-dev.aykutcandan.com/user/detail/username/' + res.data.username,
                        {
                            method: "GET",
                            headers: {
                                'Authorization': `Bearer ${decodeURIComponent(session)}`
                            }
                        }
                    )
                        .then((res1) => res1?.json())
                        .then((res1) => {
                            console.log(res.data.uuid)
                            setUserId(res1.data.uuid)
                            setUser({
                                ...user,
                                bio: res1.data?.bio,
                                gender: res1.data?.gender,
                                birthDate: res1.data?.birthDate,
                                phoneNumber: res1.data?.phoneNumber,
                            })

                        })



                })
        } else {
            setLoadingUser(true)
        }

    }, [])

    const handleSaveUser = () => {
        if (userId !== null) {
            const dataObj = {
                'phoneNumber': user.phoneNumber,
                'birthDate': user.birthDate,
                'gender': user.gender,
                'bio': user.bio,
            }
            fetch('http://api-dev.aykutcandan.com/user/detail/update/' + userId,
                {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${decodeURIComponent(session)}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataObj)
                }
            )
                .then((res) => res.json())
                .then((res) => console.log(res.data))
                .catch((err) => console.log(err))
        } else {
            const obj1 = {
                "firstName": user.firstName,
                "lastName": user.lastName,
                "username": user.username,
                "email": user.email,
                "password": user.password,
                "sms_permission": user.smsPermission,
                "email_permission": user.emailPermission,
                "agreement_accepted": true
            }

            fetch('http://api-dev.aykutcandan.com/user/info/register',
                {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${decodeURIComponent(session)}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(obj1)
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === 200) {

                    }
                    const dataObj = {
                        'phoneNumber': user.phoneNumber,
                        'birthDate': user.birthDate,
                        'gender': user.gender,
                        'bio': user.bio,
                        'userUUID': res.data.uuid
                    }
                    fetch('http://api-dev.aykutcandan.com/user/detail/add',
                        {
                            method: "POST",
                            headers: {
                                'Authorization': `Bearer ${decodeURIComponent(session)}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(dataObj)
                        }
                    )
                        .then((res1) => res1.json())
                        .then((res1) => console.log(res1.data))
                        .catch((err) => console.log(err))
                })
                .catch((err) => console.log(err))


        }

    }

    return <>
        {
            loadingUser === false ? <Spinner></Spinner> : <div className="d-flex flex-column jsutify-content-start">
                <Container>
                    <div className='d-flex justify-content-end w-100'>
                        <Button variant="primary" size="sm" className="d-flex justify-content-end" onClick={() => handleSaveUser()}>Save</Button>
                    </div>
                    <Row>
                        <Col xl={5}>
                            <div className="d-flex flex-column justify-content-start gap-4">
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">First Name</label>
                                    <FormControl onChange={(e) => {
                                        setUser({ ...user, firstName: e.target.value })
                                    }} defaultValue={user.firstName} type="text" size="sm"></FormControl>
                                </div>
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">Last Name</label>
                                    <FormControl onChange={(e) => {
                                        setUser({ ...user, lastName: e.target.value })
                                    }} defaultValue={user.lastName} type="text" size="sm"></FormControl>
                                </div>
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">Username</label>
                                    <FormControl onChange={(e) => setUser({ ...user, username: e.target.value })} defaultValue={user.username} type="text" size="sm"></FormControl>
                                </div>
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">Email Address</label>
                                    <FormControl onChange={(e) => setUser({ ...user, email: e.target.value })} defaultValue={user.email} type="text" size="sm"></FormControl>
                                </div>
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">Password</label>
                                    <FormControl onChange={(e) => {
                                        setUser({ ...user, password: e.target.value })
                                    }} defaultValue={user.password} type="password" size="sm"></FormControl>
                                </div>
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">Phone Number</label>
                                    <FormControl onChange={(e) => {
                                        setUser({ ...user, phoneNumber: e.target.value })
                                    }} defaultValue={user.phoneNumber} type="text" size="sm"></FormControl>
                                </div>
                            </div>
                        </Col>
                        <Col xl={5}>
                            <div className="d-flex flex-column justify-content-start gap-4">
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">Birthday Date</label>
                                    <FormControl defaultValue={user.birthDate} onChange={(e) => {
                                        setUser({ ...user, birthDate: e.target.value })
                                    }} type="date" size="sm"></FormControl>
                                </div>
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">Gender</label>
                                    <FormSelect defaultValue={user.gender} onChange={(e) => {
                                        console.log(e.target.value)
                                        setUser({ ...user, gender: e.target.value })
                                    }}>
                                        <option value='MALE'>Male</option>
                                        <option value='FEMALE'>Female</option>
                                        <option value='none'>None</option>
                                    </FormSelect>
                                </div>
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">Bio</label>
                                    <FormControl onChange={(e) => {
                                        setUser({ ...user, bio: e.target.value })
                                    }} defaultValue={user.bio} as={"textarea"} />
                                </div>
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">Status</label>
                                    <FormCheck defaultChecked={user.status} onChange={(e) => setUser({ ...user, status: e.target.checked })} type="switch"></FormCheck>
                                </div>
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">Email Permission</label>
                                    <FormCheck onChange={(e) => {
                                        setUser({ ...user, emailPermission: e.target.checked })
                                    }} defaultChecked={user.emailPermission} type="switch"></FormCheck>
                                </div>
                                <div className="d-flex flex-column justify-content-start gap-1">
                                    <label className="fs-6">Sms Permission</label>
                                    <FormCheck onChange={(e) => {
                                        setUser({ ...user, smsPermission: e.target.checked })
                                    }} defaultChecked={user.smsPermission} type="switch"></FormCheck>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        }
    </>
}


export default UserCreate