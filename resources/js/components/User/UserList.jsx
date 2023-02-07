import React, { useEffect, useState } from "react";
import { TextInput, Button, Tooltip, ActionIcon } from "@mantine/core";
import { IconSearch }  from "@tabler/icons";

export default function UserList(props) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios("/data/users").then((response) => {
            setUsers(response.data);
        });
    }, []);

    return (
        <div id="app-db-user-list">
            <h1>users</h1>
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
                    <div className="app-db-list-header-item flex-1">
                        First Name
                    </div>
                    <div className="app-db-list-header-item flex-1">
                        Last Name
                    </div>
                    <div className="app-db-list-header-item flex-1">Email</div>
                    <div className="app-db-list-header-item flex-1">Role</div>
                </div>
                <div id="app-db-user-list-data" className="max-h-[400px]">
                    {users.map((user) => (
                        <a
                            key={user.id}
                            className="border border-solid border-transparent rounded-md flex p-4 hover:border-blue-400 bg-white"
                            href={`/admin/users/${user.id}/edit`}
                        >
                            <div className="flex-1">{user.first_name}</div>
                            <div className="flex-1">{user.last_name}</div>
                            <div className="flex-1">{user.email}</div>
                            <div className="flex-1">
                                {user.roles.map((role, index) => (
                                    <span key={index}>{role}</span>
                                ))}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
