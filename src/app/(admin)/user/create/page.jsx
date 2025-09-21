'use client'
import { useForm } from "react-hook-form";
import TextAreaFormInput from "../../../../components/form/TextAreaFormInput"
import { Button, Col, Container, FormCheck, FormControl, FormSelect, Row } from "react-bootstrap"
import { useState } from "react";


const UserCreate = () => {
    const {
        control
    } = useForm();

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

    return <div className="d-flex flex-column jsutify-content-start">
        <Container>
            <div className='d-flex justify-content-end w-100'>
                <Button variant="primary" size="sm" className="d-flex justify-content-end" onClick={() => console.log(user)}>Save</Button>
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
                                setUser({ ...user, gender: e.target.value })
                            }}>
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
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


export default UserCreate