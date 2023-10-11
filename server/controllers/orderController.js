const Order = require("../models/Order");
const Tour = require("../models/Tour");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createPaymentIntent = async ({ amount, currency }) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
  });

  return {
    client_secret: paymentIntent.client_secret,
    amount: paymentIntent.amount / 100,
  };
};

const createOrder = async (req, res) => {
  const { items: cartItems } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbTour = await Tour.findOne({ _id: item.tour });
    if (!dbTour) {
      throw new CustomError.NotFoundError(`No tour with id : ${item.tour}`);
    }
    // Check if there is an order with a 'paid' status for the same tour and time slot
   const paidOrderExists = await Order.findOne({
     "orderItems.tour": item.tour,
     "orderItems.availableDays": {
       $in: item.availableDays,
     },
     "orderItems.date": {
       $in: item.date,
     },
     "orderItems.timeSlots.start": {
       $in: item.timeSlots.map((slot) => slot.start),
     },
     "orderItems.timeSlots.end": {
       $in: item.timeSlots.map((slot) => slot.end),
     },
     status: "paid",
   });


    if (paidOrderExists) {
      throw new CustomError.BadRequestError(
        `Cannot book the selected time slot as it is already booked`
      );
    }
    const { vendor, duration, _id,price } =
      dbTour;
    const singleOrderItem = {
      amount: item.amount,
      vendor,
      duration,
      price,
      date: item.date,
      availableDays: item.availableDays, // use selected available days from the item
      timeSlots: item.timeSlots, // use selected time slots from the item
      tour: _id,
      // endTime: new Date(item.date + " " + item.timeSlots[0].end),
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
  }
  // calculate total
  const total = subtotal;
  // get client secret
  console.log(total);


  
  const paymentIntent = await createPaymentIntent({
    amount: total,
    currency: "PKR",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
   
     const ordersStatus = await Order.find({ status: { $in: ["paid"] } });
     for (const order of ordersStatus) {
       if (order.orderItems[0].endTime && order.orderItems[0].endTime <= new Date()) {
         order.status = "completed";
         await order.save();
       }
     }
   
  const orders = await Order.find({ status: { $ne: "pending" } });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  // checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const user = req.user;
  if (user.role === "tourist") {
    const orders = await Order.find({
      user: req.user.userId,
      status: { $ne: "pending" },
    });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
  }
  else if (user.role === "vendor") {
    const orders = await Order.find({
      "orderItems.vendor": req.user.userId,
      status: { $ne: "pending" },
    });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
  }
  else {
    
    throw new CustomError.NotFoundError(`No order found`);
  }
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
