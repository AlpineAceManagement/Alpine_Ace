import React from "react"; // Add this line
const Navi = () => {
  const mapRef = useRef(null); // Reference to the map container
  return (
    <div>
      <h1>Navi</h1>
      {/* <img
        src={require("./dashboard.png")}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      /> */}
    </div>
  );
};

export default Navi;
