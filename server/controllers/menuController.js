const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getMenu(req, res, next) {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category) {
      query.category = { $regex: new RegExp(String(category).trim(), "i") };
    }

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(String(search).trim(), "i") } },
        { category: { $regex: new RegExp(String(search).trim(), "i") } },
      ];
    }

    const items = await MenuItem.find(query).sort({ createdAt: -1 });
    return res.json({ items });
  } catch (error) {
    return next(error);
  }
}

async function getMenuById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid menu item ID." });
    }

    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Menu item not found." });
    }

    return res.json({ item });
  } catch (error) {
    return next(error);
  }
}

async function createMenuItem(req, res, next) {
  try {
    const { name, category, price, image, description } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Menu item name is required." });
    }

    if (!category || !String(category).trim()) {
      return res.status(400).json({ error: "Category is required." });
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ error: "Price must be a positive number." });
    }

    const item = await MenuItem.create({
      name: String(name).trim(),
      category: String(category).trim(),
      price: numericPrice,
      description: description ? String(description).trim() : "",
      image: image ? String(image).trim() : "",
    });

    return res.status(201).json({ item });
  } catch (error) {
    return next(error);
  }
}

async function updateMenuItem(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid menu item ID." });
    }

    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Menu item not found." });
    }

    const allowedFields = ["name", "category", "price", "image", "description", "isAvailable"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.name !== undefined && !String(updates.name).trim()) {
      return res.status(400).json({ error: "Menu item name is required." });
    }

    if (updates.price !== undefined) {
      const numericPrice = Number(updates.price);
      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({ error: "Price must be a positive number." });
      }
      updates.price = numericPrice;
    }

    Object.assign(item, updates);
    await item.save();

    return res.json({ item });
  } catch (error) {
    return next(error);
  }
}

async function deleteMenuItem(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid menu item ID." });
    }

    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Menu item not found." });
    }

    return res.json({ message: "Menu item deleted." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMenu,
  getMenuById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
