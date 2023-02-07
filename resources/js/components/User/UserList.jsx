import React, { useEffect, useState } from "react";
import { TextInput, Button, Tooltip, ActionIcon, Loader } from "@mantine/core";
import { IconSearch, IconPlus, IconTrash, IconEdit } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { appDataState } from "../../store";

export default function UserList(props) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const appData = useRecoilValue(appDataState);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios("/data/users").then((response) => {
            setUsers(response.data);
            setFilteredUsers(response.data);
            setLoading(false);
        });
    }, []);

    const deleteUser = (id) => {
        axios.delete(`/data/users/${id}`).then((response) => {
            setUsers(response.data);
        });
    };

    const filterUsers = (search) => {
        setSearch(search);
        if (search.length > 0) {
            const filtered = users.filter((user) => {
                return (
                    user.first_name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    user.last_name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase())
                );
            });
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };

    return (
        <div id="app-db-user-list">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl">Users</h1>
                <div className="flex items-center">
                    <Button
                        leftIcon={<IconPlus />}
                        onClick={() =>
                            (window.location.href = "/admin/users/create")
                        }
                        color="blue"
                    >
                        Create
                    </Button>
                </div>
            </div>

            <div className="flex mb-4">
                <TextInput
                    placeholder="Search Users"
                    className="w-full max-w-[300px]"
                    value={search}
                    onChange={(e) => filterUsers(e.target.value)}
                    label={
                        <div className="flex items-center">
                            <IconSearch className="mr-2" />
                            Search Users
                        </div>
                    }
                />
            </div>
            <div
                id="app-db-user-list-container"
                className="rounded-md max-w-[1075px]"
            >
                <div className="app-db-list-header flex p-4 mb-1 font-bold ">
                    <div className="app-db-list-header-item flex-1 max-w-[200px] px-1">
                        First Name
                    </div>
                    <div className="app-db-list-header-item flex-1 max-w-[250px] px-1">
                        Last Name
                    </div>
                    <div className="app-db-list-header-item flex-1 max-w-[330px] px-1">
                        Email
                    </div>
                    <div className="app-db-list-header-item flex-1 max-w-[200px] px-1">
                        Role
                    </div>
                    <div className="app-db-list-header-item flex-1 max-w-[65px] px-1">
                        Actions
                    </div>
                </div>
                {loading && (
                    <div className="flex justify-center">
                        <Loader className="text-center" />
                    </div>
                )}
                {!loading && (
                    <div
                        id="app-db-user-list-data"
                        className="max-h-[400px] overflow-y-auto"
                    >
                        {filteredUsers.map((user) => {
                            console.log( user )
                            return (
                                <div
                                    key={user.id}
                                    className="items-center border border-solid border-transparent rounded-md flex px-4 py-2 my-1 hover:border-blue-400 bg-white"
                                >
                                    <div className="flex-1 max-w-[200px] px-1">
                                        {user.first_name}
                                    </div>
                                    <div className="flex-1 max-w-[250px] px-1">
                                        {user.last_name}
                                    </div>
                                    <div className="flex-1 max-w-[330px] px-1">
                                        <a href={`mailto:${user.email}`}>
                                            {user.email}
                                        </a>
                                    </div>
                                    <div className="flex-1 max-w-[200px] px-1">
                                        {user.roles.map((role, index) => (
                                            <span key={index}>{role}</span>
                                        ))}
                                    </div>
                                    <div className="flex-1 max-w-[65px] flex px-1">
                                        <Tooltip label="Edit User">
                                            <ActionIcon
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/users/${user.id}/edit`
                                                    )
                                                }
                                                color="blue"
                                                variant="subtle"
                                                className="mr-2"
                                            >
                                                <IconEdit />
                                            </ActionIcon>
                                        </Tooltip>

                                        {appData.user?.id !== user.id && (
                                            <Tooltip label="Delete User">
                                                <ActionIcon
                                                    onClick={() =>
                                                        deleteUser(user.id)
                                                    }
                                                    color="red"
                                                    variant="subtle"
                                                >
                                                    <IconTrash />
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
