import { DrawboardView } from "./view/DrawboardView/DrawboardView";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoomCreateView } from "./view";
import * as React from "react";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/r/:roomId" Component={DrawboardView} />
        <Route path="*" Component={RoomCreateView} />
      </Routes>
    </BrowserRouter>
  );
}
