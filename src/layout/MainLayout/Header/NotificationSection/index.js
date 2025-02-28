// import { useState, useRef, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import {
//     Avatar,
//     Box,
//     Button,
//     ButtonBase,
//     CardActions,
//     Chip,
//     ClickAwayListener,
//     Divider,
//     Grid,
//     Paper,
//     Popper,
//     Stack,
//     TextField,
//     Typography,
//     useMediaQuery
// } from '@mui/material';

// // third-party
// import PerfectScrollbar from 'react-perfect-scrollbar';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import Transitions from 'ui-component/extended/Transitions';
// import NotificationList from './NotificationList';

// // assets
// import { IconBell } from '@tabler/icons';
// import Timer from 'views/pages/attendance/Timer';
// import { API } from 'Constants/API';
// import axios from 'axios';

// // notification status options
// const status = [
//     {
//         value: 'all',
//         label: 'All Notification'
//     },
//     {
//         value: 'new',
//         label: 'New'
//     },
//     {
//         value: 'unread',
//         label: 'Unread'
//     },
//     {
//         value: 'other',
//         label: 'Other'
//     }
// ];

// // ==============================|| NOTIFICATION ||============================== //

// const NotificationSection = () => {
//     const theme = useTheme();
//     const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

//     const [dataFromChild, setDataFromChild] = useState('0');
//     const [open, setOpen] = useState(false);
//     const [value, setValue] = useState('');
//     /**
//      * anchorRef is used on different componets and specifying one type leads to other components throwing an error
//      * */
//     const anchorRef = useRef(null);

//     function handleToggle() {
//         setOpen((prevOpen) => !prevOpen);
//     }

//     const handleClose = (event) => {
//         if (anchorRef.current && anchorRef.current.contains(event.target)) {
//             return;
//         }
//         setOpen(false);
//     };

//     const prevOpen = useRef(open);
//     useEffect(() => {
//         if (prevOpen.current === true && open === false) {
//             anchorRef.current.focus();
//         }
//         prevOpen.current = open;
//     }, [open]);

//     const handleChange = (event) => {
//         if (event?.target.value) setValue(event?.target.value);
//     };
//     const [notification, setnotification] = useState(0);
//     const user_id = localStorage.getItem('userId');
//     const token = localStorage.getItem('Token');
//     // get Top 10 notification
//     async function gettop10notification() {
//         setDataFromChild(0);
//         setnotification(0);
//         const URL = API.GETTOP10NOTIFICATIONS;
//         const userId = user_id;
//         try {
//             const result = await axios.post(
//                 URL,
//                 // '/user/get_project_supervisor',
//                 { userId },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );
//             if (result.status === 200) {
//                 console.log(result.data.data.data.notifications, 'this response is NOTIFICATIONS');
//                 const newNotificationCount = result.data.data.data.newmsg;
//                 console.log(newNotificationCount);
//                 setnotification(newNotificationCount);
//                 setDataFromChild(newNotificationCount);
//                 console.warn('working');
//             }
//         } catch (err) {
//             console.log(err, 'CATCH err');
//         }
//     }
//     useEffect(() => {
//         gettop10notification();
//     }, [1]);
//     setInterval(function () {
//         gettop10notification();
//     }, 240000); // 4 minutes = 4 * 60 * 1000 milliseconds

//     // const handleDataFromChild = (data) => {
//     //     // Update parent component state with data received from child
//     //     setDataFromChild(data - 1);
//     // };
//     // console.log(dataFromChild);

//     const handleDataFromChild = (data) => {
//         // Update parent component state with data received from child
//         const updatedData = parseInt(data, 10) - 1;
//         setDataFromChild(updatedData);
//         setnotification(0);
//     };
//     console.log(dataFromChild);
//     console.log('>>>>>>>>>>>>>>>>>>>workinggggggggggggggggggg');

