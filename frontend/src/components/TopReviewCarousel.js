import React, { useEffect } from "react";
import { Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listTopReviewProduct } from "../action/productAction";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import Message from "./Message";

const TopReviewCarousel = () => {
  const dispatch = useDispatch();

  const topReviewProduct = useSelector((state) => state.topReviewProduct);
  const { error, loading, products } = topReviewProduct;

  useEffect(() => {
    dispatch(listTopReviewProduct());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Carousel slide pause='hover' className='bg-dark'>
          {products?.map((product) => (
            <Carousel.Item key={product.id}>
              <Link to={`/products/${product.id}`}>
                <Image src={product.image} alt={product.image} fluid />
                <Carousel.Caption className='carousel-caption'>
                  <h2>
                    {product.name} (Rs.{product.price})
                  </h2>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default TopReviewCarousel;
