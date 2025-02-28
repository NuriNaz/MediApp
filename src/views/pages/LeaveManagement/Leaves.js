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
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';

const columns = [
    { id: 'id', label: '#', minWidth: '60%' },
    { id: 'leaveType', label: 'Leave Type' },
    { id: 'appliedDate', label: 'Applied Date' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' }
    // { id: 'taskpriority', label: 'Task Priority' },
    // { id: 'createdon', label: 'Created On' },
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

export default function Leaves() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [task, setTask] = useState([]);
    const [allscrums, setAllscrums] = useState([]);
    // const [currentTask, setCurrentTask] = useState([]);
    const [currentTask, setCurrentTask] = useState(false);

    const [user, setUser] = useState({
        cause: ''
    });

    const { cause } = user;

    const [value, setValue] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [actions, setActions] = useState(false);
    const [tabs, settabs] = useState('0');
    // const [checkboxDate, setCheckboxDate] = useState(formatDate(new Date()));
    const [tabsValue, setTabsvalue] = useState();
    const [reasonErrors, setReasonErrors] = useState({
        dueDate: false,
        dateReason: false,
        notFound: false,
        leaveTypes: false,
        cause: false,
        leaveDesc: false,
        leaveStartDate: false
    });
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));

    const [leavestartDate, setLeaveStartDate] = useState(formatDate(new Date()));
    const [leaveendDate, setLeaveEndDate] = useState(formatDate(new Date()));
    const [isLoading, setIsLoading] = useState(false);
    const [leaveData, setLeaveData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');

    const handleTabsChange = (event, newValue) => {
        // console.log(newValue, 'hello newvalue');
        settabs(newValue);
        const to_date = endDate;
        const from_date = startDate;
        const data = {
            userId: user_id,
            approved_status: newValue,
            to_date,
            from_date
        };
        tasks(data);
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
        setOpen3(false);
        setSelectedOption('');
        setUser({ cause: '' });
        setValue('');
        setLeaveStartDate(formatDate(new Date()));
        setLeaveEndDate(formatDate(new Date()));
        setReasonErrors({ cause: false, leaveDesc: false, leaveTypes: false });
    };

    const handleClose2 = () => {
        setOpen4(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const SelecthandleChange = (e) => {
        console.log(e);
        setSelectedOption(e.target.value);
        // LeaveTypes();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const navigate = useNavigate();

    const handleStartDateChange = (event) => {
        if (leavestartDate) {
            setLeaveStartDate(event.target.value);
        }
        if (startDate) {
            setStartDate(event.target.value);
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

    async function tasks(data) {
        setTask([]);
        const URL = API.GET_ALL_LEAVES;
        const userId = user_id;
        try {
            const result = await axios.post(
                URL,
                // '/user/get-tasks',
                // data === undefined ? { user_id: user_id, status: 0 } : data,
                data === undefined ? { userId: userId, approved_status: 0 } : data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                console.log(result.data.data.data, 'hello this is result');
                setCurrentTask(true);
                setTask(result.data.data.data);
                console.log(result.data.data.dateRange);
                setStartDate(result.data.data.dateRange.startDate.split('T')[0]);
                setEndDate(result.data.data.dateRange.endDate.split('T')[0]);
            }
        } catch (err) {
            if (err.response.status === 404) {
                console.log('404040404000000000000000000000000000000000000000000000');
                setTask([]);
                setCurrentTask(false);
                setAllscrums([]);
                console.log(err, 'Error from the API Response ');
            } else if (err.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    }

    // console.log(reasonErrors.commonReason, 'hello himanshu');
    const handleDates = async (e) => {
        e.preventDefault();
        const to_date = endDate;
        const from_date = startDate;
        const URL = API.GET_ALL_LEAVES;
        const userId = user_id;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_notes',
                { userId, to_date, from_date, approved_status: tabsValue === undefined ? 0 : tabsValue },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                console.log(result.data.data.data, 'handleDates');
                setCurrentTask(false);
                setAllscrums(result.data.data.data);
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

    // console.log(allscrums, 'hello rajat jfajak');
    const serialNumber = (page, index) => {
        return page * rowsPerPage + index + 1;
    };

    const handleClear = () => {
        // settabs('0');
        // setCurrentTask(true);
        setActions(false);
        // setTask([]);
        // setAllscrums([]);

        // setAllscrums([]);
        const to_date = formatDate(new Date());
        const from_date = formatDate(new Date());
        console.log(tabsValue);

        const newdata = {
            userId: user_id,
            approved_status: tabsValue === undefined ? 0 : tabsValue,
            to_date,
            from_date
        };
        setStartDate(formatDate(new Date()));
        setEndDate(formatDate(new Date()));
        tasks(newdata);
    };

    const leaveApply = (e) => {
        setOpen3(true);
    };

    const handleLeave = async (e) => {
        e.preventDefault();
        if (selectedOption === '') {
            setReasonErrors({ leaveTypes: true });
        } else if (!cause) {
            setReasonErrors({ cause: true });
        } else if (!value) {
            setReasonErrors({ leaveDesc: true });
        } else {
            const URL = API.LEAVE_APPLY;
            const leave_type_id = selectedOption;
            const subject = cause;
            const to_date = leaveendDate;
            const from_date = leavestartDate;
            const reason = value;
            try {
                setIsLoading(true);
                const result = await axios.post(
                    URL,
                    // '/user/get_notes',
                    { user_id, leave_type_id, subject, to_date, from_date, reason },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (result.status === 200) {
                    setOpen3(false);
                    tasks();
                    setSelectedOption('');
                    setUser({ cause: '' });
                    setValue('');
                    setLeaveStartDate(formatDate(new Date()));
                    setLeaveEndDate(formatDate(new Date()));
                    setReasonErrors({ cause: false, leaveDesc: false, leaveTypes: false });
                }
            } catch (err) {
                console.log(err);
            }
            setIsLoading(false);
        }
    };

    const LeaveTypes = async () => {
        // console.log('hello these are leave types');
        const URL = API.LEAVE_TYPE;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_notes',
                { user_id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                console.log(result.data.data, 'this is bottle text');
                setLeaveTypes(result.data.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleviewLeave = async (id) => {
        const URL = API.VIEW_LEAVE_BY_ID;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_notes',
                { user_id, id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                console.log(result.data.data);
                setLeaveData(result.data.data);
                // setSnackbar({
                //     open: true,
                //     message: result.data.message,
                //     severity: 'success'
                // });
            }
        } catch (err) {
            console.log(err);
        }
    };
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: MENU_OPEN, id: 'leave' });
        tasks();
        LeaveTypes();
    }, []);

    return (
        <>
            <form onSubmit={handleDates}>
                <div className="attendance buttonsettings">
                    <div className="settingbutton">
                        <input
                            // max={formatDate(new Date())}
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={handleStartDateChange}
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
                        <Button size="large" variant="contained" color="secondary" className="punchin leaveManagement" onClick={leaveApply}>
                            Apply for leave
                        </Button>
                    </motion.button>

                    {/* </AnimateButton> */}
                </div>
                <h4>Leave Records</h4>

                {/* <Box sx={{ mt: 2 }} className="popup_scrum scrumbtns"> */}
            </div>
            <Box sx={{ marginTop: 2, width: '100%', typography: 'body1' }}>
                <TabContext className="AllTabs" value={tabs}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList
                            sx={{
                                '& .Mui-selected': {
                                    color: '#573dac '
                                }
                            }}
                            onChange={handleTabsChange}
                            aria-label="lab API tabs example"
                        >
                            <Tab label="Applied" value="0" />
                            <Tab label="Approved" value="1" />
                            <Tab label="Disapproved" value="2" />

                            {/* <Tab label="Completed" value="3" />
                            <Tab label="Done" value="4" /> */}
                        </TabList>
                    </Box>
                    <TabPanel value="0">
                        <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
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
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            style={{ minWidth: column.minWidth }}
                                                        >
                                                            {column.label}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        </TableHead>
                                        {currentTask ? (
                                            <TableBody className="scrumrows">
                                                {task && task.length > 0 ? (
                                                    task.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                                        return (
                                                            <TableRow
                                                                className="scrumreports"
                                                                hover
                                                                role="checkbox"
                                                                key={index}
                                                                tabIndex={-1}
                                                            >
                                                                <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                <TableCell>{item.leave_type_name}</TableCell>

                                                                <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                <TableCell>
                                                                    <span>
                                                                        {(item.approved_status === 0 && 'Applied') ||
                                                                            (item.approved_status === 1 && 'Approved') ||
                                                                            (item.approved_status === 2 && 'Disapproved')}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        size="small"
                                                                        type="submit"
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        // style={{ padding: '10px 50px' }}
                                                                        onClick={() => {
                                                                            setOpen4(true);
                                                                            handleviewLeave(item.id);
                                                                        }}
                                                                        className="from_date leaveViewDate"
                                                                    >
                                                                        <AiFillEye fontSize={16} style={{ marginRight: 4 }} /> View
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                ) : (
                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'center' }} colSpan="9">
                                                            Record Not Found
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        ) : (
                                            <TableBody>
                                                {allscrums && allscrums.length > 0 ? (
                                                    allscrums
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((item, index) => {
                                                            // console.log(allscrums.length, 'hello Length');
                                                            return (
                                                                <TableRow
                                                                    className="scrumreports"
                                                                    hover
                                                                    role="checkbox"
                                                                    key={index}
                                                                    tabIndex={-1}
                                                                >
                                                                    <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                    <TableCell>{item.leave_type_name}</TableCell>

                                                                    <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                    <TableCell>
                                                                        <span>
                                                                            {(item.approved_status === 0 && 'Applied') ||
                                                                                (item.approved_status === 1 && 'Approved') ||
                                                                                (item.approved_status === 2 && 'Disapproved')}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            size="small"
                                                                            type="submit"
                                                                            variant="contained"
                                                                            color="secondary"
                                                                            // style={{ padding: '10px 50px' }}
                                                                            onClick={() => {
                                                                                setOpen4(true);
                                                                                handleviewLeave(item.id);
                                                                            }}
                                                                            className="from_date leaveViewDate"
                                                                        >
                                                                            <AiFillEye fontSize={16} style={{ marginRight: 4 }} /> View
                                                                        </Button>
                                                                    </TableCell>
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
                                    count={currentTask ? task.length : allscrums.length || 0}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Box>
                    </TabPanel>
                    <TabPanel value="1">
                        <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
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
                                        {currentTask ? (
                                            <TableBody className="scrumrows">
                                                {task && task.length > 0 ? (
                                                    task.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                                        return (
                                                            <TableRow
                                                                className="scrumreports"
                                                                hover
                                                                role="checkbox"
                                                                key={index}
                                                                tabIndex={-1}
                                                            >
                                                                <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                <TableCell>{item.leave_type_name}</TableCell>

                                                                <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                <TableCell>
                                                                    <span>
                                                                        {(item.approved_status === 0 && 'Applied') ||
                                                                            (item.approved_status === 1 && 'Approved') ||
                                                                            (item.approved_status === 2 && 'Disapproved')}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        size="small"
                                                                        type="submit"
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        // style={{ padding: '10px 50px' }}
                                                                        onClick={() => {
                                                                            setOpen4(true);
                                                                            handleviewLeave(item.id);
                                                                        }}
                                                                        className="from_date leaveViewDate"
                                                                    >
                                                                        <AiFillEye fontSize={16} style={{ marginRight: 4 }} /> View
                                                                    </Button>
                                                                </TableCell>
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
                                        ) : (
                                            <TableBody>
                                                {allscrums && allscrums.length > 0 ? (
                                                    allscrums
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((item, index) => {
                                                            return (
                                                                <TableRow
                                                                    className="scrumreports"
                                                                    hover
                                                                    role="checkbox"
                                                                    key={index}
                                                                    tabIndex={-1}
                                                                >
                                                                    <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                    <TableCell>{item.leave_type_name}</TableCell>

                                                                    <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                    <TableCell>
                                                                        <span>
                                                                            {(item.approved_status === 0 && 'Applied') ||
                                                                                (item.approved_status === 1 && 'Approved') ||
                                                                                (item.approved_status === 2 && 'Disapproved')}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            size="small"
                                                                            type="submit"
                                                                            variant="contained"
                                                                            color="secondary"
                                                                            // style={{ padding: '10px 50px' }}
                                                                            onClick={() => {
                                                                                setOpen4(true);
                                                                                handleviewLeave(item.id);
                                                                            }}
                                                                            className="from_date leaveViewDate"
                                                                        >
                                                                            <AiFillEye fontSize={16} style={{ marginRight: 4 }} /> View
                                                                        </Button>
                                                                    </TableCell>
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
                                    count={currentTask ? task.length : allscrums.length || 0}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Box>
                    </TabPanel>
                    <TabPanel value="2">
                        <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
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
                                        {currentTask ? (
                                            <TableBody className="scrumrows">
                                                {task && task.length > 0 ? (
                                                    task.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                                        return (
                                                            <TableRow
                                                                className="scrumreports"
                                                                hover
                                                                role="checkbox"
                                                                key={index}
                                                                tabIndex={-1}
                                                            >
                                                                <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                <TableCell>{item.leave_type_name}</TableCell>

                                                                <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                <TableCell>
                                                                    <span>
                                                                        {(item.approved_status === 0 && 'Applied') ||
                                                                            (item.approved_status === 1 && 'Approved') ||
                                                                            (item.approved_status === 2 && 'Disapproved')}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        size="small"
                                                                        type="submit"
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        // style={{ padding: '10px 50px' }}
                                                                        onClick={() => {
                                                                            setOpen4(true);
                                                                            handleviewLeave(item.id);
                                                                        }}
                                                                        className="from_date leaveViewDate"
                                                                    >
                                                                        <AiFillEye fontSize={16} style={{ marginRight: 4 }} /> View
                                                                    </Button>
                                                                </TableCell>
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
                                        ) : (
                                            <TableBody>
                                                {allscrums && allscrums.length > 0 ? (
                                                    allscrums
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((item, index) => {
                                                            return (
                                                                <TableRow
                                                                    className="scrumreports"
                                                                    hover
                                                                    role="checkbox"
                                                                    key={index}
                                                                    tabIndex={-1}
                                                                >
                                                                    <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                    <TableCell>{item.leave_type_name}</TableCell>

                                                                    <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                    <TableCell>
                                                                        <span>
                                                                            {(item.approved_status === 0 && 'Applied') ||
                                                                                (item.approved_status === 1 && 'Approved') ||
                                                                                (item.approved_status === 2 && 'Disapproved')}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            size="small"
                                                                            type="submit"
                                                                            variant="contained"
                                                                            color="secondary"
                                                                            // style={{ padding: '10px 50px' }}
                                                                            onClick={() => {
                                                                                setOpen4(true);
                                                                                handleviewLeave(item.id);
                                                                            }}
                                                                            className="from_date leaveViewDate"
                                                                        >
                                                                            <AiFillEye fontSize={16} style={{ marginRight: 4 }} /> View
                                                                        </Button>
                                                                    </TableCell>
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
                                    count={currentTask ? task.length : allscrums.length || 0}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Box>
                    </TabPanel>
                </TabContext>
            </Box>

            <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                <div>
                    {/* Apply For Leave */}
                    <Modal
                        open={open3}
                        // onClose={handleClose1}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h3" component="h2">
                                Apply for Leave
                            </Typography>
                            <form onSubmit={handleLeave}>
                                <FormControl style={{ width: '100%', marginTop: 10 }}>
                                    <Select
                                        id="select-label"
                                        labelId="select-label"
                                        value={selectedOption}
                                        onChange={SelecthandleChange}
                                        // error={error.reasons}
                                        displayEmpty
                                        onClick={LeaveTypes}
                                    >
                                        <MenuItem value="">
                                            <span>Select Leave Type *</span>
                                        </MenuItem>
                                        {leaveTypes.map((item, index) => {
                                            return (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.type}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                    <FormHelperText style={{ color: 'red' }}>
                                        {reasonErrors.leaveTypes && 'Please select the reason first'}
                                    </FormHelperText>
                                </FormControl>

                                <Stack spacing={3}>
                                    <TextField
                                        type="text"
                                        style={{ margin: '15px 0' }}
                                        name="cause"
                                        autoComplete="off"
                                        label="Subject *"
                                        value={cause}
                                        onChange={handleChange}
                                        error={reasonErrors.cause}
                                        helperText={reasonErrors.cause && 'Please enter the cause'}
                                    />

                                    <div className="attendance leavedates flex_cus_8g_k  ">
                                        {/* <div className="settingbutton"> */}
                                        <div className="leavedates  cus_leave_ub">
                                            <label className="label_cus_8" htmlFor="start-date">
                                                From Date *:
                                            </label>
                                            {/* <span>To Date:</span> */}
                                            <input
                                                // max={formatDate(new Date())}
                                                // label="From Date"

                                                min={leavestartDate}
                                                name="leavestartDate"
                                                type="date"
                                                id="start-date"
                                                value={leavestartDate}
                                                onChange={handleStartDateChange}
                                                className="leaveDate"
                                            />
                                        </div>

                                        <div className="leavedates  cus_leave_ub margin_left_cus">
                                            <label className="label_cus_8" htmlFor="end-date">
                                                To Date *:
                                            </label>
                                            <input
                                                // max={leavestartDate}
                                                min={leaveendDate}
                                                name="leaveendDate"
                                                type="date"
                                                id="end-date"
                                                value={leaveendDate}
                                                onChange={handleEndDateChange}
                                                className="leaveDate"
                                            />
                                        </div>
                                    </div>
                                    {/* </div> */}
                                </Stack>

                                <div className="editor">
                                    <ReactQuill
                                        theme="snow"
                                        value={value}
                                        onChange={setValue}
                                        className="editor-input"
                                        modules={modules}
                                        placeholder="Description*"
                                    />
                                </div>
                                {reasonErrors.leaveDesc && (
                                    <span style={{ color: '#f44336', fontSize: 12, marginLeft: 14 }}>Please enter the Description </span>
                                )}
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

                    {/* View Leave */}
                    <Modal
                        open={open4}
                        // onClose={handleClose1}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h3" component="h2">
                                View Leave Details
                            </Typography>
                            <form onSubmit={handleviewLeave}>
                                <FormControl style={{ width: '100%', marginTop: 10 }}>
                                    <Select
                                        disabled
                                        id="select-label"
                                        labelId="select-label"
                                        value={selectedOption}
                                        onChange={SelecthandleChange}
                                        // error={error.reasons}
                                        displayEmpty
                                        onClick={LeaveTypes}
                                    >
                                        <MenuItem value="" disabled>
                                            <span>{leaveData?.leaveTypeName?.type}</span>
                                        </MenuItem>
                                        {/* {leaveData.map((item, index) => {
                                            return ( */}
                                        <MenuItem
                                        // key={index} value={item.id}
                                        >
                                            {/* {leaveData.reason} */}
                                        </MenuItem>
                                        {/* );
                                        })} */}
                                    </Select>
                                    <FormHelperText style={{ color: 'red' }}>
                                        {reasonErrors.leaveTypes && 'Please select the reason first'}
                                    </FormHelperText>
                                </FormControl>

                                <Stack spacing={3}>
                                    <TextField
                                        disabled
                                        type="text"
                                        style={{ margin: '15px 0' }}
                                        name="cause"
                                        autoComplete="off"
                                        label="Subject"
                                        value={leaveData?.data?.subject}
                                        onChange={handleChange}
                                        error={reasonErrors.cause}
                                        helperText={reasonErrors.cause && 'Please enter the cause'}
                                    />
                                    <div className="attendance leavedates flex_cus_8g_k  ">
                                        {/* <div className="settingbutton"> */}
                                        <div className="leavedates  cus_leave_ub">
                                            <label className="" htmlFor="start-date">
                                                From Date:{' '}
                                            </label>
                                            {/* <span>To Date:</span> */}
                                            <input
                                                // max={formatDate(new Date())}
                                                // label="From Date"
                                                min={new Date().toISOString().split('T')[0]}
                                                name="leavestartDate"
                                                type="date"
                                                id="start-date"
                                                // value={leavestartDate}
                                                value={leaveData?.data?.from_date}
                                                onChange={handleStartDateChange}
                                                className="leaveDate"
                                                disabled
                                            />
                                            {reasonErrors.fromdate && (
                                                <span style={{ color: '#f44336', fontSize: 12, marginLeft: 14 }}>
                                                    Please enter the From date{' '}
                                                </span>
                                            )}
                                        </div>
                                        <div className="leavedates  cus_leave_ub margin_left_cus">
                                            <label className="" htmlFor="end-date">
                                                To Date:
                                            </label>
                                            <input
                                                // max={formatDate(new Date())}
                                                name="leaveendDate"
                                                type="date"
                                                id="end-date"
                                                value={leaveData?.data?.to_date}
                                                onChange={handleEndDateChange}
                                                className="leaveDate"
                                                disabled
                                            />
                                            {reasonErrors.todate && (
                                                <span style={{ color: '#f44336', fontSize: 12, marginLeft: 14 }}>
                                                    Please enter the To-date{' '}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Stack>

                                <div className="editor" style={{ background: '#f8fafc' }}>
                                    <ReactQuill
                                        // disabled
                                        readOnly={true}
                                        theme="snow"
                                        value={leaveData?.data?.reason}
                                        onChange={setValue}
                                        className="editor-input"
                                        modules={modules}
                                        placeholder="Description"
                                    />
                                </div>
                                {reasonErrors.leaveDesc && (
                                    <span style={{ color: '#f44336', fontSize: 12, marginLeft: 14 }}>Please enter the Description </span>
                                )}
                                <Box sx={{ mt: 2 }} className="popup_scrum ">
                                    {/* <AnimateButton>
                                        <Button size="large" type="submit" variant="contained" color="secondary">
                                            Submit
                                        </Button>
                                    </AnimateButton> */}
                                    <AnimateButton>
                                        <Button
                                            // className="cancellation"
                                            size="large"
                                            // type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={handleClose2}
                                        >
                                            Close
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </form>
                        </Box>
                    </Modal>
                </div>
            </Box>

            <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
        </>
    );
}