//     return (
//         <>
//             <Box sx={{ mr: 2 }}>
//                 <Timer />
//             </Box>
//             <Box
//                 className="shadowchange"
//                 onClick={handleToggle}
//                 style={{ transition: 'none' }}
//                 sx={{
//                     ml: 2,
//                     mr: 3,
//                     [theme.breakpoints.down('md')]: {
//                         mr: 2
//                     }
//                 }}
//             >
//                 <ButtonBase className="shadowchanges" onClick={handleToggle} sx={{ borderRadius: '12px' }}>
//                     <span className="notilength">{dataFromChild}</span>
//                     <Avatar
//                         variant="rounded"
//                         sx={{
//                             ...theme.typography.commonAvatar,
//                             ...theme.typography.mediumAvatar,
//                             transition: 'all .2s ease-in-out',
//                             background: theme.palette.secondary.light,
//                             color: theme.palette.secondary.dark,
//                             '&[aria-controls="menu-list-grow"],&:hover': {
//                                 background: theme.palette.secondary.dark,
//                                 color: theme.palette.secondary.light
//                             }
//                         }}
//                         ref={anchorRef}
//                         aria-controls={open ? 'menu-list-grow' : undefined}
//                         aria-haspopup="true"
//                         onClick={handleToggle}
//                         color="inherit"
//                     >
//                         <IconBell stroke={1.5} size="1.3rem" />
//                     </Avatar>
//                 </ButtonBase>
//             </Box>
//             <Popper
//                 placement={matchesXs ? 'bottom' : 'bottom-end'}
//                 open={open}
//                 anchorEl={anchorRef.current}
//                 role={undefined}
//                 transition
//                 disablePortal
//                 popperOptions={{
//                     modifiers: [
//                         {
//                             name: 'offset',
//                             options: {
//                                 offset: [matchesXs ? 5 : 0, 20]
//                             }
//                         }
//                     ]
//                 }}
//             >
//                 {({ TransitionProps }) => (
//                     <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
//                         <Paper>
//                             <ClickAwayListener onClickAway={handleClose}>
//                                 <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
//                                     <Grid container direction="column" spacing={2}>
//                                         {/* <Grid item xs={12}>
//                                             <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
//                                                 <Grid item>
//                                                     <Stack direction="row" spacing={2}>
//                                                         <Typography variant="subtitle1">All Notification</Typography>
//                                                         <Chip
//                                                             size="small"
//                                                             label="01"
//                                                             sx={{
//                                                                 color: theme.palette.background.default,
//                                                                 bgcolor: theme.palette.warning.dark
//                                                             }}
//                                                         />
//                                                     </Stack>
//                                                 </Grid>
//                                                 <Grid item>
//                                                     <Typography component={Link} to="#" variant="subtitle2" color="primary">
//                                                         Mark as all read
//                                                     </Typography>
//                                                 </Grid>
//                                             </Grid>
//                                         </Grid> */}
//                                         <Grid item xs={12}>
//                                             <PerfectScrollbar
//                                                 style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowY: 'hidden' }}
//                                             >
//                                                 {/* <Grid container direction="column" spacing={2}>
//                                                     <Grid item xs={12}>
//                                                         <Box sx={{ px: 2, pt: 0.25 }}>
//                                                             <TextField
//                                                                 id="outlined-select-currency-native"
//                                                                 select
//                                                                 fullWidth
//                                                                 value={value}
//                                                                 onChange={handleChange}
//                                                                 SelectProps={{
//                                                                     native: true
//                                                                 }}
//                                                             >
//                                                                 {status.map((option) => (
//                                                                     <option key={option.value} value={option.value}>
//                                                                         {option.label}
//                                                                     </option>
//                                                                 ))}
//                                                             </TextField>
//                                                         </Box>
//                                                     </Grid>
//                                                     <Grid item xs={12} p={0}>
//                                                         <Divider sx={{ my: 0 }} />
//                                                     </Grid>
//                                                 </Grid> */}
//                                                 <NotificationList onDataReceived={handleDataFromChild} data={notification} />
//                                             </PerfectScrollbar>
//                                         </Grid>
//                                     </Grid>
//                                     <Divider />
//                                     <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
//                                         {/* onClick={handleClose()} */}
//                                         <Button size="small" disableElevation>
//                                             <Link onClick={handleClose} to="/notifications">
//                                                 View All notifications
//                                             </Link>
//                                         </Button>
//                                     </CardActions>
//                                 </MainCard>
//                             </ClickAwayListener>
//                         </Paper>
//                     </Transitions>
//                 )}
//             </Popper>
//         </>
//     );
// };

