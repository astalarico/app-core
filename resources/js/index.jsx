import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./components/App";
import { BrowserRouter as Router } from "react-router-dom";
import { MantineProvider, createEmotionCache } from "@mantine/core";
const myCache = createEmotionCache({ key: "mantine" });

createRoot(document.getElementById("md-events-db-root")).render(
    <RecoilRoot>
        <MantineProvider
            emotionCache={myCache}
            withGlobalStyles
            withNormalizeCSS
            theme={{
                breakpoints: {
                    xs: 500,
                    sm: 640,
                    md: 768,
                    lg: 1024,
                    xl: 1280,
                },
            }}
        >
            <Router>
                <App />
            </Router>
        </MantineProvider>
    </RecoilRoot>
);
