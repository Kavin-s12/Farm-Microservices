import { React, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listOrder } from "../action/orderAction";
import { formatDate } from "../functions/convertDate";

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderList = useSelector((state) => state.orderList);
  const { error, loading, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrder());
    } else {
      navigate("/login");
    }
  }, [dispatch, userInfo]);

  return (
    <>
      <h2>ORDERS</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>ORDERED AT</th>
              <th>NAME</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.createdAt &&
                    formatDate(order.createdAt).substring(0, 10)}
                </td>
                <td>{order.user && order.user.name}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <span>
                      {order.paidAt &&
                        formatDate(order.paidAt).substring(0, 10)}
                    </span>
                  ) : (
                    <i className='fas fa-times' style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <span>
                      {order.deliveredAt &&
                        formatDate(order.deliveredAt).substring(0, 10)}
                    </span>
                  ) : (
                    <i className='fas fa-times' style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/orders/${order.id}`}>
                    <Button className='btn-sm' variant='light'>
                      DETAILS
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
