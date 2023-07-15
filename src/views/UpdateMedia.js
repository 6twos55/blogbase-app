import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMedia, updateMedia } from "../routes/mediaRoutes";

const UpdateMedia = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getMedia(mediaId)
      .then(result => {
        const { title, content } = result.data;
        setTitle(title);
        setContent(content);
      })
      .catch(err => {
        console.error('Error fetching media: ', err);
        window.alert("Couldn't update blog. \n Check your connection and try again.");
      })

  }, [mediaId]);

  const handleUpdateMedia = (e) => {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('fileData', file);

    updateMedia(mediaId, formData)
      .then(() => {
        setIsLoading(false);
        navigate(`/medias/${mediaId}`);
      })
      .catch(err => {
        console.error('Error updating media: ', err);
        setIsLoading(false);
      });
  }
  

  return(
    <div className="updateContainer">
      <div>Update blog</div>

      <form onSubmit={handleUpdateMedia} encType="multipart/form-data">
        <div>
          <legend>Title: </legend>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <legend>Content: </legend>
          <textarea
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <legend>File: </legend>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update' }
        </button>
      </form>

    </div>
  );

}

export default UpdateMedia;