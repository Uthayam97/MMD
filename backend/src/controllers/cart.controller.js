const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    return res.json(cart || { user: req.user.id, items: [] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    const product = await Product.findById(productId, "name stock");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (Number(product.stock || 0) <= 0) {
      return res.status(400).json({ message: `${product.name} is out of stock` });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const index = cart.items.findIndex((item) => item.product.toString() === productId);

    if (index >= 0) {
      const nextQty = cart.items[index].quantity + qty;
      if (nextQty > Number(product.stock || 0)) {
        return res.status(400).json({ message: `Only ${product.stock} item(s) available in stock` });
      }
      cart.items[index].quantity = nextQty;
    } else {
      if (qty > Number(product.stock || 0)) {
        return res.status(400).json({ message: `Only ${product.stock} item(s) available in stock` });
      }
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    const populated = await cart.populate("items.product");

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add to cart", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity);

    if (!productId || !mongoose.Types.ObjectId.isValid(productId) || !qty || qty < 1) {
      return res.status(400).json({ message: "Valid productId and quantity >= 1 are required" });
    }

    const product = await Product.findById(productId, "name stock");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (Number(product.stock || 0) <= 0) {
      return res.status(400).json({ message: `${product.name} is out of stock` });
    }

    if (qty > Number(product.stock || 0)) {
      return res.status(400).json({ message: `Only ${product.stock} item(s) available in stock` });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((entry) => entry.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = qty;
    await cart.save();
    const populated = await cart.populate("items.product");
    return res.json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update cart", error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    const populated = await cart.populate("items.product");
    return res.json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
