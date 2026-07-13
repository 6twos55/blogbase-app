import { useEffect, useState } from "react";
import { getMedias } from "../routes/mediaRoutes";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaCalendarAlt, FaUser } from "react-icons/fa";

const Medias = () => {
  const [medias, setMedias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getMedias()
      .then((result) => {
        setMedias(result.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="mediasContainer">
        <div className="mediasHeader">
          <h1 className="topTitle">All Stories</h1>
          <p className="subtitle">Discover what's happening around the world</p>
        </div>
        <div className="mediaGrid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div className="skeletonCard" key={i}>
              <div className="skeletonImage"></div>
              <div className="skeletonContent">
                <div className="skeletonTitle"></div>
                <div className="skeletonText"></div>
                <div className="skeletonText short"></div>
                <div className="skeletonMeta"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mediasContainer">
      <div className="mediasHeader">
        <h1 className="topTitle">All Stories</h1>
        <p className="subtitle">Discover what's happening around the world</p>
      </div>

      {medias.length >= 1 ? (
        <div className="mediaGrid">
          {medias.map((media) => {
            const mediaDate = new Date(media.date);
            const dateOptions = { day: "numeric", month: "short", year: "numeric" };
            const formattedMediaDate = mediaDate.toLocaleDateString("en-US", dateOptions);

            return (
              <article className="mediaCard" key={media._id}>
                <Link to={`/medias/${media._id}`} className="cardLink">
                  <div className="cardImageWrapper">
                    <img
                      src={media.imageUrl}
                      alt={media.title}
                      className="cardImage"
                      loading="lazy"
                    />
                  </div>
                  <div className="cardBody">
                    <h3 className="cardTitle">
                      {media.title.length >= 35 ? media.title.slice(0, 35) + "..." : media.title}
                    </h3>
                    <p className="cardExcerpt">
                      {media.content.length >= 80 ? media.content.slice(0, 80) + "..." : media.content}
                    </p>
                    <div className="cardFooter">
                      <span className="cardAuthor">
                        <FaUser size={12} className="metaIcon" />
                        {media.author}
                      </span>
                      <span className="cardDate">
                        <FaCalendarAlt size={12} className="metaIcon" />
                        {formattedMediaDate}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="noBlogs">
          <h3>No stories to display yet</h3>
          <p>Be the first to share a story on BlogBase.</p>
          {user ? (
            <Link to="/add_media" className="btnAddFirst">
              Create a Blog Post
            </Link>
          ) : (
            <Link to="/login" className="btnAddFirst">
              Sign In to Post
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Medias;
