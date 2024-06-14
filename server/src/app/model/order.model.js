const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../../constants");
const mongoose_delete = require("mongoose-delete");

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    codeOrder: { type: String, unique: true },
    customer: {
      type: {
        name: { type: String, trim: true, required: true },
        phone: { type: String, trim: true, required: true },
        address: { type: String, trim: true, required: true },
      },
      required: false,
    },
    nameProducts: { type: Array, required: true, default: [] },
    note: { type: String, default: "" },
    listProducts: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        size: { type: Number, required: true },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity can not be less then 1."],
        },
        price: {
          type: Number,
          required: true,
        },
        priceSale: {
          type: Number,
          required: true,
        },
      },
    ],
    // trang thai don hang
    status: {
      type: String,
      enum: Object.values(constants.ORDER.STATUS),
      default: constants.ORDER.STATUS.PENDING,
      required: true,
    },
    // phuong thuc thanh toan
    paymentMethod: {
      type: String,
      enum: Object.values(constants.ORDER.PAYMENT_METHOD),
      default: constants.ORDER.PAYMENT_METHOD.CASH,
      required: true,
    },
    // trang thai thanh toan
    paymentStatus: {
      type: String,
      enum: Object.values(constants.ORDER.PAYMENT_STATUS),
      default: constants.ORDER.PAYMENT_STATUS.PENDING,
    },

    codePayment: {
      type: String,
      default: function () {
        if (this.paymentMethod !== "cod") {
          return "";
        } else {
          return;
        }
      },
    },

    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },

    shippingUnit: {
      type: String,
      required: true,
      enum: Object.values(constants.ORDER.SHIPPING_UNIT),
      default: constants.ORDER.SHIPPING_UNIT.GHN,
    },

    reasonCanceled: { type: String },
    canceller: { type: Schema.Types.ObjectId, ref: "users" },

    delivery_at: { type: Date },
    canceled_at: { type: Date },
    complete_at: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

OrderSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("orders", OrderSchema);