// export default NotificationSection;

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    CardActions,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    Paper,
    Popper,
    Stack,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';

// assets
import { IconBell } from '@tabler/icons';
import Timer from 'views/pages/attendance/Timer';
import { API } from 'Constants/API';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';

// notification status options
const status = [
    {
        value: 'all',
        label: 'All Notification'
    },
    {
        value: 'new',
        label: 'New'
    },
    {
        value: 'unread',
        label: 'Unread'
    },
    {
        value: 'other',
        label: 'Other'
    }
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [dataFromChild, setDataFromChild] = useState(0);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    /**
     * anchorRef is used on different components and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    function handleToggle() {
        setOpen((prevOpen) => !prevOpen);
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleChange = (event) => {
        if (event?.target.value) setValue(event?.target.value);
    };
    const [notification, setNotification] = useState(0);
    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');
    // get Top 10 notification
    async function getTop10Notification() {
        // setDataFromChild(0);
        // setNotification(0);
        const URL = API.GETTOP10NOTIFICATIONS;
        const userId = user_id;
        try {
            const result = await axios.post(
                URL,
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                console.log(result.data.data.data.notifications, 'this response is NOTIFICATIONS');
                const newNotificationCount = result.data.data.data.newmsg;
                console.log(newNotificationCount);
                setNotification(newNotificationCount);
                setDataFromChild(newNotificationCount);
                console.warn('working');
            }
        } catch (err) {
            console.log(err, 'CATCH err');
        }
    }
    useEffect(() => {
        getTop10Notification();
    }, []);
    setInterval(function () {
        getTop10Notification();
    }, 240000); // 4 minutes = 4 * 60 * 1000 milliseconds

    const handleDataFromChild = (data) => {
        // Update parent component state with data received from child
        const updatedData = parseInt(data == 1 ? data - 1 : data, 10) - 1;
        setDataFromChild(updatedData ? updatedData : dataFromChild);
        // setNotification(0);
    };
    const dispatch = useDispatch();

    console.log('dataFromChild update', dataFromChild);
    console.log('>>>>>>>>>>>>>>>>>>>notificationggggggggggggggggggg', notification);
    return (
        <>
            <Box sx={{ mr: 2 }}>
                <Timer />
            </Box>
            <Box
                className="shadowchange"
                onClick={handleToggle}
                style={{ transition: 'none' }}
                sx={{
                    ml: 2,
                    mr: 3,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <ButtonBase className="shadowchanges" onClick={handleToggle} sx={{ borderRadius: '12px' }}>
                    {dataFromChild.length <= 0 ? '' : <span className="notilength">{dataFromChild === -1 ? 0 : dataFromChild}</span>}
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="inherit"
                    >
                        <IconBell stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs={12}>
                                            <PerfectScrollbar
                                                style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowY: 'hidden' }}
                                            >
                                                <NotificationList onDataReceived={handleDataFromChild} data={notification} />
                                            </PerfectScrollbar>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                    <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                                        <Button size="small" disableElevation>
                                            <Link
                                                onClick={() => {
                                                    handleClose;
                                                    dispatch({ type: MENU_OPEN, id: '' });
                                                }}
                                                to="/notifications"
                                            >
                                                View All notifications
                                            </Link>
                                        </Button>
                                    </CardActions>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default NotificationSection;
