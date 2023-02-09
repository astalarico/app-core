import { Button } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons';

export default function SaveButton({ saveSetting, settingKey}) {
    return (
        <Button
            leftIcon={<IconDeviceFloppy />}
            size="xs"
            color="green"
            onClick={() => saveSetting( settingKey)}
        >
            Save
        </Button>
    );
}
