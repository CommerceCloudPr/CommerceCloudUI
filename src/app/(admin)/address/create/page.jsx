"use client"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import { Button, Col, Container, FormCheck, FormControl, FormSelect, Row } from "react-bootstrap";


const AddressCreate = () => {

    const [countryList, setCountryList] = useState([]);
    const [countryData, setCountryData] = useState([])
    const [cityList, setCityList] = useState([]);
    const params = useSearchParams()
    const [addressId, setAddressId] = useState(params.get('uuid'))
    const session = localStorage.getItem('session_token');
    const [user, setUser] = useState({
        userUUID: "",
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
        taxOffice: "",
        uuid: ""
    });

    const handleSelectCountry = (selectedCountry) => {
        let temp = [];
        countryData.map((item) => {
            if (item.country === selectedCountry) {
                temp = item?.cities
            }
        })
        console.log(temp)
        setCityList(temp);
    }

    useEffect(() => {
        fetch('https://api-dev.aykutcandan.com/user/info/getme', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${decodeURIComponent(session)}`
            }
        })
            .then((res) => res.json())
            .then((res) => setUser({
                ...user,
                userUUID: res.data?.uuid
            }))
            .catch((err) => console.log(err))
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

        if (addressId !== null) {
            fetch('https://api-dev.aykutcandan.com/user/address/get/' + addressId, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`
                }
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res.data)
                    handleSelectCountry(res.data.country)
                    setUser({
                        ...user,
                        addressLine1: res.data?.addressLine1,
                        addressLine2: res.data.addressLine2,
                        city: res.data.city,
                        state: res.data.state,
                        postalCode: res.data.postalCode,
                        country: res.data.country,
                        addressType: res.data.addressType,
                        default: res.data.isDefault,
                        addressPhone: res.data.phoneNumber,
                        billing: res.data.isBilling,
                        identityNumber: res.data.identityNumber,
                        company: res.data.companyName,
                        taxNumber: res.data.taxNumber,
                        taxOffice: res.data.taxOffice,
                        uuid: res.data.uuid
                    })
                })
                .catch((err) => console.log(err))
        }
    }, [])



    const handleSaveUser = () => {
        const myObj = {
            'userUUID': user.userUUID,
            'addressLine1': user.addressLine1,
            'addressLine2': user.addressLine2,
            'city': user.city,
            'state': user.state,
            'postalCode': user.postalCode,
            'country': user.country,
            'addressType': user.addressType,
            'isDefault': user.default,
            'phoneNumber': user.addressPhone,
            'isBilling': user.billing,
            'identityNumber': user.identityNumber,
            'companyName': user.company,
            'taxNumber': user.taxNumber,
            'taxOffice': user.taxOffice
        }

        const updateObj = {
            'addressLine1': user.addressLine1,
            'addressLine2': user.addressLine2,
            'city': user.city,
            'state': user.state,
            'postalCode': user.postalCode,
            'country': user.country,
            'addressType': user.addressType,
            'isDefault': user.default,
            'phoneNumber': user.addressPhone,
            'isBilling': user.billing,
            'identityNumber': user.identityNumber,
            'companyName': user.company,
            'taxNumber': user.taxNumber,
            'taxOffice': user.taxOffice
        }
        if (addressId !== null) {
            fetch('https://api-dev.aykutcandan.com/user/address/update/' + addressId, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateObj)
            })
                .then((res) => res.json())
                .then((res) => console.log(res.data))
                .catch((err) => console.log(err))
        } else {
            fetch('https://api-dev.aykutcandan.com/user/address/add',
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

    }
    return <div>
        <Container>
            <div className='d-flex justify-content-end w-100'>
                <Button variant="primary" size="sm" className="d-flex justify-content-end" onClick={() => handleSaveUser()}>Save</Button>
            </div>
            <Row className="p-4">

                <Col xl={5}>
                    <div className="d-flex flex-column justify-content-start gap-4">
                        <div className="d-flex flex-column justify-content-start gap-1">
                            <label className="fs-6">Address Line 1</label>
                            <FormControl as={"textarea"} defaultValue={user.addressLine1} value={user.addressLine1} onChange={(e) => {
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
                            <FormSelect defaultValue={user.country} value={user.country} onChange={(e) => {
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
                            <FormSelect defaultValue={user.city} value={user.city} onChange={(e) => {
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
                            }} defaultChecked={user.default} checked={user.default} type="switch"></FormCheck>
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
                            }} defaultChecked={user.billing} checked={user.billing} type="switch"></FormCheck>
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
        </Container>
    </div>
}

export default AddressCreate;