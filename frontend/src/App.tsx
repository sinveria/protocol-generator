import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SessionPage from "./pages/SessionPage";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/">
          <h1>Генератор протоколов ГЭК</h1>
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