import React, { useEffect, useState } from "react";
import { PasswordInput, TextInput, Button} from "@mantine/core";
import { useRecoilState } from "recoil";
import { appDataState } from "../../store";
import { IconDeviceFloppy } from "@tabler/icons";
import { useForm } from "@mantine/form";

export default function UserForm(props) {
    const [appData, setAppData] = useRecoilState(appDataState);
    const [user, setUser] = useState(appData?.user);

    const form = useForm({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        },
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

    useEffect( () => {
        form.setValues( user)
    }, [user])

    const saveUser = () => {
   
        if( !form.values.password ){
            delete form.values.password;
        }
        axios.put( '/data/update-user', form.values ).then( response => {
            setAppData( response.data )
        });
    }

    return (
        <div id="md-events-db-user-form" className="max-w-[650px]">
            <h2>Edit User Profile</h2>
            <form className="bg-white p-4 rounded-md" onSubmit={ e => e.preventDefault()}>
                <div className="flex flex-col w-full md:flex-row mb-7">
                    <TextInput
                        label="First Name"
                        name="first_name"
                        {...form.getInputProps('first_name')}
                        onChange={handleChange}
                        className="mb-7 w-full mr-4 md:w-[50%] md:mb-0"
                    />
                    <TextInput
                        label="Last Name"
                        name="last_name"
                        {...form.getInputProps('last_name')}
                        onChange={handleChange}
                        className="w-full md:w-[50%]"
                    />
                </div>

                <TextInput
                    disabled
                    label="Email"
                    name="email"
                    {...form.getInputProps('email')}
                    onChange={handleChange}
                    className="mb-8 lg:w-[50%]"
                />
                <TextInput
                    label="Password"
                    name="password"
                    autoComplete="off"
                    className="mb-8 lg:w-[50%]"
                    {...form.getInputProps('password')}
                />
                <Button onClick={e => saveUser()} leftIcon={<IconDeviceFloppy />} type="submit" color="blue"> Save </Button>
            </form>
        </div>
    );
}
