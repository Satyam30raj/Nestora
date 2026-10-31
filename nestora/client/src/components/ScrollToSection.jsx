
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToSection() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const sectionId = location.hash.substring(1);

            // Wait for the page to render before scrolling
            setTimeout(() => {
                const section = document.getElementById(sectionId);

                if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [location]);

    return null;
}

export default ScrollToSection;
