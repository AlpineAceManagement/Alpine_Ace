import { Link } from "react-router-dom";
const Hauptmenu = () => {
  return (
    <div className="main">
      <h1>Hautmenü</h1>
      <Link to="/Karte">
        <button>Karte</button>
      </Link>
      <Link to="/Wetter">
        <button>Wetter</button>
      </Link>
    </div>
  );
};

export default Hauptmenu;
