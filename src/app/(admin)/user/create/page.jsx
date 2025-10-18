'use client'
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
    const [selectedTab, setSelectedTab] = useState("1");
    const [countryList, setCountryList] = useState([]);
    const [countryData, setCountryData] = useState([])
    const [cityList, setCityList] = useState([]);
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
        gender: 'MALE',
        bio: '',
        status: true,
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        addressType: "",
        default: true,
        addressPhone: "",
        billing: true,
        identityNumber: "",
        company: "",
        taxNumber: "",
        taxOffice: ""
    })

    useEffect(() => {

        fetch('https://countriesnow.space/api/v0.1/countries',
            {
                method: 'GET',

            }
        )
            .then((res) => res.json())
            .then(async (res) => {
                let temp = []
                res.data?.map((item) => {
                    temp.push({
                        label: item.country,
                        value: item.country,
                        cities: item.cities
                    })
                })
                setCountryList(temp);
                setCountryData(res.data);
            })
            .catch((err) => console.log(err))

        if (userId !== null) {
            fetch('https://api-dev.aykutcandan.com/user/info/get/' + userId,
                {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${decodeURIComponent(session)}`
                    }
                }
            )
                .then((res) => res.json())
                .then((res) => {
                    toastify({
                        message: res?.message,
                        props: {
                            type: res?.success === true ? 'success' : 'error',
                            position: 'top-right',
                            closeButton: false,
                            autoClose: 3000
                        }
                    })
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
                    fetch('https://api-dev.aykutcandan.com/user/detail/get/username/' + res.data.username,
                        {
                            method: "GET",
                            headers: {
                                'Authorization': `Bearer ${decodeURIComponent(session)}`
                            }
                        }
                    )
                        .then((res1) => res1?.json())
                        .then((res1) => {
                            toastify({
                                message: res1?.message,
                                props: {
                                    type: res1?.success === true ? 'success' : 'error',
                                    position: 'top-right',
                                    closeButton: false,
                                    autoClose: 3000
                                }
                            })
                            setUserId(res1.data.uuid)
                            setUser({
                                ...user,
                                bio: res1.data?.bio,
                                gender: res1.data?.gender,
                                birthDate: res1.data?.birthDate,
                                phoneNumber: res1.data?.phoneNumber,
                            })

                        })

                    fetch('https://api-dev.aykutcandan.com/user/detail/get/username/' + res.data.username,
                        {
                            method: "GET",
                            headers: {
                                'Authorization': `Bearer ${decodeURIComponent(session)}`
                            }
                        }
                    )

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
            fetch('https://api-dev.aykutcandan.com/user/detail/update/' + userId,
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
                .then((res) => {
                    toastify({
                        message: res?.message,
                        props: {
                            type: res?.success === true ? 'success' : 'error',
                            position: 'top-right',
                            closeButton: false,
                            autoClose: 3000
                        }
                    })
                })
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

            fetch('https://api-dev.aykutcandan.com/user/info/register',
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


                    const dataObj = {
                        'phoneNumber': user.phoneNumber,
                        'birthDate': user.birthDate,
                        'gender': user.gender,
                        'bio': user.bio,
                        'userUUID': res.data.uuid
                    }
                    fetch('https://api-dev.aykutcandan.com/user/detail/add',
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
                        .then((res1) => {
                            toastify({
                                message: res1?.message,
                                props: {
                                    type: res1?.success === true ? 'success' : 'error',
                                    position: 'top-right',
                                    closeButton: false,
                                    autoClose: 3000
                                }
                            })
                        })
                        .catch((err) => console.log(err))

                
                })
                .catch((err) => console.log(err))


        }

    }

    const handleSelectCountry = (selectedCountry) => {
        let temp = [];
        countryData.map((item) => {
            if (item.country === selectedCountry) {
                temp = item?.cities
            }
        })
        setCityList(temp);
    }

    return <>
        {
            loadingUser === false ? <Spinner></Spinner> : <div className="d-flex flex-column jsutify-content-start">
                <Container>
                    <div className='d-flex justify-content-end w-100'>
                        <Button variant="primary" size="sm" className="d-flex justify-content-end" onClick={() => handleSaveUser()}>Save</Button>
                    </div>
                    {
                        selectedTab === "1" ? <Row className="p-4">

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
                        </Row> : <Row className="p-4">
                            <Col xl={5}>
                                <div className="d-flex flex-column justify-content-start gap-4">
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Address Line 1</label>
                                        <FormControl as={"textarea"} defaultValue={user.addressLine1} onChange={(e) => {
                                            setUser({ ...user, addressLine1: e.target.value })
                                        }} size="sm"></FormControl>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Address Line 2</label>
                                        <FormControl as={"textarea"} defaultValue={user.addressLine2} onChange={(e) => {
                                            setUser({ ...user, addressLine2: e.target.value })
                                        }} size="sm"></FormControl>

                                    </div>
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Country</label>
                                        <FormSelect defaultValue={user.country} onChange={(e) => {
                                            console.log(e.target.value)
                                            setUser({ ...user, country: e.target.value })
                                            handleSelectCountry(e.target.value);
                                        }}>
                                            {countryList?.map((item, key) => {
                                                return <option key={key} value={item.value}>{item.label}</option>
                                            })}
                                        </FormSelect>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">City</label>
                                        <FormSelect defaultValue={user.city} onChange={(e) => {
                                            console.log(e.target.value)
                                            setUser({ ...user, city: e.target.value })
                                            // handleSelectCountry(e);
                                        }}>
                                            {cityList?.map((item, key) => {
                                                return <option key={key} value={item}>{item}</option>
                                            })}
                                        </FormSelect>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">State</label>
                                        <FormControl defaultValue={user.state} onChange={(e) => {
                                            setUser({ ...user, state: e.target.value })
                                        }} size="sm"></FormControl>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Postal Code</label>
                                        <FormControl defaultValue={user.postalCode} onChange={(e) => {
                                            setUser({ ...user, postalCode: e.target.value })
                                        }} size="sm"></FormControl>
                                    </div>

                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Address Type</label>
                                        <FormControl defaultValue={user.addressType} onChange={(e) => {
                                            setUser({ ...user, addressType: e.target.value })
                                        }} size="sm"></FormControl>
                                    </div>

                                </div>
                            </Col>
                            <Col xl={5}>
                                <div className="d-flex flex-column justify-content-start gap-4">
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Default</label>
                                        <FormCheck onChange={(e) => {
                                            setUser({ ...user, default: e.target.checked })
                                        }} defaultChecked={user.default} type="switch"></FormCheck>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Phone Number</label>
                                        <FormControl defaultValue={user.addressPhone} onChange={(e) => {
                                            setUser({ ...user, addressPhone: e.target.value })
                                        }} size="sm"></FormControl>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Billing</label>
                                        <FormCheck onChange={(e) => {
                                            setUser({ ...user, billing: e.target.checked })
                                        }} defaultChecked={user.billing} type="switch"></FormCheck>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Identity Number</label>
                                        <FormControl defaultValue={user.identityNumber} onChange={(e) => {
                                            setUser({ ...user, identityNumber: e.target.value })
                                        }} size="sm"></FormControl>
                                    </div>

                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Company Name</label>
                                        <FormControl defaultValue={user.company} onChange={(e) => {
                                            setUser({ ...user, company: e.target.value })
                                        }} size="sm"></FormControl>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Tax Number</label>
                                        <FormControl defaultValue={user.taxNumber} onChange={(e) => {
                                            setUser({ ...user, taxNumber: e.target.value })
                                        }} size="sm"></FormControl>
                                    </div>
                                    <div className="d-flex flex-column justify-content-start gap-1">
                                        <label className="fs-6">Tax Office</label>
                                        <FormControl defaultValue={user.taxOffice} onChange={(e) => {
                                            setUser({ ...user, taxOffice: e.target.value })
                                        }} size="sm"></FormControl>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    }
                </Container>
            </div>
        }
    </>
}


export default UserCreate