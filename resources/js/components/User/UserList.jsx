import React, { useEffect, useState } from "react";
import { TextInput, Button, Tooltip, ActionIcon } from "@mantine/core";
import { IconSearch, IconPlus, IconTrash, IconEdit } from "@tabler/icons";

export default function UserList(props) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios("/data/users").then((response) => {
            setUsers(response.data);
        });
    }, []);

    const deleteUser = (id) => {
        axios.delete(`/data/users/${id}`).then((response) => {
            setUsers(users.filter((user) => user.id !== id));
        });
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
                    label={
                        <div className="flex items-center">
                            <IconSearch className="mr-2" />
                            Search Users
                        </div>
                    }
                />
            </div>
            <div id="app-db-user-list-container" className="rounded-md ">
                <div className="app-db-list-header flex p-4 mb-2 ">
                    <div className="app-db-list-header-item flex-1 max-w-[200px]">
                        First Name
                    </div>
                    <div className="app-db-list-header-item flex-1 max-w-[200px]">
                        Last Name
                    </div>
                    <div className="app-db-list-header-item flex-1 max-w-[250px]">Email</div>
                    <div className="app-db-list-header-item flex-1 max-w-[200px]">Role</div>
                    <div className="app-db-list-header-item flex-1 max-w-[100px]">
                        Actions
                    </div>
                </div>
                <div id="app-db-user-list-data" className="max-h-[400px]">
                    {users.map((user) => (
                        <a
                            key={user.id}
                            className="items-center border border-solid border-transparent rounded-md flex p-4 hover:border-blue-400 bg-white"
                            href={`/admin/users/${user.id}/edit`}
                        >
                            <div className="flex-1 max-w-[200px]">{user.first_name}</div>
                            <div className="flex-1 max-w-[200px]">{user.last_name}</div>
                            <div className="flex-1 max-w-[250px]">{user.email}</div>
                            <div className="flex-1 max-w-[200px]">
                                {user.roles.map((role, index) => (
                                    <span key={index}>{role}</span>
                                ))}
                            </div>
                            <div className="flex-1 max-w-[100px] flex">
                                <Tooltip label="Edit User">
                                    <ActionIcon
                                        onClick={() => editUser(user.id)}
                                        color="blue"
                                        variant="filled"
                                        className="mr-2"
                                    >
                                        <IconEdit />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Delete User">
                                    <ActionIcon
                                        onClick={() => deleteUser(user.id)}
                                        color="red"
                                        variant="filled"
                                    >
                                        <IconTrash />
                                    </ActionIcon>
                                </Tooltip>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
