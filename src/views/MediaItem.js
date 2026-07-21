import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteMedia, getMedia } from "../routes/mediaRoutes";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaEdit, FaChevronLeft, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const MediaItem = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: item, isLoading, error } = useQuery({
    queryKey: ["media", mediaId],
    queryFn: async () => {
      const res = await getMedia(mediaId);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await deleteMedia(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["medias"]);
      navigate("/");
    },
    onError: (err) => {
      console.error("Error deleting media:", err);
      window.alert("Failed to delete the story. Please try again.");
    },
  });

  const handleDeleteMedia = (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      deleteMutation.mutate(id);
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

  if (error || !item) {
    return (
      <div className="itemContainer">
        <div className="errorContainer">
          <h2>Oops!</h2>
          <p>Failed to load the story. It might have been deleted.</p>
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
            <button
              onClick={() => handleDeleteMedia(item._id)}
              className="btnDelete"
              title="Delete story"
              disabled={deleteMutation.isLoading}
            >
              <FaTrash size={14} style={{ marginRight: 8 }} />
              {deleteMutation.isLoading ? "Deleting..." : "Delete Story"}
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default MediaItem;
