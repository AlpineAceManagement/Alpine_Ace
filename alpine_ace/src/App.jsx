import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Component } from "react";
import "./App.css";
import Hauptmenu from "./Components/Hauptmenu";
import Karte from "./Components/Karte";
import Wetter from "./Components/Wetter";
import Kopfzeile from "./Components/Kopfzeile";
import Statistiken from "./Components/Statistiken";
import Navi from "./Components/Navi";
import Bewertungen from "./Components/Bewertungen";
import Restaurant from "./Components/Restaurant";
import Test from "./Components/_alt/test";
import Graph from "./Components/Graph";
import Einstellungen from "./Components/Einstellungen";
import Test_2 from "./Components/_alt/test_2";
import Test_3 from "./Components/_alt/test_3";
import GPX_Viewer from "./Components/GPX_Viewer";
import Kopfzeile_Statistiken from "./Components/Kopfzeile_Statistiken";
import Restaurant_Viewer from "./Components/Restaurant_Viewer";
import Kopfzeile_Restaurant from "./Components/Kopfzeile_Restaurant";

function App() {
  return (
    <BrowserRouter>
      <main className="main">
        <Routes>
          <Route path="/" element={<Hauptmenu />} />
          <Route
            exact
            path="/Karte"
            element={
              <>
                <Kopfzeile />
                <Karte />
              </>
            }
          />
          <Route
            exact
            path="/Wetter"
            element={
              <>
                <Kopfzeile />
                <Wetter />
              </>
            }
          />
          <Route
            exact
            path="/Statistiken"
            element={
              <>
                <Kopfzeile />
                <Statistiken />
              </>
            }
          />
          <Route
            exact
            path="/Navi"
            element={
              <>
                <Kopfzeile />
                <Navi />
              </>
            }
          />
          <Route
            exact
            path="/Bewertungen"
            element={
              <>
                <Kopfzeile />
                <Bewertungen />
              </>
            }
          />
          <Route
            exact
            path="/Restaurant"
            element={
              <>
                <Kopfzeile />
                <Restaurant />
              </>
            }
          />
          <Route
            exact
            path="/Restaurant_Viewer"
            element={
              <>
                <Kopfzeile_Restaurant />
                <Restaurant_Viewer />
              </>
            }
          />
          <Route
            exact
            path="/Graph"
            element={
              <>
                <Kopfzeile />
                <Graph />
              </>
            }
          />

          <Route
            exact
            path="/Einstellungen"
            element={
              <>
                <Kopfzeile />
                <Einstellungen />
              </>
            }
          />

          <Route
            exact
            path="/GPX_Viewer"
            element={
              <>
                <Kopfzeile_Statistiken />
                <GPX_Viewer />
              </>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
