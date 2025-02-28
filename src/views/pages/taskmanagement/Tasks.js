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
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
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
import { handleFormatDate, formatDate } from 'function/FormatTime';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';

const columns = [
    { id: 'id', label: '#', minWidth: '60%' },
    { id: 'project', label: 'Project' },
    { id: 'taskName', label: 'Task Name' },
    { id: 'assignedby', label: 'Assigned by' },
    { id: 'due_date', label: 'Due Date' },
    { id: 'taskpriority', label: 'Task Priority' },
    { id: 'createdon', label: 'Created On' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' }
];

// function createData(
//     id,
//     project,
//     // assignedsupervisors,
//     assignedby,
//     due_date,
//     taskpriority,
//     createdon,
//     status,
//     actions
// ) {
//     return {
//         id,

//         project,
//         // assignedsupervisors,
//         assignedby,
//         due_date,
//         taskpriority,
//         createdon,
//         status,
//         actions
//     };
// }

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

export default function Tasks() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [task, setTask] = useState([]);
    const [allscrums, setAllscrums] = useState([]);
    // const [currentTask, setCurrentTask] = useState([]);
    const [currentTask, setCurrentTask] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [user, setUser] = useState({
        to: '',
        bugs_counted: '',
        reasons: ''
    });
    const { to, bugs_counted, reasons } = user;
    const [acknowledge, setAcknowledge] = useState('');
    const [checkboxTrue, setCheckboxTrue] = useState(false);
    const [ids, setids] = useState({ task_id: '', project_id: '' });
    const [editUser, setEdituser] = useState({
        title: '',
        client_project_report_id: ''
    });
    const [error, seterror] = useState(false);
    const [value, setValue] = useState('');
    const [supervisor, setSupervisor] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [open, setOpen] = useState(false);
    const [alertContent, setAlertcontent] = useState('');
    const [actions, setActions] = useState(false);
    const [tabs, settabs] = useState('0');
    const [checked, setChecked] = useState(false);
    // const [checkboxDate, setCheckboxDate] = useState(formatDate(new Date()));
    const [tabsValue, setTabsvalue] = useState();
    const [projectids, setProjectids] = useState({ task_id: '', project_id: '', selectedValues: '', task_due_date: '' });
    const [checkboxDate, setCheckboxDate] = useState();
    const [reasonErrors, setReasonErrors] = useState({ commonReason: false, dueDate: false, dateReason: false, notFound: false });

    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');

    const handleTabsChange = (event, newValue) => {
        // console.log(newValue, 'hello newvalue');
        setAllscrums([]);
        settabs(newValue);
        const to_date = endDate;
        const from_date = startDate;
        const data = {
            user_id: user_id,
            status: newValue,
            to_date,
            from_date
        };
        tasks(data);
        setTabsvalue(newValue);
        // setAllscrums([]); // add this line to clear the state
    };
    // console.log(task, 'hello this the data');

    // console.log(tabsValue, 'hello this is tab value');
    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false,
            message: ''
        });
    };

    const handleClose = () => setOpen1(false);
    const handleClose1 = () => setOpen2(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        // setHandlereason({ ...user, [name]: value });
    };
    // console.log(user, 'Deepak =========>');

    const handleChange1 = (e) => {
        const { name, value } = e.target;
        setEdituser({ ...editUser, [name]: value });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));
    const navigate = useNavigate();

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleCheckboxDate = (event) => {
        setCheckboxDate(event.target.value);
    };

    // console.log(checked, 'hello checkbox');

    // console.log(startDate, endDate);

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
        setReasonErrors({ dateReason: false });
    };

    async function tasks(data) {
        const URL = API.GET_TASKS;
        console.log('entering');

        try {
            var result = await axios.post(
                URL,
                // '/user/get-tasks',
                // data === undefined ? { user_id: user_id, status: 0 } : data,
                data === undefined ? { user_id: user_id, status: 0 } : data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // console.log(result.data, 'getdata');
            if (result.status === 200) {
                // console.log(result.data,');
                // setCurrentTask(true);
                let newresult = result.data.data.tasks;
                const assignedByName = await Promise.all(
                    newresult.map(async (assignment) => {
                        const response = await axios.post(
                            API.ASSIGNED_BY_NAME,
                            // "/user/getAssignedByUser",
                            {
                                user_id: assignment.user_id,
                                supervisor_id: assignment.assigned_by
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );
                        // console.log('hello this is my', response.data.data);
                        const super_user_fname = response.data.data.first_name;
                        const super_user_mname = response.data.data.middle_name;
                        const super_user_lname = response.data.data.last_name;
                        const supervisor_Name = `${super_user_fname} ${super_user_mname} ${super_user_lname}`;
                        return {
                            ...assignment,
                            ...result.data.data,
                            supervisor_Name
                        };
                    })
                );
                setCurrentTask(true);
                setTask(assignedByName);
                setStartDate(assignedByName[0].dateRange.startDate);
                setEndDate(assignedByName[0].dateRange.endDate);

                // setSupervisorName(assignedByName);
                // console.log('Hello BottleMobile:', assignedByName);
            }

            if (result.status === 202) {
                console.log(result.data.data.dateRange, '>>>>>>>>..ammmmyyyy');
                setStartDate(result.data.data.dateRange.startDate);
                setEndDate(result.data.data.dateRange.endDate);
                setCurrentTask(false);
            }
        } catch (err) {
            console.log('>>>>>>>>>>>>>>>>>>>>>>result', result);
            if (err.response.status === 404) {
                setCurrentTask(false);
                console.log(err, 'Error from the API Response ');
            } else if (err.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    }

    // console.log(currentTask, 'hello');
    // console.log(task, 'hello ');
    // console.log(supervisorName, 'hello supervisors');
    // const to_date = startDate;
    // const from_date = endDate;
    const to_date = endDate;
    const from_date = startDate;

    // console.log(reasonErrors.commonReason, 'hello himanshu');
    const handleDates = async (e) => {
        e.preventDefault();
        // console.log(tabsValue, 'hello All statuses');
        const URL = API.GET_TASKS;
        try {
            const result = await axios.post(
                URL,
                // '/user/get-tasks',
                {
                    user_id,
                    to_date,
                    from_date,
                    status: tabsValue === undefined ? 0 : tabsValue
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                setCurrentTask(false);
                let newresult = result.data.data.tasks;
                // console.log(newresult, 'getdata');
                setActions(true);
                // setAllscrums(newresult);
                // setTask(newresult);
                // Assigned by Name
                // const assignedByID = result.data.data.tasks;
                const assignedByName = await Promise.all(
                    newresult.map(async (assignment) => {
                        const response = await axios.post(
                            API.ASSIGNED_BY_NAME,
                            // "/user/getAssignedByUser",
                            {
                                user_id: assignment.user_id,
                                supervisor_id: assignment.assigned_by
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );
                        // console.log('hello this is my', response.data.data);
                        const super_user_fname = response.data.data.first_name;
                        const super_user_mname = response.data.data.middle_name;
                        const super_user_lname = response.data.data.last_name;
                        const supervisor_Name = `${super_user_fname} ${super_user_mname} ${super_user_lname}`;
                        return {
                            ...assignment,
                            supervisor_Name
                        };
                    })
                );
                setAllscrums(assignedByName);

                // setSupervisorName(assignedByName);
                console.log('Hello BottleMobile:', assignedByName);
            }
        } catch (err) {
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
        // setAllscrums([]);
        const to_date = formatDate(new Date());
        const from_date = formatDate(new Date());
        console.log(tabsValue);
        const newdata = {
            user_id: user_id,
            status: tabsValue,
            to_date,
            from_date
        };
        console.log(to_date, from_date);
        setStartDate(formatDate(new Date()));
        setEndDate(formatDate(new Date()));
        tasks(newdata);
        // console.log(newdata);
        // if (tabsValue === 0) {
        //     tasks(newdata);
        // }
        // if (projectids === 0) {
        //     setCurrentTask(true);
        //     tasks(newdata);
        //     console.log('hello');
        // }
        // if (projectids === 1) {
        //     setCurrentTask(true);
        //     tasks(newdata);
        // }
        // if (projectids === 2) {
        //     setCurrentTask(true);
        // }
        // if (projectids === 3) {
        //     setCurrentTask(true);
        // }
    };

    const handleReport = async (e, task_id, project_id, due_date, createdAt) => {
        const proId = e.target.value;
        if (proId === '8') {
            setOpen(true);
            // setAlertcontent('Are you sure you want to move task in Done');
            setAlertcontent('Are you sure you want to mark this task as done?');
            setCheckboxTrue(false);
            setProjectids({ task_id: task_id, project_id: project_id, selectedValues: e.target.value });
        }
        if (proId === '5') {
            setOpen(true);
            setAlertcontent('Are you sure you want to mark this task as completed?');
            setCheckboxTrue(false);
            setProjectids({ task_id: task_id, project_id: project_id, selectedValues: e.target.value });
        }
        if (proId === '9') {
            setOpen(true);
            setAlertcontent('Are you sure you want to mark this task as In-Progress?');
            setCheckboxTrue(false);
            setProjectids({ task_id: task_id, project_id: project_id, selectedValues: e.target.value });
        }
        if (proId === '6') {
            setOpen(true);
            setAlertcontent('Are you sure you want to mark this task as Acknowledged?');
            setProjectids({ task_id: task_id, project_id: project_id, selectedValues: e.target.value, task_due_date: due_date });
            setCheckboxTrue(true);
            const now = new Date();

            const Datestring = new Date(createdAt);
            const timeString = Datestring.toLocaleTimeString();
            console.log(timeString, 'Only Time');
            console.log(createdAt, 'Created Date of Task');

            // const amitDate = new Date(createdAt);
            // const datecheck = createdAt.setHours(createdAt.getHours() + 24);

            // if (now > datecheck) {
            //     setShowcheck(true);
            // }
        }
        if (proId === '1') {
            setOpen1(true);
        }
        if (proId === '2') {
            // getDSRreport(id);
            setOpen2(true);
        }
        if (proId === '4') {
            navigate(`/task-management/qa-response/${project_id}/${task_id}`);
        }
    };

    async function handleConsole() {
        // console.log(projectids, 'Hello ID');
        // console.log(acknowledge, checkboxDate, 'hello');
        // if (tabsValue === '1' && !reasons) {
        //     console.log('Not Empty');
        //     setReasonErrors({ commonReason: true });
        // } else
        if (!checked && !reasons) {
            setReasonErrors({ commonReason: true });
        } else {
            if (checked && !checkboxDate) {
                setReasonErrors({ dueDate: true });
            } else if (checked && !acknowledge) {
                setReasonErrors({ dateReason: true });
            } else if (checkboxDate === projectids.task_due_date) {
                setReasonErrors({ dueDate: true });
            }
            //  else {
            const data = {
                task_id: projectids.task_id,
                user_id: user_id,
                project_id: projectids.project_id,
                new_status:
                    projectids.selectedValues === '6'
                        ? 1
                        : projectids.selectedValues === '9'
                        ? 2
                        : projectids.selectedValues === '5'
                        ? 3
                        : projectids.selectedValues === '8'
                        ? 4
                        : '',
                old_status:
                    projectids.selectedValues === '6'
                        ? 0
                        : projectids.selectedValues === '9'
                        ? 1
                        : projectids.selectedValues === '5'
                        ? 2
                        : projectids.selectedValues === '8'
                        ? 3
                        : '',
                reason: checked ? acknowledge : reasons,
                new_task_due_date: checked ? checkboxDate : null,
                old_task_due_date: checked ? projectids.task_due_date : null
            };
            // console.log('status', data);
            const URL = API.UPDATE_TASK_STATUS;
            try {
                const result = await axios.post(
                    URL,
                    // '/user/update_status_tasks',
                    data,
                    // { user_id, status, task_id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (result.status === 200) {
                    const newdata = {
                        user_id: user_id,
                        status: tabsValue
                    };
                    console.log(result.data, 'helllsl');
                    setOpen(false);
                    setChecked(false);
                    setReasonErrors({ dateReason: false });
                    setSnackbar({
                        open: true,
                        message: result.data.msg,
                        severity: 'success'
                    });
                    tasks(newdata);
                    setAcknowledge('');
                    setUser({ reasons: '' });
                }
            } catch (err) {
                console.log(err);
            }
        }
        // }
    }

    const project_supervisor = async (project_id) => {
        const URL = API.PROJECT_SUPERVISOR;
        if (project_id === undefined) {
            // console.log('undefined');
            return null;
        } else {
            try {
                const result = await axios.post(
                    URL,
                    // '/user/get_project_supervisor',
                    { user_id, project_id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (result.status === 200) {
                    // console.log(result.data.data.data, 'this response is hello');
                    const response = result.data.data.data;
                    setSupervisor(response);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    async function handleQA(e) {
        const URL = API.ADD_QA_NOTES;
        e.preventDefault();
        const { project_id, task_id } = ids;
        const qa_description = value;
        // console.log(project_id, task_id, 'this is himanshu');

        // console.log('task_id:', task_id, 'project_id:', project_id);
        try {
            const result = await axios.post(
                URL,
                // '/user/add_qa_notes',
                {
                    user_id,
                    project_id,
                    task_id,
                    qa_description,
                    bugs_counted
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 201) {
                setOpen(true);
                setOpen1(false);
                setSnackbar({
                    open: true,
                    message: 'Notes added successfully'
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleDisagree = () => {
        setOpen(false);
        setChecked(false);
        setReasonErrors({ dateReason: false });
        setAcknowledge('');
        setUser({ reasons: '' });
    };

    // const TaskCreatedDate = (createdDate) => {
    //     const date = new Date(createdDate);

    //     const year = date.getFullYear();
    //     const month = date.getMonth() + 1;
    //     const day = date.getDate();

    //     const hours = date.getHours();
    //     const minutes = date.getMinutes();
    //     const seconds = date.getSeconds();
    //     const formattedDate = `${year}-${month}-${day}`;
    //     const formattedTime = `${hours}:${minutes}:${seconds}`;
    //     return { date: formattedDate, time: formattedTime };
    // };

    // const Dating = '2023-04-26T00:00:00.000Z';
    // console.log(TaskCreatedDate(Dating), 'deepakwss');

    const createdDate = '2023-04-26T00:00:00.000Z';
    // console.log(date, time, 'hello date time ');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: MENU_OPEN, id: 'task' });
        tasks();
        project_supervisor();
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
                <h4>Task Records</h4>

                {/* <Box sx={{ mt: 2 }} className="popup_scrum scrumbtns">
                     <AnimateButton>
                        <Button
                            style={{ marginRight: 10 }}
                            size="large"
                            // type="submit"
                            variant="contained"
                            color="secondary"
                        >
                            Weekly Sprint
                        </Button>
                    </AnimateButton> 
                    <AnimateButton>
                        <Button
                            size="large"
                            // type="submit"
                            variant="contained"
                            color="secondary"
                        >
                            Miscellaneous Tasks
                        </Button>
                    </AnimateButton>
                    <AnimateButton>
                        <Button
                            size="large"
                            // type="submit"
                            variant="contained"
                            color="secondary"
                        >
                            Upcoming weekly sprints
                        </Button>
                    </AnimateButton>
                </Box> */}
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
                            <Tab label="Assigned" value="0" />
                            <Tab label="Acknowledged" value="1" />
                            <Tab label="In Progress" value="2" />
                            <Tab label="Completed" value="3" />
                            <Tab label="Done" value="4" />
                        </TabList>
                    </Box>
                    <TabPanel value="0">
                        <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                {/* {columns.map((column) => {
                                                    if (column.label === 'Actions' && actions) {
                                                        return null;
                                                    } */}
                                                {columns.map((column) => {
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
                                                        // console.log(item, 'heifisfdas=f=as===');
                                                        // alert('hello');
                                                        // project_supervisor(item.project_id);
                                                        return (
                                                            <TableRow
                                                                className="scrumreports"
                                                                // value={project_supervisor(item.project_id)}
                                                                // onClick={() => {
                                                                //     // console.log(item.project_id, 'Cap');
                                                                //     project_supervisor(item.project_id);
                                                                // }}
                                                                hover
                                                                role="checkbox"
                                                                key={index}
                                                                tabIndex={-1}
                                                            >
                                                                <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                <TableCell>{item.project.project_name}</TableCell>

                                                                <TableCell>{item.task_name}</TableCell>
                                                                <TableCell>
                                                                    {item.supervisor_Name === null ? 'Lorem' : item.supervisor_Name}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.task_due_date === null
                                                                        ? '0000-00-00'
                                                                        : handleFormatDate(item.task_due_date)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span>
                                                                        {item.Task_Priority === 0
                                                                            ? 'Low'
                                                                            : item.Task_Priority === 1
                                                                            ? 'High'
                                                                            : 'Medium'}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                <TableCell>
                                                                    <span className="assigned">Assigned</span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div>
                                                                        <select
                                                                            name="action"
                                                                            id="actions"
                                                                            className="actions"
                                                                            // onChange={handleReport}
                                                                            onChange={(e) => {
                                                                                // setTaskid(item.task_id);
                                                                                // getValue(e, item.task_id);
                                                                                // handleConsole(e, item.task_id);
                                                                                handleReport(
                                                                                    e,
                                                                                    item.task_id,
                                                                                    item.project_id,
                                                                                    item.task_due_date,
                                                                                    item.createdAt
                                                                                );
                                                                                // status(e, item.task_id);
                                                                                setids({
                                                                                    task_id: item.task_id,
                                                                                    project_id: item.project_id
                                                                                });
                                                                            }}
                                                                        >
                                                                            <option value="7" selected>
                                                                                Select
                                                                            </option>
                                                                            <option value="6">Acknowledged</option>
                                                                            {/* <option value="6">In Progress</option> */}
                                                                            {/* <option value="1">QA Notes</option>
                                                                            <option value="4">QA Response</option>
                                                                            <option value="5">Completed</option> */}
                                                                        </select>
                                                                    </div>
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
                                                                    // onClick={searchScrumsbydates}
                                                                    // onClick={() => {
                                                                    //     // console.log(item.project_id, 'Cap1');
                                                                    //     project_supervisor(item.project_id);
                                                                    // }}
                                                                    hover
                                                                    role="checkbox"
                                                                    key={index}
                                                                    tabIndex={-1}
                                                                >
                                                                    <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                    <TableCell>{item.project.project_name}</TableCell>
                                                                    <TableCell>{item.task_name}</TableCell>
                                                                    <TableCell>
                                                                        {item.supervisor_Name === null ? 'Lorem' : item.supervisor_Name}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item.task_due_date === null
                                                                            ? '0000-00-00'
                                                                            : handleFormatDate(item.task_due_date)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span>
                                                                            {item.Task_Priority === 0
                                                                                ? 'Low'
                                                                                : item.Task_Priority === 1
                                                                                ? 'High'
                                                                                : 'Medium'}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                    <TableCell>
                                                                        <span className="assigned">Assigned</span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div>
                                                                            <select
                                                                                name="action"
                                                                                id="actions"
                                                                                className="actions"
                                                                                // onChange={handleReport}
                                                                                onChange={(e) => {
                                                                                    // setTaskid(item.task_id);
                                                                                    // getValue(e, item.task_id);
                                                                                    // handleConsole(e, item.task_id);
                                                                                    handleReport(
                                                                                        e,
                                                                                        item.task_id,
                                                                                        item.project_id,
                                                                                        item.task_due_date,
                                                                                        item.createdAt
                                                                                    );
                                                                                    // status(e, item.task_id);
                                                                                    setids({
                                                                                        task_id: item.task_id,
                                                                                        project_id: item.project_id
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <option value="7" selected>
                                                                                    Select
                                                                                </option>
                                                                                <option value="6">Acknowledged</option>
                                                                                {/* <option value="6">In Progress</option> */}
                                                                                {/* <option value="1">QA Notes</option>
                                                                            <option value="4">QA Response</option>
                                                                            <option value="5">Completed</option> */}
                                                                            </select>
                                                                        </div>
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
                                                        // console.log(item, 'heifisfdas=f=as===');
                                                        // alert('hello');
                                                        // project_supervisor(item.project_id);
                                                        return (
                                                            <TableRow
                                                                className="scrumreports"
                                                                // value={project_supervisor(item.project_id)}
                                                                // onClick={() => {
                                                                //     // console.log(item.project_id, 'Cap');
                                                                //     project_supervisor(item.project_id);
                                                                // }}
                                                                hover
                                                                role="checkbox"
                                                                key={index}
                                                                tabIndex={-1}
                                                            >
                                                                <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                <TableCell>{item.project.project_name}</TableCell>
                                                                <TableCell>{item.task_name}</TableCell>
                                                                <TableCell>
                                                                    {item.supervisor_Name === null ? 'Lorem' : item.supervisor_Name}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.task_due_date === null
                                                                        ? '0000-00-00'
                                                                        : handleFormatDate(item.task_due_date)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span>
                                                                        {item.Task_Priority === 0
                                                                            ? 'Low'
                                                                            : item.Task_Priority === 1
                                                                            ? 'High'
                                                                            : 'Medium'}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                <TableCell>
                                                                    <span className="assigned">Acknowledged</span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div>
                                                                        <select
                                                                            name="action"
                                                                            id="actions"
                                                                            className="actions"
                                                                            // onChange={handleReport}
                                                                            onChange={(e) => {
                                                                                // setTaskid(item.task_id);
                                                                                // handleConsole(e, item.task_id);
                                                                                handleReport(e, item.task_id, item.project_id);
                                                                                // setTaskStatus(0);
                                                                                // status(e, item.task_id);
                                                                                setids({
                                                                                    task_id: item.task_id,
                                                                                    project_id: item.project_id
                                                                                });
                                                                                // getValue(e);
                                                                            }}
                                                                            // defaultValue="Select"
                                                                        >
                                                                            <option value="7" selected>
                                                                                Select
                                                                            </option>
                                                                            {/* <option value="3">Pending</option> */}
                                                                            <option value="9">In Progress</option>
                                                                            {/* <option value="1">QA Notes</option>
                                                                            <option value="4">QA Response</option>
                                                                            <option value="5">Completed</option> */}
                                                                        </select>
                                                                    </div>
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
                                                                    // onClick={searchScrumsbydates}
                                                                    onClick={() => {
                                                                        // console.log(item.project_id, 'Cap1');
                                                                        project_supervisor(item.project_id);
                                                                    }}
                                                                    hover
                                                                    role="checkbox"
                                                                    key={index}
                                                                    tabIndex={-1}
                                                                >
                                                                    <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                    <TableCell>{item.project.project_name}</TableCell>
                                                                    <TableCell>{item.task_name}</TableCell>
                                                                    <TableCell>
                                                                        {item.supervisor_Name === null ? 'Lorem' : item.supervisor_Name}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item.task_due_date === null
                                                                            ? '0000-00-00'
                                                                            : handleFormatDate(item.task_due_date)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span>
                                                                            {item.Task_Priority === 0
                                                                                ? 'Low'
                                                                                : item.Task_Priority === 1
                                                                                ? 'High'
                                                                                : 'Medium'}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                    <TableCell>
                                                                        <span className="assigned">Acknowledged</span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div>
                                                                            <select
                                                                                name="action"
                                                                                id="actions"
                                                                                className="actions"
                                                                                // onChange={handleReport}
                                                                                onChange={(e) => {
                                                                                    // setTaskid(item.task_id);
                                                                                    handleReport(e, item.task_id, item.project_id);
                                                                                    // setTaskStatus(0);
                                                                                    status(e, item.task_id);
                                                                                    setids({
                                                                                        task_id: item.task_id,
                                                                                        project_id: item.project_id
                                                                                    });
                                                                                }}
                                                                                defaultValue="Select"
                                                                            >
                                                                                <option value="7">Select</option>
                                                                                {/* <option value="3">Pending</option> */}
                                                                                <option value="9">In Progress</option>
                                                                                {/* <option value="1">QA Notes</option>
                                                                                <option value="4">QA Response</option>
                                                                                <option value="5">Completed</option> */}
                                                                            </select>
                                                                        </div>
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
                                                        // console.log(item, 'hello this is In Progress DATA ');
                                                        // alert('hello');
                                                        // project_supervisor(item.project_id);
                                                        return (
                                                            <TableRow
                                                                className="scrumreports"
                                                                // value={project_supervisor(item.project_id)}
                                                                // onClick={() => {
                                                                //     // console.log(item.project_id, 'Cap');
                                                                //     project_supervisor(item.project_id);
                                                                // }}
                                                                hover
                                                                role="checkbox"
                                                                key={index}
                                                                tabIndex={-1}
                                                            >
                                                                <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                <TableCell>{item.project.project_name}</TableCell>
                                                                <TableCell>{item.task_name}</TableCell>
                                                                <TableCell>
                                                                    {/* {supervisorName} */}
                                                                    {item.supervisor_Name === null ? 'Lorem' : item.supervisor_Name}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.task_due_date === null
                                                                        ? '0000-00-00'
                                                                        : handleFormatDate(item.task_due_date)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span>
                                                                        {item.Task_Priority === 0
                                                                            ? 'Low'
                                                                            : item.Task_Priority === 1
                                                                            ? 'High'
                                                                            : 'Medium'}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                <TableCell>
                                                                    <span className="assigned">In Progress</span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div>
                                                                        <select
                                                                            name="action"
                                                                            id="actions"
                                                                            className="actions"
                                                                            // onChange={handleReport}
                                                                            onChange={(e) => {
                                                                                // setTaskid(item.task_id);
                                                                                handleReport(e, item.task_id, item.project_id);
                                                                                // setTaskStatus(0);
                                                                                // status(e, item.task_id);
                                                                                setids({
                                                                                    task_id: item.task_id,
                                                                                    project_id: item.project_id
                                                                                });
                                                                            }}
                                                                        >
                                                                            <option value="7" selected>
                                                                                Select
                                                                            </option>
                                                                            {/* <option value="3">Pending</option> */}
                                                                            {/* <option value="6">In Progress</option>
                                                                            <option value="1">QA Notes</option>
                                                                            <option value="4">QA Response</option> */}
                                                                            <option value="5">Complete</option>
                                                                        </select>
                                                                    </div>
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
                                                                    // onClick={searchScrumsbydates}
                                                                    // onClick={() => {
                                                                    //     // console.log(item.project_id, 'Cap1');
                                                                    //     project_supervisor(item.project_id);
                                                                    // }}
                                                                    hover
                                                                    role="checkbox"
                                                                    key={index}
                                                                    tabIndex={-1}
                                                                >
                                                                    <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                    <TableCell>{item.project.project_name}</TableCell>
                                                                    <TableCell>{item.task_name}</TableCell>
                                                                    <TableCell>
                                                                        {item.supervisor_Name === null ? 'Lorem' : item.supervisor_Name}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item.task_due_date === null
                                                                            ? '0000-00-00'
                                                                            : handleFormatDate(item.task_due_date)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span>
                                                                            {item.Task_Priority === 0
                                                                                ? 'Low'
                                                                                : item.Task_Priority === 1
                                                                                ? 'High'
                                                                                : 'Medium'}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                    <TableCell>
                                                                        <span className="assigned">In Progress</span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div>
                                                                            <select
                                                                                name="action"
                                                                                id="actions"
                                                                                className="actions"
                                                                                // onChange={handleReport}
                                                                                onChange={(e) => {
                                                                                    // setTaskid(item.task_id);
                                                                                    handleReport(e, item.task_id, item.project_id);
                                                                                    // setTaskStatus(0);
                                                                                    status(e, item.task_id);
                                                                                    setids({
                                                                                        task_id: item.task_id,
                                                                                        project_id: item.project_id
                                                                                    });
                                                                                }}
                                                                                defaultValue="Select"
                                                                            >
                                                                                <option value="7">Select</option>
                                                                                {/* <option value="3">Pending</option>
                                                                                <option value="6">In Progress</option>
                                                                                <option value="1">QA Notes</option>
                                                                                <option value="4">QA Response</option> */}
                                                                                <option value="5">Completed</option>
                                                                            </select>
                                                                        </div>
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
                    <TabPanel value="3">
                        <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                {columns.map((column) => {
                                                    // Render the 'Actions' column only if alldsrs is false
                                                    if (column.label === 'Actions') {
                                                        return null;
                                                    }

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
                                                        // console.log(item, 'heifisfdas=f=as===');
                                                        // alert('hello');
                                                        // project_supervisor(item.project_id);
                                                        return (
                                                            <TableRow
                                                                className="scrumreports"
                                                                // value={project_supervisor(item.project_id)}
                                                                onClick={() => {
                                                                    // console.log(item.project_id, 'Cap');
                                                                    project_supervisor(item.project_id);
                                                                }}
                                                                hover
                                                                role="checkbox"
                                                                key={index}
                                                                tabIndex={-1}
                                                            >
                                                                <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                <TableCell>{item.project.project_name}</TableCell>

                                                                <TableCell>{item.task_name}</TableCell>
                                                                <TableCell>
                                                                    {item.supervisor_Name === null ? 'Lorem' : item.supervisor_Name}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.task_due_date === null
                                                                        ? '0000-00-00'
                                                                        : handleFormatDate(item.task_due_date)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span>
                                                                        {item.Task_Priority === 0
                                                                            ? 'Low'
                                                                            : item.Task_Priority === 1
                                                                            ? 'High'
                                                                            : 'Medium'}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                <TableCell>
                                                                    <span className="assigned">Completed</span>
                                                                </TableCell>
                                                                {/* <TableCell>
                                                                    <div>
                                                                        <select
                                                                            name="action"
                                                                            id="actions"
                                                                            className="actions"
                                                                            // onChange={handleReport}
                                                                            onChange={(e) => {
                                                                                // setTaskid(item.task_id);
                                                                                handleReport(e, item.task_id, item.project_id);
                                                                                // setTaskStatus(0);
                                                                                // status(e, item.task_id);
                                                                                setids({
                                                                                    task_id: item.task_id,
                                                                                    project_id: item.project_id
                                                                                });
                                                                            }}
                                                                        >
                                                                            <option value="7" selected>
                                                                                Select
                                                                            </option>
                                                                            //  <option value="3">Pending</option>
                                                                            // <option value="6">In Progress</option>
                                                                            // <option value="1">QA Notes</option>
                                                                            // <option value="4">QA Response</option>
                                                                            // <option value="5">Completed</option> 
                                                                            <option value="8">Done</option>
                                                                        </select>
                                                                    </div>
                                                                </TableCell> */}
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
                                                                    // onClick={searchScrumsbydates}
                                                                    onClick={() => {
                                                                        // console.log(item.project_id, 'Cap1');
                                                                        project_supervisor(item.project_id);
                                                                    }}
                                                                    hover
                                                                    role="checkbox"
                                                                    key={index}
                                                                    tabIndex={-1}
                                                                >
                                                                    <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                    <TableCell>{item.project.project_name}</TableCell>
                                                                    <TableCell>{item.task_name}</TableCell>
                                                                    <TableCell>
                                                                        {item.supervisor_Name === null ? 'Lorem' : item.supervisor_Name}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item.task_due_date === null
                                                                            ? '0000-00-00'
                                                                            : handleFormatDate(item.task_due_date)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span>
                                                                            {item.Task_Priority === 0
                                                                                ? 'Low'
                                                                                : item.Task_Priority === 1
                                                                                ? 'High'
                                                                                : 'Medium'}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                    <TableCell>
                                                                        <span className="assigned">Completed</span>
                                                                    </TableCell>
                                                                    {/* <TableCell>
                                                                        <div>
                                                                            <select
                                                                                name="action"
                                                                                id="actions"
                                                                                className="actions"
                                                                                // onChange={handleReport}
                                                                                onChange={(e) => {
                                                                                    // setTaskid(item.task_id);
                                                                                    handleReport(e, item.task_id, item.project_id);
                                                                                    // setTaskStatus(0);
                                                                                    status(e, item.task_id);
                                                                                    setids({
                                                                                        task_id: item.task_id,
                                                                                        project_id: item.project_id
                                                                                    });
                                                                                }}
                                                                                defaultValue="Select"
                                                                            >
                                                                                <option value="7" disabled>
                                                                                    Select
                                                                                </option>
                                                                                //  <option value="3">Pending</option>
                                                                                // <option value="6">In Progress</option>
                                                                                // <option value="1">QA Notes</option>
                                                                                // <option value="4">QA Response</option>
                                                                                // <option value="5">Completed</option> 
                                                                                <option value="8">Done</option>
                                                                            </select>
                                                                        </div>
                                                                    </TableCell> */}
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
                    <TabPanel value="4">
                        <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                {columns.map((column) => {
                                                    // Render the 'Actions' column only if alldsrs is false
                                                    if (column.label === 'Actions') {
                                                        return null;
                                                    }

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
                                                {/* {columns.map((column) => (
                                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                                        {column.label}
                                                    </TableCell>
                                                ))} */}
                                            </TableRow>
                                        </TableHead>
                                        {currentTask ? (
                                            <TableBody className="scrumrows">
                                                {task && task.length > 0 ? (
                                                    task.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                                        // console.log(item, 'heifisfdas=f=as===');
                                                        // alert('hello');
                                                        // project_supervisor(item.project_id);
                                                        return (
                                                            <TableRow
                                                                className="scrumreports"
                                                                // value={project_supervisor(item.project_id)}
                                                                // onClick={() => {
                                                                //     // console.log(item.project_id, 'Cap');
                                                                //     project_supervisor(item.project_id);
                                                                // }}
                                                                hover
                                                                role="checkbox"
                                                                key={index}
                                                                tabIndex={-1}
                                                            >
                                                                <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                <TableCell>{item.project.project_name}</TableCell>
                                                                <TableCell>{item.task_name}</TableCell>

                                                                <TableCell>
                                                                    {item.supervisor_Name === null ? 'Lorem' : item.supervisor_Name}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.task_due_date === null
                                                                        ? '0000-00-00'
                                                                        : handleFormatDate(item.task_due_date)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span>
                                                                        {item.Task_Priority === 0
                                                                            ? 'Low'
                                                                            : item.Task_Priority === 1
                                                                            ? 'High'
                                                                            : 'Medium'}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {/* {TaskCreatedDate(item.created_date)}
                                                                    <br /> */}
                                                                    {handleFormatDate(item.created_date)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className="assigned">Done</span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div>
                                                                        {/* <select
                                                                            name="action"
                                                                            id="actions"
                                                                            className="actions"
                                                                            // onChange={handleReport}
                                                                            onChange={(e) => {
                                                                                // setTaskid(item.task_id);
                                                                                handleReport(e, item.task_id, item.project_id);
                                                                                // setTaskStatus(0);
                                                                                // status(e, item.task_id);
                                                                                setids({
                                                                                    task_id: item.task_id,
                                                                                    project_id: item.project_id
                                                                                });
                                                                            }}
                                                                        >
                                                                            <option value="7" selected>
                                                                                Select
                                                                            </option>
                                                                            //  <option value="3">Pending</option>
                                                                            // <option value="6">In Progress</option>
                                                                            // <option value="1">QA Notes</option>
                                                                            // <option value="4">QA Response</option>
                                                                            // <option value="5">Completed</option> 
                                                                            <option value="8">Done</option>
                                                                        </select> */}
                                                                    </div>
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
                                                                    // onClick={searchScrumsbydates}
                                                                    onClick={() => {
                                                                        // console.log(item.project_id, 'Cap1');
                                                                        project_supervisor(item.project_id);
                                                                    }}
                                                                    hover
                                                                    role="checkbox"
                                                                    key={index}
                                                                    tabIndex={-1}
                                                                >
                                                                    <TableCell key={index}>{serialNumber(page, index)}</TableCell>
                                                                    <TableCell>{item.project.project_name}</TableCell>
                                                                    <TableCell>{item.task_name}</TableCell>

                                                                    <TableCell>
                                                                        {item.supervisor_Name === null ? 'Lorem' : item.supervisor_Name}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item.task_due_date === null
                                                                            ? '0000-00-00'
                                                                            : handleFormatDate(item.task_due_date)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span>
                                                                            {item.Task_Priority === 0
                                                                                ? 'Low'
                                                                                : item.Task_Priority === 1
                                                                                ? 'High'
                                                                                : 'Medium'}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>{handleFormatDate(item.created_date)}</TableCell>
                                                                    <TableCell>
                                                                        <span className="assigned">Done</span>
                                                                    </TableCell>
                                                                    {/* <TableCell>
                                                                        <div>
                                                                            <select
                                                                                name="action"
                                                                                id="actions"
                                                                                className="actions"
                                                                                // onChange={handleReport}
                                                                                onChange={(e) => {
                                                                                    // setTaskid(item.task_id);
                                                                                    handleReport(e, item.task_id, item.project_id);
                                                                                    // setTaskStatus(0);
                                                                                    status(e, item.task_id);
                                                                                    setids({
                                                                                        task_id: item.task_id,
                                                                                        project_id: item.project_id
                                                                                    });
                                                                                }}
                                                                                defaultValue="Select"
                                                                            >
                                                                                <option value="7" disabled>
                                                                                    Select
                                                                                </option>
                                                                                // <option value="3">Pending</option>
                                                                                // <option value="6">In Progress</option>
                                                                                // <option value="1">QA Notes</option>
                                                                                // <option value="4">QA Response</option>
                                                                                // <option value="5">Completed</option> 
                                                                                // <option value="10">Done</option>
                                                                            </select>
                                                                        </div>
                                                                    </TableCell> */}
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
                {/* QA Notes */}

                <div>
                    <Modal
                        open={open1}
                        // onClose={handleClose1}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h3" component="h2">
                                QA Notes
                            </Typography>
                            <form
                                onSubmit={handleQA}
                                // onSubmit={AddDSR}
                            >
                                <Stack spacing={3}>
                                    <TextField
                                        type="number"
                                        style={{ margin: '15px 0' }}
                                        required
                                        name="bugs_counted"
                                        autoComplete="off"
                                        label=" Total Bugs Reported"
                                        value={bugs_counted}
                                        onChange={handleChange}
                                        error={error}
                                        helperText={error ? 'Please Fill the Email First' : ''}
                                    />
                                </Stack>

                                <div className="editor">
                                    <ReactQuill theme="snow" value={value} onChange={setValue} className="editor-input" modules={modules} />
                                </div>
                                <Box sx={{ mt: 2 }} className="popup_scrum">
                                    <AnimateButton>
                                        <Button size="large" type="submit" variant="contained" color="secondary">
                                            Send
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
                                            Cancel
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </form>
                        </Box>
                    </Modal>
                </div>

                {/* Edit DSR Modal  */}
                {/* <div>
                    <Modal
                        open={open2}
                        // onClose={handleClose1}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h3" component="h2">
                                Edit DSR Here
                            </Typography>
                            <form onSubmit={EditDSR}>
                                <Stack spacing={3}>
                                    <TextField
                                        style={{ margin: '15px 0' }}
                                        required
                                        name="title"
                                        autoComplete="off"
                                        label="Subject"
                                        value={title}
                                        onChange={handleChange1}
                                        error={error}
                                        helperText={error ? 'Please Fill the Email First' : ''}
                                    />
                                </Stack>

                                <div className="editor">
                                    <ReactQuill theme="snow" value={value} onChange={setValue} className="editor-input" modules={modules} />
                                </div>

                                <Box sx={{ mt: 2 }} className="popup_scrum">
                                    <AnimateButton>
                                        <Button size="large" type="submit" variant="contained" color="secondary">
                                            Send
                                        </Button>
                                    </AnimateButton>
                                    <AnimateButton>
                                        <Button
                                            className="cancellation"
                                            size="large"
                                            variant="contained"
                                            color="primary"
                                            onClick={handleClose1}
                                        >
                                            Cancel
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </form>
                        </Box>
                    </Modal>
                </div> */}
            </Box>

            <ResponsiveDialog
                open={open}
                setOpen={setOpen}
                // dialogTitle="Use Google's location service?"
                disagree={handleDisagree}
                agree={handleConsole}
                dialogContent={alertContent}
                handleChange={handleChange}
                value={reasons}
                name="reasons"
                disagreeButtonText="No"
                agreeButtonText="Yes"
                label="Reason"
                Reasonerror={reasonErrors.commonReason}
                helpers={reasonErrors.commonReason && 'Please Enter Reason'}
                // helpersText=
                // By Clicking on Checkbox Condition
                handleCheckboxChange={handleCheckboxChange}
                handleCheckboxDate={handleCheckboxDate}
                checked={checked}
                startDate={checkboxDate}
                dateError={checked && reasonErrors.dueDate && 'Please enter expected Date'}
                checkboxlabel="Check if you want to increase the Due Date"
                reasonlabel="Reason"
                reasonvalue={acknowledge}
                handleChangeReason={(e) => {
                    setAcknowledge(e.target.value);
                }}
                DateReason={reasonErrors.dateReason}
                datehelper={reasonErrors.dateReason && 'Please enter Reason'}
                displaycheckbox={!checkboxTrue ? 'none' : ''}
                date={projectids.task_due_date}
                display={tabs === '0' ? 'block' : 'none'}
            />
            <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
        </>
    );
}
