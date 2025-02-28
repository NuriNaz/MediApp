import React, { useState, createContext, useEffect, useContext } from 'react';

import axios from 'axios';
import { API } from 'Constants/API';
const MyContext = createContext();

function MyProvider({ children }) {
    const [data, setData] = useState('');
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [punchedin, setPunchedin] = useState(false);
    const [scrumSubmitted, setScrumSubmitted] = useState(false);
    const [datas, setDatas] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');
    const [punchintime, setPunchintime] = useState('');

    useEffect(() => {
        getAttendanceDetails();
    }, []);

    useEffect(() => {
        if (!punchintime) {
            setShow(true);
        } else {
            const [hour, minute, second] = punchintime.split(':');
            const start = new Date();
            start.setHours(hour);
            start.setMinutes(minute);
            start.setSeconds(second);
            setStartTime(start);
        }
    }, [punchintime]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // async function getAttendanceDetails() {
    //     try {
    //         const response = await axios.post(
    //             '/user/get_punch',
    //             { userId },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             }
    //         );
    //         if (response.status === 200) {
    //             console.log(response.data[0].punch_in_time, 'Punchin Time');
    //             setPunchintime(response.data[0].punch_in_time);
    //             setData(response.data[0]);
    //             setDatas(response.data[0]);
    //             //console.log('punchInDate', response.data[0].report_date);
    //             if (response.data[0] != null && response.data[0] != undefined) {
    //                 const scrumSubmitted = response.data[0].is_scrum_submitted;
    //                 if (scrumSubmitted === 0) {
    //                     setOpen(true);
    //                 } else if (scrumSubmitted === 1) {
    //                     setPunchedin(true);
    //                     setOpen(false);
    //                     setScrumSubmitted(true);
    //                 }
    //             }
    //         }
    //     } catch (err) {
    //         console.log(err, 'kdsajfkl');
    //         if (err.response.status === 404) {
    //             setNotfound(true);
    //         }
    //     }
    // }

    async function getAttendanceDetails() {
        const URL = API.GET_ATTENDANCE;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_punch',
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setData(result.data[0].punch_in_time);
        } catch (err) {
            console.log(err);
        }
    }
    const formattedTime = startTime ? new Date(currentTime - startTime).toISOString().substr(11, 8) : '00:00:00';

    return (
        <MyContext.Provider
            value={{ formattedTime, open, setOpen, punchedin, setPunchedin, scrumSubmitted, setScrumSubmitted, datas, setDatas }}
        >
            {children}
        </MyContext.Provider>
    );
}
export const MyContextState = () => {
    return useContext(MyContext);
};
export default MyProvider;
