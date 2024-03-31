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
import test from "./Components/test";

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
            path="/test"
            element={
              <>
                <Kopfzeile />
                <test />
              </>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
