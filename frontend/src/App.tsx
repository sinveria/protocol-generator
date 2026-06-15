import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SessionPage from "./pages/SessionPage";

export default function App() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <header style={{ borderBottom: "2px solid #2c5", paddingBottom: 10, marginBottom: 20 }}>
        <Link to="/" style={{ textDecoration: "none", color: "#222" }}>
          <h1 style={{ margin: 0 }}>📄 Генератор протоколов ГЭК</h1>
        </Link>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session/new" element={<SessionPage />} />
        <Route path="/session/:id" element={<SessionPage />} />
      </Routes>
    </div>
  );
}