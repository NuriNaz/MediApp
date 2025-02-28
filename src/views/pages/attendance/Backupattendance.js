// material-ui
import { Box, Button, IconButton, InputAdornment, Modal, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import DatePickers from './DatePickers';
import './index.css';
import Details from './Details';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Details Component
// import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { MyContextState } from 'context/ContextAPI';
import Stopwatch from './hello';
// ==============================|| Attendance PAGE ||============================== //

const Attendance = () => {
    const [open, setOpen] = React.useState(false);
    const [error, seterror] = useState(false);
    const [cc, setCC] = useState(false);
    const [punchedin, setPunchedin] = useState(false);
    const [scrumSubmitted, setScrumSubmitted] = useState(false);
    const [data, setData] = useState([]);
    const [value, setValue] = useState('');
    // console.log(JSON.stringify({ value }));

    // const { interval } = MyContextState();
    const token = localStorage.getItem('Token');
    const userId = localStorage.getItem('userId');
    const scrum_description = value;
    const [user, setUser] = useState({
        scrum_to: '',
        scrum_cc: '',
        scrum_subject: ''
    });
    const { scrum_to, scrum_cc, scrum_subject } = user;

    // useEffect(() => {
    //     if (interval) {
    //         setPunchedin(true);
    //     }
    // }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };
    // console.log(user, 'Hello');

    // Punch In
    const punchin = async () => {
        try {
            const result = await axios.post(
                '/user/punch-in',
                { userId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 201) {
                console.log(result.data, 'hello');
                setPunchedin(true);
                getAttendanceDetails();
                setNotfound(false);

                //Scrum Submitted API
                const response = await axios.post(
                    '/user/get_punch',
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    console.log(response.data[0].is_scrum_submitted, 'scrum status');
                    setData(response.data[0]);
                    const scrumSubmitted = response.data[0].is_scrum_submitted;
                    if (scrumSubmitted === 0) {
                        setOpen(true);
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    // PunchOut Popup
    const punchout = () => {
        setPunchedin(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const report_id = data.report_id;

    // Punchin Popup Form
    const handlePunchin = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post(
                '/user/scrum',
                { userId, report_id, scrum_to, scrum_cc, scrum_subject, scrum_description },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 201) {
                console.log(result, 'specs');
                setOpen(false);
                const response = await axios.post(
                    '/user/get_punch',
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
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleCC = () => {
        setCC(true);
    };

    const columns = [
        { id: 'id', label: 'Sr. No', minWidth: 50 },
        { id: 'date', label: 'Date', minWidth: 60 },
        { id: 'punchin', label: 'Punch-in', minWidth: 60 },
        { id: 'punchout', label: 'Punch-out', minWidth: 60 },
        { id: 'lunchduration', label: 'Lunch Duration', minWidth: 60 },
        { id: 'totalhours', label: 'Total Hours', minWidth: 60 },
        { id: 'clockedtime', label: 'Clocked Time', minWidth: 60 },
        { id: 'paidtime', label: 'Paid Time', minWidth: 60 },
        { id: 'paidtimestatus', label: 'Paid Time Status', minWidth: 60 }
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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [datas, setDatas] = useState([]);
    // const [punchin, setPunchin] = useState(false);
    const [notfound, setNotfound] = useState(false);
    // const handleClose = () => setOpen1(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getAttendanceDetails = async () => {
        try {
            const result = await axios.post(
                '/user/get_punch',
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // console.log(result.data, 'hello');
            setDatas(result.data[0]);
        } catch (err) {
            console.log(err, 'kdsajfkl');
            if (err.response.status === 404) {
                setNotfound(true);
            }
        }
    };

    useEffect(() => {
        getAttendanceDetails();
    }, []);
    console.log('datas', datas);
    const rows = [
        {
            id: 1,
            date: `${datas.created_date}`,
            punchin: `${datas.punch_in_time}`,
            punchout: `${datas.punch_out_time}` === null ? `${datas.punch_out_time}` : ' ',
            lunchduration: `${datas.lunch_time_duration}` === null ? `${datas.lunch_time_duration}` : '00:00:00',
            totalhours: '',
            clockedtime: `${datas.total_clocked_time}` === null ? `${datas.total_clocked_time}` : '00:00:00',
            paidtime: `${datas.paid_time}` === null ? `${datas.paid_time}` : '00:00:00',
            paidtimestatus: 'Pending'
        }
    ];

    console.log(rows, 'hello');
    return (
        <MainCard title="Attendance">
            {/* <Timer /> */}
            <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center' }}>
                <AnimateButton>
                    {!punchedin ? (
                        <Button
                            size="large"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                punchin();
                            }}
                            style={{ padding: '10px 100px' }}
                        >
                            Punch in
                        </Button>
                    ) : punchedin && !scrumSubmitted ? (
                        <Button
                            size="large"
                            variant="contained"
                            color="secondary"
                            onClick={() => setOpen(true)}
                            style={{ padding: '10px 100px' }}
                        >
                            Add Scrum Report
                        </Button>
                    ) : punchedin && scrumSubmitted ? (
                        <Button size="large" variant="contained" color="secondary" style={{ padding: '10px 100px' }} onClick={punchout}>
                            Punch Out
                        </Button>
                    ) : (
                        ''
                    )}
                </AnimateButton>

                <Modal
                    open={open}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h3" component="h2">
                            Add Scrum Report Here
                        </Typography>
                        <form onSubmit={handlePunchin}>
                            <Stack spacing={3}>
                                <TextField
                                    required
                                    type="text"
                                    style={{ marginTop: '15px' }}
                                    name="scrum_to"
                                    autoComplete="off"
                                    label="To"
                                    value={scrum_to}
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleCC}
                                                    style={{
                                                        background: '#6142b2',
                                                        fontSize: '16px',
                                                        color: 'white',
                                                        borderRadius: 4,
                                                        marginRight: '-4px',
                                                        display: cc ? 'none' : 'block'
                                                    }}
                                                    edge="end"
                                                >
                                                    CC
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={error}
                                    helperText={error ? 'Please Fill the Email First' : ''}
                                />
                                <TextField
                                    style={{ display: cc ? 'block' : 'none' }}
                                    fullWidth
                                    name="scrum_cc"
                                    autoComplete="off"
                                    label="CC"
                                    value={scrum_cc}
                                    onChange={handleChange}
                                    error={error}
                                    helperText={error ? 'Please Fill the Email First' : ''}
                                />
                                <TextField
                                    style={{ marginBottom: '15px' }}
                                    required
                                    name="scrum_subject"
                                    autoComplete="off"
                                    label="Subject"
                                    value={scrum_subject}
                                    onChange={handleChange}
                                    error={error}
                                    helperText={error ? 'Please Fill the Email First' : ''}
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
                    </Box>
                </Modal>
            </Box>

            <div>
                <h3>Attendance Filter</h3>
                <div className="attendance">
                    <DatePickers />
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
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row} style={{}}>
                                        {!notfound ? (
                                            <>
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.date}</TableCell>
                                                <TableCell>{row.punchin}</TableCell>
                                                <TableCell>{row.punchout}</TableCell>
                                                <TableCell>{row.lunchduration}</TableCell>
                                                <TableCell>{row.totalhours}</TableCell>
                                                <TableCell>{row.clockedtime}</TableCell>
                                                <TableCell>{row.paidtime}</TableCell>
                                                <TableCell>{row.paidtimestatus}</TableCell>
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
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </MainCard>
    );
};

export default Attendance;
