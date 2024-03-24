import React from "react"; // Add this line
import { Link } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Kopfzeile = () => {
  return (
    <div className="Kopfzeile">
      <Link to="/">
        <ArrowBackIosNewIcon className="zurueck-icon" />
      </Link>
    </div>
  );
};

export default Kopfzeile;
