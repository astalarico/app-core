import React, { useEffect, useState } from "react";
import { PasswordInput, TextInput } from "@mantine/core";
import { useRecoilState } from "recoil";
import { appDataState } from "../../store";
import { useForm } from "@mantine/form";

export default function UserForm(props) {
    const [appData, setAppData] = useRecoilState(appDataState);
    const [user, setUser] = useState(appData?.user);
    const form = useForm({
        initialValues: user,
        validationRules: {
            first_name: (value) => value.length > 0,
            last_name: (value) => value.length > 0,
            email: (value) => value.length > 0,
        },
    });
    const handleChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value,
        });
    };

    useEffect(() => {
        setUser(appData.user);
    }, [appData]);

    return (
        <div id="md-events-db-user-form" className="max-w-[650px]">
            <h2>Edit User Profile</h2>
            <form>
                <div className="flex flex-col w-full md:flex-row mb-7">
                    <TextInput
                        label="First Name"
                        name="first_name"
                        value={user?.first_name}
                        onChange={handleChange}
                        className="mb-7 w-full mr-4 md:w-[50%] md:mb-0"
                    />
                    <TextInput
                        label="Last Name"
                        name="last_name"
                        value={user?.last_name}
                        onChange={handleChange}
                        className="w-full md:w-[50%]"
                    />
                </div>

                <TextInput
                    disabled
                    label="Email"
                    name="email"
                    value={user?.email}
                    onChange={handleChange}
                    className="mb-8 lg:w-[50%]"
                />
                <PasswordInput
                    label="Password"
                    name="password"
                    autoComplete="off"
                    className="mb-8 lg:w-[50%]"
                />
            </form>
        </div>
    );
}
