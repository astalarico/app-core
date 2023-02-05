import React,{useEffect} from "react";
import AppRoutes from "./AppRoutes";
import Navigation from "./Navigation";
import { useRecoilState } from "recoil";
import { appDataState } from "../store";
import axios from "axios";

export default function App(props) {
    const [appData, setAppData] = useRecoilState(appDataState);
 
    useEffect(() => {
        axios('/data/init').then((response) => {
            setAppData(response.data);
        });
    }, []);

    return (
        <div id="md-events-db-app-container" className="flex h-full">
            <Navigation />
            <div id="md-events-db-data" className="flex-1 p-4 border-l border-r-0 border-b-0 border-t-0 border-slate-200 border-solid">
                <AppRoutes />
            </div>
        </div>
    );
}
