import React, { useEffect, useState } from "react";
import { TextInput, Button } from "@mantine/core";
import { useRecoilState } from "recoil";
import { appDataState } from "../../store";
import { IconDeviceFloppy } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    timer: 3000,
    timerProgressBar: false,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

export default function UserForm(props) {
    const [appData, setAppData] = useRecoilState(appDataState);

    const { id } = useParams();

    const form = useForm({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
        },
        validate: {
            first_name: (value) => value.length > 0 ? null : "First Name is required",
            last_name: (value) => value.length > 0 ? null : "Last Name is required",
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const handleChange = (event) => {
        form.setFieldValue(event.target.name, event.target.value);
    };

    useEffect(() => {
        axios.get(`/data/users/${id}`).then((response) => {
            form.setValues(response.data);
        });
    }, []);

    const saveUser = () => {
   
        const validation = form.validate();
     
        if( ! validation.hasErrors ){
        
            axios.put(`/data/users/${id}`, form.values).then((response) => {
                const { data } = response;
        
                if (!("password" in data)) {
                    data.password = "";
                }

                form.setValues(data);

                Toast.fire({
                    icon: 'success',
                    title: 'User Profile Updated'
                })
            });
        }
    };

    return (
        <div id="md-events-db-user-form" className="max-w-[650px]">
            <h2>Edit User Profile</h2>
            <form
                className="bg-white p-4 rounded-md"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="flex flex-col w-full md:flex-row mb-7">
                    <TextInput
                        label="First Name"
                        withAsterisk
                        name="first_name"
                        {...form.getInputProps("first_name")}
                        onChange={handleChange}
                        className="mb-7 w-full mr-4 md:w-[50%] md:mb-0"
                    />
                    <TextInput
                        label="Last Name"
                        name="last_name"
                        withAsterisk
                        {...form.getInputProps("last_name")}
                        onChange={handleChange}
                        className="w-full md:w-[50%]"
                    />
                </div>

                <TextInput
                    disabled
                    label="Email"
                    name="email"
                    withAsterisk
                    {...form.getInputProps("email")}
                    onChange={handleChange}
                    className="mb-8 lg:w-[50%]"
                />
                <TextInput
                    label="Password"
                    name="password"
                    autoComplete="off"
                    className="mb-8 lg:w-[50%]"
                    {...form.getInputProps("password")}
                    onChange={handleChange}
                />
                <Button
                    onClick={(e) => saveUser()}
                    leftIcon={<IconDeviceFloppy />}
                    type="submit"
                    color="blue"
                >
                    Save
                </Button>
            </form>
        </div>
    );
}
