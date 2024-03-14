import React, { useEffect, useState } from "react";
import Message from "./Message";
import { updatePaidStatus } from "../action/orderAction";
import TimerComponent from "./TimerComponent";
import Loader from "./Loader";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

const PayButton = ({ totalPrice, id, expiresAt }) => {
  const [expire, setExpired] = useState(false);
  const [sdkready, setSdkReady] = useState(false);
  const dispatch = useDispatch();

  const successPaymentHandler = (paymentResult) => {
    dispatch(updatePaidStatus(id, paymentResult));
  };

  const handlePayment = async () => {
    // Initialize and open the Razorpay checkout form
    try {
      // const data = {
      //   amount: order.totalPrice,
      //   orderId: order.id,
      // };
      // const config = {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // };

      // const { data: orderId } = await axios.post(
      //   "/api/payments/createId",
      //   JSON.stringify(data),
      //   config
      // );

      // const response = await axios.post(
      //   "https://api.razorpay.com/v1/orders",
      //   {
      //     amount: order.totalPrice * 100, // Amount should be in smallest currency unit (e.g., paise for INR)
      //     currency: "INR",
      //     receipt: userInfo.email,
      //   },
      //   {
      //     auth: {
      //       username: process.env.RAZORPAY_KEY_ID, // Ensure these environment variables are set
      //       password: process.env.RAZORPAY_SECRET,
      //     },
      //     config,
      //   }
      // );
      // console.log(response);
      console.log(process.env);
      const options = {
        key: "rzp_test_4lnT7r2n2nIbba",
        amount: totalPrice * 100,
        currency: "INR",
        name: "Farm Products",
        description: "Fresh Farm to Home",
        image: "favicon-16x16.png",
        //order_id: response.data.orderId,
        handler: function (response) {
          if (response.razorpay_payment_id) {
            // Payment successful
            console.log(
              "Payment successful! Payment ID:",
              response.razorpay_payment_id
            );
            successPaymentHandler(response.razorpay_payment_id);
          } else {
            // Payment failed or was canceled
            console.log("Payment failed or canceled!");
            // Handle the failure scenario, e.g., display an error message
            alert("Payment failed or canceled. Please try again.");
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("error in creating payment", error);
    }
  };

  const addRazorpayScript = async () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      setSdkReady(true);
    };

    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!window.razorPay) {
      addRazorpayScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  return (
    <>
      {!expire ? (
        <>
          <p>
            Order will be cancelled automatically after{" "}
            <TimerComponent
              expiresAt={expiresAt ? expiresAt : new Date()}
              handleExpired={() => setExpired(true)}
            />{" "}
            mins{" "}
          </p>
          {!sdkready ? (
            <Loader />
          ) : (
            <>
              <Button onClick={handlePayment}>Pay Now</Button>
            </>
          )}
        </>
      ) : (
        <Message variant='danger'>Payment time has expired</Message>
      )}
    </>
  );
};

export default PayButton;
