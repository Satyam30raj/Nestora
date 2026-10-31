import API_BASE_URL from "../api.js";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";
import API_BASE_URL from "../api.js";

function Home() {
  const [properties, setProperties] = useState([]);
  const [listingType, setListingType] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/properties`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError("Could not load properties. Check your backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesType =
      listingType === "All" ||
      property.listingType === listingType;

    const matchesSearch =
      property.title.toLowerCase().includes(search.toLowerCase()) ||
      property.location.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <>
      <Navbar />

      <main>
        <section className="hero">
          <p className="eyebrow">FIND YOUR PLACE IN THE WORLD</p>

          <h1>
            A place to call
            <br />
            <span>your own.</span>
          </h1>

          <p className="hero-description">
            Discover spaces that fit your life, your dreams,
            and your next chapter.
          </p>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search by property or location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        <section className="listings" id="properties">
          <div className="section-heading">
            <div>
              <p className="eyebrow">HANDPICKED FOR YOU</p>
              <h2>Find your next space</h2>
            </div>

            <div className="filter-buttons">
              {["All", "Rent", "Sale"].map((type) => (
                <button
                  key={type}
                  className={
                    listingType === type ? "filter active" : "filter"
                  }
                  onClick={() => setListingType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {loading && <p>Loading properties...</p>}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && filteredProperties.length === 0 && (
            <p className="empty-message">
              No properties found. Try another search.
            </p>
          )}

          <div className="property-grid">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </section>
        
<section id="about" className="about-section">
    <div className="about-content">
        <span className="about-label">ABOUT NESTORA</span>

        <h2>Finding a place to call home should feel simple.</h2>

        <p>
            At Nestora, we believe finding the right property should be
            an exciting experience, not a complicated one. Whether you're
            searching for a cosy apartment, a spacious family home, or
            a property to invest in, we're here to make your search
            easier.
        </p>

        <p>
            Nestora is a property marketplace designed to bring property
            seekers and property owners together in one convenient place.
            Explore available listings, discover properties that match
            your needs, and find the details you need to make informed
            decisions.
        </p>

        <p>
            For property owners, Nestora offers a simple way to publish
            listings and showcase properties to people looking for their
            next home. You can manage your own listings and keep your
            property information up to date.
        </p>

        <p>
            From exploring new neighbourhoods to taking the first step
            towards your next home, Nestora aims to make the process
            clearer, more accessible, and more convenient.
        </p>

    </div>
</section>

      </main>

      <footer id="about">
        <a className="logo" href="/">
          nestora<span>.</span>
        </a>
        <p>Find a space that feels like yours.</p>
        <p>© 2026 Nestora</p>
      </footer>
    </>
  );
}

export default Home;
