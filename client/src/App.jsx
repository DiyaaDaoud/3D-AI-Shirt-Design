import { useState } from "react";
import "./App.css";
import { Customizer, Home } from "./pages";
import CanvasModel from "./canvas";

function App() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <CanvasModel />
      <Customizer />
    </main>
  );
}

export default App;
