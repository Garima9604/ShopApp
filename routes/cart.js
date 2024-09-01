const express = require("express");
const { isLoggedIn } = require("../middleware");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const router = express.Router();

const stripe = require("stripe")(process.env.stripeKey);

router.get("/user/cart", isLoggedIn, async (req, res) => {
  let userId = req.user._id;
  let user = await User.findById(userId).populate("cart");
  //   console.log(user, "sam");
  let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
  //   console.log(totalAmount);
  const productInfo = user.cart.map((p) => p.desc).join(",");
  console.log(productInfo);
  res.render("cart/cart", { user, totalAmount, productInfo });
});

router.post("/user/:productId/add", isLoggedIn, async (req, res) => {
  let { productId } = req.params;
  let userId = req.user._id;
  let user = await User.findById(userId);
  let product = await Product.findById(productId);
  user.cart.push(product);
  await user.save();
  res.redirect("/user/cart");
});

router.get("/product/payment", async (req, res) => {
  let user = req.user;
  let products = await User.findById({ _id: user._id }).populate("cart");
  console.log("\n******************NEW ORDER STARTS **************** ");
  console.log(products.cart);

  const customer = await stripe.customers.create({
    name: user.username,
    email: user.email,
    address: {
      line1: "510 Townsend St",
      postal_code: "98140",
      city: "San Francisco",
      state: "CA",
      country: "US",
    },
  });
  console.log("req.user.name -> ", req.user);
  console.log("Current Customer who made an order : ", customer);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: Array.from(products.cart).map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: `${item.name}`,
          },
          unit_amount: item.price * 100,
        },
        quantity: 1,
      };
    }),
    mode: "payment",
    success_url: "https://shopapp-90nf.onrender.com//success",
    cancel_url: "https://shopapp-90nf.onrender.com//cancel",
    // success_url: "http://localhost:8080/success",
    // cancel_url: "http://localhost:8080/cancel",
    customer: customer.id, // Link the customer to the session
  });

  res.redirect(303, session.url);
});

router.get("/success", async (req, res) => {
  let currUser = req.user;
  // console.log("Before Current User :-> ", currUser);
  console.log("CurrUser.cart -> ", currUser.cart);
  let products = currUser.cart.map((productId) => ({
    product: productId,
    quantity: 1, // Assuming 1 for now, update logic if needed
  }));
  console.log("Cart Products : ", products);

  let userId = req.user._id;
  let user = await User.findById(userId).populate("cart");
  //   console.log(user, "sam");
  let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);

  const order = new Order({
    user: currUser._id,
    products,
    totalAmount,
    status: "completed",
  });
  console.log("Cart Order : ", order);
  await order.save();
  currUser.cart = [];
  await currUser.save();
  // console.log("After Current User :-> ", currUser);
  req.flash("success", "Order Placed Successfully");
  res.redirect("/products");
});

router.get("/cancel", (req, res) => {
  req.flash("error", "Something Wrong !! Retry");
  res.redirect("/products");
});

router.get("/user/cart/remove/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;
    const user = await User.findById(userId);
    user.cart = user.cart.filter(
      (product) => product._id.toString() !== productId
    );
    await user.save();
    res.redirect("/user/cart");
  } catch (e) {
    res.status(500).render("error", { err: e.message });
  }
});

router.get("/orders", isLoggedIn, async (req, res) => {
  let userId = req.user._id;
  let orders = await Order.find({ user: userId }).populate("products.product");
  res.render("orders/order", { orders });
});

module.exports = router;
