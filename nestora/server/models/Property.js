
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        listingType: {
            type: String,
            enum: ["Rent", "Sale"],
            required: true,
        },
        propertyType: {
            type: String,
            enum: ["Apartment", "House", "Villa", "Plot"],
            default: "Apartment",
        },
        bedrooms: {
            type: Number,
            default: 1,
            min: 0,
        },
        bathrooms: {
            type: Number,
            default: 1,
            min: 0,
        },
        area: {
            type: Number,
            default: 0,
            min: 0,
        },
        images: {
            type: [String],
            default: [],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
