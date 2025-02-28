// material-ui
import { Box, Button, Modal, Stack, TextField, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import './index.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios';
import { API } from 'Constants/API';
import { useNavigate } from 'react-router';
import BackTimer from './BackTimer';
import Message from '../Snackbar/Toaster';
import { Bars } from 'react-loader-spinner';
import { formatDate, formatTime, handleFormatDate } from 'function/FormatTime';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN, SET_MENU } from 'store/actions';
import { punched } from 'store/api';

// ==============================|| Attendance PAGE ||============================== //

const Attendance = () => {
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [radio, setRadio] = React.useState(0);

    const [error, seterror] = useState(false);
    const [cc, setCC] = useState(false);
    const [punchedin, setPunchedin] = useState(false);
    const [punchedinweekend, setPunchedinweekend] = useState(false);

    const [scrumSubmitted, setScrumSubmitted] = useState(false);
    const [value, setValue] = useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [datas, setDatas] = useState([]);
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));
    const [filter, setFilter] = useState([]);
    const [filterdata, setfilterdata] = useState(false);
    const [notfound, setNotfound] = useState(false);
    const [emails, setEmails] = useState([]);
    const [tags, setTags] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');
    const [errorMsg, setErrorMsg] = useState(false);
    const [errorDesc, setErrordesc] = useState(false);
    const [Manager, setManager] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: ''
    });
    const [ccManager, setCCManager] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedOptions1, setSelectedOptions1] = useState([]);
    const [scrumUID, setscrumuid] = useState();
    const [scrumtoUID, setScrumtoUID] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [Punchout, setPunchout] = useState(false);
    const [allErrors, setAllerrors] = useState({ scrum_to: false, scrum_cc: false });
    const moment = require('moment');
    const customModalWidth = 300;

    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false,
            message: ''
        });
    };

    const [tags2, setTags2] = useState([]);

    // const handleClose = () => setOpen1(false);
    // console.log(JSON.stringify({ value }));

    // const { formattedTime, open, setOpen, punchedin, setPunchedin, scrumSubmitted, setScrumSubmitted, datas, setDatas } = MyContextState();
    const token = localStorage.getItem('Token');
    const userId = localStorage.getItem('userId');
    const scrum_description = value;
    const [user, setUser] = useState({
        scrum_to: '',
        scrum_cc: '',
        scrum_subject: ''
    });
    const { scrum_to, scrum_cc, scrum_subject } = user;
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (interval) {
    //         setPunchedin(true);
    //     }
    // }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const { loading } = useSelector((state) => state.api);

    // Punch In
    const punchin = async () => {
        const result = await dispatch(punched());
        if (result.payload && result.payload.status === 201) {
            setPunchedin(true);
            getAttendanceDetails();
            setNotfound(false);
            setOpen1(true);
        } else {
            setSnackbar({ open: true, severity: error, message: 'Network Error' });
        }
        // const URL = API.PUNCHIN;
        // try {
        //     const result = await axios.post(
        //         URL,
        //         { userId },
        //         {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 // Authorization: `Bearer ${token}`
        //                 Authorization: `Bearer ${token}`
        //             }
        //         }
        //     );
        //     if (result.status === 201) {
        //         // console.log(result.data, 'hello');
        //         setPunchedin(true);
        //         getAttendanceDetails();
        //         setNotfound(false);
        //         setOpen1(true);
        //     }
        // } catch (err) {
        //     console.log('in catch');
        //     if (err.response.status === 401) {
        //         localStorage.clear();
        //         navigate('/login');
        //     }
        //     console.log(err);
        // }
    };

    // const punchin = async () => {
    //     dispatch(punched());
    //     setPunchedin(true);
    //     console.log(loading, 'hi this is it');
    //     setTimeout(() => {
    //         getAttendanceDetails();
    //     }, 2500);
    //     setNotfound(false);
    //     setOpen1(true);
    // };

    // PunchOut Popup
    const punchout = () => {
        navigate('/dsr');
        setPunchedin(false);
    };

    const handleClose = () => {
        setUser({ scrum_subject: '' });
        setValue('');
        setOpen(false);
        setErrordesc(false);
        seterror(false);
        setAllerrors({ scrum_to: false });
        setSelectedOptions([]);
        setSelectedOptions1([]);
    };

    const report_id = datas.report_id;

    // Punchin Popup Form
    const handlePunchin = async (e) => {
        const URL = API.SCRUM_POPUP;
        e.preventDefault();
        // const scrum_to = selectedOptions.map((item) => item.value);
        // if (tags.length === 0) {
        //     setErrorMsg(true);
        // }
        // // console.log(errorMsg.scrum_to, 'fsdaf');
        // if (!scrum_subject) {
        //     seterror(true);
        // }
        // if (!scrum_description) {
        //     setErrordesc(true);
        // }
        // if (!selectedOptions || selectedOptions.length === 0) {
        //     setAllerrors({ scrum_to: true });
        // }

        // if (!selectedOptions || selectedOptions.length === 0) {
        //     setAllerrors({ scrum_to: true });
        // } else

        if (!scrum_subject) {
            seterror(true);
            setAllerrors({ scrum_to: false });
        } else if (!scrum_description) {
            setErrordesc(true);
            seterror(false);
        }
        // if (!selectedOptions || selectedOptions.length === 0) {
        //     setAllerrors({ scrum_to: true });
        // }
        else {
            // const scrum_to = selectedOptions.map((item) => item.value);
            // const scrum_cc = selectedOptions1.map((item) => item.value);
            // const scrum_to = JSON.stringify(tags);
            const scrum_to = scrumtoUID;
            const scrum_cc = scrumUID;
            try {
                setIsLoading(true);
                const result = await axios.post(
                    URL,
                    // `${BaseUrl}/user/scrum`,
                    { userId, report_id, scrum_to, scrum_cc, scrum_subject, scrum_description },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (result.status === 201) {
                    setOpen(false);
                    setSnackbar({
                        open: true,
                        message: result.data.msg,
                        severity: 'success'
                    });
                    const URL = API.GET_ATTENDANCE;
                    const response = await axios.post(
                        URL,
                        // `${BaseUrl}/user/get_punch`,
                        { userId },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    if (response.status === 200) {
                        const scrumSubmitted = response.data[0].is_scrum_submitted;
                        if (scrumSubmitted === 1) {
                            setScrumSubmitted(true);
                        } else {
                            setScrumSubmitted(false);
                        }
                    }
                }
            } catch (err) {
                console.log(err, 'hello this is api error ');
                if (err.response.status === 400) {
                    setSnackbar({
                        open: true,
                        message: err.response.data.msg,
                        severity: 'error'
                    });
                }
            }
            setIsLoading(false);
        }
    };

    const handleCC = () => {
        setCC(true);
    };

    const columns = [
        { id: 'id', label: '#', minWidth: 50 },
        { id: 'date', label: 'Date', minWidth: 60 },
        { id: 'punchin', label: 'Punch-in', minWidth: 60 },
        { id: 'punchout', label: 'Punch-out', minWidth: 60 },
        { id: 'lunchduration', label: 'Lunch Duration', minWidth: 60 },
        { id: 'totalhours', label: 'Total Hours', minWidth: 60 },
        { id: 'clockedtime', label: 'Clocked Time', minWidth: 60 },
        { id: 'paidtime', label: 'Paid Time', minWidth: 60 },
        // { id: 'paidtimestatus', label: 'Paid Time Status', minWidth: 60 }
        { id: 'breaktime', label: 'Break Time', minWidth: 60 }
    ];

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { list: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video']
        ]
    };
    // Details Component

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getAttendanceDetails = async () => {
        const URL = API.GET_ATTENDANCE;
        try {
            const response = await axios.post(
                URL,
                // '/user/get_punch',
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                // console.log(response.data[0].punch_in_time, 'hello earphones');
                const punchInTime = response.data[0].punch_in_time;
                // const date = response.data[0].created_date;
                const date1 = response.data[0].created_date;
                const dateObject = new Date(date1);
                const date = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject
                    .getDate()
                    .toString()
                    .padStart(2, '0')}`;
                // console.log(date, 'hello');
                if (response.data[0].punch_out_time !== null) {
                    setPunchout(true);
                }
                setDatas(response.data[0]);
                if (response.data[0] != null && response.data[0] != undefined) {
                    const scrumSubmitted = response.data[0].is_scrum_submitted;
                    if (scrumSubmitted === 0) {
                        const punch_in_time = `${date}T${punchInTime}`;
                        const targetTime = new Date(punch_in_time); // replace with your target time variable
                        const delay = targetTime - Date.now();
                        // console.log(delay);
                        setTimeout(function () {
                            // your code to execute 10 minutes after targetTime goes here
                            // console.log('Time is up!');
                            setScrumSubmitted(true);
                        }, delay + 600000);
                        setScrumSubmitted(false);
                        // setOpen(true);
                        setPunchedin(true);
                    } else if (scrumSubmitted === 1) {
                        setPunchedin(true);
                        setOpen(false);
                        setScrumSubmitted(true);
                    }
                    // const PunchoutTime = response.data[0].punch_out_time;
                    else if (response.data[0].punch_out_time !== null) {
                        // if (PunchoutTime !== null) {
                        setPunchout(true);
                        // }
                    }
                }
                // if (punchout !== null) {
                //     // setData(result.data[0].punch_in_time);
                //     setPunchout(true);
                // }
            }
        } catch (err) {
            console.log(err, 'Hello Get Punch');
            setNotfound(true);
            if (err.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };
    // console.log(startDate, endDate);

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const Attendancefilter = async (e) => {
        const URL = API.ATTENDANCE_FILTER;
        e.preventDefault();
        // console.log('hifisisiis');
        const user_id = userId;
        const to_date = startDate;
        const from_date = endDate;
        try {
            const result = await axios.post(
                URL,
                // '/user/search-report',
                { user_id, to_date, from_date },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                const data = result.data.getdata;
                setFilter(data);
                setfilterdata(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleClear = () => {
        setStartDate(formatDate(new Date()));
        setEndDate(formatDate(new Date()));
        setfilterdata(false);
    };

    function TotalLogtime(punchinTimes, punchoutTimes) {
        if (!punchinTimes || !punchoutTimes) {
            return '00:00:00';
        } else {
            const [punchInHours, punchInMinutes, punchInSeconds] = punchinTimes.split(':');
            const [punchOutHours, punchOutMinutes, punchOutSeconds] = punchoutTimes.split(':');

            const punchInTime = new Date();
            punchInTime.setHours(punchInHours);
            punchInTime.setMinutes(punchInMinutes);
            punchInTime.setSeconds(punchInSeconds);

            const punchOutTime = new Date();
            punchOutTime.setHours(punchOutHours);
            punchOutTime.setMinutes(punchOutMinutes);
            punchOutTime.setSeconds(punchOutSeconds);

            let differenceInMs = punchOutTime.getTime() - punchInTime.getTime();

            // Adjust for negative time difference
            if (differenceInMs < 0) {
                differenceInMs += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
            }

            const differenceInSeconds = differenceInMs / 1000;

            const hours = Math.floor(differenceInSeconds / 3600);
            const minutes = Math.floor((differenceInSeconds % 3600) / 60);
            const seconds = Math.floor(differenceInSeconds % 60);
            if (isNaN(hours)) {
                return '00:00:00';
            }
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    const rows = [
        {
            id: 1,
            date: `${datas.created_date}`,
            punchin: `${datas.punch_in_time}`,
            punchout: `${datas.punch_out_time === null ? '-' : datas.punch_out_time}`,
            lunchduration: `${
                datas.lunch_time_duration === null || datas.lunch_time_duration === '0' ? '00:00:00' : datas.lunch_time_duration
            }`,
            // totalhours: `${TotalLogtime()}`,
            // `${datas.punch_out_time}` === null ? `${TotalLogtime(datas.punch_in_time, datas.punch_out_time)}` : '00:00:00',
            clockedtime: `${formatTime(datas.total_clocked_time)}`,
            paidtime: `${datas.paid_time}` === null ? `${datas.paid_time}` : '00:00:00',
            // paidtimestatus: `${datas.is_punch_out}`,
            breaktime: `${datas.break_availed}`,
            paidBreak: '00:00:00'
        }
    ];

    const SelectManager = async () => {
        const URL = API.SELECT_MANAGER;
        const user_id = userId;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_assign_sup_man',
                { user_id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${token}`
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // console.log(result.data, 'hello');
            if (result.status === 200) {
                // console.log(result.data, 'hello');
                setManager(result.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const SelectManagerincc = async () => {
        const URL = API.GET_CC;
        const user_id = userId;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_assign_sup_man',
                { user_id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${token}`
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // console.log(result.data, 'hello');
            if (result.status === 200) {
                // console.log(result.data, 'cc Managers');
                setCCManager(result.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const serialNumber = (page, index) => {
        return page * rowsPerPage + index + 1;
    };

    const StyledListItem = styled('li')({
        borderBottom: '1px solid #1e88e5',
        // borderRadius: 6,
        padding: '20px',
        height: 40,
        marginBottom: 1,
        backgroundColor: '#673ab7',
        color: '#fff',
        '&[aria-selected="false"]': {
            borderRadius: 6,
            backgroundColor: '#673ab7'
        },
        '&:hover:not([aria-selected="true"])': {
            backgroundColor: '#673ab7',
            color: '#fff',
            borderRadius: 6
            // borderBottom: 'unset'
        },
        '&:hover': {
            borderRadius: 6,
            backgroundColor: '#673ab7',
            color: '#fff'
        }
    });

    async function weekendcall() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        // console.log(dayOfWeek, 'dayOfWeek');
        try {
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                const result = await weekendpinchin();
                if (result.data.status === 1) {
                    setPunchedinweekend(true);
                }
            } else {
                setPunchedinweekend(true);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function weekendpinchin() {
        const URL = API.WEEKENDWORKINGPUNCHIN;
        const user_id = userId;
        const today = new Date().toISOString().split('T')[0];

        try {
            const result = await axios.post(
                URL,
                { user_id, dateOfWorking: today },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return result;
            // if (result.status === 200) {
            //     console.log(result, 'hello');
            // }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: MENU_OPEN, id: 'Attendance' });
        weekendcall();
        getAttendanceDetails();
        SelectManager();
        SelectManagerincc();
    }, []);

    function handleradiovalue(event) {
        const selectedValue = event.target.value;
        setRadio(selectedValue);
    }

    const PunchinTiming = datas.punch_in_time;
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
            .toString()
            .padStart(2, '0')}`;
    };

    // Workplacestatus
    async function Workplacestatus() {
        // console.log(radio);
        const URL = API.WORKPLACESTATUS;
        const user_id = userId;
        const today = new Date().toISOString().split('T')[0];

        try {
            const result = await axios.post(
                URL,
                { user_id, workspace_status: radio },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // return result;
            if (result.status === 200) {
                setSnackbar({
                    open: true,
                    message: result.data.msg
                });
                setOpen(true);
                // console.log(result, 'hello');
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    // end

    return (
        <MainCard title="Attendance">
            {/* <BackTimer /> */}
            {/* <EmailTagsInput /> */}
            {/* <SearchableDropdown /> */}
            <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center' }}>
                {/* <AnimateButton>
                 */}
                {/* <AnimateButton> */}
                <motion.button whileTap={{ scale: 0.9 }} style={{ border: 'unset', background: 'unset' }}>
                    {!punchedin ? (
                        <Button
                            size="large"
                            variant="contained"
                            color="secondary"
                            className="punchin"
                            onClick={() => {
                                punchin();
                            }}
                            // disabled={punchedinweekend === false}

                            // disabled={punchedinweekend}

                            // style={{ padding: '10px 100px', borderRadius: '10px' }}
                        >
                            Punch in
                        </Button>
                    ) : punchedin && !scrumSubmitted ? (
                        <Button
                            size="large"
                            variant="contained"
                            className="punchin"
                            color="secondary"
                            onClick={() => setOpen(true)}
                            // style={{ padding: '10px 100px', borderRadius: '10px' }}
                        >
                            Add Scrum Report
                        </Button>
                    ) : punchedin && scrumSubmitted ? (
                        <Button
                            size="large"
                            variant="contained"
                            className="punchin"
                            color="secondary"
                            // style={{ padding: '10px 100px', borderRadius: '10px' }}
                            onClick={() => {
                                dispatch({ type: MENU_OPEN, id: 'eod' });
                                punchout();
                            }}
                            disabled={!!Punchout}
                        >
                            Proceed To Punch Out
                        </Button>
                    ) : (
                        ''
                    )}
                    {/* </AnimateButton> */}
                </motion.button>
                <div style={{ marginTop: 15, display: scrumSubmitted && 'none' }}>
                    <BackTimer Time={PunchinTiming} />
                </div>

                <Modal
                    open={open}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography style={{ marginBottom: '15px' }} id="modal-modal-title" variant="h3" component="h2">
                            Add Scrum Report Here
                        </Typography>
                        <form onSubmit={handlePunchin}>
                            <Stack spacing={3} className="scrum_to">
                                <TextField
                                    style={{ marginBottom: '15px' }}
                                    // required
                                    maxLength={150}
                                    name="scrum_subject"
                                    autoComplete="off"
                                    label="Subject *"
                                    value={scrum_subject}
                                    onChange={handleChange}
                                    error={error}
                                    helperText={error && 'Please enter the Subject'}
                                />
                            </Stack>

                            <div className="editor">
                                <ReactQuill
                                    theme="snow"
                                    name="scrum_description"
                                    value={value}
                                    onChange={setValue}
                                    className="editor-input"
                                    modules={modules}
                                    placeholder="Description *"
                                />
                            </div>
                            {errorDesc ? (
                                <span style={{ color: '#f44336', fontSize: 12, marginLeft: 14 }}>Please enter the Description </span>
                            ) : (
                                ''
                            )}
                            <Box sx={{ mt: 2 }} className="popup_scrum">
                                <AnimateButton>
                                    <Button size="large" type="submit" variant="contained" color="secondary">
                                        Send
                                    </Button>
                                </AnimateButton>
                                <AnimateButton>
                                    <Button
                                        className="cancellation"
                                        // disableElevation
                                        // disabled={isSubmitting}
                                        size="large"
                                        // type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </form>
                        <div className="loading">
                            {isLoading && (
                                <Bars
                                    height="80"
                                    width="80"
                                    color="#5a49ae"
                                    ariaLabel="bars-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                />
                            )}
                        </div>
                    </Box>
                </Modal>

                {/* wfh */}

                <Modal
                    open={open1}
                    // onClose={handleClose}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            // border: '2px solid #000',
                            boxShadow: 24,
                            width: customModalWidth,

                            outline: 'none' // Remove the default outline styles
                        }}
                    >
                        <Typography
                            style={{ marginBottom: '15px' }}
                            id="modal-modal-title"
                            className="header_popup"
                            variant="h3"
                            component="h2"
                        >
                            Please Confirm!
                        </Typography>
                        <Stack spacing={3} className="scrum_to workplace_content">
                            <FormControl component="fieldset">
                                <FormLabel id="demo-radio-buttons-group-label">Select Workplace: </FormLabel>
                                <RadioGroup
                                    className="d-flex"
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="0" // Set the default value to "0" or "1" as needed
                                    name="radio-buttons-group"
                                    onChange={handleradiovalue} // Add onChange handler to capture the selected value
                                >
                                    <FormControlLabel value="0" control={<Radio />} label="Work From Office" />
                                    <FormControlLabel value="1" control={<Radio />} label="Work From Home" />
                                </RadioGroup>
                            </FormControl>
                        </Stack>
                        <Box sx={{ mt: 2 }} className="popup_scrum workplace_button">
                            <AnimateButton>
                                <Button
                                    onClick={() => {
                                        Workplacestatus();
                                        setOpen1(false);
                                        // setOpen(true);
                                    }}
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Confirm
                                </Button>
                            </AnimateButton>
                        </Box>

                        <div className="loading">
                            {isLoading && (
                                <Bars
                                    height="80"
                                    width="80"
                                    color="#5a49ae"
                                    ariaLabel="bars-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                />
                            )}
                        </div>
                    </Box>
                </Modal>

                {/* enf */}
            </Box>

            <div>
                <h3>Attendance Filter</h3>
                <div className="attendance">
                    {/* <DatePickers />
                     */}
                    <form onSubmit={Attendancefilter}>
                        <div className="settingbutton">
                            <input
                                type="date"
                                id="start-date"
                                max={formatDate(new Date())}
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                            <input max={formatDate(new Date())} type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />

                            <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                                <AnimateButton>
                                    <Button
                                        className="from_date"
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        // style={{ padding: '10px 50px' }}
                                    >
                                        Submit
                                    </Button>
                                </AnimateButton>
                                <AnimateButton>
                                    <Button
                                        className="to_date"
                                        size="large"
                                        onClick={handleClear}
                                        variant="contained"
                                        color="primary"
                                        // style={{ padding: '10px 50px' }}
                                    >
                                        Clear
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </div>
                    </form>
                </div>
            </div>
            {/* <Details /> */}
            {/* Details component  */}
            {/* <Stopwatch /> */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        {!filterdata ? (
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.date} style={{}}>
                                            {!notfound ? (
                                                <>
                                                    <TableCell>{row.id}</TableCell>
                                                    <TableCell>{handleFormatDate(row.date)}</TableCell>
                                                    <TableCell>
                                                        {row.punchin}
                                                        {/* {AfterTenMinutes(row?.date, row?.punchin)} */}
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: 'center' }}>{row.punchout}</TableCell>
                                                    <TableCell>{row.lunchduration === 0 ? '00:00:00' : row.lunchduration}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }}>
                                                        {TotalLogtime(row.punchin, row.punchout)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {/* {formatTime(row.clockedtime)} */}
                                                        {row.clockedtime}
                                                    </TableCell>
                                                    <TableCell>{TotalLogtime(row.paidBreak, row.clockedtime)}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }}>{formatDuration(row.breaktime)}</TableCell>
                                                </>
                                            ) : notfound ? (
                                                <TableCell style={{ textAlign: 'center' }} colSpan={9}>
                                                    <strong>Record not found</strong>
                                                </TableCell>
                                            ) : (
                                                ''
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {filter && filter.length > 0 ? (
                                    filter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                        return (
                                            <TableRow
                                                className="scrumreports"
                                                // onClick={searchScrumsbydates}
                                                hover
                                                role="checkbox"
                                                key={index}
                                                tabIndex={-1}
                                            >
                                                <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                <TableCell>{item.punch_in_time}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>
                                                    {item.punch_out_time === null ? '-' : item.punch_out_time}
                                                </TableCell>
                                                <TableCell>
                                                    {item.lunch_time_duration === null || item.lunch_time_duration === '0'
                                                        ? '00:00:00'
                                                        : item.lunch_time_duration}
                                                </TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>
                                                    {TotalLogtime(item.punch_in_time, item.punch_out_time)}
                                                </TableCell>
                                                <TableCell>
                                                    {/* {item.total_clocked_time === null ? '00:00:00' : item.total_clocked_time} */}
                                                    {formatTime(item.total_clocked_time)}
                                                </TableCell>
                                                <TableCell>
                                                    {/* {item.paid_time === null ? '00:00:00' : item.paid_time} */}
                                                    {formatTime(item.total_clocked_time)}
                                                    {/* {TotalLogtime(row.paidBreak, row.clockedtime)} */}
                                                </TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{formatDuration(item.break_availed)}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell style={{ textAlign: 'center' }} colSpan={9}>
                                            Record Not Found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={!filterdata ? rows?.length : filter?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    s
                />
            </Paper>
            <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
        </MainCard>
    );
};

export default Attendance;
