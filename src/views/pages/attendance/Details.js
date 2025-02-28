// import * as React from 'react';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import { useEffect } from 'react';
// import axios from 'axios';
// import { useState } from 'react';

// const columns = [
//     { id: 'id', label: 'Sr. No', minWidth: 50 },
//     { id: 'date', label: 'Date', minWidth: 60 },
//     { id: 'punchin', label: 'Punch-In ', minWidth: 60 },
//     { id: 'punchout', label: 'Punch-out ', minWidth: 60 },
//     { id: 'paidbreak', label: 'Paid Break', minWidth: 60 },
//     { id: 'lunchduration', label: 'Lunch Duration', minWidth: 60 },
//     { id: 'totalhours', label: 'Total Hours', minWidth: 60 },
//     { id: 'clockedtime', label: 'Clocked Time', minWidth: 60 },
//     { id: 'unpaidbreak', label: 'Unpaid Break', minWidth: 60 },
//     { id: 'paidtime', label: 'Paid Time', minWidth: 60 },
//     { id: 'paidtimestatus', label: 'Paid Time Status', minWidth: 60 },
//     { id: 'status', label: 'Status', minWidth: 60 }

//     // {
//     //     id: 'population',
//     //     label: 'Population',
//     //     minWidth: 170,
//     //     align: 'right',
//     //     format: (value) => value.toLocaleString('en-US')
//     // },
//     // {
//     //     id: 'size',
//     //     label: 'Size\u00a0(km\u00b2)',
//     //     minWidth: 170,
//     //     align: 'right',
//     //     format: (value) => value.toLocaleString('en-US')
//     // },
//     // {
//     //     id: 'density',
//     //     label: 'Density',
//     //     minWidth: 170,
//     //     align: 'right',
//     //     format: (value) => value.toFixed(2)
//     // }
// ];

// function createData(
//     id,
//     date,
//     punchin,
//     punchout,
//     paidbreak,
//     totalhours,
//     lunchduration,
//     clockedtime,
//     unpaidbreak,
//     paidtime,
//     paidtimestatus,
//     status
//     // population, size
// ) {
//     // const density = population / size;
//     return {
//         id,
//         date,
//         punchin,
//         // population,size,
//         lunchduration,
//         totalhours,
//         paidbreak,
//         // density,
//         punchout,
//         totalhours,
//         clockedtime,
//         unpaidbreak,
//         paidtime,
//         paidtimestatus,
//         status
//     };
// }
// const date = Date.now();

// const rows = [
//     createData(
//         1,
//         '10/03/2023',
//         '10:57:19',
//         '',
//         '00:00:00',
//         '00:00:00',
//         '00:00:00',
//         '00:00:00',
//         '00:00:00',
//         '00:00:00',
//         'Pending',
//         'Not Submitted'
//     )
// ];

// export default function Details() {
//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(10);
//     const [data, setData] = useState([])

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(+event.target.value);
//         setPage(0);
//     };
//     const userId = localStorage.getItem('userId');
//     const token = localStorage.getItem('Token');
//     const getAttendanceDetails = async () => {
//         try {
//             const result = await axios.post(
//                 '/user/get_punch',
//                 { userId },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );
//             console.log(result.data, 'hello');
//             setData(result.data)

//         } catch (err) {
//             console.log(err);
//         }
//     };
//     useEffect(() => {
//         getAttendanceDetails();
//     }, []);

//     return (
//         <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//             <TableContainer sx={{ maxHeight: 440 }}>
//                 <Table stickyHeader aria-label="sticky table">
//                     <TableHead>
//                         <TableRow>
//                             {columns.map((column) => (
//                                 <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
//                                     {column.label}
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
//                             return (
//                                 <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
//                                     {columns.map((column) => {
//                                         const value = row[column.id];
//                                         return (
//                                             <TableCell key={column.id} align={column.align}>
//                                                 {column.format && typeof value === 'number' ? column.format(value) : value}
//                                             </TableCell>
//                                         );
//                                     })}
//                                 </TableRow>
//                             );
//                         })}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             <TablePagination
//                 rowsPerPageOptions={[10, 25, 100]}
//                 component="div"
//                 count={rows.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//         </Paper>
//     );
// }

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { FaBlackTie } from 'react-icons/fa';
import './index.css';
import { useState } from 'react';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect } from 'react';
import axios from 'axios';

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

export default function Details() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [data, setData] = useState([]);
    const [punchin, setPunchin] = useState(false);
    const [notfound, setNotfound] = useState(false);
    const handleClose = () => setOpen1(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');
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
            console.log(result.data, 'hello');
            setData(result.data[0]);
        } catch (err) {
            console.log(err, 'kdsajfkl');
            if (err.response.status === 404) {
                setNotfound(true);
                // alert('true');
            }
        }
    };

    useEffect(() => {
        getAttendanceDetails();
    }, []);
    const date = new Date(data.punch_in_time);
    // const hours = String(date.getHours()).padStart(2, '0');
    // const minutes = String(date.getMinutes()).padStart(2, '0');
    // const seconds = String(date.getSeconds()).padStart(2, '0');
    // // console.log(`${hours}:${minutes}:${seconds}`);

    const rows = [
        {
            id: 1,
            date: `${data.created_date}`,
            punchin: `${data.punch_in_time}`,
            punchout: `${data.punch_out_time}` === null ? `${data.punch_out_time}` : ' ',
            lunchduration: `${data.lunch_time_duration}` === null ? `${data.lunch_time_duration}` : '00:00:00',
            totalhours: '',
            clockedtime: `${data.total_clocked_time}` === null ? `${data.total_clocked_time}` : '00:00:00',
            paidtime: `${data.paid_time}` === null ? `${data.paid_time}` : '00:00:00',
            paidtimestatus: 'Pending'
        }
    ];

    return (
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
                            // console.log('row', row);
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
                                        <div className="recordnotfound" style={{ textAlign: 'center' }}>
                                            <p>Record Not Found</p>
                                        </div>
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
    );
}
