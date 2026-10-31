
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import API_BASE_URL from "../api.js";

const API = `${API_BASE_URL}/api/properties`;

function MyListings() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProperties() {
    const token = localStorage.getItem("nestoraToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API}/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("nestoraToken");
        localStorage.removeItem("nestoraUser");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not load listings.");
      }

      setProperties(data);
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  async function deleteProperty(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("nestoraToken");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete property.");
      }

      setProperties((current) =>
        current.filter((property) => property._id !== id)
      );
    } catch (err) {
      setError(err.message || "Could not delete property.");
    }
  }

  async function editProperty(property) {
    const title = window.prompt("Property title:", property.title);
    if (title === null) return;

    const location = window.prompt("Location:", property.location);
    if (location === null) return;

    const priceText = window.prompt(
      "Price in rupees:",
      String(property.price)
    );
    if (priceText === null) return;

    const price = Number(priceText);

    if (
      !title.trim() ||
      !location.trim() ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError("Enter a title, location, and valid positive price.");
      return;
    }

    const token = localStorage.getItem("nestoraToken");

    try {
      const response = await fetch(`${API}/${property._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          location: location.trim(),
          price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update property.");
      }

      setProperties((current) =>
        current.map((item) =>
          item._id === property._id ? data : item
        )
      );
      setError("");
    } catch (err) {
      setError(err.message || "Could not update property.");
    }
  }

  return (
    <>
      <Navbar />

      <main className="my-listings-page">
        <div className="my-listings-heading">
          <div>
            <p className="eyebrow">YOUR PROPERTIES</p>
            <h1>My Listings</h1>
            <p>Manage the properties you've shared on Nestora.</p>
          </div>

          <Link to="/properties/new" className="primary-btn">
            + List a property
          </Link>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Loading your listings...</p>
        ) : properties.length === 0 ? (
          <div className="empty-listings">
            <h2>No listings yet</h2>
            <p>Your properties will appear here after you publish them.</p>
            <Link to="/properties/new" className="primary-btn">
              List your first property
            </Link>
          </div>
        ) : (
          <div className="my-listings-grid">
            {properties.map((property) => (
              <article className="my-listing-card" key={property._id}>
                {property.images?.[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="my-listing-image"
                  />
                )}

                <div className="my-listing-content">
                  <span className="listing-type">
                    {property.listingType}
                  </span>

                  <h2>{property.title}</h2>
                  <p>{property.location}</p>

                  <strong>
                    ₹{Number(property.price).toLocaleString("en-IN")}
                    {property.listingType === "Rent" ? " / month" : ""}
                  </strong>

                  <div className="my-listing-actions">
                    <Link to={`/properties/${property._id}`}>
                      View
                    </Link>

                    <button
                      type="button"
                      onClick={() => editProperty(property)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deleteProperty(property._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default MyListings;
