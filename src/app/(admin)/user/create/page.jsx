import { Col, Container, FormControl, Row } from "react-bootstrap"

const UserCreate = () => {
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
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
}


export default UserCreate