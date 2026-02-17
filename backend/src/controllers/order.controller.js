const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { sendMail } = require("../services/mail.service");

const paymentMethods = ["card", "upi", "cod", "netbanking"];

const notifyAdminsForOrder = async (order, customer) => {
  try {
    const admins = await User.find({ role: "admin" }, "email name");
    const adminEmails = admins.map((admin) => admin.email).filter(Boolean);

    if (!adminEmails.length) {
      return;
    }

    const lowStockItems = order.items.filter((item) => Number(item.remainingStock) <= 5);
    const lowStockText = lowStockItems.length
      ? `\nLow stock alert:\n${lowStockItems
          .map((item) => `- ${item.name}: remaining ${item.remainingStock}`)
          .join("\n")}`
      : "";

    const text = [
      "New order placed in Department Store",
      `Invoice: ${order.invoiceNumber}`,
      `Customer: ${customer?.name || "User"} (${customer?.email || "N/A"})`,
      `Total: $${Number(order.totalAmount || 0).toFixed(2)}`,
      `Payment: ${order.paymentMethod}`,
      "Items:",
      ...order.items.map(
        (item) =>
          `- ${item.name} | qty ${item.quantity} | line $${Number(item.lineTotal).toFixed(2)} | remaining stock ${item.remainingStock}`
      ),
      lowStockText,
    ]
      .filter(Boolean)
      .join("\n");

    await sendMail({
      to: adminEmails,
      subject: `New Purchase Alert - ${order.invoiceNumber}`,
      text,
    });

    const outOfStockItems = order.items.filter((item) => Number(item.remainingStock) === 0);
    if (outOfStockItems.length) {
      await sendMail({
        to: adminEmails,
        subject: `OUT OF STOCK ALERT - ${order.invoiceNumber}`,
        text: [
          "The following products are now out of stock:",
          ...outOfStockItems.map((item) => `- ${item.name}`),
        ].join("\n"),
      });
    }
  } catch (error) {
    console.error("Admin notification failed:", error.message);
  }
};

const checkout = async (req, res) => {
  try {
    const { paymentMethod, billing } = req.body;

    if (!paymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: "Valid paymentMethod is required" });
    }

    if (!billing?.fullName || !billing?.email || !billing?.phone || !billing?.address) {
      return res.status(400).json({ message: "Complete billing details are required" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const stockUpdates = [];
    const orderItems = [];

    for (const entry of cart.items) {
      const product = entry.product;
      const quantity = Number(entry.quantity || 0);

      if (!product || !quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid cart item found" });
      }

      const updateResult = await Product.updateOne(
        { _id: product._id, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } }
      );

      if (!updateResult.modifiedCount) {
        for (const update of stockUpdates) {
          await Product.updateOne({ _id: update.productId }, { $inc: { stock: update.quantity } });
        }
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}`,
        });
      }

      const freshProduct = await Product.findById(product._id, "name image price stock");
      stockUpdates.push({ productId: product._id, quantity });
      orderItems.push({
        productId: product._id,
        name: freshProduct?.name || product.name,
        image: freshProduct?.image || product.image,
        price: Number(freshProduct?.price || product.price || 0),
        quantity,
        lineTotal: Number(freshProduct?.price || product.price || 0) * quantity,
        remainingStock: Number(freshProduct?.stock || 0),
      });
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const invoiceNumber = `INV-${Date.now()}`;

    const order = await Order.create({
      user: req.user.id,
      invoiceNumber,
      paymentMethod,
      billing: {
        fullName: billing.fullName,
        email: billing.email,
        phone: billing.phone,
        address: billing.address,
      },
      items: orderItems,
      totalAmount,
    });

    cart.items = [];
    await cart.save();

    await notifyAdminsForOrder(order, {
      name: req.user?.name,
      email: req.user?.email,
    });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Checkout failed", error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

module.exports = { checkout, getMyOrders };
