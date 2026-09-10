import { Routes, Route, Link } from "react-router-dom";
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
import "@fontsource/dancing-script/400.css";
import "@fontsource/dancing-script/700.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";

import Login from "./views/Login";
import Register from "./views/Register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="appContainer">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Medias />} />
          <Route path="/medias/:mediaId" element={<MediaItem />} />
          <Route path="/update_media/:mediaId" element={<UpdateMedia />} />
          <Route path="/add_media" element={<AddMedia />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <div className="pageNotFound">
                <h1>Page Not Found</h1>
                <p>The story or page you are looking for doesn't exist.</p>
                <Link to="/" className="btnBack">
                  Back to Stories
                </Link>
              </div>
            }
          />
        </Routes>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
