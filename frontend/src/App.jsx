import GhostCursor from "./components/GhostCursor/GhostCursor";
import { Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <>
      <GhostCursor
        color="#6366F1"
        brightness={0.7}
        trailLength={35}
        inertia={0.35}
        grainIntensity={0.025}
        bloomStrength={0.08}
        fadeDelayMs={800}
        fadeDurationMs={1200}
        zIndex={0}
      />
      <div style={{ position: "relative", zIndex: 1, height: "100vh" }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </div>
    </>
  );
}
