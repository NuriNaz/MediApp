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
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MainCard from 'ui-component/cards/MainCard';
import { API } from 'Constants/API';
import { formatDate } from 'function/FormatTime';

const columns = [
    { id: 'id', label: 'Sr. No', minWidth: '60%' },
    { id: 'project', label: 'Task Title' },
    { id: 'assignedsupervisors', label: 'Project' },
    { id: 'assignedby', label: 'Bugs Counted' },
    { id: 'due_date', label: 'Description' },
    { id: 'taskpriority', label: 'Bug Reported Date' },
    { id: 'createdon', label: 'Due Date' }
    // { id: 'status', label: 'Status' }
    // { id: 'actions', label: 'Actions' }

    // { id: 'subject', label: 'Subject' }
];

function createData(id, project, assignedsupervisors, assignedby, due_date, taskpriority, createdon) {
    return {
        id,

        project,
        assignedsupervisors,
        assignedby,
        due_date,
        taskpriority,
        createdon
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
export default function Qaresponse() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [scrum, setscrum] = useState([]);

    const [allscrums, setAllscrums] = useState([]);
    const [qaresponse, setQaresponse] = useState([]);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [user, setUser] = useState({
        to: '',
        subject: ''
    });
    const { to, subject } = user;

    const [editUser, setEdituser] = useState({
        title: '',
        client_project_report_id: ''
    });
    const { title, client_project_report_id } = editUser;
    const [error, seterror] = useState(false);
    const [value, setValue] = useState('');

    const params = useParams();
    const project_id = params.id;
    const task_id = params.taskid;
    console.log(project_id, task_id, 'hellsoskj');

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

    const Qaresponse = async () => {
        const URL = API.QA_RESPONSE;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_notes',
                { user_id, project_id, task_id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(result.data.notes, 'this is bottle text');

            if (result.status === 200) {
                setQaresponse(true);
                let newresult = result.data.notes;
                console.log(result.data, 'getdata');
                setscrum(newresult);
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
        try {
            const result = await axios.post(
                '/user/search-scrum',
                { user_id, to_date, from_date },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                setQaresponse(false);
                let newresult = result.data.getdata;
                console.log(result.data.getdata, 'getdata');
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

    const scrumid = scrum?.map((item) => item.id);
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
        setQaresponse(true);
    };

    const handleReport = (e, id) => {
        const proId = e.target.value;
        if (proId === '1') {
            setOpen1(true);
        }
        if (proId === '2') {
            // getDSRreport(id);
            setOpen2(true);
        }
    };

    useEffect(() => {
        Qaresponse();
    }, []);

    return (
        <>
            <MainCard title="Task Management">
                <h4>QA Repsonse</h4>
                {/* <form onSubmit={handleDates}>
                    <div className="attendance buttonsettings">
                        <div className="settingbutton">
                            <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} />
                            <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />
                            <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                                <AnimateButton>
                                    <Button
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        style={{ padding: '10px 50px' }}
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
                                        style={{ padding: '10px 50px' }}
                                    >
                                        Clear
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </div>
                    </div>
                </form> */}

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
                                {qaresponse ? (
                                    <TableBody className="scrumrows">
                                        {scrum && scrum.length > 0 ? (
                                            scrum.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                                return (
                                                    <TableRow
                                                        className="scrumreports"
                                                        // onClick={getscrum}
                                                        hover
                                                        role="checkbox"
                                                        key={index}
                                                        tabIndex={-1}
                                                    >
                                                        <TableCell key={index}>
                                                            {serialNumber(page, index)}
                                                            {/* {index + 1} */}
                                                        </TableCell>
                                                        {/* <TableCell>{item.scrum_subject}</TableCell> */}
                                                        <TableCell>{item.task.task_name}</TableCell>
                                                        <TableCell>{item.task.project.project_name}</TableCell>
                                                        <TableCell>{item.bugs_counted}</TableCell>

                                                        <TableCell>
                                                            <span
                                                                dangerouslySetInnerHTML={{
                                                                    __html: `${item.qa_description}`
                                                                }}
                                                            />
                                                            {/* {item.qa_description} */}
                                                            {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. */}
                                                        </TableCell>
                                                        <TableCell>{item.create_date}</TableCell>
                                                        <TableCell>
                                                            {item.task.task_due_date}
                                                            {/* 2023-02-18 */}
                                                        </TableCell>
                                                        {/* <TableCell>
                                                            <div>
                                                                <select
                                                                    name="action"
                                                                    id="actions"
                                                                    className="actions"
                                                                    // onChange={handleReport}
                                                                    onChange={(e) => {
                                                                        //     setProjectID(item.project_id);
                                                                        //     settotalTime(item.total_time);
                                                                        //     settaskDate(item.task_date);
                                                                        handleReport(e, item.project_id);
                                                                    }}
                                                                    defaultValue="Select"
                                                                >
                                                                    <option disabled>Select</option>
                                                                    <option value="3">Pending</option>
                                                                    <option value="2">In Progress</option>
                                                                    <option value="1">QA Notes</option>
                                                                    <option value="4">QA Response</option>
                                                                    <option value="5">Completed</option>
                                                                </select>
                                                            </div>
                                                        </TableCell> */}
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
                                ) : (
                                    <TableBody>
                                        {allscrums && allscrums.length > 0 ? (
                                            allscrums.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                                return (
                                                    <TableRow
                                                        className="scrumreports"
                                                        onClick={searchScrumsbydates}
                                                        hover
                                                        role="checkbox"
                                                        key={index}
                                                        tabIndex={-1}
                                                    >
                                                        <TableCell key={index}>{index + 1}</TableCell>
                                                        <TableCell>{item.scrum_subject}</TableCell>
                                                        <TableCell>fdsafsadfsadfs</TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell>dasdfdfadf</TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell>fkjsadhf</TableCell>
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
                            count={qaresponse ? scrum.length : allscrums.length}
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
                                // onSubmit={AddDSR}
                                >
                                    <Stack spacing={3}>
                                        <TextField
                                            style={{ margin: '15px 0' }}
                                            required
                                            name="subject"
                                            autoComplete="off"
                                            label=" Total Bugs Reported"
                                            value={subject}
                                            onChange={handleChange}
                                            error={error}
                                            helperText={error ? 'Please Fill the Email First' : ''}
                                        />
                                    </Stack>

                                    <div className="editor">
                                        <ReactQuill
                                            theme="snow"
                                            value={value}
                                            onChange={setValue}
                                            className="editor-input"
                                            modules={modules}
                                        />
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
                                        <ReactQuill
                                            theme="snow"
                                            value={value}
                                            onChange={setValue}
                                            className="editor-input"
                                            modules={modules}
                                        />
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
            </MainCard>
        </>
    );
}
