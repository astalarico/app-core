import React, { useEffect, useState } from "react";
import { TextInput, Button, Tooltip, Grid, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { dataArrayToSelectOptions } from "@/utility";
import {
    IconBrandGoogleDrive,
    IconKey,
    IconTrash,
    IconShieldLock,
    IconWriting,
    IconPhotoUp,
    IconAffiliate,
    IconAddressBook,
    IconPlus,
} from "@tabler/icons";
import FieldLabel from "../FieldLabel";
import "./settings.scss";
import Swal from "sweetalert2";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import SaveButton from "../SaveButton";
import { useRecoilState } from "recoil";
import { appDataState } from "@/store";

registerPlugin(FilePondPluginImagePreview);

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    timer: 3000,
    timerProgressBar: false,
});

export default function GeneralSettings(props) {
    const [appData, setAppData] = useRecoilState(appDataState);
    const [settingsId, setSettingsId] = useState(0);
    const [files, setFiles] = useState([]);
    const [settings, setSettings] = useState({});

    const form = useForm({
        initialValues: {
            app_name: "",
            google_maps_api_key: "",
            app_api_tokens: [],
            app_logo: "",
            open_ai_key: "",
            admin_contact: "",
        },
    });

    useEffect(() => {
        axios.get("/data/settings").then((response) => {
            setSettings(response.data);

            if (
                response.data.app_logo &&
                response.data.app_logo !== "undefined"
            ) {
                setFiles([
                    {
                        source: response.data.app_logo,
                        type: "local",
                    },
                ]);
            }
            setSettingsId(response.data.id);
            form.setValues(response.data);
        });
    }, []);

    useEffect(() => {}, [settings, files]);

    const addToken = () => {
        axios.get("/data/create-api-token").then((response) => {
            const { app_api_tokens } = response.data;
            setSettingsId(response.data.id);
            form.setValues({
                ...form.values,
                app_api_tokens,
            });

            Toast.fire({
                icon: "success",
                title: "Api Token Added",
            });
        });
    };

    const revokeToken = (token) => {
        axios
            .post("/data/revoke-api-token", {
                token,
            })
            .then((response) => {
                const { app_api_tokens } = response.data;
                form.setValues({
                    ...form.values,
                    app_api_tokens,
                });

                Toast.fire({
                    icon: "success",
                    title: "API Token Removed",
                });
            });
    };

    const saveSetting = (setting) => {
        var formData = new FormData();

        if (setting === "app_logo" && form.values[setting]) {
            formData.append(
                "value",
                form.values[setting],
                form.values[setting].name
            );
        } else {
            formData.append("value", form.values[setting]);
        }

        formData.append("setting", setting);
        formData.append("_method", "put");

        axios({
            url: `/data/settings/${settingsId}`,
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then((response) => {
            form.setValues(response.data);
            setAppData({
                ...appData,
                settings: response.data,
            });
            Toast.fire({
                icon: "success",
                title: `Settings Updated`,
            });
        });
    };

    const updateFormValues = (setting, value) => {
        form.setValues({
            [setting]: value,
        });
    };

    return (
        <div id="md-events-db-settings">
            <h2>General Settings</h2>
            <Grid className="flex max-w-lg md:max-w-5xl">
                <Grid.Col md={6} className="">
                    <TextInput
                        className="mb-2 p-4 bg-white rounded-md"
                        {...form.getInputProps("app_name")}
                        label={
                            <FieldLabel
                                Icon={IconWriting}
                                label="App Name"
                                SaveButton={
                                    <SaveButton
                                        saveSetting={saveSetting}
                                        settingKey={"app_name"}
                                    />
                                }
                            />
                        }
                        onChange={(event) =>
                            updateFormValues("app_name", event.target.value)
                        }
                        name="app_name"
                    />
                    <div className="file-upload-wrapper bg-white p-4 rounded-md mb-2">
                        <FieldLabel
                            Icon={IconPhotoUp}
                            label="App Logo"
                            SaveButton={
                                <SaveButton
                                    saveSetting={saveSetting}
                                    settingKey={"app_logo"}
                                />
                            }
                        />
                        <FilePond
                            files={files}
                            onupdatefiles={(fileItems) => {
                                const fileObjects = fileItems.map(
                                    (fileItem) => fileItem.file
                                );
                                setFiles(fileObjects);
                                updateFormValues("app_logo", fileObjects[0]);
                            }}
                            server={{
                                load: (src, load) =>
                                    fetch(src)
                                        .then((res) => res.blob())
                                        .then(load),
                            }}
                            allowMultiple={false}
                            name="files" /* sets the file input name, it's filepond by default */
                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                        />
                    </div>
                    <TextInput
                        className="mb-2 p-4 bg-white rounded-md"
                        {...form.getInputProps("google_maps_api_key")}
                        label={
                            <FieldLabel
                                Icon={IconBrandGoogleDrive}
                                label="Google Maps API Key"
                                SaveButton={
                                    <SaveButton
                                        saveSetting={saveSetting}
                                        settingKey={"google_maps_api_key"}
                                    />
                                }
                            />
                        }
                        onChange={(event) =>
                            updateFormValues(
                                "google_maps_api_key",
                                event.target.value
                            )
                        }
                    />
                </Grid.Col>
                <Grid.Col md={6} className="">
                    <Select
                        data={dataArrayToSelectOptions( appData.users)}
                        className="mb-2 bg-white p-4 rounded-md"
                        label={
                            <FieldLabel
                                Icon={IconAddressBook}
                                label="Admin Contact"
                                SaveButton={
                                    <SaveButton
                                        saveSetting={saveSetting}
                                        settingKey={"admin_contact"}
                                    />
                                }   
                            />
                        }
                        {...form.getInputProps("admin_contact")}
                        onChange={(userId) =>
                            updateFormValues(
                                "admin_contact",
                                userId
                            )
                        }
                    />
                    <TextInput
                        className=" mb-2 p-4 bg-white rounded-md"
                        {...form.getInputProps("open_ai_key")}
                        label={
                            <FieldLabel
                                Icon={IconAffiliate}
                                label="Open AI Key"
                                SaveButton={
                                    <SaveButton
                                        saveSetting={saveSetting}
                                        settingKey={"open_ai_key"}
                                    />
                                }
                            />
                        }
                        onChange={(event) =>
                            updateFormValues(
                                "google_maps_api_key",
                                event.target.value
                            )
                        }
                    />
                    <div
                        id="app-api-tokens-list"
                        className="bg-white px-4 pt-4 pb-2 rounded-md mb-2 min-h-[95px]"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <FieldLabel
                                Icon={IconShieldLock}
                                label="API Tokens"
                                SaveButton={
                                    <Button
                                        size="xs"
                                        color="green"
                                        onClick={addToken}
                                        leftIcon={<IconPlus />}
                                    >
                                        Add Token
                                    </Button>
                                }
                            />
                        </div>

                        <div className="" id="app-api-tokens">
                            {form.values.app_api_tokens.map((token) => {
                                return (
                                    <div
                                        className="flex items-center mb-4"
                                        key={token.id}
                                    >
                                        <div className="flex items-center truncate">
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
                </Grid.Col>
            </Grid>
        </div>
    );
}
