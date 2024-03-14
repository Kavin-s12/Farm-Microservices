import { body, check, ValidationChain } from "express-validator";
import mongoose from "mongoose";
import { ProductDoc } from "../../models/productModel";

// Common validation functions
const isArrayNotEmpty = (field: string): ValidationChain =>
  body(field).isArray().notEmpty().withMessage(`${field} should not be empty.`);

const isObjectNotEmpty = (field: string): ValidationChain =>
  body(field)
    .isObject()
    .notEmpty()
    .withMessage(`${field} should not be empty.`);

const isStringNotEmpty = (field: string): ValidationChain =>
  body(field)
    .isString()
    .notEmpty()
    .withMessage(`${field} should not be empty.`);

const isNumericNotEmpty = (field: string): ValidationChain =>
  body(field)
    .isNumeric()
    .notEmpty()
    .withMessage(`${field} should not be empty and must be a number.`);

const validateOrderItem = (): ValidationChain[] => {
  return [
    body("orderItems")
      .isArray({ min: 1 })
      .withMessage("At least one order item is required."),
    body("orderItems.*.name")
      .isString()
      .notEmpty()
      .withMessage("Name in order item should not be empty."),
    body("orderItems.*.qty")
      .isNumeric()
      .notEmpty()
      .withMessage(
        "Qty in order item should not be empty and must be a number."
      ),
    body("orderItems.*.image")
      .isString()
      .notEmpty()
      .withMessage("Image in order item should not be empty."),
    body("orderItems.*.price")
      .isNumeric()
      .notEmpty()
      .withMessage(
        "Price in order item should not be empty and must be a number."
      ),
    body("orderItems.*.productId")
      .notEmpty()
      .isMongoId()
      .withMessage(
        "Product ID in order item should be a valid MongoDB ObjectId."
      ),
    // Add more validations for other fields within OrderItem if needed
  ];
};

const validateShippingAddress = (): ValidationChain[] => {
  return [
    isStringNotEmpty("shippingAddress.address"),
    isNumericNotEmpty("shippingAddress.postalCode"),
    isStringNotEmpty("shippingAddress.city"),
    isStringNotEmpty("shippingAddress.country"),
  ];
};

// Validation configuration
const orderValidation: ValidationChain[] = [
  isObjectNotEmpty("shippingAddress"),
  isStringNotEmpty("paymentMethod"),
  isNumericNotEmpty("itemsPrice"),
  isNumericNotEmpty("taxPrice"),
  isNumericNotEmpty("shippingPrice"),
  isNumericNotEmpty("totalPrice"),
  ...validateShippingAddress(),
  ...validateOrderItem(),
];

export { orderValidation };
