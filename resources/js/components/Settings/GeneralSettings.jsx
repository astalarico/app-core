import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { appDataState } from "../../store";
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

export default function GeneralSettings(props) {
    const [appData, setAppData] = useRecoilState(appDataState);
    const [settings, setSettings] = useState(appData?.settings);

    useEffect(() => {
        setSettings(appData.settings);
    }, [appData]);

    const handleAddToken = () => {
        axios.get("/data/create-api-token").then((response) => {
            setSettings(response.data);
        });
    };

    const revokeToken = (token) => {
        axios
            .post("/data/revoke-api-token", {
                token,
            })
            .then((response) => {
                setSettings(response.data);
            });
    };

    const saveSetting = (setting) => {
        axios
            .put("/data/settings", {
                id : settings.id,
                setting,
                value: settings[setting],
            })
            .then((response) => {
                //setSettings(response.data);
            });
    };

    return (
        <div id="md-events-db-settings">
            <h2>General Settings</h2>
            <div className="field-groups">
                <div className="field-group w-full max-w-[450px]">
                    <TextInput
                        className="w-full mb-7 p-4 bg-white rounded-md"
                        labelProps={{ width: "100%" }}
                        value={settings?.google_maps_api_key ?? ""}
                        label={
                            <FieldLabel
                                Icon={IconBrandGoogleDrive}
                                label="Google Maps API Key"
                                SaveButton={
                                    <Button
                                        leftIcon={<IconDeviceFloppy />}
                                        size="xs"
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
                            setSettings({
                                ...settings,
                                google_maps_api_key: event.currentTarget.value,
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
                                onClick={handleAddToken}
                                leftIcon={<IconShieldLock />}
                            >
                                Add Token
                            </Button>
                        </div>

                        <div className="" id="app-api-tokens">
                            {settings?.app_api_tokens.map((token) => {
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
