import React, { useEffect, useState } from "react";

import { Box, NavLink as NavItem, Drawer, Group, Button } from "@mantine/core";
import {
    IconDashboard,
    IconFingerprint,
    IconBuildingCommunity,
    IconCalendar,
    IconSettings,
    IconTool,
    IconListDetails,
    IconAdjustmentsAlt,
    IconUsers,
} from "@tabler/icons";
import { useLocation, NavLink } from "react-router-dom";
import { appDataState } from "../store";
import { useRecoilValue } from "recoil";

const childrenOffset = 0;
const iconSize = 22;
const navObjects = [
    {
        label: "Dashboard",
        pathname: "/admin/dashboard",
        restricted: true,
        icon: <IconDashboard size={iconSize} stroke={1.5} />,
    },
    {
        label: "Users",
        pathname: "/admin/users",
        restricted: true,
        icon: <IconUsers size={iconSize} stroke={1.5} />,
    },
    {
        label: "Settings",
        pathname: "/admin/settings",
        restricted: true,
        icon: <IconSettings size={iconSize} stroke={1.5} />
    },
];

export default function NavigationItems() {
    const appData = useRecoilValue(appDataState);
    const location = useLocation();
    const [activeNav, setActiveNav] = useState(location.pathname);
    const [selectedNav, setSelectedNav] = useState(activeNav);
    const [childNavSelected, setChildNavSelected] = useState(false);
    const [ navOpened, setNavOpened ] = useState(false);

    useEffect( () => {
        // setActiveNav(location.pathname);
        // setSelectedNav(location.pathname);

    }, [location.pathname])

    return (
        <div
            id="md-events-db-nav-items"
            className="flex flex-col justify-between h-full overflow-hidden items-center mx-4"
        >
            {navObjects.map((navObject, index) => {

                const navIconClass = `${
                    childNavSelected || location.pathname.includes(navObject.pathname)
                        ? "text-white bg-green-400"
                        : "bg-slate-100"
                } p-1 leading-none rounded-md`;

                const active = ( location.pathname.includes(navObject.pathname) ) 

                const opened = selectedNav.includes(navObject.pathname);
                const navItemClass = `flex items-center text-slate-700 ${active ? '!bg-slate-100 !text-blue-500' : 'bg-white' } py-2 text-sm font-medium text-slate-600 hover:text-blue-500 hover:bg-slate-100 }} rounded-md`;
                
                return (
                    <NavItem
                        onClick={() => {
                            if (!("children" in navObject)) {
                                setActiveNav(navObject.pathname);
                                setSelectedNav("");
                            } else if ("children" in navObject) {
                                setSelectedNav(navObject.pathname);
                            }
                        }}
                        opened={opened}
                        key={navObject.label}
                        active={active}
                        component={NavLink}
                        label={navObject.label}
                        icon={
                            <div className={navIconClass}>{navObject.icon}</div>
                        }
                        to={`/admin/${navObject.label.toLowerCase()}`}
                        className={navItemClass}
                        style={{ marginLeft: navObject.childrenOffset }}
                    >
                        {navObject.children &&
                            navObject.children.map((child, childIndex) => {
                                const key = child.label + index;
                                const active = location.pathname == child.pathname;
                                const navItemClass = `rounded-md flex items-center ${active ? '!bg-white' : 'bg-white' } !px-0 py-2 text-sm font-medium text-slate-600 hover:text-blue-500 ${active ? 'border-blue-400' : 'border-transparent' } w-full`;

                                const navIconClass = `${
                                    childNavSelected || location.pathname == child.pathname
                                        ? "text-white bg-green-400"
                                        : "bg-slate-100"
                                } p-1 leading-none rounded-md`;
                                return (
                                    <NavItem
                                        onClick={() => {
                                            setActiveNav(child.pathname);
                                        }}
                                        active={active}
                                        label={child.label}
                                        icon={     <div className={navIconClass}>{child.icon}</div>}
                                        key={key}
                                        component={NavLink}
                                        to={`/admin/${navObject.label.toLowerCase()}/${child.label.toLowerCase()}`}
                                        className={navItemClass}
                                        style={{
                                            paddingLeft: 12,
                                            marginLeft: child.childrenOffset,
                                       
                                        }}
                                    />
                                );
                            })}
                    </NavItem>
                );
            })}
        </div>
    );
}

