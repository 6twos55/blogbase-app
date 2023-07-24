import { useEffect, useState } from "react";
import { getMedias } from "../routes/mediaRoutes";
import { Link } from "react-router-dom";



const Medias = () => {
  const [medias, setMedias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getMedias()
      .then((result) => {
        setIsLoading(false);
        setMedias(result.data);
      })
      .catch(err => {
        console.error('Error ', err);
      })
  }, []);


  if(isLoading){
    return (
      <div className="mediasContainer">
        <div>My blogs</div>
        <div style={{ textAlign: "center", color: "orange", fontSize: "20px", marginTop: "10vh", marginBottom: "60vh" }}>Loading. Please wait...</div>
      </div>
    ) 
  }


  return(
    <div className="mediasContainer">
      <div>My blogs</div>
      { 
        medias.length >= 1 ? (
          <div className="mediaList">
            {
              medias.map(media => {
                const mediaDate = new Date(media.date);
                const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
                const timeOptions = { hour: 'numeric', minute: 'numeric' };
                const formattedMediaDate = mediaDate.toLocaleDateString('en-US', dateOptions);
                const formattedMediaTime = mediaDate.toLocaleTimeString('en-US', timeOptions);

                return (

                  <li className="mediaItem" key={media._id}>
                    <Link to={`/medias/${media._id}`} style={{ textDecoration: "none" }}>
                      <img src={media.fileData} alt="Unsupported file" className="mediaImg" />
                      <h3 className="mediaTitle">{ media.title.length >= 30 ? media.title.slice(0, 30) + "....": media.title }</h3>
                      
                      <div className="mediaOptions">
                      <p className="mediaContent">{ media.content.length >= 45 ? media.content.slice(0, 45) + "...." : media.content }</p>
                      <small className="mediaDate">{ formattedMediaTime + " • " + formattedMediaDate }</small>
                      </div>
                    </Link>
                    
                  </li>
  
                )

              })
            }
          </div>
        ) : 
          <div className="noBlogs" style={{ textAlign: "center", color: "orange", fontSize: "20px", marginTop: "10vh", marginBottom: "60vh" }}>
            <h3 style={{ margin: "20px 0" }}>No blogs to view :(</h3>
            <p style={{ fontSize: "15px", margin: "0" }}>Add a blog or check connection</p>
          </div>
          
      }
      
    </div>
  );
}

export default Medias;
