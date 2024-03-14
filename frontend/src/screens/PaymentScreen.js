import { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { savePaymentMethod } from "../action/cartAction";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!shippingAddress) {
    navigate("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };
  return (
    <FormContainer>
      <h1>Payment Method</h1>
      <CheckoutSteps step1 step2 step3 />
      <Form onSubmit={onSubmitHandler}>
        <Form.Group className='form-group'>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            {/* <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              value='PayPal'
              name='paymentMethod'
              id='PayPal'
              onChange={(e) => setPaymentMethod(e.target.value)}
              checked
            ></Form.Check> */}
            <Form.Check
              type='radio'
              label='Razorpay'
              value='Razorpay'
              id='Razorpay'
              name='paymentMethod'
              onChange={(e) => setPaymentMethod(e.target.value)}
              checked
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
