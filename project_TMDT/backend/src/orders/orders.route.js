const express = require("express");
const Order = require("./orders.model");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  try {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Confirm Payment
router.post("/confirm-payment", async (req, res) => {
  const { session_id } = req.body;
  // console.log(session_id);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

    const paymentIntentId = session.payment_intent.id;

    let order = await Order.findOne({ orderId: paymentIntentId });

    if (!order) {
      const lineItems = session.line_items.data.map((item) => ({
        productId: item.price.product,
        quantity: item.quantity,
      }));

      const amount = session.amount_total / 100;

      order = new Order({
        orderId: paymentIntentId,
        products: lineItems,
        amount: amount,
        email: session.customer_details.email,
        status:
          session.payment_intent.status === "succeeded" ? "pending" : "failed",
      });
    } else {
      order.status =
        session.payment_intent.status === "succeeded" ? "pending" : "failed";
    }

    // Save the order to MongoDB
    await order.save();
    //   console.log('Order saved to MongoDB', order);

    res.json({ order });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
});

router.get("/:email", async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ message: "Email parameter is required" });
  }
 

  try {
    const orders = await Order.find({ email: email }).sort({ createdAt: -1 });
    if (orders.length === 0 || !orders) {
      return res
        .status(404)
        .json({ order: 0, message: "No orders found for this email" });
    }
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/order/:id", async (req, res) => {
  // console.log(req.params.id);
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// get all orders 
router.get('/', async (req, res) => {

  try {
    const orders = await Order.find().sort({createdAt: -1});
    if (orders.length === 0) {
      console.log('No orders found');
      return res.status(200).json({ message: "No orders found", orders: [] });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// update order status
router.patch('/update-order-status/:id', async (req, res) => {
  try {
      const { id } = req.params;
      // console.log(id);
      const { status } = req.body;

      // console.log(status)

      if (!status) {
          return res.status(400).json({ message: "Order status is required" });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
          id,
          { status, updatedAt: Date.now() },
          { new: true, runValidators: true }
      );

      if (!updatedOrder) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({
          message: "Order status updated successfully",
          order: updatedOrder
      });
  } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Server error" });
  }
});

// delete order
router.delete('/delete-order/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully",
      order: deletedOrder
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// COD (Cash on Delivery) checkout flow
router.post("/cod-checkout", async (req, res) => {
  try {
    const { products = [], email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Customer email is required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products list cannot be empty" });
    }

    // Validate each product has an id
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product._id && !product.id) {
        return res.status(400).json({ 
          message: `Each product must include an id. Product at index ${i} is missing id.` 
        });
      }
    }

    // Normalize products - ensure each has productId
    const normalizedProducts = products.map((product) => ({
      productId: product._id || product.id,
      quantity: Number(product.quantity) || 1,
    }));

    // Calculate total amount
    const totalAmount = products.reduce((sum, product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 1;
      return sum + price * quantity;
    }, 0);

    // Create COD order with confirmed status (ready for shipping)
    const order = new Order({
      orderId: `COD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      products: normalizedProducts,
      amount: totalAmount,
      email: email,
      status: "confirmed", // COD orders start as confirmed, waiting for shipping
      paymentMethod: "cod",
    });

    await order.save();

    res.status(201).json({
      message: "Đơn hàng COD đã được tạo thành công. Bạn sẽ thanh toán khi nhận hàng.",
      order: order,
    });
  } catch (error) {
    console.error("Error creating COD order:", error);
    res.status(500).json({ 
      message: "Không thể tạo đơn hàng COD",
      error: error.message 
    });
  }
});

// MoMo Payment Gateway Integration
let momoPayment;
try {
  momoPayment = require('../utils/momoPayment');
} catch (error) {
  console.error('⚠️ Could not load MoMo payment module:', error.message);
}

// Create MoMo payment link
router.post("/create-momo-payment", async (req, res) => {
  try {
    if (!momoPayment) {
      return res.status(503).json({ 
        message: "MoMo payment service is not available. Please check server configuration.",
        error: "MoMo module not loaded"
      });
    }

    const { products = [], email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Customer email is required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products list cannot be empty" });
    }

    // Validate each product has an id
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product._id && !product.id) {
        return res.status(400).json({ 
          message: `Each product must include an id. Product at index ${i} is missing id.` 
        });
      }
    }

    // Normalize products
    const normalizedProducts = products.map((product) => ({
      productId: product._id || product.id,
      quantity: Number(product.quantity) || 1,
    }));

    // Calculate total amount (convert USD to VND, 1 USD = 25000 VND)
    const totalAmountUSD = products.reduce((sum, product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 1;
      return sum + price * quantity;
    }, 0);
    
    const totalAmountVND = Math.round(totalAmountUSD * 25000);

    // Generate unique order ID
    const orderId = `MOMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create order with pending status
    const order = new Order({
      orderId: orderId,
      products: normalizedProducts,
      amount: totalAmountUSD,
      email: email,
      status: "pending",
      paymentMethod: "momo",
    });

    await order.save();

    // Create order info string
    const productNames = products.map(p => p.name).join(', ');
    const orderInfo = `Thanh toan don hang ${orderId}: ${productNames}`;

    // MoMo payment URLs
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const returnUrl = `${baseUrl}/success?orderId=${order._id}&paymentMethod=momo`;
    const notifyUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/orders/momo-callback`;

    // Create MoMo payment
    const momoResult = await momoPayment.createMoMoPayment({
      orderId: orderId,
      amount: totalAmountVND,
      orderInfo: orderInfo,
      returnUrl: returnUrl,
      notifyUrl: notifyUrl,
      extraData: JSON.stringify({ orderId: order._id.toString(), email: email }),
    });

    if (momoResult && momoResult.success) {
      res.status(200).json({
        message: "Payment link created successfully",
        payUrl: momoResult.payUrl,
        orderId: order._id,
        momoOrderId: orderId,
      });
    } else {
      // Update order status to failed
      order.status = 'failed';
      await order.save();

      res.status(400).json({
        message: momoResult?.message || "Không thể tạo payment link. Vui lòng thử lại hoặc sử dụng thanh toán đơn giản.",
        error: momoResult || "Unknown error",
      });
    }
  } catch (error) {
    console.error("Error creating MoMo payment:", error);
    
    // Try to update order status if it was created
    try {
      if (order && order._id) {
        order.status = 'failed';
        await order.save();
      }
    } catch (saveError) {
      console.error("Error updating order status:", saveError);
    }

    res.status(500).json({ 
      message: "Failed to create payment. Vui lòng thử lại hoặc sử dụng thanh toán đơn giản.",
      error: error.message 
    });
  }
});

// MoMo payment callback (IPN)
router.post("/momo-callback", async (req, res) => {
  try {
    const callbackData = req.body;

    // Verify signature
    const isValid = momoPayment.verifyMoMoCallback(callbackData);

    if (!isValid) {
      console.error('Invalid MoMo callback signature');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Find order by orderId
    const order = await Order.findOne({ orderId: callbackData.orderId });

    if (!order) {
      console.error('Order not found:', callbackData.orderId);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status based on resultCode
    // resultCode = 0: Success
    // resultCode != 0: Failed
    if (callbackData.resultCode === 0) {
      order.status = 'pending'; // Will be processed
      order.paymentId = callbackData.transId;
      order.paymentTime = new Date(callbackData.responseTime);
    } else {
      order.status = 'failed';
    }

    await order.save();

    // Return success to MoMo
    res.status(200).json({
      resultCode: 0,
      message: 'Success',
    });
  } catch (error) {
    console.error("Error processing MoMo callback:", error);
    res.status(500).json({ 
      resultCode: -1,
      message: 'Internal server error',
    });
  }
});

module.exports = router;
