import React, { useEffect, useState } from "react";
import { TextInput, Button, Tooltip, ActionIcon } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
    IconBrandGoogleDrive,
    IconKey,
    IconTrash,
    IconShieldLock,
    IconDeviceFloppy,
} from "@tabler/icons";
import FieldLabel from "../FieldLabel";
import "./settings.scss";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    timer: 3000,
    timerProgressBar: false,
});


export default function GeneralSettings(props) {
    const [ settingsId, setSettingsId ] = useState(0);

    useEffect( () => {
        axios.get("/data/settings").then((response) => {
            setSettingsId( response.data.id)
            console.log( response.data )
            form.setValues(response.data);
        });
    }, []);

    const form = useForm({
        initialValues: {
            google_maps_api_key: "",
            app_api_tokens : []
        },
    });

    const addToken = () => {
        axios.get("/data/create-api-token").then((response) => {
            const {app_api_tokens} = response.data;
            setSettingsId( response.data.id)
            form.setValues({
                ...form.values,
                app_api_tokens,
            });

            Toast.fire({
                icon: 'success',
                title: 'Api Token Added'
            });
        });
    };

    const revokeToken = (token) => {
        
        axios
            .post("/data/revoke-api-token", {
                token,
            })
            .then((response) => {
                const {app_api_tokens} = response.data;
                form.setValues({
                    ...form.values,
                    app_api_tokens,
                });

                Toast.fire({
                    icon: 'success',
                    title: 'API Token Removed'
                });
            });
    };

    const saveSetting = (setting) => {
        axios
            .put(`/data/settings/${settingsId}`, {
                setting,
                value: form.values[setting],
            })
            .then((response) => {
                form.setValues(response.data);
                Toast.fire({
                    icon: 'success',
                    title: `Settings Updated`
                });
            });
    };

    return (
        <div id="md-events-db-settings">
            <h2>General Settings</h2>
            <div className="field-groups">
                <div className="field-group w-full max-w-[450px]">
                    <TextInput
                        className="w-full mb-7 p-4 bg-white rounded-md"
                        {...form.getInputProps("google_maps_api_key")}
                        label={
                            <FieldLabel
                                Icon={IconBrandGoogleDrive}
                                label="Google Maps API Key"
                                SaveButton={
                                    <Button
                                        leftIcon={<IconDeviceFloppy />}
                                        size="xs"
                                        color="green"
                                        onClick={() =>
                                            saveSetting("google_maps_api_key")
                                        }
                                    >
                                        Save
                                    </Button>
                                }
                            />
                        }
                        onChange={(event) =>
                            form.setValues({
                                ...form.values,
                                google_maps_api_key: event.target.value,
                            })
                        }
                        name="google_maps_api_key"
                    />
                    <div
                        id="app-api-tokens-list"
                        className="bg-white px-4 pt-4 pb-2 w-full rounded-md"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="font-bold">API Tokens</div>
                            <Button
                                size="xs"
                                color="green"
                                onClick={addToken}
                                leftIcon={<IconShieldLock />}
                            >
                                Add Token
                            </Button>
                        </div>

                        <div className="" id="app-api-tokens">
                            {form.values.app_api_tokens.map((token) => {
                                return (
                                    <div
                                        className="flex items-center mb-4 w-full"
                                        key={token.id}
                                    >
                                        <div className="flex items-center">
                                            <IconKey
                                                size={20}
                                                className="mr-4"
                                            />
                                            <div className="text-sm token-text">
                                                {token.bearer}
                                            </div>
                                        </div>
                                        <Tooltip
                                            label="Revoke Token"
                                            position="right"
                                        >
                                            <Button
                                                className="max-w-max ml-auto"
                                                variant={"subtle"}
                                                color="red"
                                                onClick={() =>
                                                    revokeToken(token)
                                                }
                                            >
                                                <IconTrash />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
