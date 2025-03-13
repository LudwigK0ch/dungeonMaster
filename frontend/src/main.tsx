import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import Navbar from "./components/navbar/Navbar";
import EncounterTable from "./components/encounterTable/EncounterTable";
import Home from "./components/home/Home";
import Campaigns from "./components/campaigns/Campaigns";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/encounter" element={<EncounterTable />} />
        </Routes>
      </div>
    </Router>
  </StrictMode>
);
