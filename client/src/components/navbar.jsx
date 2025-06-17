import { useNavigate} from "react-router-dom";
import logo from '../assets/logo.png';
import '../sass/NavBar.scss';

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <nav>
        <div className="NavBar">
          <div onClick={() => navigate("/")} className="logo">
            <img src={logo} alt="Logo" />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
