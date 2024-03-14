import { useEffect, useState } from "react";
import {
  Row,
  Image,
  Col,
  ListGroup,
  ListGroupItem,
  Card,
  Button,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, updateDeliveredStatus } from "../action/orderAction";

import {
  ORDER_DELIVERED_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants";
import { formatDate } from "../functions/convertDate";
import PayButton from "../components/PayButton";

const OrderScreen = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { error, loading, order } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { success: successPay, loading: loadingPay } = orderPay;

  const orderDelivered = useSelector((state) => state.orderDelivered);
  const {
    error: errorDelivered,
    success: successDelivered,
    loading: loadingDelivered,
  } = orderDelivered;

  useEffect(() => {
    if (!order || successPay || successDelivered || order.id !== id) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVERED_RESET });
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, successPay, successDelivered, order, id]);

  const deliverHandler = () => {
    dispatch(updateDeliveredStatus(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h2>Order {order.id}</h2>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode}{" "}
                {order.shippingAddress.country}
              </p>
              {/* <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p> */}
            </ListGroupItem>
            <ListGroupItem>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {order.paymentMethod}
              {order.isPaid ? (
                <Message variant='success'>
                  Paid on {order.paidAt ? formatDate(order.paidAt) : ""}
                </Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroupItem>

            <ListGroupItem>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item) => (
                    <ListGroupItem key={item.productId}>
                      <Row>
                        <Col md={1} sm={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.productId}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} sm={4}>
                          {item.qty} X Rs.{item.price} = Rs.
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                  {order.isDelivered ? (
                    <Message variant='success'>Delivered</Message>
                  ) : (
                    <Message variant='danger'>Not Delivered</Message>
                  )}
                </ListGroup>
              )}
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <h2>Order Summary </h2>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Item:</Col>
                  <Col>Rs.{order.itemsPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Tax:</Col>
                  <Col>Rs.{order.taxPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Shipping Charges:</Col>
                  <Col>Rs.{order.shippingPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Total:</Col>
                  <Col>Rs.{order.totalPrice}</Col>
                </Row>
              </ListGroupItem>
              {!order.isPaid && order.status !== "cancelled" && (
                <ListGroupItem>
                  {loadingPay && <Loader />}
                  <PayButton
                    totalPrice={order.totalPrice}
                    expiresAt={order.expiresAt}
                    id={order.id}
                  />
                </ListGroupItem>
              )}

              {order.status === "cancelled" && (
                <ListGroupItem>
                  <Message variant={"danger"}>Order cancelled</Message>
                </ListGroupItem>
              )}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroupItem>
                    {errorDelivered && (
                      <Message variant='danger'>{errorDelivered}</Message>
                    )}
                    {loadingDelivered && <Loader />}
                    <Button
                      onClick={deliverHandler}
                      className='btn btn-primary'
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroupItem>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
