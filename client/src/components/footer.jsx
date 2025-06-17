import { useNavigate, useLocation } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Fingerprint from '@mui/icons-material/Fingerprint';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPlaylist = location.pathname === "/playlist";
  const isPlaylistObs = location.pathname === "/playlist-obs";

  const handleClick = () => {
    navigate(isPlaylist ? "/" : "/playlist");
  };

  const handleToPlaylistObs = () => {
    navigate(isPlaylistObs ? "/" : "/playlist-obs");
  };

  return (
    <footer>
      <IconButton
        aria-label="to-playlist"
        color="secondary"
        onClick={handleClick}
        sx={{ fontSize: 40 }}
      >
        <Fingerprint sx={{ fontSize: 40 }} />
      </IconButton>

      <IconButton
        aria-label="to-playlist-obs"
        color="success"
        onClick={handleToPlaylistObs}
        sx={{ fontSize: 40 }}
      >
        <Fingerprint sx={{ fontSize: 40 }} />
      </IconButton>
    </footer>
  );
};

export default Footer;
