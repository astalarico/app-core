import React, { useEffect, useState } from "react";
import { TextInput, Button, Tooltip, ActionIcon } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
    IconBrandGoogleDrive,
    IconKey,
    IconTrash,
    IconShieldLock,
    IconWriting,
    IconPhotoUp,
} from "@tabler/icons";
import FieldLabel from "../FieldLabel";
import "./settings.scss";
import Swal from "sweetalert2";
import { Grid } from "@mantine/core";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import SaveButton from "../SaveButton";
import { useRecoilState } from "recoil";
import { appDataState } from "../../store";

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
    const [settingsId, setSettingsId] = useState(0);
    const [files, setFiles] = useState([]);
    const [appData, setAppData] = useRecoilState(appDataState);

    useEffect(() => {

        axios.get("/data/settings").then((response) => {
      
            console.log( response.data)
            setFiles([
                {
                    source: response.data.app_logo.url,
                        type: "local",
                    },
                
            ]);

            setSettingsId(response.data.id);
            form.setValues(response.data);
        });
    }, [appData]);

    const form = useForm({
        initialValues: {
            app_name: "",
            google_maps_api_key: "",
            app_api_tokens: [],
        },
    });

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

        if (setting === "app_logo") {
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
            Toast.fire({
                icon: "success",
                title: `Settings Updated`,
            });
        });
    };

    const updateFormValues = (setting, value) => {
        form.setValues({
            ...form.values,
            [setting]: value,
        });
    };

    return (
        <div id="md-events-db-settings">
            <h2>General Settings</h2>
            <Grid>
                <Grid.Col lg={5} md={12}>
                    <TextInput
                        className="max-w-md mb-7 p-4 bg-white rounded-md"
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
                    <div className="file-upload-wrapper max-w-md bg-white p-4 rounded-md mb-7">
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
                            server={{ load: (src, load) => fetch(src).then(res => res.blob()).then(load)  }}
                            allowMultiple={false}
                            name="files" /* sets the file input name, it's filepond by default */
                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                        />
                    </div>
                    <TextInput
                        className="max-w-md mb-7 p-4 bg-white rounded-md"
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
                <Grid.Col lg={6} md={12}>
                    <div
                        id="app-api-tokens-list"
                        className="bg-white px-4 pt-4 pb-2 rounded-md max-w-lg"
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
                                        className="flex items-center mb-4"
                                        key={token.id}
                                    >
                                        <div className="flex items-center">
                                            <IconKey
                                                size={20}
                                                className="mr-4"
                                            />
                                            <div className="text-sm token-text truncate">
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
