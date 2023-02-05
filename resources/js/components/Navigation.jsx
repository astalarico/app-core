import React, { useState } from "react";
import NavItems from "./NavItems";
import { MediaQuery, Drawer, Button, Popover } from "@mantine/core";
import { IconUserCircle, IconAddressBook, IconLogout } from "@tabler/icons";
import { appDataState } from "@/store";
import { useRecoilValue } from "recoil";
import { NavLink } from "react-router-dom";
import { useClickOutside } from "@mantine/hooks";

export default function NavigationItems() {
    const [navDrawerOpened, setNavDrawerOpened] = useState(false);
    const appData = useRecoilValue(appDataState);
    const [profileTagOpened, setProfileTagOpened] = useState(false);
    const profileNavTagRef = useClickOutside(() => setProfileTagOpened(false));


    return (
        <div id="md-events-db-nav" className="w-[250px]">
            <div id="md-events-db-logo" className="py-6 px-2">
                logo
            </div>
            <div
                id="md-events-db-nav-inner"
                className="flex flex-col justify-between h-[calc(100%-4.1rem)]"
            >
                <MediaQuery
                    query="(max-width: 1024px)"
                    styles={{
                        display: "none",
                    }}
                >
                    <div className="md-events-db-nav-wrapper" >
                        <NavItems />
                    </div>
                </MediaQuery>
                <MediaQuery
                    query="(min-width: 1024px)"
                    styles={{
                        display: "none",
                    }}
                >
                    <div className="md-events-db-nav-wrapper">
                        <Button onClick={() => setNavDrawerOpened(true)}>
                            Nav
                        </Button>
                        <Drawer
                            opened={navDrawerOpened}
                            onClose={() => setNavDrawerOpened(false)}
                            title="Register"
                            padding="xl"
                            size="xl"
                        >
                            <NavItems />
                        </Drawer>
                    </div>
                </MediaQuery>
                <div id="events-db-profile" className="p-4">
                    <Popover
                        width="target" 
                        opened={profileTagOpened}
                        shadow="md"
                        withArrow
                        className="hover:cursor-pointer"
                    >
                        <Popover.Target>
                            <div
                                ref={profileNavTagRef}
                                className="flex"
                                onClick={() =>
                                    setProfileTagOpened((opened) => !opened)
                                }
                            >
                                <IconUserCircle className="mr-2" size="30px" />
                                <div className="flex-1">
                                    <div className="text-slate-800">
                                        {appData.user?.first_name}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {appData.user?.roles[0]}
                                    </div>
                                </div>
                            </div>
                        </Popover.Target>
                        <Popover.Dropdown
                            className="max-w-max"
                            p={0}

                        >
                            <div onClick={() => setProfileTagOpened(false)}>
                                <a
                                    href="/logout"
                                    className="py-2 px-6 items-center flex hover:cursor-pointer hover:bg-sky-50 no-underline"
                                >
                                    <IconLogout className="mr-2" />
                                    Logout
                                </a>
                                <NavLink
                                    to={`/admin/users/${appData.user?.id}/edit`}
                                    className="py-2 px-6 items-center flex hover:cursor-pointer hover:bg-sky-50 no-underline"
                                >
                                    <IconAddressBook className="mr-3 -ml-1" />
                                    Profile
                                </NavLink>
                            </div>
                        </Popover.Dropdown>
                    </Popover>
                </div>
            </div>
        </div>
    );
}
