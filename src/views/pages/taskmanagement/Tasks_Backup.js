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
import { Box, Button, ClickAwayListener, Modal, Stack, TextField, Typography, makeStyles } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import '../attendance/index.css';
import { useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Message from '../Snackbar/Toaster';
import Example from './Multi';
import { API } from 'Constants/API';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ResponsiveDialog from '../Alerts/ResponsiveDialog';
import { formatDate } from 'function/FormatTime';

const columns = [
    { id: 'id', label: '#', minWidth: '60%' },
    { id: 'project', label: 'Project' },
    // { id: 'assignedsupervisors', label: 'Assigned Supervisors' },
    { id: 'assignedby', label: 'Assigned by' },
    { id: 'due_date', label: 'Due Date' },
    { id: 'taskpriority', label: 'Task Priority' },
    { id: 'createdon', label: 'Created On' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' }

    // { id: 'subject', label: 'Subject' }
];

function createData(
    id,
    project,
    // assignedsupervisors,
    assignedby,
    due_date,
    taskpriority,
    createdon,
    status,
    actions
) {
    return {
        id,

        project,
        // assignedsupervisors,
        assignedby,
        due_date,
        taskpriority,
        createdon,
        status,
        actions
    };
}
const date = Date.now();

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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [task, setTask] = useState([]);
    const [allscrums, setAllscrums] = useState([]);
    const [currentTask, setCurrentTask] = useState([]);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [user, setUser] = useState({
        to: '',
        bugs_counted: ''
    });
    const { to, bugs_counted } = user;

    const [ids, setids] = useState({ task_id: '', project_id: '' });

    const [editUser, setEdituser] = useState({
        title: '',
        client_project_report_id: ''
    });
    const { title, client_project_report_id } = editUser;
    const [error, seterror] = useState(false);
    const [value, setValue] = useState('');
    const [supervisor, setSupervisor] = useState([]);
    const [superVisorProjectId, setSuperVisorProjectId] = useState();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [Alerts, setAlerts] = useState(true);
    const [open, setOpen] = React.useState(false);

    const [tabs, settabs] = useState('1');

    const handleTabsChange = (event, newValue) => {
        settabs(newValue);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false,
            message: ''
        });
    };

    // function getdata_ids() {
    //     let projectids = allscrums.map((item) => item.project_id);
    // }

    const handleClose = () => setOpen1(false);
    const handleClose1 = () => setOpen2(false);

    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

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
    // console.log(startDate, endDate);

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const tasks = async () => {
        const URL = API.GET_TASKS;
        try {
            const result = await axios.post(
                URL,
                // '/user/get-tasks',
                { user_id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // console.log(result.data.data.tasks, 'helllsl');

            if (result.status === 200) {
                setCurrentTask(true);
                let newresult = result.data.data.tasks;
                // console.log(result.data.getdata, 'getdata');
                setTask(newresult);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const rows = [createData(1, 'Scrum Reports Here')];
    const to_date = startDate;
    const from_date = endDate;

    const handleDates = async (e) => {
        e.preventDefault();
        const URL = API.GET_TASKS;
        try {
            const result = await axios.post(
                URL,
                // '/user/get-tasks',
                { user_id, to_date, from_date },
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
                setAllscrums(newresult);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const EditDSR = async (e) => {
        e.preventDefault();
        const report_description = value;
        const user_id = userId;
        try {
            const result = await axios.post(
                '/user/edit_dsr',
                { user_id, title, report_description, client_project_report_id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                // console.log(result.data, 'hifi');
                setOpen2(false);
                setSnackbar({
                    open: true,
                    message: 'DSR Updated Successfully'
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const scrumid = task?.map((item) => item.id);
    const getscrum = () => {
        navigate(`/scrum/${scrumid}`);
    };

    const allscrumid = allscrums.map((item) => item.id);
    const searchScrumsbydates = () => {
        navigate(`/scrum/${allscrumid}`);
    };

    const serialNumber = (page, index) => {
        return page * rowsPerPage + index + 1;
    };

    const handleClear = () => {
        setStartDate(formatDate(new Date()));
        setEndDate(formatDate(new Date()));
        setCurrentTask(true);
    };

    const handleReport = async (e, task_id, project_id) => {
        const proId = e.target.value;

        // if (proId === '3') {
        //     setOpen1(true);
        // }
        if (proId === '1') {
            setOpen1(true);
        }
        if (proId === '2') {
            // getDSRreport(id);
            setOpen2(true);
        }
        if (proId === '4') {
            // const { task_id, project_id } = ids;
            // console.log(ids.project_id, ids.task_id, 'hellohimanshu');
            // navigate(`/task-management/qa-response/${ids.project_id}/${ids.task_id}`);
            navigate(`/task-management/qa-response/${project_id}/${task_id}`);
        }
    };
    const handleConsole = () => {
        console.log('hellos ');
    };

    const status = async (e, id) => {
        // <option disabled>Select</option>
        // <option value="3">Pending</option>
        // <option value="6">In Progress</option>
        // <option value="1">QA Notes</option>
        // <option value="4">QA Response</option>
        // <option value="5">Completed</option>
        // console.log('e', e.target.value, 'id', id);
        const selectedValue = e.target.value;
        // const task_id = id;
        const data = {
            user_id: user_id,
            status:
                selectedValue === '3'
                    ? 0
                    : selectedValue === '6'
                    ? 1
                    : selectedValue === '1'
                    ? 2
                    : // : selectedValue === '4'
                    // ? 3
                    selectedValue === '5'
                    ? 3
                    : 7,
            task_id: id
        };
        // console.log('status', data);
        const URL = API.UPDATE_TASK_STATUS;

        // if (e.target.value === '1') return setTaskStatus(1);
        // if (e.target.value === '3') {
        //     console.log('fdasfdsafasdfsadfadsfasdfasdfas');
        // }
        // return setTaskStatus(0);
        // if (e.target.value === '4') return setTaskStatus(2);
        // if (e.target.value === '5') return setTaskStatus(3);
        // if (e.target.value === '6') return setTaskStatus(4);

        // const status = taskStatus;
        // console.log('status', status);
        // console.log(user_id, status, 'hrelleolsknafsddmnmn ');
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
            console.log(result.data.data.tasks, 'helllsl');

            if (result.status === 200) {
                // setCurrentTask(true);
                // let newresult = result.data.data.tasks;
                // console.log(result.data, 'getdata');
                if (result.data.status === 0) {
                    setSnackbar({
                        open: true,
                        message: 'Task set to pending'
                    });
                }
                // setTask(newresult);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // console.log(
    //     allscrums.map((item) => item.project_id),
    //     'Hello Rajat'
    // );

    const project_supervisor = async (project_id) => {
        const URL = API.PROJECT_SUPERVISOR;
        if (project_id === undefined) {
            console.log('undefined');
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

    useEffect(() => {
        tasks();
        project_supervisor();
    }, []);

    return (
        <>
            <form onSubmit={handleDates}>
                <div className="attendance buttonsettings">
                    <div className="settingbutton">
                        <input
                            max={formatDate(new Date())}
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <input max={formatDate(new Date())} type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />
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
                <TabContext value={tabs}>
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
                            <Tab label="Assigned" value="1" />
                            <Tab label="Acknowledged" value="2" />
                            <Tab label="In Progress" value="3" />
                            <Tab label="Completed" value="4" />
                            <Tab label="Done" value="5" />
                        </TabList>
                    </Box>
                    {/* <TabPanel value="1">Item One</TabPanel>
                    <TabPanel value="2">Item Two</TabPanel>
                    <TabPanel value="3">Item Three</TabPanel>
                    <TabPanel value="4">Item Four</TabPanel>
                    <TabPanel value="5">Item Five</TabPanel> */}
                </TabContext>
            </Box>

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

                                                    {/* <TableCell></TableCell> */}
                                                    {/* {supervisor.map((item) => {
                                                        console.log(item, 'this is bottle');
                                                        return (
                                                            <>
                                                                <TableCell>Hello</TableCell>
                                                                // <TableCell>{item.assigned_by}</TableCell>
                                                            </>
                                                        );
                                                    })} */}
                                                    {/* <TableCell>{item.assigned_by}</TableCell> */}
                                                    <TableCell>{item.assigned_by === null ? 'Lorem' : item.assigned_by}</TableCell>
                                                    <TableCell>{item.task_due_date === null ? '0000-00-00' : item.task_due_date}</TableCell>
                                                    <TableCell>High</TableCell>
                                                    <TableCell>{item.created_date}</TableCell>
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
                                                                    handleReport(e, item.task_id, item.project_id);
                                                                    // setTaskStatus(0);
                                                                    status(e, item.task_id);
                                                                    setids({ task_id: item.task_id, project_id: item.project_id });
                                                                }}
                                                                defaultValue="Select"
                                                            >
                                                                <option value="7" disabled>
                                                                    Select
                                                                </option>
                                                                <option value="3">Pending</option>
                                                                <option value="6">In Progress</option>
                                                                <option value="1">QA Notes</option>
                                                                <option value="4">QA Response</option>
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
                            ) : (
                                <TableBody>
                                    {allscrums && allscrums.length > 0 ? (
                                        allscrums.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
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

                                                    {/* <TableCell></TableCell> */}
                                                    {/* {supervisor.map((item) => {
                                                        console.log(item, 'this is bottle');
                                                        return (
                                                            <>
                                                                <TableCell>Hello</TableCell>
                                                                // <TableCell>{item.assigned_by}</TableCell>
                                                            </>
                                                        );
                                                    })} */}
                                                    {/* <TableCell>{item.assigned_by}</TableCell> */}
                                                    <TableCell>{item.assigned_by === null ? 'Lorem' : item.assigned_by}</TableCell>
                                                    <TableCell>{item.task_due_date === null ? '0000-00-00' : item.task_due_date}</TableCell>
                                                    <TableCell>High</TableCell>
                                                    <TableCell>{item.created_date}</TableCell>
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
                                                                    handleReport(e, item.task_id, item.project_id);
                                                                    // setTaskStatus(0);
                                                                    status(e, item.task_id);
                                                                    setids({ task_id: item.task_id, project_id: item.project_id });
                                                                }}
                                                                defaultValue="Select"
                                                            >
                                                                <option value="7" disabled>
                                                                    Select
                                                                </option>
                                                                <option value="3">Pending</option>
                                                                <option value="6">In Progress</option>
                                                                <option value="1">QA Notes</option>
                                                                <option value="4">QA Response</option>
                                                                <option value="5">Completed</option>
                                                            </select>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell style={{ textAlign: 'center' }} colSpan={2}>
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
                        count={currentTask ? task.length : allscrums.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>

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
                <div>
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
                </div>
            </Box>
            <ResponsiveDialog
                open={open}
                setOpen={setOpen}
                // dialogTitle="Use Google's location service?"
                disagree={handleConsole}
                dialogContent="Are you Sure do you Want to Submit?"
                disagreeButtonText="No"
                agreeButtonText="Yes"
            />
            <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
        </>
    );
}
