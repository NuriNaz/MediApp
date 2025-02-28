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
import { Box, Button } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import '../attendance/index.css';
import { useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API } from 'Constants/API';
import { formatDate, handleFormatDate } from 'function/FormatTime';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';

const columns = [
    { id: 'id', label: '#', minWidth: '60%' },
    { id: 'report_date', label: 'Report Date' },
    { id: 'subject', label: 'Subject' },
    { id: 'description', label: 'Description' }
];

function createData(id, subject, description, report_date) {
    return {
        id,
        report_date,
        subject,
        description
    };
}
const date = Date.now();

export default function Scrums() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [scrum, setscrum] = useState([]);
    const [allscrums, setAllscrums] = useState([]);
    const [currentscrum, setCurrentscrum] = useState(false);
    const [Allscrumlength, setallscrumLength] = useState(false);

    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');

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

    const scrumReports = async () => {
        const date = new Date();
        const formattedDate = date.toISOString().substr(0, 10);
        const URL = API.SCRUM_REPORTS;
        const to_date = formattedDate;
        const from_date = formattedDate;
        try {
            const result = await axios.post(
                URL,
                // '/user/search-scrum',
                { user_id, to_date, from_date },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (result.status === 200) {
                setCurrentscrum(true);
                console.log(result.data);
                setStartDate(result.data.dateRange.startDate.split('T')[0]);
                setEndDate(result.data.dateRange.endDate.split('T')[0]);
                // let newresult = result.data.getdata;
                let newresult = result.data.data;
                // console.log(result.data.getdata, 'getdata');
                setscrum(newresult);
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

    const rows = [createData(1, 'Scrum Reports Here')];
    const to_date = startDate;
    const from_date = endDate;

    const handleDates = async (e) => {
        e.preventDefault();
        const URL = API.SCRUM_REPORTS;
        try {
            const result = await axios.post(
                URL,
                // '/user/search-scrum',
                { user_id, to_date, from_date },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (result.status === 200) {
                setCurrentscrum(false);
                setallscrumLength(true);
                let newresult = result.data.data;
                // console.log(result.data.data, 'getdata');
                setAllscrums(newresult);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // const scrumid = scrum?.map((item) => item.id);
    const getscrum = (id) => {
        navigate(`/scrum/${id}`);
    };

    // const allscrumid = allscrums.map((item) => item.id);
    const searchScrumsbydates = (id) => {
        navigate(`/scrum/${id}`);
    };

    const handleClear = () => {
        setStartDate(formatDate(new Date()));
        setEndDate(formatDate(new Date()));
        setCurrentscrum(true);
    };

    const serialNumber = (page, index) => {
        return page * rowsPerPage + index + 1;
    };
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: MENU_OPEN, id: 'scrum' });
        scrumReports();
    }, []);

    return (
        <>
            <form onSubmit={handleDates}>
                <div className="attendance buttonsettings">
                    <div className="settingbutton">
                        <input
                            type="date"
                            max={formatDate(new Date())}
                            id="start-date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <input type="date" max={formatDate(new Date())} id="end-date" value={endDate} onChange={handleEndDateChange} />
                        <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                            <AnimateButton>
                                <Button
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    className="from_date"
                                    // style={{ padding: '10px 50px' }}
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
                                    className="to_date"

                                    // style={{ padding: '10px 50px' }}
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
                            {currentscrum ? (
                                <TableBody className="scrumrows">
                                    {scrum && scrum.length > 0 ? (
                                        scrum.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                            // console.log(item, 'hello Himanshu ');
                                            return (
                                                <TableRow
                                                    className="scrumreports"
                                                    onClick={() => {
                                                        getscrum(item.id);
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
                                                    <TableCell>{handleFormatDate(item.create_date)}</TableCell>

                                                    <TableCell className="withdescription">
                                                        <p
                                                            style={{
                                                                padding: '0',
                                                                margin: '0',
                                                                fontWeight: 600,
                                                                color: 'black'
                                                            }}
                                                        >
                                                            {item.scrum_subject}
                                                        </p>{' '}
                                                        {/* <p
                                                            dangerouslySetInnerHTML={{
                                                                __html: `${item.scrum_description.slice(0, 100)}...`
                                                            }}
                                                        /> */}
                                                    </TableCell>
                                                    <TableCell className="withdescription">
                                                        <p
                                                            dangerouslySetInnerHTML={{
                                                                __html: `${item.scrum_description.slice(0, 100)}...`
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
                                    {allscrums && allscrums.length > 0 ? (
                                        allscrums.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                            return (
                                                <TableRow
                                                    className="scrumreports"
                                                    onClick={() => {
                                                        searchScrumsbydates(item.id);
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
                                                    <TableCell>{handleFormatDate(item.create_date)}</TableCell>
                                                    {/* <TableCell>{item.scrum_subject}</TableCell> */}
                                                    <TableCell className="withdescription">
                                                        <p style={{ fontWeight: 500, color: 'black' }}>{item.scrum_subject}</p>{' '}
                                                        {/* <p
                                                            dangerouslySetInnerHTML={{
                                                                __html: `${item.scrum_description.slice(0, 100)}...`
                                                            }}
                                                        /> */}
                                                    </TableCell>
                                                    <TableCell className="withdescription">
                                                        {/* <p style={{ fontWeight: 600, color: 'black' }}>{item.scrum_subject}</p>{' '} */}
                                                        <p
                                                            dangerouslySetInnerHTML={{
                                                                __html: `${item.scrum_description.slice(0, 100)}...`
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
                        // count={currentscrum ? scrum?.length : Allscrumlength ? 2 : 0}
                        count={currentscrum ? scrum?.length || 0 : Allscrumlength ? allscrums?.length || 0 : '0'}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </>
    );
}
