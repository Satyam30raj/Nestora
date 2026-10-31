
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PropertyDetails from "./pages/PropertyDetails.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import AddProperty from "./pages/AddProperty.jsx";
import MyListings from "./pages/MyListings.jsx";
import ScrollToSection from "./components/ScrollToSection";

function App() {
  return (
    <BrowserRouter>
    <ScrollToSection />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/properties/:id"
          element={<PropertyDetails />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/properties/new" element={<AddProperty />} />
        <Route path="/my-listings" element={<MyListings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
