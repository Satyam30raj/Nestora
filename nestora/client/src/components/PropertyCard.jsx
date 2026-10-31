import { Link } from "react-router-dom";
function PropertyCard({ property }) {
    const isRent = property.listingType === "Rent";

    return (
        <article className="property-card">
            <div className="property-image">
                {property.images?.[0] ? (
                    <img src={property.images[0]} alt={property.title} />
                ) : (
                    <div className="image-placeholder">
                        <span>⌂</span>
                    </div>
                )}

                <span className="listing-badge">
                    For {property.listingType}
                </span>
            </div>

            <div className="property-info">
                <p className="property-location">{property.location}</p>

                <h3>{property.title}</h3>

                <p className="property-description">
                    {property.description}
                </p>

                <div className="property-features">
                    <span>{property.bedrooms} Beds</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>{property.area} sq ft</span>
                </div>

                <div className="property-footer">
                    <p className="property-price">
                        ₹{Number(property.price).toLocaleString("en-IN")}
                        {isRent && <span> / month</span>}
                    </p>

                    <Link
                        to={`/properties/${property._id}`}
                        className="details-btn"
                    >
                        View details ↗
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default PropertyCard;
