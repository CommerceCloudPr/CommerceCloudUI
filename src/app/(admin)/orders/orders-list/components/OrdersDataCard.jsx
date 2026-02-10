'use client';

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { orderData } from '../data';
import { Card, CardBody, Col, Row } from 'react-bootstrap';

const OrderCard = ({
  icon,
  item,
  title,
  color
}) => {
  return (
    <Card className="card-animate">
      <CardBody>
        <div className="d-flex justify-content-between">
          <div>
            <p className="fw-medium text-muted mb-0">{title}</p>
            <h2 className="mt-4 ff-secondary fw-semibold">
              <span className="counter-value">{item}</span>
            </h2>
          </div>
          <div>
            <div className="avatar-sm flex-shrink-0">
              <span className={`avatar-title bg-${color}-subtle text-${color} rounded-circle fs-3`}>
                <IconifyIcon icon={icon} />
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const OrdersDataCardPage = () => {
  return (
    <Row>
      {orderData.map((item, idx) => (
        <Col xl={3} md={6} key={idx}>
          <OrderCard {...item} />
        </Col>
      ))}
    </Row>
  );
};

export default OrdersDataCardPage;