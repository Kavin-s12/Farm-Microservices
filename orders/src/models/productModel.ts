import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ProductAttrs {
  id: string;
  price: number;
  countInStock: number;
}

export interface ProductDoc extends mongoose.Document {
  price: number;
  countInStock: number;
  version: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
  findByEvent(event: { id: string; version: number }): Promise<ProductDoc>;
}

const productSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

productSchema.set("versionKey", "version");
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    _id: attrs.id,
    price: attrs.price,
    countInStock: attrs.countInStock,
  });
};

productSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Product.findOne({ _id: event.id, version: event.version - 1 });
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Prodcut",
  productSchema
);

export { Product };
