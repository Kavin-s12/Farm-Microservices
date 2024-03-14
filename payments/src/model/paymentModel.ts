import mongoose from "mongoose";

interface PaymentAttrs {
  user: string;
  orderId: string;
  razorPayId: string;
}

interface PaymentDoc extends mongoose.Document {
  user: string;
  orderId: string;
  razorPayId: string;
  createdAt: Date;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    razorPayId: {
      required: true,
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      timestamps: true,
    },
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
