import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./components/App";
import { BrowserRouter as Router} from 'react-router-dom';

createRoot(document.getElementById("md-events-db-root")).render(
    <RecoilRoot>
        <Router>
            <App />
        </Router>
    </RecoilRoot>
);
