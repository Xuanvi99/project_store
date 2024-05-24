const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressModel = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, default: "" },
    specific: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

AddressModel.statics.saveAddress = async function (address) {
  const _object = new this({
    userId: address.userId,
    name: address.name,
    phone: address.phone,
    province: address.province,
    district: address.district,
    ward: address.ward,
    specific: address.specific,
  });
  await _object.save();
  return _object;
};

module.exports = mongoose.model("address", AddressModel);
