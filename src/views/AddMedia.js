import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addMedia } from "../routes/mediaRoutes";
import { useAuth } from "../context/AuthContext";
import { FaUpload, FaChevronLeft } from "react-icons/fa";

const AddMedia = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
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

  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Please select an image file.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("fileData", file);

    addMedia(formData)
      .then(() => {
        setIsLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.error("Couldn't add media: ", err);
        setErrorMsg(err.response?.data?.error || "Failed to create post. Please try again.");
        setIsLoading(false);
      });
  };

  if (authLoading) {
    return <div className="loadingSpinner">Loading credentials...</div>;
  }

  return (
    <div className="formContainer">
      <Link to="/" className="btnBackLink">
        <FaChevronLeft size={12} style={{ marginRight: 6 }} /> Cancel
      </Link>

      <div className="formCard">
        <h2>Write a Story</h2>
        <p className="subtitle">Publish a new blog post with an image</p>

        {errorMsg && <div className="errorAlert">{errorMsg}</div>}

        <form onSubmit={handleAddMedia} encType="multipart/form-data">
          <div className="formGroup">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Give your story a catchy title"
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
                required
              />
              <label htmlFor="fileUpload" className="dropzoneLabel">
                {previewUrl ? (
                  <div className="imagePreviewWrapper">
                    <img src={previewUrl} alt="Preview" className="imagePreview" />
                    <span className="changeImageOverlay">Change Image</span>
                  </div>
                ) : (
                  <div className="dropzonePrompt">
                    <FaUpload size={24} className="uploadIcon" />
                    <span>Click to select an image</span>
                    <span className="fileTypes">PNG, JPG, WEBP up to 5MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button type="submit" className="btnSubmit" disabled={isLoading}>
            {isLoading ? "Publishing Story..." : "Publish Story"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedia;