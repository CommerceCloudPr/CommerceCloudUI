'use client'
import { useForm } from "react-hook-form";
import TextAreaFormInput from "../../../../components/form/TextAreaFormInput"
import { Col, Container, FormCheck, FormControl, FormSelect, Row } from "react-bootstrap"


const UserCreate = () => {
    const {
        control
    } = useForm();
    return <div className="d-flex flex-column jsutify-content-start">
        <Container>
            <Row>
                <Col xl={5}>
                    <div className="d-flex flex-column justify-content-start gap-4">
                        <div className="d-flex flex-column justify-content-start gap-1">
                            <label className="fs-6">First Name</label>
                            <FormControl type="text" size="sm"></FormControl>
                        </div>
                        <div className="d-flex flex-column justify-content-start gap-1">
                            <label className="fs-6">Last Name</label>
                            <FormControl type="text" size="sm"></FormControl>
                        </div>
                        <div className="d-flex flex-column justify-content-start gap-1">
                            <label className="fs-6">Username</label>
                            <FormControl type="text" size="sm"></FormControl>
                        </div>
                        <div className="d-flex flex-column justify-content-start gap-1">
                            <label className="fs-6">Email Address</label>
                            <FormControl type="text" size="sm"></FormControl>
                        </div>
                        <div className="d-flex flex-column justify-content-start gap-1">
                            <label className="fs-6">Phone Number</label>
                            <FormControl type="text" size="sm"></FormControl>
                        </div>
                        
                    </div>
                </Col>
                <Col xl={5}>
                    <div className="d-flex flex-column justify-content-start gap-4">
                        <div className="d-flex flex-column justify-content-start gap-1">
                            <label className="fs-6">Birthday Date</label>
                            <FormControl type="date" size="sm"></FormControl>
                        </div>
                        <div className="d-flex flex-column justify-content-start gap-1">
                            <label className="fs-6">Gender</label>
                            <FormSelect >
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
                                <option value='none'>None</option>
                            </FormSelect>
                        </div>
                        <div className="d-flex flex-column justify-content-start gap-1">
                            <label className="fs-6">Bio</label>
                            <TextAreaFormInput name="textarea"  control={control} rows={5} />
                        </div>
                        <div className="d-flex flex-column justify-content-start gap-1">
                            <label className="fs-6">Status</label>
                            <FormCheck type="switch"></FormCheck>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
}


export default UserCreate