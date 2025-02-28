import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import ClassNameGenerator from '@mui/utils/ClassNameGenerator';
import { API } from 'Constants/API';
import axios from 'axios';
import { textAlign } from '@mui/system';
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { MENU_OPEN } from 'store/actions';
import { useDispatch } from 'react-redux';
import { formatDate, handleFormatDate } from 'function/FormatTime';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}
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
const useStyles = makeStyles((theme) => ({
    activeButton: {
        backgroundColor: '#673ab7',
        color: 'white'
    },
    inactiveButton: {
        // backgroundColor: '#2196f3',
        backgroundColor: 'gray',
        color: '#fff'
    }
}));
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'Notification_Message', numeric: false, disablePadding: true, label: 'Notification Message' },
    { id: 'Date_Time', numeric: true, disablePadding: false, label: ' Date Time' }
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
        // onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        style={{ textAlign: 'start' }}
                        className="centerheading"
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            sx={{ fontWeight: 'bold' }}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    // onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

export default function Notifications() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));
    const [notificationData, setNotificationData] = useState([]);
    const [getnotiid, setGetnotiid] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionid, setActionid] = useState();
    const [isItemSelectedw, setIsItemSelectedw] = useState(0);
    const [activebtn, setActivebtn] = useState(0);
    const [activedate, setActivedate] = useState(0);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);

    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');
    const to_date = endDate;
    const from_date = startDate;
    const classes = useStyles();

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = notificationData.map((n) => n.notification_id);
            console.log(newSelecteds);
            setSelected(newSelecteds);
            setGetnotiid(newSelecteds);
            return;
        }
        setSelected([]);
        setGetnotiid([]);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (notificationId) => selected.indexOf(notificationId) !== -1;

    // const emptyRows =
    //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - notificationData.length) : Math.max(0, rowsPerPage - notificationData.length);

    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - (notificationData ? notificationData.length : 0))
            : Math.max(0, rowsPerPage - (notificationData ? notificationData.length : 0));

    const handleEndDateChange = (event) => {
        setActivedate(1);
        setEndDate(event.target.value);
    };
    const navigate = useNavigate();

    const handleStartDateChange = (event) => {
        setActivedate(1);
        setStartDate(event.target.value);
    };
    // action id 1 get unread Notifications/get all Notifications
    // (both api in single api you can use actionId 0 is Get unread notifications and actionId 1 is Get all notifications  )
    const handleNotifications = async () => {
        setNotificationData([]);
        const URL = API.NOTIFICATIONS;
        const userId = user_id;

        try {
            let requestData = { userId, actionId: 0 };
            if (activedate === 1) {
                requestData = { ...requestData, to_date, from_date };
            }
            const result = await axios.post(URL, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStartDate(result.data.data.dateRange.startDate.split('T')[0]);
            setEndDate(result.data.data.dateRange.endDate.split('T')[0]);
            if (result.status === 200) {
                setNotificationData(result.data.data.data.notifications);
                setActivedate(0);
            }
            if (result.status === 202) {
                setNotificationData(result.data.data.data.notifications);
                setActivedate(0);
                setStartDate(result.data.data.dateRange.startDate.split('T')[0]);
                setEndDate(result.data.data.dateRange.endDate.split('T')[0]);
            }
        } catch (err) {
            console.log(err, 'hello this is it');
        }
    };

    // action  id 0 Get unread
    const handleNotificationsall = async () => {
        setNotificationData([]);
        const URL = API.NOTIFICATIONS;
        const userId = user_id;
        try {
            let requestData = { userId, actionId: 1 };
            if (activedate === 1) {
                requestData = { ...requestData, to_date, from_date };
            }

            const result = await axios.post(URL, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStartDate(result.data.data.dateRange.startDate.split('T')[0]);
            setEndDate(result.data.data.dateRange.endDate.split('T')[0]);
            if (result.status === 200) {
                setNotificationData([]);
                console.log(result.data, 'this response is NOTIFICATIONS');
                setNotificationData(result.data.data.data.notifications);
                setActivedate(0);
            }
        } catch (err) {
            console.log(err, 'hello this is it ');
        }
    };

    console.log('dfdfds', getnotiid);

    const getallNotifications = getnotiid.map((id) => ({
        notification_id: id
    }));
    console.log('dfdfds', getallNotifications);
    // delete data
    const handleNotificationsdelete = async () => {
        // handleNotificationsall
        setActivebtn(0);
        setNotificationData([]);
        setIsItemSelectedw(0);
        console.warn('delete');
        const URL = API.ALLMARKASREADANDDELETE;
        const userId = user_id;
        try {
            const result = await axios.post(
                URL,
                { userId, actionId: 1, getallNotifications },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                setOpen2(false);
                console.log(result.data, 'this response is handleNotificationsdelete');
                // setNotificationData(result.data.data.data.notifications);
                handleNotifications();
                handleNotificationsall();
            }
        } catch (err) {
            console.log(err, 'hello this is it ');
        }
    };
    // mark as read data
    const handleNotificationsmark = async () => {
        setActivebtn(0);
        setNotificationData([]);
        setIsItemSelectedw(0);
        const URL = API.ALLMARKASREADANDDELETE;
        const userId = user_id;
        try {
            const result = await axios.post(
                URL,
                { userId, actionId: 0, getallNotifications },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                setOpen1(false);
                console.log(result.data, 'this response is handleNotificationsmark');
                handleNotifications();
                // handleNotificationsall();
                // setNotificationData(result.data.data.data.notifications);
            }
        } catch (err) {
            console.log(err, 'hello this is it ');
        }
    };
    async function handleSubmit(e) {
        setOpen1(false);
        setNotificationData([]);
        e.preventDefault();

        const URL = API.NOTIFICATIONS;
        const userId = user_id;
        try {
            const result = await axios.post(
                URL,
                { userId, actionId: actionid, to_date, from_date },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (result.status === 200) {
                setNotificationData([]);
                console.log(result.data, 'this response is NOTIFICATIONS');
                setNotificationData(result.data.data.data.notifications);
                // setStartDate(formatDate(new Date()));
                // setEndDate(formatDate(new Date()));
                // handleClear();
            }
        } catch (err) {
            console.log(err, 'hello this is it ');
        }
    }
    const handleClear = () => {
        setStartDate(formatDate(new Date()));
        setEndDate(formatDate(new Date()));
        handleNotifications();
        handleNotificationsall();
    };

    useEffect(() => {
        handleNotifications();
    }, [1]);
    // console.clear();
    const dispatch = useDispatch();
    async function Notificationclick(item, index) {
        // Handle the click event
        console.log(item.notification_id);
        console.log(item.notification_type);
        // MARKASREADTOP10NOT
        if (item.notification_type === 'leave_application') {
            navigate('/leave-management');
            dispatch({ type: MENU_OPEN, id: 'leave' });
        } else if (item.notification_type === 'scrum_report_added') {
            dispatch({ type: MENU_OPEN, id: 'scrum' });
            navigate('/scrum-report');
        } else if (item.notification_type === 'weekend_working') {
            dispatch({ type: MENU_OPEN, id: 'Weekend' });
            navigate('/Weekend-working');
        } else if (item.notification_type === 'task_due_date_changed') {
            dispatch({ type: MENU_OPEN, id: 'task' });
            navigate('/task-management');
        } else if (item.notification_type === 'task_management') {
            navigate('/task-management');
            dispatch({ type: MENU_OPEN, id: 'task' });
        }
        // SCRUM
        else if (item.notification_type === 'scrum_report_added') {
            navigate('/scrum-report');
            dispatch({ type: MENU_OPEN, id: 'scrum' });
        }
        // DSR ADDED
        else if (item.notification_type === 'dsr_report_added') {
            navigate('/dsr');
            dispatch({ type: MENU_OPEN, id: 'eod' });
        }
        // DSR_EDIT
        else if (item.notification_type === 'dsr_report_edited') {
            navigate('/dsr');
            dispatch({ type: MENU_OPEN, id: 'eod' });
        }
        // overtime
        else if (item.notification_type === 'overtime_approve') {
            navigate('/Weekend-working');
            dispatch({ type: MENU_OPEN, id: 'Weekend ' });
        }
        // overtime
        else if (item.notification_type === 'overtime_disapprove') {
            navigate('/Weekend-working');
            dispatch({ type: MENU_OPEN, id: 'Weekend ' });
        }
        // leave
        else if (item.notification_type === 'approve_leave') {
            navigate('/leave-management');
            dispatch({ type: MENU_OPEN, id: 'leave ' });
        } else if (item.notification_type === 'disapprove_leave') {
            navigate('/leave-management');
            dispatch({ type: MENU_OPEN, id: 'leave ' });
        }
    }

    return (
        <MainCard title="Notifications">
            <Box sx={{ width: '100%' }}>
                {/* serach by date */}
                <form onSubmit={handleSubmit}>
                    <div className="attendance buttonsettings">
                        <div className="settingbutton">
                            <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} />
                            <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />
                            <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                                <AnimateButton>
                                    <Button size="large" type="submit" variant="contained" color="secondary" className="from_date">
                                        Submit
                                    </Button>
                                </AnimateButton>
                                <AnimateButton>
                                    <Button size="large" variant="contained" onClick={handleClear} color="primary" className="to_date">
                                        Clear
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </div>
                    </div>
                </form>
                {/* end */}

                <Toolbar
                    sx={{
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 },
                        ...(selected.length > 0 && {
                            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                        })
                    }}
                >
                    {selected.length > 0 ? (
                        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                            {selected.length} selected
                        </Typography>
                    ) : (
                        // <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                        //     Notifications
                        // </Typography>
                        ''
                    )}

                    {selected.length > 0 && (
                        <>
                            <Tooltip
                                onClick={() => {
                                    setOpen1(true);
                                }}
                                title="Mark as Read"
                            >
                                <IconButton>
                                    <DoneAllIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                onClick={
                                    () => {
                                        setOpen2(true);
                                    }
                                    // handleNotificationsdelete
                                }
                                title="Delete"
                            >
                                <IconButton>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Toolbar>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                    <Box sx={{ mt: 2, mb: 2, mr: 5 }} style={{ textAlign: 'center', display: 'flex' }}>
                        <AnimateButton sx={{ mr: 5 }}>
                            <Button
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={`${classes.from_date} ${activebtn === 0 ? classes.activeButton : classes.inactiveButton}`}
                                onClick={() => {
                                    setActivebtn(0);
                                    setActionid(0);
                                    handleNotifications();
                                    setSelected([]);
                                    // handleClear();
                                }}
                            >
                                Unread
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button
                                size="large"
                                variant="contained"
                                color="primary"
                                style={{ marginLeft: '10px' }}
                                className={`${classes.from_date} ${activebtn === 1 ? classes.activeButton : classes.inactiveButton}`}
                                onClick={() => {
                                    setActivebtn(1);
                                    setActionid(1);
                                    handleNotificationsall();
                                    setSelected([]);
                                    // handleClear();
                                }}
                            >
                                All
                            </Button>
                        </AnimateButton>
                    </Box>
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                            {/* <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                rowCount={notificationData.length}
                            /> */}
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                rowCount={notificationData?.length || 0} // Use optional chaining and provide a fallback value
                            />

                            <TableBody>
                                {notificationData?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            Notification Messages not found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    // notificationData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                    notificationData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                        // const isItemSelected = isSelected(row.notification_id);
                                        let isItemSelected = !loading && isSelected(row.notification_id);
                                        // isItemSelected = isItemSelectedw;
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.name}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        onChange={(event) => {
                                                            if (event.target.checked) {
                                                                setSelected((prevSelected) => [...prevSelected, row.notification_id]);
                                                                setGetnotiid((prevIds) => [...prevIds, row.notification_id]);
                                                            } else {
                                                                setSelected((prevSelected) =>
                                                                    prevSelected.filter((id) => id !== row.notification_id)
                                                                );
                                                                setGetnotiid((prevIds) =>
                                                                    prevIds.filter((id) => id !== row.notification_id)
                                                                );
                                                            }
                                                        }}
                                                        inputProps={{
                                                            'aria-labelledby': labelId
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell onClick={() => Notificationclick(row)} className="center_ds">
                                                    {row.notification_body}
                                                </TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>
                                                    {handleFormatDate(row.notification_date)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}

                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={notificationData?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                {/* <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" /> */}
            </Box>

            {/*mark as read */}
            <div>
                <Modal
                    open={open1}
                    // onClose={handleClose1}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h3" component="h2">
                            Are you sure you want to Mark as read?
                        </Typography>
                        <Box sx={{ mt: 2 }} className="popup_scrum">
                            <AnimateButton>
                                <Button
                                    size="large"
                                    // type="submit"
                                    onClick={() => {
                                        handleNotificationsmark();
                                    }}
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
                                    onClick={() => {
                                        setOpen1(false);
                                    }}
                                >
                                    No
                                </Button>
                            </AnimateButton>
                        </Box>
                    </Box>
                </Modal>
            </div>

            {/* end */}
            {/* delete */}
            <div>
                <Modal
                    open={open2}
                    // onClose={handleClose1}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h3" component="h2">
                            Are you sure you want to Delete?
                        </Typography>
                        <Box sx={{ mt: 2 }} className="popup_scrum">
                            <AnimateButton>
                                <Button
                                    size="large"
                                    // type="submit"
                                    onClick={() => {
                                        handleNotificationsdelete();
                                    }}
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
                                    onClick={() => {
                                        setOpen2(false);
                                    }}
                                >
                                    No
                                </Button>
                            </AnimateButton>
                        </Box>
                    </Box>
                </Modal>
            </div>

            {/* end */}
        </MainCard>
    );
}
