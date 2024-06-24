import { useState } from "react";
import { Routing } from "./Router/Routing";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </>
  );
}

export default App;
