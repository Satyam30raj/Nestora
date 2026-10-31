import mongoose from "mongoose";
import express from "express";
import Property from "../models/Property.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const properties = await Property.find().sort({
            createdAt: -1,
        });

        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get properties belonging to the logged-in user
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.userId,
    }).sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch your properties.",
    });
  }
});

router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid property ID" });
        }

        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a property only if it belongs to the logged-in user
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid property ID.",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "location",
      "price",
      "listingType",
      "propertyType",
      "bedrooms",
      "bathrooms",
      "area",
      "images",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const property = await Property.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.userId,
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found or you do not own it.",
      });
    }

    res.json(property);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Could not update property.",
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const property = await Property.create({
            ...req.body,
            owner: req.userId,
        });
        res.status(201).json(property);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a property only if it belongs to the logged-in user
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid property ID.",
      });
    }

    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found or you do not own it.",
      });
    }

    res.json({ message: "Property deleted successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete property.",
    });
  }
});
export default router;
