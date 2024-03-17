import { Link } from "react-router-dom";
const Kopfzeile = () => {
  return (
    <div>
      <h1>Kopfzeile</h1>
      <Link to="/">
        <button>Zurück zum Hauptmenü</button>
      </Link>
    </div>
  );
};

export default Kopfzeile;
