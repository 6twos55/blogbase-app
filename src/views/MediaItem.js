import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteMedia, getMedia } from "../routes/mediaRoutes";
import trashcan from "../styles/trashcan.svg";


const MediaItem = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const itemDate = new Date(item.date);
  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: 'numeric' };
  const formattedItemDate = itemDate.toLocaleDateString('en-US', dateOptions);
  const formattedItemTime = itemDate.toLocaleTimeString('en-US', timeOptions);

  useEffect(() => {
    setIsLoading(true);
    getMedia(mediaId)
      .then(result => {
        setIsLoading(false);
        setItem(result.data)
      })
      .catch(err => {
        console.error('Error: ', err);
      })

  }, [mediaId])

    // delete a media
    const handleDeleteMedia = (mediaId) => {
      deleteMedia(mediaId)
        .then(() => {
          navigate("/");
        })
        .catch(err => {
          console.error('Error ', err);
        })
    }



  if(isLoading){
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: "orange", fontSize: "20px", height: '70vh', textAlign: 'center'}}>Loading... Free server, please pardon the slowness 🧘‍♂️</div>;
  }

  
  return (
    <div className="itemContainer">
      <div className="itemCover">
      
        <h2>{ item.title }</h2>
        <img src={ item.fileData } alt="Unsupported file" />
        <p className="itemDate">{ formattedItemTime + " • " + formattedItemDate }</p>
        <p className="itemContent">{ item.content }</p>

        <div className="actions">
          <Link to={`/update_media/${item._id}`}>Update media</Link>
          <div onClick={() => handleDeleteMedia(item._id)}><img src={trashcan} alt="" title="Delete blog" /></div>
        </div>

      </div>
    </div>
  );
}

export default MediaItem;
