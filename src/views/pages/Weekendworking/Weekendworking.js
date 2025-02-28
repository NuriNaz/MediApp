import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { Box, Button, FormControl, FormHelperText, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import '../attendance/index.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Message from '../Snackbar/Toaster';
import { API } from 'Constants/API';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ResponsiveDialog from '../Alerts/ResponsiveDialog';
import { formatDate, handleFormatDate } from 'function/FormatTime';
import { AiFillEye } from 'react-icons/ai';
import { Bars } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';

const columns = [
    { id: 'id', label: '#', minWidth: '60%' },
    { id: 'leaveType', label: 'Working Date' },
    { id: 'appliedDate', label: 'Title' },
    { id: 'status', label: 'Status' },
    { id: 'taskpriority', label: 'Approved by' },
    { id: 'createdon', label: 'Created date' }
    // { id: 'status', label: 'Status' },
    // { id: 'actions', label: 'Actions' }
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
export default function Weekendworking() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [task, setTask] = useState([]);
    const [allscrums, setAllscrums] = useState([]);
    // const [currentTask, setCurrentTask] = useState([]);
    const [currentTask, setCurrentTask] = useState(false);
    // subject
    const [subject, setsubject] = useState('');
    // date
    const [date, setDate] = useState('');
    // reason
    const [reasond, setreasond] = useState('');
    // end
    // const [user, setUser] = useState({
    //     cause: ''
    // });
    // reason date subject

    const [value, setValue] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: ''
    });

    const [actions, setActions] = useState(false);
    const [tabs, settabs] = useState('0');
    // const [checkboxDate, setCheckboxDate] = useState(formatDate(new Date()));
    const [tabsValue, setTabsvalue] = useState();
    const [reasonErrors, setReasonErrors] = useState({
        subject: false,
        date: false,
        reasond: false
    });
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));

    const [leavestartDate, setLeaveStartDate] = useState();

    const [leaveendDate, setLeaveEndDate] = useState(formatDate(new Date()));
    const [isLoading, setIsLoading] = useState(false);
    const [leaveData, setLeaveData] = useState([]);
    const [getalldata, setGetalldata] = useState([]);

    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');

    const handleTabsChange = (event, newValue) => {
        // console.log(newValue, 'hello newvalue');
        settabs(newValue);
        const data = {
            userId: user_id,
            approved_status: newValue
        };
        setTabsvalue(newValue);
        // setAllscrums([]); // add this line to clear the state
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false,
            message: ''
        });
    };

    const handleClose1 = () => {
        setsubject('');
        setDate('');
        setreasond('');
        setReasonErrors({ subject: false });
        setOpen3(false);
        setSelectedOption('');
        // setUser({ cause: '' });
        setValue('');
        setLeaveStartDate();
        // setLeaveEndDate(formatDate(new Date()));
    };
    const handleClose2 = () => {
        setOpen4(false);
    };

    const handleChange = (e) => {
        setsubject(e.target.value);
        const { name, value } = e.target;
        // setUser({ ...user, [name]: value });
    };

    const SelecthandleChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const navigate = useNavigate();
    const handleStartDateChanges = (event) => {
        setStartDate(event.target.value);
    };

    const handleStartDateChange = (event) => {
        const selectedDate = new Date(event.target.value);
        const day = selectedDate.getDay(); // Sunday: 0, Monday: 1, ..., Saturday: 6

        // if (day === 1 || day === 2 || day === 3 || day === 4 || day === 1 || day === 5) {
        //     // Selected date is Sunday, Saturday, Monday, Tuesday, Wednesday, or Thursday
        //     console.log('Please select a date that is Saturday or Sunday.');
        // } else {

        // const selectedDate = new Date(event.target.value);
        const dayOfWeek = selectedDate.getDay();

        if (dayOfWeek === 6 || dayOfWeek === 0) {
            setStartDate(event.target.value);
            setDate(event.target.value);
            if (leavestartDate) {
                setLeaveStartDate(event.target.value);
            }
            // if (startDate) {
            //     setStartDate(event.target.value);
            // }
        } else {
            setSnackbar({
                open: true,
                message: 'Please select Saturday or Sunday only.',
                severity: 'warning'
            });
        }
    };

    const handleEndDateChange = (event) => {
        if (leaveendDate) {
            setLeaveEndDate(event.target.value);
        }
        if (endDate) {
            setEndDate(event.target.value);
        }
    };

    const handleDates = async (e) => {
        e.preventDefault();
        setGetalldata([]);
        const to_date = endDate;
        const from_date = startDate;
        const URL = API.GETAPPLYWEEKENDWORKING;
        // const userId = user_id;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_notes',
                { user_id, to_date, from_date },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // console.log(result);
            // setGetalldata(result.data.data);

            const newresult = result.data.data;

            if (result.status === 200) {
                const assignedByName = await Promise.all(
                    newresult.map(async (item) => {
                        let Aname = ''; // Initialize with an empty string

                        if (item.approved_by) {
                            const response = await axios.post(
                                API.ASSIGNED_BY_NAME,
                                {
                                    user_id: item.approved_by,
                                    supervisor_id: item.approved_by
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                }
                            );

                            const userData = response.data.data;

                            // Extract the name fields from the response data
                            const user_fname = userData.first_name || '';
                            const user_mname = userData.middle_name || '';
                            const user_lname = userData.last_name || '';

                            Aname = `${user_fname} ${user_mname} ${user_lname}`;
                            console.log('hello this is my', Aname);
                        }

                        return {
                            ...item,
                            Aname
                        };
                    })
                );

                setGetalldata(assignedByName);
                console.log('dddddddddddddd', assignedByName);
            }
        } catch (err) {
            // console.log(err);
            if (err.response.status === 404) {
                console.log(err, 'Error from API Response');
                setReasonErrors({ notFound: true });
                setAllscrums(false);
                setTask(false);
            }
        }
    };

    const getweekenddata = async (e) => {
        setGetalldata([]);
        const URL = API.GETAPPLYWEEKENDWORKING;

        try {
            const result = await axios.post(
                URL,
                { user_id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(result.data.dateRange.startDate);

            setStartDate(result.data.dateRange.startDate);
            setEndDate(result.data.dateRange.endDate);

            const newresult = result.data.data;

            if (result.status === 200) {
                const assignedByName = await Promise.all(
                    newresult.map(async (item) => {
                        let Aname = ''; // Initialize with an empty string

                        if (item.approved_by) {
                            const response = await axios.post(
                                API.ASSIGNED_BY_NAME,
                                {
                                    user_id: item.approved_by,
                                    supervisor_id: item.approved_by
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                }
                            );

                            const userData = response.data.data;

                            // Extract the name fields from the response data
                            const user_fname = userData.first_name || '';
                            const user_mname = userData.middle_name || '';
                            const user_lname = userData.last_name || '';

                            Aname = `${user_fname} ${user_mname} ${user_lname}`;
                        }

                        return {
                            ...item,
                            Aname
                        };
                    })
                );

                setGetalldata(assignedByName);
                console.log('dddddddddddddd', assignedByName);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.log(err, 'Error from API Response');
                setReasonErrors({ notFound: true });
                setAllscrums(false);
                setTask(false);
            }
        }
    };

    const serialNumber = (page, index) => {
        return page * rowsPerPage + index + 1;
    };

    const handleClear = () => {
        setStartDate(formatDate(new Date()));
        setEndDate(formatDate(new Date()));
        // settabs('0');
        // setCurrentTask(true);
        setActions(false);
        // setAllscrums([]);
        const newdata = {
            userId: user_id,
            approved_status: tabsValue === undefined ? 0 : tabsValue
        };
        tasks(newdata);
    };

    const leaveApply = (e) => {
        setOpen3(true);
    };

    const handleWeekendworking = async (e) => {
        e.preventDefault();
        if (!subject) {
            setReasonErrors({ subject: true });
        } else if (!date) {
            setReasonErrors({ date: true });
        } else if (!reasond) {
            setReasonErrors({ reasond: true });
        } else {
            const URL = API.APPLYWEEKENDWORKING;
            const leave_type_id = selectedOption;
            const subjects = subject;
            const dateOfWorkings = date;
            const reason = reasond;
            try {
                console.log('try', isLoading);
                setIsLoading(true);
                const result = await axios.post(
                    URL,
                    // '/user/get_notes',
                    { user_id, subject: subject, dateOfWorking: date, reason },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (result.data.status === 1) {
                    setReasonErrors({ subject: false, date: false, reasond: false });
                    setLeaveStartDate();
                    setOpen3(false);
                    setsubject(null);
                    setDate(null);
                    setreasond(null);
                    // setReasonErrors({ subject: false, date: false, reasond: false });
                    setSnackbar({
                        open: true,
                        message: `${result.data.message}`,
                        severity: 'success'
                    });
                    setReasonErrors({ subject: false, date: false, reasond: false });
                    await getweekenddata();
                } else if (result.data.status === 0) {
                    setSnackbar({
                        open: true,
                        message: `${result.data.message}`,
                        severity: 'warning'
                    });
                }
            } catch (err) {
                console.log(err);
            }
            console.log('catch', isLoading);
            setIsLoading(false);
        }
    };

    // apply weekend working
    //     reason date subjectApply
    // end

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: MENU_OPEN, id: 'Weekend' });
        getweekenddata();
    }, [1]);
    console.log('getalldata>>>>>>>>>>>>>>>>>>>>>>>', getalldata);

    //
    const today = new Date();

    // Function to check if a given date is a weekend (Saturday or Sunday)
    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday is 0, Saturday is 6
    };

    // Function to filter out non-weekend dates from the date picker
    const filterWeekendDates = (date) => {
        return isWeekend(date);
    };

    //

    return (
        <>
            <MainCard title="Weekend Working">
                <form onSubmit={handleDates}>
                    <div className="attendance buttonsettings">
                        <div className="settingbutton">
                            <input
                                // max={formatDate(new Date())}
                                type="date"
                                id="start-date"
                                value={startDate}
                                onChange={handleStartDateChanges}
                            />
                            <input
                                // max={formatDate(new Date())}
                                type="date"
                                id="end-date"
                                value={endDate}
                                onChange={handleEndDateChange}
                            />
                            <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                                <AnimateButton>
                                    <Button
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        // style={{ padding: '10px 50px' }}
                                        className="from_date"
                                    >
                                        Submit
                                    </Button>
                                </AnimateButton>
                                <AnimateButton>
                                    <Button
                                        size="large"
                                        // type="submit"
                                        onClick={handleClear}
                                        variant="contained"
                                        color="primary"
                                        // style={{ padding: '10px 50px' }}
                                        className="to_date"
                                    >
                                        Clear
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </div>
                    </div>
                </form>
                <div>
                    <div className="leave">
                        {/* <AnimateButton> */}
                        <motion.button whileTap={{ scale: 0.9 }} style={{ border: 'unset', background: 'unset' }}>
                            <Button
                                size="large"
                                variant="contained"
                                color="secondary"
                                className="punchin leaveManagement"
                                onClick={leaveApply}
                            >
                                Apply for weekend working
                            </Button>
                        </motion.button>

                        {/* </AnimateButton> */}
                    </div>
                    <h4>Weekend Working Records</h4>

                    {/* <Box sx={{ mt: 2 }} className="popup_scrum scrumbtns"> */}
                </div>

                <Box sx={{ marginTop: 2, width: '100%', typography: 'body1' }}>
                    {' '}
                    <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                        {' '}
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => {
                                                if (column.label === 'Actions' && actions) {
                                                    return null;
                                                }
                                                // {columns.map((column) => {
                                                return (
                                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                                        {column.label}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getalldata && getalldata.length > 0 ? (
                                            getalldata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                                // console.log(allscrums.length, 'hello Length');
                                                return (
                                                    <TableRow className="scrumreports" hover role="checkbox" key={index} tabIndex={-1}>
                                                        <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                        <TableCell>{handleFormatDate(item.date_of_working)}</TableCell>
                                                        <TableCell>{item.subject}</TableCell>
                                                        <TableCell>
                                                            {/* <span>
                                                                {(item.is_approved === 0 && 'In progress') ||
                                                                    (item.is_approved === 1 && 'Disapproved') ||
                                                                    (item.is_approved === 2 && 'Approved')}
                                                            </span> */}

                                                            <span style={{ display: item.is_approved !== 0 && 'none' }} className="pending">
                                                                {item.is_approved === 0 && 'Pending'}
                                                            </span>
                                                            <span
                                                                style={{ display: item.is_approved !== 1 && 'none' }}
                                                                className="Disapproved"
                                                            >
                                                                {item.is_approved === 1 && 'Disapproved'}
                                                            </span>
                                                            <span
                                                                style={{ display: item.is_approved !== 2 && 'none' }}
                                                                className="green approved"
                                                            >
                                                                {item.is_approved === 2 && 'Approved'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>{item.Aname ? item.Aname : <span className="center">-</span>}</TableCell>
                                                        <TableCell>{handleFormatDate(item.createdAt.split('T')[0])}</TableCell>
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
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={currentTask ? task.length : allscrums.length || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Box>
                </Box>
                <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                    <div>
                        {/* Apply For Leave */}
                        <Modal
                            open={open3}
                            onClose={handleClose1}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h3" component="h2">
                                    Apply for weekend working
                                </Typography>
                                <form onSubmit={handleWeekendworking}>
                                    <Stack spacing={3}>
                                        <TextField
                                            type="text"
                                            style={{ margin: '15px 0' }}
                                            name="cause"
                                            autoComplete="off"
                                            label="Subject *"
                                            value={subject}
                                            onChange={handleChange}
                                            // error={reasonErrors.cause}
                                            error={reasonErrors.subject}
                                            helperText={reasonErrors.subject && 'Please enter the subject'}
                                        />
                                        <div className="leavedates weeekend_cus_p9">
                                            {/* <div className="settingbutton"> */}
                                            <label style={{ marginLeft: '5px' }} htmlFor="start-date">
                                                Date of Working *:
                                            </label>
                                            {/* <span>To Date:</span> */}
                                            <input
                                                // max={formatDate(new Date())}
                                                // label="From Date"
                                                min={new Date().toISOString().split('T')[0]}
                                                name="leavestartDate"
                                                type="date"
                                                id="start-date"
                                                value={leavestartDate}
                                                onChange={handleStartDateChange}
                                                className="leaveDate leaveDate_cus"
                                            />
                                            {reasonErrors.date && (
                                                <span
                                                    style={{
                                                        color: '#f44336',
                                                        fontSize: 12,
                                                        marginLeft: 14,
                                                        display: 'flex',
                                                        marginBottom: '10px'
                                                    }}
                                                >
                                                    Please enter the Date of Working{' '}
                                                </span>
                                            )}
                                        </div>
                                        {/* </div> */}
                                    </Stack>

                                    <div className="editor">
                                        <ReactQuill
                                            theme="snow"
                                            value={reasond}
                                            onChange={setreasond}
                                            className="editor-input"
                                            modules={modules}
                                            placeholder="Description *"
                                        />
                                    </div>

                                    {reasonErrors.reasond && (
                                        <span style={{ color: '#f44336', fontSize: 12, marginLeft: 14 }}>
                                            Please enter the Description{' '}
                                        </span>
                                    )}

                                    {/* )} */}
                                    <Box sx={{ mt: 2 }} className="popup_scrum">
                                        <AnimateButton>
                                            <Button size="large" type="submit" variant="contained" color="secondary">
                                                Submit
                                            </Button>
                                        </AnimateButton>
                                        <AnimateButton>
                                            <Button
                                                className="cancellation"
                                                size="large"
                                                // type="submit"
                                                variant="contained"
                                                color="primary"
                                                onClick={handleClose1}
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
                    </div>
                </Box>
                <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
            </MainCard>
        </>
    );
}
