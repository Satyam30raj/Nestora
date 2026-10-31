
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api.js";

function AddProperty() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        price: "",
        listingType: "Rent",
        propertyType: "Apartment",
        bedrooms: 2,
        bathrooms: 1,
        area: "",
        images: [],
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([""]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        const token = localStorage.getItem("nestoraToken");

        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/properties`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...form,
                        price: Number(form.price),
                        bedrooms: Number(form.bedrooms),
                        bathrooms: Number(form.bathrooms),
                        area: Number(form.area),
                        images: imageUrls
                        .map((url) => url.trim())
                        .filter(Boolean),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not create listing.");
            }

            navigate(`/properties/${data._id}`);
        } catch (err) {
            setError(err.message || "Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <Link to="/" className="logo">
                nestora<span>.</span>
            </Link>

            <form className="auth-card listing-form" onSubmit={handleSubmit}>
                <p className="eyebrow">SHARE YOUR SPACE</p>
                <h1>List your property</h1>
                <p className="auth-subtitle">
                    Add the details so people can discover your property.
                </p>

                {error && <p className="error-message">{error}</p>}

                <label htmlFor="title">Property title</label>
                <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Modern 2 BHK apartment"
                    required
                />

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your property..."
                    required
                    rows={4}
                />

                <label htmlFor="location">Location</label>
                <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Saket, Delhi"
                    required
                />

                <label htmlFor="listingType">Listing type</label>
                <select
                    id="listingType"
                    name="listingType"
                    value={form.listingType}
                    onChange={handleChange}
                >
                    <option value="Rent">Rent</option>
                    <option value="Sale">Sale</option>
                </select>

                <label htmlFor="price">
                    Price {form.listingType === "Rent" ? "(per month, ₹)" : "(₹)"}
                </label>
                <input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="propertyType">Property type</label>
                <select
                    id="propertyType"
                    name="propertyType"
                    value={form.propertyType}
                    onChange={handleChange}
                >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                </select>

                <div className="listing-number-grid">
                    <div>
                        <label htmlFor="bedrooms">Bedrooms</label>
                        <input
                            id="bedrooms"
                            name="bedrooms"
                            type="number"
                            min="0"
                            value={form.bedrooms}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="bathrooms">Bathrooms</label>
                        <input
                            id="bathrooms"
                            name="bathrooms"
                            type="number"
                            min="0"
                            value={form.bathrooms}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="area">Area (sq ft)</label>
                        <input
                            id="area"
                            name="area"
                            type="number"
                            min="0"
                            value={form.area}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="image-url-section">
                    <label>Property images</label>
                    <p className="form-hint">
                        Add links to photos of your property. The first image will be the cover.
                    </p>

                    {imageUrls.map((url, index) => (
                        <div className="image-url-row" key={index}>
                            <input
                                type="url"
                                value={url}
                                onChange={(event) => {
                                    const updated = [...imageUrls];
                                    updated[index] = event.target.value;
                                    setImageUrls(updated);
                                }}
                                placeholder="https://example.com/property-photo.jpg"
                            />

                            {imageUrls.length > 1 && (
                                <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={() =>
                                        setImageUrls((current) =>
                                            current.filter((_, i) => i !== index)
                                        )
                                    }
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    {imageUrls.length < 3 && (
                        <button
                            type="button"
                            className="add-image-btn"
                            onClick={() => setImageUrls((current) => [...current, ""])}
                        >
                            + Add another image
                        </button>
                    )}
                </div>

                <button className="primary-btn auth-submit" disabled={loading}>
                    {loading ? "Publishing..." : "Publish property"}
                </button>
            </form>
        </main>
    );
}

export default AddProperty;
