import {useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { appDataState } from "./store";

export const useAppData = (state  ) => {
    const [stateProp, setStateProp] = useState(state);
    const [appData, setAppData] = useRecoilState(appDataState);

    useEffect(() => {
        setStateProp( appData[state] );
    }, [appData]);

    return [stateProp, setStateProp];
}