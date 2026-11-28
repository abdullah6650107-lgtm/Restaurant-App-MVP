const mongoose = require("mongoose");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

const STATUS_FLOW = ["pending", "preparing", "ready", "served"];

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function buildOrderItem(menuItem, quantity) {
  const unitPrice = Number(menuItem.price);
  const itemQuantity = Number(quantity);
  const lineTotal = unitPrice * itemQuantity;

  return {
    menuItem: menuItem._id,
    name: menuItem.name,
    quantity: itemQuantity,
    unitPrice,
    lineTotal,
  };
}

async function getOrders(req, res, next) {
  try {
    const query = req.user.role === "manager" ? {} : { customer: req.user._id };
    const orders = await Order.find(query).populate("customer", "name email role").populate("items.menuItem", "name category price").sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (error) {
    return next(error);
  }
}

async function createOrder(req, res, next) {
  try {
    const { items, notes, customerName, address, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must include at least one item." });
    }

    const normalizedItems = [];
    let subtotal = 0;

    for (const entry of items) {
      if (!entry || !entry.menuItem || !Number.isInteger(Number(entry.quantity)) || Number(entry.quantity) <= 0) {
        return res.status(400).json({ error: "Each order item must include a valid menu item and quantity." });
      }

      if (!isValidObjectId(String(entry.menuItem))) {
        return res.status(400).json({ error: `Invalid menu item id: ${entry.menuItem}` });
      }

      const menuItem = await MenuItem.findById(entry.menuItem);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ error: `Menu item unavailable: ${entry.menuItem}` });
      }

      const quantity = Number(entry.quantity);
      const orderItem = buildOrderItem(menuItem, quantity);
      normalizedItems.push(orderItem);
      subtotal += orderItem.lineTotal;
    }

    // Never trust a client-supplied total price. We calculate totals on the server using the current menu price records.
    const deliveryFee = 120;
    subtotal = Number(subtotal.toFixed(2));
    const total = Number((subtotal + deliveryFee).toFixed(2));
    const order = await Order.create({
      customer: req.user._id,
      items: normalizedItems,
      subtotal,
      total,
      deliveryFee,
      customerName: customerName ? String(customerName).trim() : req.user.name,
      address: address ? String(address).trim() : "",
      paymentMethod: paymentMethod ? String(paymentMethod).trim() : "Cash on Delivery",
      notes: notes ? String(notes).trim() : "",
      status: "pending",
    });

    return res.status(201).json({ order });
  } catch (error) {
    return next(error);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid order ID." });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (req.user.role !== "manager") {
      return res.status(403).json({ error: "Only managers can update order status." });
    }

    const currentIndex = STATUS_FLOW.indexOf(order.status);
    const nextIndex = STATUS_FLOW.indexOf(status);
    if (nextIndex === -1) {
      return res.status(400).json({ error: "Invalid order status." });
    }

    if (status === "cancelled") {
      if (order.status !== "pending") {
        return res.status(400).json({ error: "Only pending orders can be cancelled." });
      }
      order.status = "cancelled";
    } else if (currentIndex === -1 || nextIndex < currentIndex) {
      return res.status(400).json({ error: "Invalid status transition." });
    } else {
      order.status = status;
    }

    await order.save();
    return res.json({ order });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
