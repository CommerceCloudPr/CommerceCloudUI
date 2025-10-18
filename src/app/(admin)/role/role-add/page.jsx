'use client'
import PageTItle from '@/components/PageTItle';
import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

const RoleAddPage = () => {
  const session = localStorage.getItem('session_token');
  const [name, setName] = useState('')


  return <>
    <PageTItle title="ROLE ADD" />
    <Row>
      <Col lg={12}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'}>Roles Information</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col lg={6}>
                <form>
                  <div className="mb-3">
                    <label htmlFor="roles-name" className="form-label">
                      Roles Name
                    </label>
                    <input type="text" id="roles-name" className="form-control" placeholder="Role name" onChange={(e) => setName(e.target.value)} />
                  </div>
                </form>
              </Col>
            </Row>
          </CardBody>
          <CardFooter className="border-top">
            <Button variant={'primary'} className='primary-ff6c2fc' color='#ff6c2fc' type="button" key={0} onClick={() => {
              fetch('https://api-dev.aykutcandan.com/user/role/add',
                {
                  headers: {
                    'Authorization': `Bearer ${decodeURIComponent(session)}`,
                    'Content-Type': 'application/json'
                  },
                  method: 'POST',
                  body: JSON.stringify({
                    name: name
                  })
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
};
export default RoleAddPage;