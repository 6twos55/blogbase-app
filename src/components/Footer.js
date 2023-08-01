import github from "../styles/Social icons/github.png";
import linkedin from "../styles/Social icons/linkedin.png";
import twitter from "../styles/Social icons/twitter.png";
import instagram from "../styles/Social icons/instagram.png";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="copyright">
        &copy;BlogBase 2023. All Rights Reserved.
      </p>
      <p>
        Built with MERN and Sass.
      </p>
      <p className="icons">
      <a href="https://github.com/6twos55" title="github link" target="_blank" rel="noreferrer" ><img src={ github } alt="" /></a>
      <a href="https://linkedin.com/in/sixtus-nwaogu-654005240/" title="linkedin link" target="_blank" rel="noreferrer" ><img src={ linkedin } alt="" /></a>
      <a href="https://twitter.com/NwaoguSixtus" title="twitter link" target="_blank" rel="noreferrer" ><img src={ twitter } alt="" /></a>
      <a href="https://www.instagram.com/6two_s55/" title="instagram link" target="_blank" rel="noreferrer" ><img src={ instagram } alt="" /></a>
      </p>
    </footer>
  )
}

export default Footer;
