import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteMedia, getMedia } from "../routes/mediaRoutes";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaEdit, FaChevronLeft, FaCalendarAlt, FaUser } from "react-icons/fa";

const MediaItem = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getMedia(mediaId)
      .then((result) => {
        setItem(result.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching media:", err);
        setErrorMsg("Failed to load the story. It might have been deleted.");
        setIsLoading(false);
      });
  }, [mediaId]);

  const handleDeleteMedia = (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      deleteMedia(id)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          console.error("Error deleting media:", err);
          window.alert("Failed to delete the story. Please try again.");
        });
    }
  };

  if (isLoading) {
    return (
      <div className="itemContainer">
        <div className="skeletonDetail">
          <div className="skeletonDetailBack"></div>
          <div className="skeletonDetailTitle"></div>
          <div className="skeletonDetailMeta"></div>
          <div className="skeletonDetailImage"></div>
          <div className="skeletonDetailContent"></div>
        </div>
      </div>
    );
  }

  if (errorMsg || !item) {
    return (
      <div className="itemContainer">
        <div className="errorContainer">
          <h2>Oops!</h2>
          <p>{errorMsg || "Story not found."}</p>
          <Link to="/" className="btnBack">
            <FaChevronLeft size={14} style={{ marginRight: 8 }} />
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const itemDate = new Date(item.date);
  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  const formattedItemDate = itemDate.toLocaleDateString("en-US", dateOptions);

  const isOwner = user && item.authorId && user.id === item.authorId;

  return (
    <div className="itemContainer">
      <Link to="/" className="btnBackLink">
        <FaChevronLeft size={12} style={{ marginRight: 6 }} /> Back to Stories
      </Link>

      <article className="itemCover">
        <h1 className="itemTitle">{item.title}</h1>

        <div className="itemMeta">
          <span className="itemAuthor">
            <FaUser size={12} className="metaIcon" /> Posted by {item.author}
          </span>
          <span className="itemDate">
            <FaCalendarAlt size={12} className="metaIcon" /> {formattedItemDate}
          </span>
        </div>

        <div className="itemImgWrapper">
          <img src={item.imageUrl} alt={item.title} className="detailImage" />
        </div>

        <div className="itemContent">
          {item.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {isOwner && (
          <div className="actions">
            <Link to={`/update_media/${item._id}`} className="btnUpdate">
              <FaEdit size={14} style={{ marginRight: 8 }} /> Edit Story
            </Link>
            <button onClick={() => handleDeleteMedia(item._id)} className="btnDelete" title="Delete story">
              <FaTrash size={14} style={{ marginRight: 8 }} /> Delete Story
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default MediaItem;
