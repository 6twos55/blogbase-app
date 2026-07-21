import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getMedia, updateMedia } from "../routes/mediaRoutes";
import { useAuth } from "../context/AuthContext";
import { FaUpload, FaChevronLeft } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const UpdateMedia = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: media, isLoading: isFetching } = useQuery({
    queryKey: ["media", mediaId],
    queryFn: async () => {
      const res = await getMedia(mediaId);
      return res.data;
    },
  });

  useEffect(() => {
    if (media) {
      // Route Guard: only author can edit
      if (!authLoading && user && media.authorId && user.id !== media.authorId) {
        navigate(`/medias/${mediaId}`);
        return;
      }
      setTitle(media.title);
      setContent(media.content);
      setCurrentImageUrl(media.imageUrl);
    }
  }, [media, user, authLoading, mediaId, navigate]);

  // Redirect if guest
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      await updateMedia(mediaId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["medias"]);
      queryClient.invalidateQueries(["media", mediaId]);
      navigate(`/medias/${mediaId}`);
    },
    onError: (err) => {
      console.error("Error updating media: ", err);
      setErrorMsg(err.response?.data?.error || "Failed to update blog. Please try again.");
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpdateMedia = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) {
      formData.append("fileData", file);
    }

    updateMutation.mutate(formData);
  };

  if (isFetching || authLoading) {
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

          <button type="submit" className="btnSubmit" disabled={updateMutation.isLoading}>
            {updateMutation.isLoading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMedia;
