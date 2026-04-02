import AppRoutes from "./routes/AppRoutes";
import "./index.css";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster position="top-center"
     toastOptions={{
    style: {
      background: "#F7DD43", 
      color: "#0f2f24", 
      border: "1px solid #0f2f24",
      padding: "14px 18px",
      borderRadius: "12px",
      fontWeight: "600",
    },
    success: {
      iconTheme: {
        primary: "#F7DD43", 
        secondary: "#0f2f24",
      },
    },
    error: {
      iconTheme: {
        primary: "#dc2626",
        secondary: "#fff",
      },
      style: {
        background: "#2a0f0f",
        color: "#fecaca",
        border: "1px solid #dc2626",
      },
    },
  }} />
      <AppRoutes />;
    </>
    )
}