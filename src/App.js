import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./styles/App.scss";
import Medias from "./views/Medias";
import AddMedia from "./views/AddMedia";
import MediaItem from "./views/MediaItem";
import UpdateMedia from "./views/UpdateMedia";
import Footer from "./components/Footer";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";

function App() {
  return (
    <div className="appContainer">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Medias />} />
        <Route path="/medias/:mediaId" element={<MediaItem />} />
        <Route path="/update_media/:mediaId" element={<UpdateMedia />} />
        <Route path="/add_media" element={<AddMedia />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
