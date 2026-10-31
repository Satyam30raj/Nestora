
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import API_BASE_URL from "../api.js";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      setError("");
      setProperty(null);
      setSelectedImage(0);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/properties/${id}`
        );

        if (!response.ok) {
          throw new Error("Property not found");
        }

        const data = await response.json();
        setProperty(data);
      } catch {
        setError("Could not find this property.");
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  const images = property?.images?.filter(Boolean) ?? [];

  return (
    <>
      <Navbar />

      <main className="details-page">
        <Link to="/" className="back-link">
          ← Back to properties
        </Link>

        {loading && <p>Loading property...</p>}
        {error && <p className="error-message">{error}</p>}

        {property && (
          <article className="details-content">
            <div className="details-gallery">
              <div className="details-image">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={`${property.title} — photo ${selectedImage + 1}`}
                  />
                ) : (
                  <div className="image-placeholder">
                    <span>⌂</span>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="details-thumbnails">
                  {images.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={`details-thumbnail ${
                        selectedImage === index ? "active" : ""
                      }`}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View photo ${index + 1}`}
                      aria-pressed={selectedImage === index}
                    >
                      <img src={image} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="property-location">{property.location}</p>

            <span className="listing-badge">
              For {property.listingType}
            </span>

            <h1>{property.title}</h1>

            <p className="details-price">
              ₹{Number(property.price).toLocaleString("en-IN")}
              {property.listingType === "Rent" && " / month"}
            </p>

            <div className="details-features">
              <span>{property.bedrooms} Bedrooms</span>
              <span>{property.bathrooms} Bathrooms</span>
              <span>{property.area} sq ft</span>
              <span>{property.propertyType}</span>
            </div>

            <h2>About this property</h2>
            <p className="details-description">
              {property.description}
            </p>
          </article>
        )}
      </main>
    </>
  );
}

export default PropertyDetails;
