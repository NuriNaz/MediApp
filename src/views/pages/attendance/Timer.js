import { Fab } from '@mui/material';
import { API } from 'Constants/API';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdOutlineTimer } from 'react-icons/md';
import { useSelector } from 'react-redux';

const Timer = () => {
    const [data, setData] = useState('');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');

    const [show, setShow] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const getAttendanceDetails = async () => {
        const URL = API.GET_ATTENDANCE;
        try {
            const result = await axios.post(
                URL,
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                const isPunchout = result.data[0]?.is_punch_out;
                const punchout = result.data[0]?.punch_out_time;
                if (isPunchout === 1) {
                    setData('');
                } else if (punchout === null) {
                    setData(result.data[0]?.punch_in_time);
                } else {
                    setData('');
                }
            }
        } catch (err) {
            console.log(err, 'hello this is error');
            if (err?.response?.status === 404) {
                setData('');
            }
        }
    };

    const punchin = useSelector((state) => state?.api?.punchin[0]?.data?.json?.punch_in_time);

    useEffect(() => {
        if (data === '') {
            setShow(true);
        } else {
            const [hour, minute, second] = data?.split(':');
            const start = new Date();
            start.setHours(hour);
            start.setMinutes(minute);
            start.setSeconds(second);
            setStartTime(start);
        }
    }, [data]);

    useEffect(() => {
        if (punchin === null || punchin === undefined) {
            setShow(true);
            getAttendanceDetails();
        } else {
            const [hour, minute, second] = punchin?.split(':');
            const start = new Date();
            start.setHours(hour);
            start.setMinutes(minute);
            start.setSeconds(second);
            setStartTime(start);
            setShow(false);
        }
    }, [punchin]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formattedTime = startTime ? new Date(currentTime - startTime).toISOString().substr(11, 8) : '00:00:00';

    return (
        <div style={{ textAlign: 'center' }}>
            <Fab variant="extended" color="primary" style={{ background: '#5e35b1' }} aria-label="add">
                <MdOutlineTimer sx={{ mr: 2 }} style={{ fontSize: '20px', marginRight: '10px' }} />
                {formattedTime}
            </Fab>
        </div>
    );
};

export default Timer;
