import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getMedia, updateMedia } from "../routes/mediaRoutes";
import { useAuth } from "../context/AuthContext";
import { FaUpload, FaChevronLeft } from "react-icons/fa";

const UpdateMedia = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getMedia(mediaId)
      .then((result) => {
        const { title, content, imageUrl, authorId } = result.data;

        // Route Guard: only author can edit
        if (!authLoading && user && authorId && user.id !== authorId) {
          navigate(`/medias/${mediaId}`);
          return;
        }

        setTitle(title);
        setContent(content);
        setCurrentImageUrl(imageUrl);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching media: ", err);
        setErrorMsg("Failed to load blog details. The post may have been deleted.");
        setIsLoading(false);
      });
  }, [mediaId, user, authLoading, navigate]);

  // Redirect if guest
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpdateMedia = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) {
      formData.append("fileData", file);
    }

    updateMedia(mediaId, formData)
      .then(() => {
        setIsUpdating(false);
        navigate(`/medias/${mediaId}`);
      })
      .catch((err) => {
        console.error("Error updating media: ", err);
        setErrorMsg(err.response?.data?.error || "Failed to update blog. Please try again.");
        setIsUpdating(false);
      });
  };

  if (isLoading || authLoading) {
    return <div className="loadingSpinner">Loading blog details...</div>;
  }

  return (
    <div className="formContainer">
      <Link to={`/medias/${mediaId}`} className="btnBackLink">
        <FaChevronLeft size={12} style={{ marginRight: 6 }} /> Cancel
      </Link>

      <div className="formCard">
        <h2>Edit Story</h2>
        <p className="subtitle">Modify details and update cover images</p>

        {errorMsg && <div className="errorAlert">{errorMsg}</div>}

        <form onSubmit={handleUpdateMedia} encType="multipart/form-data">
          <div className="formGroup">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Edit title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              placeholder="Tell your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="formGroup">
            <label>Cover Image</label>
            <div className="dropzone">
              <input
                type="file"
                id="fileUpload"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="fileUpload" className="dropzoneLabel">
                {previewUrl ? (
                  <div className="imagePreviewWrapper">
                    <img src={previewUrl} alt="Preview" className="imagePreview" />
                    <span className="changeImageOverlay">Replace selected cover</span>
                  </div>
                ) : currentImageUrl ? (
                  <div className="imagePreviewWrapper">
                    <img src={currentImageUrl} alt="Current Cover" className="imagePreview" />
                    <span className="changeImageOverlay">Change Cover Image</span>
                  </div>
                ) : (
                  <div className="dropzonePrompt">
                    <FaUpload size={24} className="uploadIcon" />
                    <span>Upload a new cover image</span>
                    <span className="fileTypes">PNG, JPG, WEBP up to 5MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button type="submit" className="btnSubmit" disabled={isUpdating}>
            {isUpdating ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMedia;
