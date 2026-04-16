import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import mixpanel from 'mixpanel-browser';

// Mixpanel 초기화
mixpanel.init('B32D8265A148455CB07F704BE7A648AA', { debug: true });

createRoot(document.getElementById("root")!).render(<App />);
