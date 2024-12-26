import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";

function App() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-background flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}

export default App;
