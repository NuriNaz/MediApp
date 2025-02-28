import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import WarningIcon from '@mui/icons-material/Warning';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Button, IconButton, InputAdornment, Modal, Stack, TextField, Typography } from '@mui/material';
// import { FaBlackTie } from 'react-icons/fa';
// import { SlOptionsVertical } from 'react-icons/sl';
import './index.css';
import { useState } from 'react';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect } from 'react';
import axios from 'axios';
import Message from '../Snackbar/Toaster';
import '../attendance/index.css';
import { API } from 'Constants/API';
import { useNavigate } from 'react-router';
import { formatDate, handleFormatDate } from 'function/FormatTime';
import { motion } from 'framer-motion';
import { AiFillEye } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';
import { Bars } from 'react-loader-spinner';

// const columns = [
//     { id: 'id', label: '#', minWidth: 50 },
//     { id: 'report_date', label: 'Report Date', minWidth: 50 },
//     { id: 'project', label: 'Project', minWidth: 60 },
//     // { id: 'client', label: 'Tasks', minWidth: 60 },
//     { id: 'clockedtime', label: 'Clocked Time', minWidth: 60 },
//     { id: 'status', label: 'Status', minWidth: 60 },
//     { id: 'actions', label: 'Actions', minWidth: 60 }
// ];
const columns = [
    { id: 'id', label: '#', minWidth: '60%' },
    { id: 'report_date', label: 'Report Date' },
    { id: 'subject', label: 'Subject' },
    { id: 'description', label: 'Description' }
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

export default function AddReports() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false); // Show warning popup
    const [open5, setOpen5] = useState(false); //view dsr
    const [error, seterror] = useState(false);
    const [cc, setCC] = useState(false);
    const [currentdsr, setCurrentdsr] = useState([]);
    const [value, setValue] = useState('');
    // const [projectID, setProjectID] = useState();
    // const [totalTime, settotalTime] = useState();
    // const [taskDate, settaskDate] = useState();

    const [dsrSubmitted, setDsrSubmitted] = useState(false);

    const [allDsrsLength, setAllDsrsLength] = useState([]);
    const [allDsrs, setAllDsrs] = useState([]);

    // const [oneDSR, setoneDSR] = useState(false);
    // const [actions, setActions] = useState(false);
    const [dsrList, setDsrList] = useState([]);
    const [currentDsrList, setCurrentDsrList] = useState(false);
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));
    // const [AllDSRlength, setAllDSRLength] = useState(false);

    const [reportDate, setReportDate] = useState();
    const [reportId, setReportId] = useState();

    const [Punchout, setPunchout] = useState(false);
    const [Punchin, setPunchin] = useState(false);
    const [checkDSR, setCheckDSR] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, seterrors] = useState({
        addSubject: false,
        addDescription: false,
        editSubject: false,
        editDescription: false,
        Notpunchedin: false
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: ''
    });

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

    const [time, setTotaltime] = useState('');

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');
    const navigate = useNavigate();

    const handleClose = () => setOpen1(false);

    const handleClose1 = () => {
        setEdituser({ title: '' });
        setValue('');
        setOpen2(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleChange1 = (e) => {
        const { name, value } = e.target;
        setEdituser({ ...editUser, [name]: value });
    };

    //backup original
    // const AddDSR = async (e) => {
    //     const URL = API.ADD_DSR;
    //     e.preventDefault();
    //     const project_id = projectID;
    //     const title = subject;
    //     const report_description = value;
    //     const report_date = taskDate;
    //     const total_time = totalTime;
    //     const user_id = userId;
    //     if (!subject) {
    //         seterrors({ addSubject: true });
    //     } else if (!value) {
    //         seterrors({ addDescription: true });
    //     } else {
    //         setIsLoading(true);

    //         try {
    //             console.log('try', isLoading);

    //             const result = await axios.post(
    //                 URL,
    //                 // '/user/add_dsr',
    //                 { user_id, project_id, title, report_description, report_date, total_time },
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`
    //                     }
    //                 }
    //             );
    //             if (result.status === 201) {
    //                 setUser({
    //                     title: '',
    //                     report_description: ''
    //                 });
    //                 setValue('');
    //                 // console.log(result, 'hello');
    //                 setOpen1(false);
    //                 seterrors({ addDescription: false, addSubject: false });
    //                 dsr();
    //                 setSnackbar({
    //                     open: true,
    //                     // message: 'DSR added successfully',
    //                     message: result.data.msg,
    //                     severity: 'success'
    //                 });
    //             }
    //         } catch (err) {
    //             console.log(err);
    //             if (err.response.status === 400) {
    //                 // console.log('DSR Already filled');
    //                 setUser({
    //                     title: '',
    //                     report_description: ''
    //                 });
    //                 setValue('');
    //                 setOpen1(false);

    //                 setSnackbar({
    //                     open: true,
    //                     message: 'DSR Already Added',
    //                     severity: 'info'
    //                 });
    //             }
    //         }
    //         console.log('catch', isLoading);
    //         setIsLoading(false);
    //     }
    // };

    // const AddDSR = async (e) => {
    //     const URL = API.ADD_DSR;
    //     e.preventDefault();
    //     const project_id = projectID;
    //     const title = subject;
    //     const report_description = value;
    //     const report_date = taskDate;
    //     const total_time = totalTime;
    //     const user_id = userId;
    //     if (!subject) {
    //         seterrors({ addSubject: true });
    //     } else if (!value) {
    //         seterrors({ addDescription: true });
    //     } else {
    //         try {
    //             setIsLoading(true);
    //             console.log('try2', isLoading);
    //             const result = await axios.post(
    //                 URL,
    //                 { user_id, project_id, title, report_description, report_date, total_time },
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`
    //                     }
    //                 }
    //             );
    //             if (result.status === 201) {
    //                 setUser({
    //                     title: '',
    //                     report_description: ''
    //                 });
    //                 setValue('');
    //                 setOpen1(false);
    //                 seterrors({ addDescription: false, addSubject: false });
    //                 dsr();
    //                 setSnackbar({
    //                     open: true,
    //                     message: result.data.msg,
    //                     severity: 'success'
    //                 });
    //             }
    //         } catch (err) {
    //             console.log(err);
    //             if (err.response && err.response.status === 400) {
    //                 setUser({
    //                     title: '',
    //                     report_description: ''
    //                 });
    //                 setValue('');
    //                 setOpen1(false);

    //                 setSnackbar({
    //                     open: true,
    //                     message: 'DSR Already Added',
    //                     severity: 'info'
    //                 });
    //             }
    //         }
    //         setIsLoading(false);
    //     }
    // };
    // console.log('himanshu try3', isLoading);

    const AddDSR = async (e) => {
        const URL = API.ADD_DSR;
        e.preventDefault();
        const title = subject;
        const report_description = value;
        const user_id = userId;
        const report_id = reportId;
        const report_date = reportDate;
        if (!subject) {
            seterrors({ addSubject: true });
        } else if (!value) {
            seterrors({ addDescription: true });
        } else {
            try {
                setIsLoading(true);
                console.log('try2', isLoading);
                const result = await axios.post(
                    URL,
                    { user_id, title, report_description, report_id, report_date },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (result.status === 201) {
                    setUser({
                        title: '',
                        report_description: ''
                    });
                    setValue('');
                    setOpen1(false);
                    seterrors({ addDescription: false, addSubject: false });
                    getAttendanceDetails();
                    dsr();
                    // if (result.data.status == 1) {
                    //     setDsrSubmitted(true);
                    // }
                    setSnackbar({
                        open: true,
                        message: result.data.msg,
                        severity: 'success'
                    });
                    setTimeout(() => {
                        navigate('/punchout');
                    }, 2000);
                }
            } catch (err) {
                console.log(err);
                if (err.response && err.response.status === 400) {
                    setUser({
                        title: '',
                        report_description: ''
                    });
                    setValue('');
                    setOpen1(false);

                    setSnackbar({
                        open: true,
                        message: 'DSR Already Added',
                        severity: 'info'
                    });
                }
            }
            setIsLoading(false);
        }
    };
    console.log('hansika try3', isLoading);

    const getDSRreport = async (id) => {
        const URL = API.GET_DSR_REPORT;
        const project_id = id;
        const user_id = userId;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_submited_data',
                { user_id, project_id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                // console.log(result.data.data[0], 'hello');
                const data = result.data.data[0];
                setEdituser({
                    title: data.title,
                    client_project_report_id: data.client_project_report_id
                });
                const description = data.report_description;
                setValue(description);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleReport = (e, id, task_date) => {
        const proId = e.target.value;
        if (proId === '1') {
            // setSnackbar({
            //     open: true,
            //     message:
            //         'Please ensure that you stop the extension first. Otherwise, the time you invested will not be collected when you add the report.',
            //     severity: 'warning'
            // });
            setOpen1(true);
            setOpen3(true);
        }
        if (proId === '2') {
            getDSRreport(id);
            setOpen2(true);
        }
        if (proId === '3') {
            setOpen5(true);
            getDSRreport(id);
        }
        if (proId === '4') {
            setSnackbar({
                open: true,
                message: `Report is Not Added for the ${task_date}`,
                severity: 'warning'
            });
        }
    };

    const handleCC = () => {
        setCC(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false,
            message: ''
        });
    };

    // const dsr = async () => {
    //     const URL = API.DSR_INFO;
    //     try {
    //         const result = await axios.post(
    //             URL,
    //             // '/user/dsr_info',
    //             {
    //                 userId
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             }
    //         );
    //         if (result.status === 200) {
    //             setoneDSR(true);
    //             // console.log(result.data.dateRange);
    //             setStartDate(result.data.dateRange.startDate.split('T')[0]);
    //             setEndDate(result.data.dateRange.endDate.split('T')[0]);
    //             const ProjectID = result.data.data;
    //             const ProjectandTask = await Promise.all(
    //                 ProjectID.map(async (item) => {
    //                     const response = await axios.post(
    //                         API.CHECK_DSR,
    //                         // 'http://192.168.75.177:8080/user/getAssignedByUser',
    //                         {
    //                             user_id: item.user_id,
    //                             project_id: item.project_id
    //                         },
    //                         {
    //                             headers: {
    //                                 Authorization: `Bearer ${token}`
    //                             }
    //                         }
    //                     );
    //                     console.log('hello', response.data);

    //                     return {
    //                         ...item,
    //                         status: response.data.status,
    //                         message: response.data.msg
    //                     };
    //                 })
    //             );
    //             // console.log(ProjectandTask, 'hello');

    //             setCurrentdsr(ProjectandTask);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         if (err.response.status === 401) {
    //             localStorage.clear();
    //             navigate('/login');
    //         }
    //     }
    // };

    const dsr = async () => {
        const URL = API.DSR_INFO;
        try {
            const result = await axios.post(
                URL,
                // '/user/dsr_info',
                {
                    userId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                // setoneDSR(true);
                setCurrentDsrList(true);

                console.log(result.data.status, 'result.data.status at dsr_info');

                // setStartDate(result.data.dateRange.startDate.split('T')[0]);
                // setEndDate(result.data.dateRange.endDate.split('T')[0]);
            }
        } catch (err) {
            console.log(err, 'error after dsr');
            if (err.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    const EditDSR = async (e) => {
        const URL = API.EDIT_DSR;
        e.preventDefault();
        const report_description = value;
        const user_id = userId;
        // try {
        if (!title) {
            seterrors({ editSubject: true });
        } else if (!value || value === '<p><br></p>') {
            seterrors({ editDescription: true });
        } else {
            try {
                setIsLoading(true);
                const result = await axios.post(
                    URL,
                    // '/user/edit_dsr',
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
                    setValue('');
                    setEdituser({
                        title: ''
                    });
                    seterrors({ editSubject: false, editDescription: false });
                    setSnackbar({
                        open: true,
                        // message: 'DSR Updated Successfully'
                        message: result.data.msg,
                        severity: 'success'
                    });
                }
            } catch (err) {
                console.log(err, 'hello error');
            }
            setIsLoading(false);
        }
    };

    // const handleDates = async (e) => {
    //     const URL = API.DSR_INFO;
    //     const from_date = startDate;
    //     const to_date = endDate;
    //     e.preventDefault();
    //     try {
    //         const result = await axios.post(
    //             URL,
    //             // '/user/dsr_info',
    //             { userId, to_date, from_date },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             }
    //         );
    //         if (result.status === 200) {
    //             setoneDSR(false);
    //             // setAllDSRLength(true)

    //             // let newresult = result.data.data;
    //             // console.log(result.data, 'getdata========?>');
    //             // setAllDsrs(newresult);
    //             setActions(true);
    //             const ProjectID = result.data.data;
    //             const ProjectandTask = await Promise.all(
    //                 ProjectID.map(async (item) => {
    //                     const response = await axios.post(
    //                         API.CHECK_DSR,
    //                         // 'http://192.168.75.177:8080/user/getAssignedByUser',
    //                         {
    //                             user_id: item.user_id,
    //                             project_id: item.project_id
    //                         },
    //                         {
    //                             headers: {
    //                                 Authorization: `Bearer ${token}`
    //                             }
    //                         }
    //                     );
    //                     console.log('hello', response.data);
    //                     return {
    //                         ...item,
    //                         status: response.data.status,
    //                         message: response.data.msg
    //                     };
    //                 })
    //             );
    //             // console.log(ProjectandTask, 'hello');
    //             setAllDsrs(ProjectandTask);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const handleDates = async (e) => {
        const URL = API.GET_DSR_LIST;
        const from_date = startDate;
        const to_date = endDate;
        const user_id = userId;
        e.preventDefault();
        try {
            const result = await axios.post(
                URL,
                // '/user/dsr_info',
                { user_id, to_date, from_date },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                setCurrentDsrList(false);
                let newresult = result.data.data;
                setAllDsrs(newresult);
                setAllDsrsLength(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleClear = () => {
        setStartDate(formatDate(new Date()));
        setEndDate(formatDate(new Date()));
        setCurrentDsrList(true);
        // setActions(false);
        // setoneDSR(true);
    };

    const getDsr = (id) => {
        navigate(`/dsr/${id}`);
    };

    // const allscrumid = allscrums.map((item) => item.id);
    const searchDsrbydates = (id) => {
        navigate(`/dsr/${id}`);
    };

    const serialNumber = (page, index) => {
        return page * rowsPerPage + index + 1;
    };

    function formatTime(durationInSeconds) {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // const isProjectSubmited = async () => {
    //     const user_id = userId;
    //     const URL = API.IS_PROJECT_SUBMITTED;
    //     try {
    //         const result = await axios.post(
    //             URL,
    //             // '/user/is_project_submited',
    //             {
    //                 user_id
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             }
    //         );
    //         if (result.status === 200) {
    //             // console.log('Helog', result.data);
    //             const status = result.data.status;
    //             if (status === 1) {
    //                 navigate('/punchout');
    //             } else if (status === 0) {
    //                 setSnackbar({
    //                     open: true,
    //                     // message: `Please Submit the DSR of ${result.data.projectName} Project`
    //                     message: result.data.message,
    //                     severity: 'error'
    //                 });
    //             }

    //             // setoneDSR(true);
    //             // setCurrentdsr(result.data.data);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const isProjectSubmited = async () => {
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
                console.log(result.data);
                if (status === 1) {
                    setOpen1(true);
                } else if (status === 0) {
                    setSnackbar({
                        open: true,
                        // message: `Please Submit the DSR of ${result.data.projectName} Project`
                        message: result.data.message,
                        severity: 'error'
                    });
                }

                // setoneDSR(true);
                // setCurrentdsr(result.data.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const dsrReports = async () => {
        // const date = new Date();
        // const formattedDate = date.toISOString().substr(0, 10);
        const URL = API.GET_DSR_LIST;
        const to_date = endDate;
        const from_date = startDate;
        const user_id = userId;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_dsr_list',
                { user_id, from_date, to_date },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (result.status === 200) {
                setCurrentDsrList(true);
                console.log(result.data, 'DSR List Data');
                // if (result.data.dateRange != '') {
                //     setStartDate(result.data.dateRange.startDate.split('T')[0]);
                //     setEndDate(result.data.dateRange.endDate.split('T')[0]);
                // }
                // let newresult = result.data.getdata;
                let newresult = result.data.data;
                // console.log(result.data.getdata, 'getdata');
                setDsrList(newresult);
                console.log(setDsrList, '*******************DSR LIST****************');
            } else {
            }
        } catch (err) {
            console.log(err);
            if (err.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    // const getAttendanceDetails = async () => {
    //     const URL = API.GET_ATTENDANCE;
    //     try {
    //         const response = await axios.post(
    //             URL,
    //             // '/user/get_punch',
    //             { userId },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             }
    //         );
    //         if (response.status === 200) {
    //             // console.log(response.data, 'hello this is himanshu data');
    //             if (response.data[0].punch_out_time !== null) {
    //                 setPunchout(true);
    //             }
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         if (err.response.status === 404) {
    //             seterrors({ Notpunchedin: true });
    //         }
    //     }
    // };

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
                // console.log(response.data, 'hello this is himanshu data');
                const dsrSubmitted = response.data[0].is_dsr_added;
                if (dsrSubmitted === 1) {
                    setDsrSubmitted(true);
                } else {
                    setDsrSubmitted(false);
                }
                setReportDate(response.data[0].report_date);
                setReportId(response.data[0].report_id);
                // reportDate = response.data[0].report_date;
                console.log(setReportDate, 'HANSIKKAAAAAAA');
                // reportId = response.data[0].report_id;

                if (response.data[0].punch_in_time !== null) {
                    setPunchin(true);
                }

                if (response.data[0].punch_out_time !== null) {
                    setPunchout(true);
                }
            }
        } catch (err) {
            console.log(err);
            if (err.response.status === 404) {
                seterrors({ Notpunchedin: true });
            }
        }
    };

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formatedDate = `${year}-${month}-${day}`;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: MENU_OPEN, id: 'eod' });
        dsrReports();
        dsr();
        getAttendanceDetails();
    }, []);

    function handleClose2() {
        setOpen3(false);
    }

    // end
    const useStyles = makeStyles({
        largerIcon: {
            fontSize: '5rem'
        },
        bodycolor: {
            color: 'red'
        }
    });

    const classes = useStyles();
    return (
        <>
            <form onSubmit={handleDates}>
                {/* <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: errors.Notpunchedin && 'none' }}>
                    <motion.button whileTap={{ scale: 0.9 }} style={{ border: 'unset', background: 'unset' }}>
                        <Button
                            size="large"
                            variant="contained"
                            color="secondary"
                            // style={{ padding: '10px 100px', borderRadius: '10px', textTransform: 'unset', marginBottom: 15 }}
                            className="proceedPunchout"
                            onClick={isProjectSubmited}
                            disabled={!!Punchout}
                        >
                            Proceed to Punch Out
                        </Button>
                    </motion.button>
                </Box> */}
                {Punchin === true && (
                    <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: errors.Notpunchedin && 'none' }}>
                        <motion.button whileTap={{ scale: 0.9 }} style={{ border: 'unset', background: 'unset' }}>
                            {dsrSubmitted == true ? (
                                <Button
                                    size="large"
                                    variant="contained"
                                    color="secondary"
                                    // style={{ padding: '10px 100px', borderRadius: '10px', textTransform: 'unset', marginBottom: 15 }}
                                    className="proceedPunchout"
                                    // onClick={isProjectSubmited}
                                    onClick={() => navigate('/punchout')}
                                    disabled={!!Punchout}
                                >
                                    Proceed to Punch Out
                                </Button>
                            ) : (
                                <Button
                                    size="large"
                                    variant="contained"
                                    color="secondary"
                                    // style={{ padding: '10px 100px', borderRadius: '10px', textTransform: 'unset', marginBottom: 15 }}
                                    className="proceedPunchout"
                                    onClick={isProjectSubmited}
                                    disabled={!!Punchout}
                                >
                                    Add DSR
                                </Button>
                            )}
                        </motion.button>
                    </Box>
                )}
                <div className="attendance buttonsettings">
                    <div className="settingbutton">
                        <input
                            type="date"
                            id="start-date"
                            max={formatDate(new Date())}
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <input type="date" id="end-date" value={endDate} max={formatDate(new Date())} onChange={handleEndDateChange} />
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
                            {currentDsrList ? (
                                <TableBody className="dsr-rows">
                                    {dsrList && dsrList.length > 0 ? (
                                        dsrList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                            return (
                                                <TableRow
                                                    className="dsr-reports"
                                                    onClick={() => {
                                                        getDsr(item.id);
                                                    }}
                                                    hover
                                                    role="checkbox"
                                                    key={index}
                                                    tabIndex={-1}
                                                >
                                                    <TableCell key={index}>
                                                        {serialNumber(page, index)}
                                                        {/* {index + 1} */}
                                                    </TableCell>
                                                    <TableCell>{handleFormatDate(item.report_date)}</TableCell>
                                                    <TableCell className="withdescription">
                                                        <p
                                                            style={{
                                                                padding: '0',
                                                                margin: '0',
                                                                fontWeight: 600,
                                                                color: 'black'
                                                            }}
                                                        >
                                                            {item.title}
                                                        </p>{' '}
                                                    </TableCell>
                                                    <TableCell className="withdescription">
                                                        <p
                                                            dangerouslySetInnerHTML={{
                                                                __html: `${item.report_description.slice(0, 100)}...`
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell style={{ textAlign: 'center' }} colSpan={4}>
                                                Record Not Found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {allDsrs && allDsrs.length > 0 ? (
                                        allDsrs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                            return (
                                                <TableRow
                                                    className="dsr-reports"
                                                    onClick={() => {
                                                        searchDsrbydates(item.id);
                                                    }}
                                                    hover
                                                    role="checkbox"
                                                    key={index}
                                                    tabIndex={-1}
                                                >
                                                    <TableCell key={index}>
                                                        {serialNumber(page, index)}
                                                        {/* {index + 1} */}
                                                    </TableCell>
                                                    <TableCell>{handleFormatDate(item.report_date)}</TableCell>
                                                    <TableCell className="withdescription">
                                                        <p style={{ fontWeight: 500, color: 'black' }}>{item.title}</p>{' '}
                                                    </TableCell>
                                                    <TableCell className="withdescription">
                                                        <p
                                                            dangerouslySetInnerHTML={{
                                                                __html: `${item.report_description.slice(0, 100)}...`
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell style={{ textAlign: 'center' }} colSpan={4}>
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
                        count={
                            currentDsrList ? dsrList?.length || 0 : !allDsrsLength ? allDsrs.length || 0 : '0'
                            // {currentdsr.length}
                            // oneDSR ? currentdsr?.length || 0 : !oneDSR ? allDsrs?.length || 0 : '0'
                        }
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                    {/* <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => {
                                    if (column.label === 'Actions' && Punchout) {
                                        return null;
                                    }

                                    return (
                                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        {oneDSR ? (
                            <TableBody>
                                {currentdsr && currentdsr.length > 0 ? (
                                    currentdsr.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index} style={{}}>
                                                <TableCell>{serialNumber(page, index)}</TableCell>
                                                <TableCell>{handleFormatDate(item.task_date)}</TableCell>
                                                <TableCell>{item.project.project_name}</TableCell>
                                                <TableCell>
                                                    {formatTime(item.total_time)}
                                                </TableCell>
                                                <TableCell>
                                                    <span style={{ display: item.status !== true && 'none' }} className="green">
                                                        {item.status === true && 'Approved'}
                                                    </span>
                                                    <span style={{ display: item.status === true && 'none' }} className="pending">
                                                        {item.status !== true && 'Pending'}
                                                    </span>
                                                 </TableCell>
                                                <TableCell style={{ display: Punchout && 'none' }}>
                                                    <div>
                                                        <select
                                                            name="action"
                                                            id="actions"
                                                            className="actions"
                                                            onChange={(e) => {
                                                                setProjectID(item.project_id);
                                                                settotalTime(item.total_time);
                                                                settaskDate(item.task_date);
                                                                handleReport(e, item.project_id);
                                                            }}
                                                            defaultValue="Select"
                                                        >
                                                            <option>Select</option>
                                                            <option style={{ display: item.status === true && 'none' }} value="1">
                                                                Add Report
                                                            </option>
                                                            <option style={{ display: item.status !== true && 'none' }} value="2">
                                                                Edit Report
                                                            </option>
                                                        </select>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell style={{ textAlign: 'center' }} colSpan="7">
                                            Record Not Found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {allDsrs && allDsrs.length > 0 ? (
                                    allDsrs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index} style={{}}>
                                                <TableCell>{serialNumber(page, index)}</TableCell>
                                                <TableCell>{handleFormatDate(item.task_date)}</TableCell>
                                                <TableCell>{item.project.project_name}</TableCell>
                                                <TableCell>
                                                    {formatTime(item.total_time)}
                                                </TableCell>
                                                <TableCell>
                                                    <span style={{ display: item.status !== true && 'none' }} className="green">
                                                        {item.status === true && 'Approved'}
                                                    </span>
                                                    <span style={{ display: item.status === true && 'none' }} className="pending">
                                                        {item.status !== true && 'Pending'}
                                                    </span>
                                                </TableCell>
                                                {console.log(item.task_date === formatedDate)}
                                                {item.task_date === formatedDate ? (
                                                    <TableCell style={{ display: Punchout && 'none' }}>
                                                        <div>
                                                            <select
                                                                name="action"
                                                                id="actions"
                                                                className="actions"
                                                                onChange={(e) => {
                                                                    setProjectID(item.project_id);
                                                                    settotalTime(item.total_time);
                                                                    settaskDate(item.task_date);
                                                                    handleReport(e, item.project_id);
                                                                }}
                                                                defaultValue="Select"
                                                            >
                                                                <option>Select</option>
                                                                <option style={{ display: item.status === true && 'none' }} value="1">
                                                                    Add Report
                                                                </option>
                                                                <option style={{ display: item.status !== true && 'none' }} value="2">
                                                                    Edit Report
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </TableCell>
                                                ) : (
                                                    <TableCell>
                                                        <div>
                                                            {item.status === true ? (
                                                                <select
                                                                    name="action"
                                                                    id="actions"
                                                                    className="actions"
                                                                    onChange={(e) => {
                                                                        setProjectID(item.project_id);
                                                                        settotalTime(item.total_time);
                                                                        settaskDate(item.task_date);
                                                                        handleReport(e, item.project_id);
                                                                    }}
                                                                    defaultValue="Select"
                                                                >
                                                                    <option>Select</option>

                                                                    <option value="3">View Report</option>
                                                                </select>
                                                            ) : (
                                                                <select
                                                                    name="action"
                                                                    id="actions"
                                                                    className="actions"
                                                                    onChange={(e) => {
                                                                        handleReport(e, item.project_id, item.task_date);
                                                                    }}
                                                                    defaultValue="Select"
                                                                >
                                                                    <option>Select</option>

                                                                    <option value="4">View Report</option>
                                                                </select>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell style={{ textAlign: 'center' }} colSpan="8">
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
                    count={
                        // {currentdsr.length}
                        oneDSR ? currentdsr?.length || 0 : !oneDSR ? allDsrs?.length || 0 : '0'
                    }
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
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
                                    Add DSR Here
                                </Typography>
                                <form onSubmit={AddDSR}>
                                    <Stack spacing={3}>
                                        <TextField
                                            style={{ margin: '15px 0' }}
                                            // required
                                            name="subject"
                                            autoComplete="off"
                                            label="Subject *"
                                            value={subject}
                                            onChange={handleChange}
                                            error={errors.addSubject}
                                            helperText={errors.addSubject && 'Please Fill the subject'}
                                        />
                                    </Stack>

                                    <div className="editor">
                                        <ReactQuill
                                            theme="snow"
                                            value={value}
                                            onChange={setValue}
                                            className="editor-input"
                                            modules={modules}
                                            placeholder="Description *"
                                        />
                                        <span style={{ color: 'red', marginTop: '10px' }}>
                                            {errors.addDescription && 'Please fill the description'}
                                        </span>
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
                                            // required
                                            name="title"
                                            autoComplete="off"
                                            label="Subject *"
                                            value={title}
                                            onChange={handleChange1}
                                            error={errors.editSubject}
                                            helperText={errors.editSubject && 'Please Fill the Subject'}
                                        />
                                    </Stack>

                                    <div className="editor">
                                        <ReactQuill
                                            theme="snow"
                                            value={value}
                                            onChange={setValue}
                                            className="editor-input"
                                            modules={modules}
                                            placeholder="Description *"
                                        />
                                        <span style={{ color: 'red', marginTop: '10px' }}>
                                            {errors.editDescription && 'Please fill the description'}
                                        </span>
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
                    {/* view dsr */}

                    <div>
                        <Modal
                            open={open5}
                            // onClose={handleClose1}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h3" component="h2">
                                    View DSR
                                </Typography>
                                <form onSubmit={EditDSR}>
                                    <Stack spacing={3}>
                                        <TextField
                                            style={{ margin: '15px 0' }}
                                            // required
                                            disabled
                                            name="title"
                                            autoComplete="off"
                                            label="Subject *"
                                            value={title}
                                            onChange={handleChange1}
                                            error={errors.editSubject}
                                            helperText={errors.editSubject && 'Please Fill the Subject'}
                                        />
                                    </Stack>

                                    <div className="editor" style={{ background: '#f8fafc' }}>
                                        <ReactQuill
                                            theme="snow"
                                            value={value}
                                            onChange={setValue}
                                            className="editor-input"
                                            modules={modules}
                                            placeholder="Description *"
                                            readOnly={true}
                                        />
                                        <span style={{ color: 'red', marginTop: '10px' }}>
                                            {errors.editDescription && 'Please fill the description'}
                                        </span>
                                    </div>
                                    <Box sx={{ mt: 2 }} className="popup_scrum">
                                        {/* <AnimateButton>
                                        <Button size="large" type="submit" variant="contained" color="secondary">
                                            Send
                                        </Button>
                                    </AnimateButton> */}
                                        <AnimateButton>
                                            <Button
                                                // className="cancellation"
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setOpen5(false)}
                                            >
                                                Close
                                            </Button>
                                        </AnimateButton>
                                    </Box>
                                </form>
                            </Box>
                        </Modal>
                    </div>

                    <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
                </Paper>
            </Box>
            {/* popup code */}
            <div>
                <Modal
                    style={{ textAlign: 'center' }}
                    open={open3}
                    // onClose={handleClose1}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} style={{ textAlign: 'center' }}>
                        <WarningIcon className={classes.largerIcon} />
                        <Typography id="modal-modal-title" variant="h3" component="h1">
                            Did you stop the timer?
                        </Typography>
                        <p className={classes.bodycolor}>
                            Before you proceed to punch-out please make sure you have stopped your timer on EMS Chrome Extension. After
                            submitting the EOD report your time from the extension will be deleted automatically.
                        </p>

                        <Box sx={{ mt: 2 }} style={{ textAlign: 'center' }} className="btn_center">
                            <AnimateButton>
                                <Button
                                    size="large"
                                    // type="submit"
                                    onClick={handleClose2}
                                    variant="contained"
                                    color="secondary"
                                >
                                    Got it, Thanks
                                </Button>
                            </AnimateButton>
                            <AnimateButton>
                                <Button
                                    className="cancellation"
                                    size="large"
                                    // type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        handleClose2();
                                        setOpen1(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </AnimateButton>
                        </Box>
                    </Box>
                </Modal>
            </div>
        </>
    );
}
