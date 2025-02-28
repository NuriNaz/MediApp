// material-ui
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import './index.css';
import { useEffect, useState } from 'react';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { MyContextState } from 'context/ContextAPI';
import { API } from 'Constants/API';
import axios from 'axios';
import Message from '../Snackbar/Toaster';
import { useNavigate } from 'react-router';
import Details from '../attendance/Details';
import { timeDifferenceSec, unpaidBreaks } from 'function/FormatTime';
import { MENU_OPEN } from 'store/actions';
import { useDispatch } from 'react-redux';

// ==============================|| SAMPLE PAGE ||============================== //

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

const PunchOutTime = () => {
    // const [age, setAge] = useState('');

    const [selectedOption, setSelectedOption] = useState('');
    const [reason, setReason] = useState(false);

    const [selectedTime, setSelectedTime] = useState('00:00');
    const [open1, setOpen1] = useState(false);
    const [selectedTime1, setSelectedTime1] = useState('00:00');
    const [details, setDetails] = useState({ punchIntime: '', clockTime: '', report_id: '', report_date: '' });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [error, setError] = useState({ reasons: false, other: false });
    const navigate = useNavigate();

    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false,
            message: ''
        });
    };

    const [user, setUser] = useState({
        // punchInTime: '',
        // punchOutTime: '',
        // lunchTime: '',
        totalTime: '',
        clockedTime: '',
        // paidBreak: '',
        // unpaidBreak: '',
        reasons: ''
    });

    const {
        //  punchInTime,
        totalTime,
        clockedTime,
        // paidBreak,
        // unpaidBreak,
        reasons
    } = user;

    const handleClose = () => setOpen1(false);
    const dispatch = useDispatch();

    const token = localStorage.getItem('Token');
    const userId = localStorage.getItem('userId');

    // const [time, setTime] = useState('');

    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };
    const handleTimeChange1 = (value) => {
        setSelectedTime1(event.target.value);
    };

    const handleChangeFields = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        // setError({ other: false });
    };

    // console.log(user, 'hello time ');
    // const { formattedTime } = MyContextState();

    const handleChange = (event) => {
        // setError({ reasons: false });
        setSelectedOption(event.target.value);
        if (event.target.value === '1') {
            setReason(true);
            setError({ reasons: false });
        }
        if (event.target.value === '2') {
            setReason(true);
            setError({ reasons: false });
        }
        if (event.target.value === '3') {
            setReason(true);
            setError({ reasons: false });
        }
        if (event.target.value === '') {
            setReason(false);
            setError({ reasons: false });
        }
    };

    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const todayDate = year + '-' + month.toString().padStart(2, '0') + '-' + date.toString().padStart(2, '0');
    // console.log(todayDate, 'hello himanshu');

    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const seconds = today.getSeconds().toString().padStart(2, '0');

    const time = `${hours}:${minutes}:${seconds}`;

    const getAttendanceDetails = async () => {
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
            if (result.status === 200) {
                // console.log(result.data[0].punch_out_time, 'Punchin Time=====>');
                const punchOut = result.data[0].punch_out_time;
                if (punchOut !== null || undefined) {
                    navigate('/dashboard');
                }
                // console.log(result.data[0].punch_in_time, 'hello himanshu');
                const data = result.data[0];
                setDetails({
                    punchIntime: data.punch_in_time,
                    clockTime: data.total_clocked_time,
                    report_id: data.report_id,
                    report_date: data.report_date
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Converting clocked time into HH/MM/SS
    const Clockedhours = Math.floor(details.clockTime / 3600);
    const Clockedminutes = Math.floor((details.clockTime % 3600) / 60);
    const Clockedseconds = details.clockTime % 60;
    const ClockedTiming = `${Clockedhours.toString().padStart(2, '0')}:${Clockedminutes.toString().padStart(
        2,
        '0'
    )}:${Clockedseconds.toString().padStart(2, '0')}`;

    const paidBreak = '00:00:00';
    const unpaidBreak = '00:00:00';

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user_id = userId;
        const URL = API.PUNCH_OUT;
        const report_id = details.report_id;
        const punch_out_reason = reasons;
        // const total_logged_time = TotalLogtime();
        const total_logged_time = timeDifferenceSec(punchInTime, punchOutTime);
        const lunch_start = selectedTime;
        const lunch_end = selectedTime1;
        const lunch_time_duration = calculateTimeDifference();
        const punch_out_time = time;
        const paid_time = PaidTime();
        // const total_clocked_time = ClockedTiming;
        const total_clocked_time = details.clockTime;
        // const unpaid_time = differenceFormatted;
        // const unpaid_time = UnpaidBreak();
        const unpaid_time = unpaidBreaks(totaltime, details.clockTime);

        // console.log(unpaid_time, 'hello this is unpaid Time');
        try {
            const result = await axios.post(
                URL,
                // '/user/get_punch',
                {
                    user_id,
                    report_id,
                    punch_out_reason,
                    total_logged_time,
                    tool_time_diff: '0',
                    report_status: 3,
                    lunch_start,
                    lunch_end,
                    lunch_time_duration,
                    punch_out_time,
                    paid_time,
                    // unpaid_time: '4',
                    unpaid_time,
                    total_clocked_time
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(result.data, 'Hello PunchoutTime ');
            if (result.status === 200) {
                console.log(result.data, 'Hello PunchoutTime ');
                setOpen1(false);
                setSnackbar({
                    open: true,
                    message: 'You are successfully punched out'
                });
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            }
        } catch (err) {
            console.log(err);
        }
    };

    function calculateTimeDifference() {
        const time1 = new Date(`2000-01-01T${selectedTime}:00`);
        const time2 = new Date(`2000-01-01T${selectedTime1}:00`);
        const diffInMs = time2 - time1;
        const hours = Math.floor(diffInMs / 1000 / 60 / 60);
        const minutes = Math.floor((diffInMs / 1000 / 60) % 60);
        const seconds = Math.floor((diffInMs / 1000) % 60);
        if (isNaN(hours)) {
            return '00:00:00';
        }
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    console.log(calculateTimeDifference(), 'time Lunch');

    // console.log(details.punchIntime, time, ' fsda');

    const TotalLogtime = () => {
        const currentDate = new Date();
        const [punchInHours, punchInMinutes, punchInSeconds] = details.punchIntime.split(':');
        const [punchOutHours, punchOutMinutes, punchOutSeconds] = time.split(':');

        const punchInTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            punchInHours,
            punchInMinutes,
            punchInSeconds
        );
        const punchOutTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            punchOutHours,
            punchOutMinutes,
            punchOutSeconds
        );

        const differenceInMs = punchOutTime.getTime() - punchInTime.getTime();
        const differenceInSeconds = differenceInMs / 1000;
        // console.log(differenceInSeconds, 'helloRajant');
        const hours = Math.floor(differenceInSeconds / 3600);
        const minutes = Math.floor((differenceInSeconds % 3600) / 60);
        const seconds = differenceInSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // console.log(TotalLogtime(), 'hello log time');

    // function for Paid Time
    const PaidTime = () => {
        const currentDate = new Date();
        const [punchInHours, punchInMinutes, punchInSeconds] = paidBreak.split(':');
        const [punchOutHours, punchOutMinutes, punchOutSeconds] = ClockedTiming.split(':');

        const punchInTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            punchInHours,
            punchInMinutes,
            punchInSeconds
        );
        const punchOutTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            punchOutHours,
            punchOutMinutes,
            punchOutSeconds
        );

        const differenceInMs = punchOutTime.getTime() - punchInTime.getTime();
        const differenceInSeconds = differenceInMs / 1000;
        // console.log(differenceInSeconds, 'helloRajant');
        const hours = Math.floor(differenceInSeconds / 3600);
        const minutes = Math.floor((differenceInSeconds % 3600) / 60);
        const seconds = differenceInSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // console.log(TotalLogtime(), 'hello Bottle Plant');
    // console.log(PaidTime(), 'hello Paid Plant');

    // Total Logged Time - Paid time  = unpaid Time
    const totalLogTimeInSeconds = TotalLogtime()
        .split(':')
        .reduce((acc, curr, index) => acc + parseInt(curr) * Math.pow(60, 2 - index), 0);
    const paidTimeInSeconds = PaidTime()
        .split(':')
        .reduce((acc, curr, index) => acc + parseInt(curr) * Math.pow(60, 2 - index), 0);
    const differenceInSeconds = totalLogTimeInSeconds - paidTimeInSeconds;

    const hours3 = Math.floor(differenceInSeconds / 3600);
    const minutes3 = Math.floor((differenceInSeconds % 3600) / 60);
    const seconds3 = differenceInSeconds % 60;

    const differenceFormatted = `${hours3.toString().padStart(2, '0')}:${minutes3.toString().padStart(2, '0')}:${seconds3
        .toString()
        .padStart(2, '0')}`;

    // console.log(`Total log time: ${TotalLogtime()}`);
    // console.log(`Paid time: ${PaidTime()}`);
    // console.log(`Difference: ${differenceFormatted}`);
    // END Total Logged Time - Paid time  = unpaid Time

    const checkDSR = async () => {
        const user_id = userId;
        const URL = API.IS_PROJECT_SUBMITTED;
        try {
            const result = await axios.post(
                URL,
                // '/user/is_project_submited',
                {
                    user_id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                // console.log('Helog', result.data);
                const status = result.data.status;
                if (status === 0) {
                    navigate('/dsr');
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    // unpaidBreak = TotalTime - Clocked Time
    // const UnpaidBreak = () => {
    //     const total_time = TotalLogtime();
    //     // const clockedTime = details.clockTime;

    //     // console.log(total_time, ClockedTiming, 'hello total time');
    //     const currentDate = new Date();
    //     const [punchInHours, punchInMinutes, punchInSeconds] = ClockedTiming.split(':');
    //     const [punchOutHours, punchOutMinutes, punchOutSeconds] = total_time.split(':');

    //     const punchInTime = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate(),
    //         punchInHours,
    //         punchInMinutes,
    //         punchInSeconds
    //     );
    //     const punchOutTime = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate(),
    //         punchOutHours,
    //         punchOutMinutes,
    //         punchOutSeconds
    //     );

    //     const differenceInMs = punchOutTime.getTime() - punchInTime.getTime();
    //     const differenceInSeconds = differenceInMs / 1000;
    //     // console.log(differenceInSeconds, 'helloRajant');
    //     const hours = Math.floor(differenceInSeconds / 3600);
    //     const minutes = Math.floor((differenceInSeconds % 3600) / 60);
    //     const seconds = differenceInSeconds % 60;
    //     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // };

    // console.log(UnpaidBreak(), 'hello this is unpaid break');

    // const Date3 = '2023-05-03';
    // const Time3 = '15:59:32';
    const Date3 = details.report_date;
    const Time3 = details.punchIntime;

    const punchInTime = `${Date3} ${Time3}`;

    // const punchInTime = 'Monday,1 May 2023, 8:11:25 PM';
    // const punchOutTime = '2 May 2023, 15:08:30';
    const punchOutTime = new Date();

    console.log(timeDifferenceSec(punchInTime, punchOutTime), 'sadd');

    const totaltime = timeDifferenceSec(punchInTime, punchOutTime);
    // const clockedTimes = ClockedTiming();
    console.log(totaltime, details.clockTime, 'punchoutin');
    // const unpaidBreaks = timeDifferenceSec(ClockedTiming, totaltime);
    // console.log(unpaidBreaks(totaltime, details.clockTime), 'hello this is unpaid break');

    useEffect(() => {
        getAttendanceDetails();
        checkDSR();
        dispatch({ type: MENU_OPEN, id: '' });
    }, []);

    // console.log(time, 'hello time ');
    return (
        <MainCard title="Add Report">
            <h4>Add your daily report here</h4>

            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <div className="reporting">
                        <div className="labeldate">Date: </div>
                        {/* <div className="dates"> */}
                        <TextField
                            style={{ width: '35%' }}
                            name="todayDate"
                            // label="Date"
                            // value={todayDate}
                            value={details.report_date}
                            disabled
                            // onChange={handleChange1}
                            // error={error}
                            // helperText={error ? 'Please Fill the Email First' : ''}
                        />
                        {/* </div> */}
                    </div>

                    <div className="reporting">
                        <span className="labeldate">Punch-in time:</span>
                        <TextField style={{ width: '35%' }} name="punchInTime" value={details.punchIntime} disabled />
                    </div>

                    <div className="reporting">
                        <span className="labeldate">Punch-out time:</span>

                        <TextField
                            style={{ width: '35%' }}
                            name="punch_out_time:"
                            // label="Punch-out Time:"
                            value={time}
                            disabled
                            // onChange={handleChange1}
                            // error={error}
                            // helperText={error ? 'Please Fill the Email First' : ''}
                        />
                    </div>

                    <div className="reporting">
                        <span className="labeldate">Lunch time:</span>

                        <input id="time-input" type="time" value={selectedTime} onChange={handleTimeChange} />

                        <input id="time-input" type="time" value={selectedTime1} onChange={handleTimeChange1} />
                    </div>
                    <div className="reporting">
                        <span className="labeldate">Total time:</span>

                        <TextField
                            style={{ width: '35%' }}
                            name="totalTime"
                            disabled
                            // label="Total Time"
                            // value={calculateTimeDifference()}
                            // value={TotalLogtime()}
                            value={timeDifferenceSec(punchInTime, punchOutTime)}
                            onChange={handleChangeFields}
                            // error={error}
                            // helperText={error ? 'Please Fill the Email First' : ''}
                        />
                    </div>

                    <div className="reporting">
                        <span className="labeldate">Clocked time:</span>

                        <TextField
                            style={{ width: '35%' }}
                            name="clockedTime"
                            disabled
                            // value={clockedTime}
                            value={ClockedTiming}
                            // label="Clocked Time"
                            onChange={handleChangeFields}
                            // error={error}
                            // helperText={error ? 'Please Fill the Email First' : ''}
                        />
                    </div>

                    <div className="reporting">
                        <span className="labeldate">Paid break:</span>

                        <TextField
                            style={{ width: '35%' }}
                            name="paidBreak"
                            disabled
                            // label="Paid break"
                            value={paidBreak}
                            // onChange={(e) => handlePaidBreakChange(e)}
                            // onChange={handleChangeFields}
                            // error={error}
                            // helperText={error ? 'Please Fill the Email First' : ''}
                        />
                    </div>

                    {/* <div className="reporting">
                    <span className="labeldate">Total Call Time:</span>

                    <TextField
                        style={{ width: '35%' }}
                        name="total_call_time"
                        label="Total Call Time"
                        // value={title}
                        // onChange={handleChange1}
                        // error={error}
                        // helperText={error ? 'Please Fill the Email First' : ''}
                    />
                </div> */}

                    <div className="reporting">
                        <span className="labeldate">Unpaid break:</span>

                        <TextField
                            style={{ width: '35%' }}
                            disabled
                            name="unpaidBreak"
                            // label="Unpaid Break"
                            // value={unpaidBreak}
                            // value={UnpaidBreak()}
                            value={unpaidBreaks(totaltime, details.clockTime)}
                            onChange={handleChangeFields}
                            // error={error}
                            // helperText={error ? 'Please Fill the Email First' : ''}
                        />
                    </div>
                    <div className="reporting">
                        <span className="labeldate">Select a reason:</span>
                        <FormControl style={{ width: '35%' }}>
                            {/* <InputLabel id="select-label">Select an option</InputLabel> */}
                            <Select
                                id="select-label"
                                labelId="select-label"
                                value={selectedOption}
                                onChange={handleChange}
                                error={error.reasons}
                                displayEmpty
                                // inputProps={{ 'aria-label': 'Without label' }}
                                // helperText={error.reasons && 'Please select the reason first'}
                            >
                                <MenuItem value="">
                                    <span>Select an option</span>
                                </MenuItem>
                                {/* <MenuItem value="0">Please select an option</MenuItem> */}
                                <MenuItem value="1">Half Day</MenuItem>
                                <MenuItem value="2">Short Leave</MenuItem>
                                <MenuItem value="3">Other</MenuItem>
                            </Select>
                            <FormHelperText style={{ color: 'red' }}>{error.reasons && 'Please select the reason first'}</FormHelperText>
                        </FormControl>
                    </div>
                </Stack>
                <div className="reporting">
                    <span className="labeldate"></span>
                    {reason && (
                        <TextField
                            style={{ marginTop: '20px', width: '35%' }}
                            label="Reason"
                            multiline
                            rows={4}
                            variant="outlined"
                            name="reasons"
                            value={reasons}
                            onChange={handleChangeFields}
                            error={error.other}
                            helperText={error.other && 'Please fill the description'}
                        />
                    )}
                </div>

                <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center' }}>
                    <AnimateButton>
                        <Button
                            size="large"
                            variant="contained"
                            color="secondary"
                            style={{ padding: '10px 100px', borderRadius: '10px', textTransform: 'unset' }}
                            onClick={() => {
                                if (!selectedOption) {
                                    setError({ reasons: true });
                                    setOpen1(false);
                                } else if (reason && !reasons) {
                                    setError({ other: true });
                                    setOpen1(false);
                                } else {
                                    setOpen1(true);
                                }
                            }}
                        >
                            Punch Out
                        </Button>
                    </AnimateButton>
                </Box>
                {/* Add DSR Modal */}

                <div>
                    <Modal
                        open={open1}
                        // onClose={handleClose1}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h3" component="h2">
                                Are you sure you want to punch out?
                            </Typography>

                            <Box sx={{ mt: 2 }} className="popup_scrum">
                                <AnimateButton>
                                    <Button
                                        size="large"
                                        // type="submit"
                                        onClick={handleSubmit}
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Yes
                                    </Button>
                                </AnimateButton>
                                <AnimateButton>
                                    <Button
                                        className="cancellation"
                                        size="large"
                                        // type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={handleClose}
                                    >
                                        No
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Box>
                    </Modal>
                </div>
            </form>
            <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
        </MainCard>
    );
};

export default PunchOutTime;
