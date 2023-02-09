import React, {useEffect, useState} from "react";
import { IconUsers } from "@tabler/icons";

export default function Dashboard(props) {
    const [ dashboardData, setDashboardData ] = useState({});

    useEffect( () => {
        axios.get("/data/dashboard").then((response) => {
            setDashboardData( response.data )
        });
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div id="app-db-dashboard-components">
                <div className="flex flex-wrap border-1 border-solid border-slate-300 p-4 max-w-max rounded-md items-center bg-white">
                    <IconUsers size={32} stroke={1.5} className="mr-2 bg-orange-500 rounded-full p-2 text-white" />
                    {dashboardData.users?.length} Users
                </div>
            </div>
        </div>
    );
}
