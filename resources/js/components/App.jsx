import React, { useEffect, useState } from "react";
import AppRoutes from "./AppRoutes";
import Navigation from "./Navigation";
import { useRecoilState } from "recoil";
import { appDataState } from "../store";
import axios from "axios";
import { MediaQuery, Drawer, ActionIcon } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";

export default function App(props) {
    const [appData, setAppData] = useRecoilState(appDataState);

    useEffect(() => {
        axios("/data/init").then((response) => {
            setAppData({
                ...appData,
                ...response.data,
            });
        });
    }, []);

    return (
        <div id="md-events-db-app-container" className="flex h-full">
            <MediaQuery
                query="(max-width: 1200px)"
                styles={{
                    display: "none",
                }}
            >
                <div className="media-query-wrapper">
                    <Navigation />
                </div>
            </MediaQuery>
            <MediaQuery
                query="(min-width: 1200px)"
                styles={{
                    display: "none",
                }}
            >
                <Drawer
                    opened={appData.navDrawerOpened}
                    onClose={() =>
                        setAppData({
                            ...appData,
                            navDrawerOpened: false,
                        })
                    }
                    padding="xl"
                    size="lg"
                >
                    <Navigation />
                </Drawer>
            </MediaQuery>
            <div
                id="md-events-db-data"
                className="flex-1 px-8 bg-slate-100 overflow-y-auto"
            >
                <MediaQuery
                    query="(min-width: 1200px)"
                    styles={{
                        display: "none",
                    }}
                >
                    <div className="media-query-wrapper">
                        <ActionIcon
                            onClick={() =>
                                setAppData({
                                    ...appData,
                                    navDrawerOpened: true,
                                })
                            }
                            className="pl-0 mt-2"
                            color="blue"
                            variant="filled"
                            size="xl"
                        >
                            <IconMenu2 />
                        </ActionIcon>
                    </div>
                </MediaQuery>
                <AppRoutes />
            </div>
        </div>
    );
}
