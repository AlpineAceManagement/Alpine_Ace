import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Hauptmenu from "./Components/Hauptmenu";
import Karte from "./Components/Karte";
import Wetter from "./Components/Wetter";
import Kopfzeile from "./Components/Kopfzeile";

function App() {
  return (
    <BrowserRouter>
      <main className="main">
        <Kopfzeile />
        <Routes>
          <Route path="/" element={<Hauptmenu />} />
          <Route exact path="/Karte" element={<Karte />} />
          <Route path="*" element={<Wetter />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
