import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMedia } from "../routes/mediaRoutes";

const AddMedia = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleAddMedia = (e) => {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('fileData', file);

    addMedia(formData)
      .then(() => {
        setIsLoading(false);
        navigate('/');
      })
      .catch(err => {
        console.error("Couldn't add media: ", err);
        window.alert("Couldn't add blog. \n Check your connection and try again.");
      })
  }

  return(
    <div className="addMediaContainer">
      <div>Add blog</div>

      <form onSubmit={handleAddMedia} encType="multipart/form-data">
        <div>
          <legend>Title: </legend>
          <input
            type="text"
            value={ title }
            onChange={(e)=>{ setTitle(e.target.value)} }
            required
          />
        </div>
        <div>
          <legend>Content: </legend>
          <textarea
            type="text"
            value={ content }
            onChange={(e)=>{ setContent(e.target.value)} }
            required
          />
        </div>
        <div>
          <legend>File: </legend>
          <input
            type="file"
            onChange={(e) => { setFile(e.target.files[0]) }}
            required
          />
        </div>
        <button type="submit" disabled={isLoading} >
          { isLoading ? 'Adding...' : 'Add media' }
        </button>
      </form>
    </div>
  )
}


export default AddMedia;