import { atom } from 'recoil';

export const appDataState = atom({
    key: 'appDataState',
    default: {
        navDrawerOpened : false,
        user : {},
        settings: {},
        users: [],
    },
});