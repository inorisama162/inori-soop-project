import { createRoot } from "react-dom/client";
import Home from "../app/page";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <Home vodEndpoint={`${import.meta.env.BASE_URL}vods.json`} />,
);
