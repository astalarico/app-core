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
        icon: <IconSettings size={iconSize} stroke={1.5} />,
        children: [
            {
                label: "General",
                pathname: "/admin/settings/general",
                icon: <IconAdjustmentsAlt size={iconSize} stroke={1.5} />,
                childrenOffset,
            },
        ],
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
            className="flex flex-col justify-between h-full pl-2"
        >
            {navObjects.map((navObject, index) => {

                const navIconClass = `${
                    childNavSelected || location.pathname.includes(navObject.pathname)
                        ? "text-blue-400 bg-white"
                        : "bg-slate-100"
                } p-1 leading-none rounded-md`;

                const active = ( location.pathname.includes(navObject.pathname) ) &&
                !("children" in navObject);

                const opened = selectedNav.includes(navObject.pathname);

                console.log( active, opened, navObject.pathname, location.pathname)

                const navItemClass = `flex items-center text-slate=700 ${active ? '!bg-green-400 !text-white' : 'bg-white' }  px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-500 rounded-tl-md rounded-bl-md ${opened ? 'text-blue-500' : 'text-slate-600'}`;
                
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
                                const navItemClass = `flex items-center ${active ? '!bg-green-400 !text-white' : 'bg-white' } max-w-[190px] !ml-auto px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-500 rounded-tl-md rounded-bl-md ${active ? 'border-blue-400' : 'border-transparent' }`;

                                const navIconClass = `${
                                    childNavSelected || location.pathname == child.pathname
                                        ? "text-blue-400 bg-white"
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

