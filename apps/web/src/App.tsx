import { DrawboardView } from "./view/DrawboardView/DrawboardView";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoomCreateView } from "./view";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
queryClient.getQueryCache().subscribe((event) => {
  if (event?.type === "observerResultsUpdated") {
    event.query?.invalidate();
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/r/:roomId" Component={DrawboardView} />
          <Route path="*" Component={RoomCreateView} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
