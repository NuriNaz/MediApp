// material-ui
import React from 'react';
// import ReactDOM from 'react-dom';
import { useTheme, styled } from '@mui/material/styles';
import { Divider, Grid, List, Stack, Typography } from '@mui/material';
// import { makeStyles } from '@mui/material';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons';
import User1 from 'assets/images/users/user-round.svg';
import axios from 'axios';
import { API } from 'Constants/API';
import { useEffect, useState } from 'react';
import ClassNameGenerator from '@mui/utils/ClassNameGenerator';
// import { Box } from '@mui/system';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';
import FirstnameIcon from 'views/pages/profile/FirstnameIcon';

// const useStyles = makeStyles((theme) => ({
//     list: {
//         overflow: 'hidden',
//         paddingTop: 0,
//         paddingBottom: 0,
//         '& .MuiListItem-root': {
//             paddingTop: theme.spacing(1),
//             paddingBottom: theme.spacing(1)
//         }
//     }
// }));
// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16
    // '&:hover': {
    //     background: theme.palette.primary.light
    // },
    // '& .MuiListItem-root': {
    //     padding: 0
    // }
}));
// ==============================|| NOTIFICATION LIST ITEM ||============================== //
const NotificationList = (props) => {
    const navigate = useNavigate();
    const [dataToSend, setDataToSend] = useState(); // Initialize dataToSend state variable

    const sendDataToParent = () => {
        // Call the callback function passed from parent
        props.onDataReceived(dataToSend);
    };
    // const classes = useStyles();
    const [notification, setnotification] = useState(0);
    const [length, setLength] = useState();

    const theme = useTheme();
    const chipSX = {
        height: 24,
        padding: '0 6px'
    };
    const chipErrorSX = {
        ...chipSX,
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.orange.light,
        marginRight: '5px'
    };

    const chipWarningSX = {
        ...chipSX,
        color: theme.palette.warning.dark,
        backgroundColor: theme.palette.warning.light
    };

    const chipSuccessSX = {
        ...chipSX,
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light,
        height: 28
    };

    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');
    // get Top 10 notification
    async function gettop10notification() {
        sendDataToParent();
        setnotification(0);
        setLength(0);
        const URL = API.GETTOP10NOTIFICATIONS;
        const userId = user_id;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_project_supervisor',
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                console.log(result.data.data.data.notifications, 'this response is NOTIFICATIONS');
                setnotification(result.data.data.data.notifications);
                setLength(result.data.data.data.newmsg);
                setDataToSend(result.data.data.data.newmsg);
                console.warn('working');
            }
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
            console.log(err, 'CATCH err');
        }
    }
    useEffect(() => {
        gettop10notification();
    }, []);
    const dispatch = useDispatch();
    async function Notificationclick(item, index) {
        // Handle the click event
        console.log(item.notification_id);
        console.log(item.notification_type);
        // MARKASREADTOP10NOT
        const URL = API.MARKASREADTOP10NOT;
        const userId = user_id;
        const notificationId = item.notification_id;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_project_supervisor',
                { userId, notificationId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(result);
            if (result.data.data.status === 1) {
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

                gettop10notification();
            }
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
            console.log(err, 'CATCH err');
        }
    }
    setInterval(function () {
        gettop10notification();
    }, 240000); // 4 minutes = 4 * 60 * 1000 milliseconds
    return (
        <List
            className="scrollbar-container scrool_dfguyd ps"
            // {classes.list}
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px'
            }}
        >
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                    <Grid item>
                        <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">You have {length} new notifications</Typography>
                            {/* <Chip size="small" label={props.data} style={{ background: '#5e35b1', color: '#fff' }} /> */}
                        </Stack>
                    </Grid>
                    {/* <Grid item>
                        <Typography
                            // component={Link}
                            to="#"
                            variant="subtitle2"
                            color="primary"
                        >
                            Mark as all read
                        </Typography>
                    </Grid> */}
                </Grid>
            </Grid>

            {
                Array.isArray(notification) && notification.length > 0
                    ? notification.map((item, index) => (
                          <>
                              <ListItemWrapper key={index}>
                                  <Grid style={{ display: 'flex' }} container direction="column" className="list-container">
                                      <Grid item xs={4} style={{}}>
                                          {/* display: 'flex', alignItems: 'center' */}
                                          <div className="wrap_ notification">
                                              {/* <div className="first_char"> */}
                                              {/* <Typography className="custom-class"> */}
                                              {/* {`${item.notification_type[0]}`.toUpperCase()} */}
                                              {/* </Typography> */}
                                              <FirstnameIcon firstName={item.notification_type} />
                                              {/* </div> */}
                                              <div className="last_char">
                                                  <Typography onClick={() => Notificationclick(item, index)} variant="subtitle2">
                                                      {item.notification_body}
                                                  </Typography>
                                              </div>
                                          </div>
                                      </Grid>
                                  </Grid>
                              </ListItemWrapper>
                              <Divider />
                          </>
                      ))
                    : ''
                // <Typography className="notfound" variant="body1" align="center" sx={{ mt: 2 }}>
                //     You have 0 notifications.
                // </Typography>
            }
        </List>
    );
};

export default NotificationList;
