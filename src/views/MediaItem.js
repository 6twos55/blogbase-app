import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteMedia, getMedia, likeMedia } from "../routes/mediaRoutes";
import { useAuth } from "../context/AuthContext";
import {
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaCalendarAlt,
  FaUser,
  FaHeart,
  FaRegHeart,
  FaShieldAlt,
} from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Linkify from "linkify-react";

const MediaItem = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [likeNotice, setLikeNotice] = useState("");

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

  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await likeMedia(mediaId);
      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["media", mediaId] });
      const previousItem = queryClient.getQueryData(["media", mediaId]);
      if (previousItem && user) {
        const currentLikes = Array.isArray(previousItem.likes) ? previousItem.likes : [];
        const userIdStr = (user.id || user._id || "").toString();
        const alreadyLiked = currentLikes.some(
          (id) => (typeof id === "string" ? id : id?._id || id?.toString()) === userIdStr
        );
        const newLikes = alreadyLiked
          ? currentLikes.filter(
              (id) => (typeof id === "string" ? id : id?._id || id?.toString()) !== userIdStr
            )
          : [...currentLikes, userIdStr];

        queryClient.setQueryData(["media", mediaId], {
          ...previousItem,
          likes: newLikes,
          likesCount: newLikes.length,
        });
      }
      return { previousItem };
    },
    onError: (err, variables, context) => {
      if (context?.previousItem) {
        queryClient.setQueryData(["media", mediaId], context.previousItem);
      }
      console.error("Like failed:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["media", mediaId] });
    },
  });

  const handleLike = () => {
    if (!user) {
      setLikeNotice("Please sign in or create an account to like this story.");
      setTimeout(() => setLikeNotice(""), 4000);
      return;
    }
    likeMutation.mutate();
  };

  const handleDeleteMedia = (id) => {
    const isOwner = user && item?.authorId && (user.id === item.authorId || user._id === item.authorId);
    const confirmMessage = isOwner
      ? "Are you sure you want to delete this story?"
      : "Admin Action: Are you sure you want to delete this story?";

    if (window.confirm(confirmMessage)) {
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

  const isOwner = user && item.authorId && (user.id === item.authorId || user._id === item.authorId);
  const isAdmin = Boolean(user?.isAdmin);
  const canDelete = isOwner || isAdmin;

  const currentLikes = Array.isArray(item.likes) ? item.likes : [];
  const currentUserIdStr = (user?.id || user?._id || "").toString();
  const isLikedByMe =
    user &&
    currentLikes.some(
      (id) => (typeof id === "string" ? id : id?._id || id?.toString()) === currentUserIdStr
    );
  const likesCount = typeof item.likesCount === "number" ? item.likesCount : currentLikes.length;

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
            <p key={index}>
              <Linkify
                options={{
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "storyLink",
                }}
              >
                {paragraph}
              </Linkify>
            </p>
          ))}
        </div>

        {/* Like section: only on individual blog details page */}
        <div className="itemInteractionBar">
          <div className="likeSection">
            <button
              type="button"
              className={`btnLike ${isLikedByMe ? "liked" : ""}`}
              onClick={handleLike}
              disabled={likeMutation.isPending}
              aria-label={isLikedByMe ? "Unlike story" : "Like story"}
            >
              {isLikedByMe ? (
                <FaHeart className="heartIcon filledHeart" />
              ) : (
                <FaRegHeart className="heartIcon" />
              )}
              <span className="likeCount">
                {likesCount} {likesCount === 1 ? "like" : "likes"}
              </span>
            </button>

            {likeNotice && (
              <div className="likeNotice">
                <span>{likeNotice}</span>
                {!user && (
                  <Link to="/login" className="noticeLoginLink">
                    Log In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions section for Owner and/or Admin */}
        {canDelete && (
          <div className="actions">
            {isOwner && (
              <Link
                to={`/update_media/${item._id}`}
                className="btnUpdate"
                style={{ pointerEvents: deleteMutation.isPending ? "none" : "auto" }}
              >
                <FaEdit size={14} style={{ marginRight: 8 }} /> Edit Story
              </Link>
            )}

            <button
              onClick={() => handleDeleteMedia(item._id)}
              className={`btnDelete ${isAdmin && !isOwner ? "btnAdminDelete" : ""}`}
              title={isAdmin && !isOwner ? "Admin delete story" : "Delete story"}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <span className="btnSpinner" /> Deleting...
                </>
              ) : (
                <>
                  {isAdmin && !isOwner ? (
                    <>
                      <FaShieldAlt size={14} style={{ marginRight: 6 }} /> Delete Story (Admin)
                    </>
                  ) : (
                    <>
                      <FaTrash size={14} style={{ marginRight: 6 }} /> Delete Story
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default MediaItem;
