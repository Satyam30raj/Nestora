
import { Link } from "react-router-dom";

function Navbar() {
    const token = localStorage.getItem("nestoraToken");

    return (
        <nav className="navbar">
            <Link className="logo" to="/">
                nestora<span>.</span>
            </Link>

            <div className="nav-links">
                <Link to="/#properties">Explore</Link>
                <Link to="/#about">About</Link>
            </div>

            <div className="nav-actions">
                {token ? (
                    <>
                        <Link to="/my-listings" className="login-btn">
                            My Listings
                        </Link>

                        <Link to="/properties/new" className="primary-btn">
                            List your property
                        </Link>

                        <button
                            className="login-btn"
                            onClick={() => {
                                localStorage.removeItem("nestoraToken");
                                localStorage.removeItem("nestoraUser");
                                window.location.href = "/";
                            }}
                        >
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="login-btn">
                            Log in
                        </Link>

                        <Link to="/register" className="primary-btn">
                            Join Nestora
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
