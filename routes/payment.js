// const express = require("express");
// const router = express.Router();
// //We are using request for making an HTTP/HTTPS call to payumoney server
// const request = require("request");
// const jsSHA = require("jssha");
// const { v4: uuid } = require("uuid");
// const { isLoggedIn } = require("../middleware");
// router.post("/payment_gateway/payumoney", isLoggedIn, (req, res) => {
//   req.body.txnid = uuid(); //Here pass txnid and it should be different on every call
//   req.body.email = req.user.email;
//   req.body.firstname = req.user.username;
//   //Here save all the details in pay object
//   const pay = req.body;
//   const hashString =
//     process.env.MERCHANT_KEY + //store in in different file
//     "|" +
//     pay.txnid +
//     "|" +
//     pay.amount +
//     "|" +
//     pay.productinfo +
//     "|" +
//     pay.firstname +
//     "|" +
//     pay.email +
//     "|" +
//     "||||||||||" +
//     process.env.MERCHANT_SALT; //store in in different file
//   const sha = new jsSHA("SHA-512", "TEXT");
//   sha.update(hashString);
//   //Getting hashed value from sha module
//   const hash = sha.getHash("HEX");

//   //We have to additionally pass merchant key to API so remember to include it.
//   pay.key = process.env.MERCHANT_KEY; //store in in different file;
//   pay.surl = "http://localhost:8081/payment/success";
//   pay.furl = "http://localhost:8081/payment/fail";
//   pay.hash = hash;
//   //Making an HTTP/HTTPS call with request
//   request.post(
//     {
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       url: "https://sandboxsecure.payu.in/_payment", //Testing url
//       form: pay,
//     },
//     function (error, httpRes, body) {
//       if (error) res.send({ status: false, message: error.toString() });
//       if (!httpRes) {
//         res.send({
//           status: false,
//           message: "No response from payment gateway.",
//         });
//         return;
//       }

//       if (httpRes.statusCode === 200) {
//         res.send(body);
//       } else if (httpRes.statusCode >= 300 && httpRes.statusCode <= 400) {
//         res.redirect(httpRes.headers.location.toString());
//       }
//     }
//   );
// });

// //success route
// router.post("/payment/success", (req, res) => {
//   res.send(req.body);
// });

// // failure route
// router.post("/payment/fail", (req, res) => {
//   res.send(req.body);
// });

// module.exports = router;

// -------------------------------
const express = require("express");
const router = express.Router();
const request = require("request");
const jsSHA = require("jssha");
const { v4: uuid } = require("uuid");
const { isLoggedIn } = require("../middleware");

router.post("/payment_gateway/payumoney", isLoggedIn, (req, res) => {
  req.body.txnid = uuid(); // Here pass txnid and it should be different on every call
  req.body.email = req.user.email;
  req.body.firstname = req.user.username;

  const pay = req.body;
  const hashString =
    process.env.MERCHANT_KEY +
    "|" +
    pay.txnid +
    "|" +
    pay.amount +
    "|" +
    pay.productinfo +
    "|" +
    pay.firstname +
    "|" +
    pay.email +
    "|" +
    "||||||||||" +
    process.env.MERCHANT_SALT;

  const sha = new jsSHA("SHA-512", "TEXT");
  sha.update(hashString);
  const hash = sha.getHash("HEX");

  pay.key = process.env.MERCHANT_KEY;
  pay.surl = "http://localhost:8081/payment/success";
  pay.furl = "http://localhost:8081/payment/fail";
  pay.hash = hash;

  request.post(
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      url: "https://sandboxsecure.payu.in/_payment",
      form: pay,
      timeout: 10000, // 10 seconds timeout
    },
    function (error, httpRes, body) {
      if (error) {
        console.log(error);
        return res.send({ status: false, message: error.toString() });
      }

      if (!httpRes) {
        return res.send({
          status: false,
          message: "No response from payment gateway.",
        });
      }

      if (httpRes.statusCode === 200) {
        res.send(body);
      } else if (httpRes.statusCode >= 300 && httpRes.statusCode <= 400) {
        res.redirect(httpRes.headers.location.toString());
      } else {
        res.send({
          status: false,
          message: `Unexpected status code ${httpRes.statusCode}`,
        });
      }
    }
  );
});

// Success route
router.post("/payment/success", (req, res) => {
  res.send(req.body);
});

// Failure route
router.post("/payment/fail", (req, res) => {
  res.send(req.body);
});

module.exports = router;
