const config = require("config");
const querystring = require("qs");
const moment = require("moment");
const crypto = require("crypto");
const axios = require("axios");
const { orderModel } = require("../model");
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

class VnPay {
  createPaymentUrl = async (req, res) => {
    try {
      const codeOrder = req.body.codeOrder;
      let date = new Date();
      let createDate = moment(date).format("YYYYMMDDHHmmss");

      let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      let tmnCode = config.get("vnp_TmnCode");
      let secretKey = config.get("vnp_HashSecret");
      let vnpUrl = config.get("vnp_Url");
      let returnUrl = config.get("vnp_ReturnUrl") + `${codeOrder}`;
      let codeBill = moment(date).format("DDHHmmss");
      let amount = req.body.totalPricePayment;
      let bankCode = req.body.bankCode;

      let locale = req.body.language;
      if (locale === null || locale === "") {
        locale = "vn";
      }
      let currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = codeBill;
      vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + codeBill;
      vnp_Params["vnp_OrderType"] = "other";
      vnp_Params["vnp_Amount"] = amount * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);

      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

      res.status(201).json({ vnpUrl });
    } catch (error) {
      res.status(500).json({ errMessage: "server error" });
    }
  };

  vnpay_ipn = async (req, res) => {
    const codeOrder = req.params.codeOrder;

    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];

    let codeBill = vnp_Params["vnp_TxnRef"];
    let price = vnp_Params["vnp_Amount"];
    let rspCode = vnp_Params["vnp_ResponseCode"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    let config = require("config");
    let secretKey = config.get("vnp_HashSecret");
    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    let paymentStatus;
    let checkOrderId;
    let checkPrice;

    const order = await orderModel
      .findOne({ codeOrder })
      .populate([
        {
          path: "listProducts",
          populate: {
            path: "productId",
            model: "products",
            select: "_id name thumbnail",
            populate: {
              path: "thumbnail",
              model: "images",
              select: "url",
            },
          },
        },
        { path: "canceller", model: "users", select: "_id role" },
      ])
      .exec();
    console.log(order);

    if (order) {
      paymentStatus = order.paymentStatus;
      checkOrderId = true;
      checkPrice = order.total === +price / 100 ? true : false;
    } else {
      checkOrderId = false;
    }
    console.log(order);

    if (secureHash === signed) {
      if (checkOrderId) {
        if (checkPrice) {
          if (paymentStatus == "pending") {
            if (rspCode == "00") {
              await order.updateOne({ paymentStatus: "paid", codeBill });
              return res.status(200).json({
                RspCode: "00",
                Message: "Success payment",
                data: order,
              });
            } else {
              return res.status(200).json({
                RspCode: rspCode,
                Message: "error payment",
                data: order,
              });
            }
          } else {
            return res.status(200).json({
              RspCode: "02",
              Message: "This order has been updated to the payment status",
              data: order,
            });
          }
        } else {
          return res
            .status(200)
            .json({ RspCode: "04", Message: "Amount invalid" });
        }
      } else {
        return res
          .status(200)
          .json({ RspCode: "01", Message: "Order not found" });
      }
    } else {
      return res
        .status(200)
        .json({ RspCode: "97", Message: "Checksum failed" });
    }
  };

  vnpay_refund = async (req, res) => {
    let date = new Date();

    let vnp_TmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");
    let vnp_Api = config.get("vnp_Api");

    let vnp_TxnRef = req.body.codeBill;
    let vnp_Amount = req.body.amount * 100;
    let vnp_CreateBy = req.body.userId;

    let vnp_TransactionType = "02";
    let vnp_TransactionDate = moment(date).format("YYYYMMDDHHmmss");
    let vnp_RequestId = moment(date).format("HHmmss");
    let vnp_Version = "2.1.0";
    let vnp_Command = "refund";
    let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;

    let vnp_IpAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

    let vnp_TransactionNo = "0";

    let data =
      vnp_RequestId +
      "|" +
      vnp_Version +
      "|" +
      vnp_Command +
      "|" +
      vnp_TmnCode +
      "|" +
      vnp_TransactionType +
      "|" +
      vnp_TxnRef +
      "|" +
      vnp_Amount +
      "|" +
      vnp_TransactionNo +
      "|" +
      vnp_TransactionDate +
      "|" +
      vnp_CreateBy +
      "|" +
      vnp_CreateDate +
      "|" +
      vnp_IpAddr +
      "|" +
      vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex");

    let dataObj = {
      vnp_RequestId: vnp_RequestId,
      vnp_Version: vnp_Version,
      vnp_Command: vnp_Command,
      vnp_TmnCode: vnp_TmnCode,
      vnp_TransactionType: vnp_TransactionType,
      vnp_TxnRef: vnp_TxnRef,
      vnp_Amount: vnp_Amount,
      vnp_TransactionNo: vnp_TransactionNo,
      vnp_CreateBy: vnp_CreateBy,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate: vnp_CreateDate,
      vnp_IpAddr: vnp_IpAddr,
      vnp_SecureHash: vnp_SecureHash,
    };
    console.log(dataObj);

    // await axios
    //   .request({
    //     url: vnp_Api,
    //     method: "POST",
    //     responseType: "json",
    //     body: {...dataObj},
    //   })
    //   .then(function (response) {
    //     console.log("response", response);
    //   });
  };
}

module.exports = new VnPay();
