import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import mixpanel from 'mixpanel-browser';

// Mixpanel 초기화
mixpanel.init('a6d30eeef83cda0e513f6b3ea08a0b3d', { debug: true });

createRoot(document.getElementById("root")!).render(<App />);
