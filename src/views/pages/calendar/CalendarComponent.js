import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import { API } from 'Constants/API';
import { Box, Stack } from '@mui/system';
import { Button, Divider, Modal, Typography } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import moment from 'moment';
import { useNavigate } from 'react-router';
import '../attendance/index.css';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
};

const CalendarComponent = () => {
    const [open3, setOpen3] = useState(false);
    const [popupdata, setPopupdata] = useState({});
    const [datesss, setDatesss] = useState('');

    const calendarRef = useRef(null);
    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: MENU_OPEN, id: 'Almanac' });
        getCalendar();
    }, []);

    const navigate = useNavigate();

    async function getCalendar() {
        try {
            const URL = API.GETCALENDER;
            const result = await axios.post(
                URL,
                { user_id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const calendarApi = calendarRef.current.getApi();
            calendarApi.setOption('headerToolbar', {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridWeek,dayGridMonth,dayGridYear'
            });
            const events = result.data.map((data, index) => ({
                id: index, // Assign a unique ID to each event
                title: data.title,
                start: data.event_date,
                end: moment(data.end_event_date).add(1, 'day').format('YYYY-MM-DD'),
                description: data.description
            }));

            calendarApi.removeAllEvents(); // Clear existing events
            events.forEach((event) => {
                event.backgroundColor = '#673ab7';
                event.textColor = 'white';
                event.borderColor = 'transparent';
                event.borderWidth = '0px';
                calendarApi.addEvent(event);
            });
        } catch (err) {
            console.log(err); // Add this line to log the error object
            if (err.response && err.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    }

    const handleEventClick = (info) => {
        const originalDate = new Date(info.event.start);
        const day = originalDate.getDate();
        const month = originalDate.getMonth() + 1; // Adding 1 since months are zero-based (0-11)
        const year = originalDate.getFullYear();
        const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
        setDatesss(formattedDate);
        setOpen3(true);
        setPopupdata(info.event);
    };

    return (
        <div>
            <MainCard title="Holidays Almanac">
                <FullCalendar ref={calendarRef} plugins={[dayGridPlugin]} eventClick={handleEventClick} />
            </MainCard>
            <Modal
                style={{ padding: '10px' }}
                className="popup_s"
                open={open3}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        style={{ textAlign: 'center', margin: '10px 0px 10px 0px' }}
                        id="modal-modal-title"
                        variant="h2"
                        component="h2"
                    >
                        Event Detail
                    </Typography>
                    <Divider />
                    <div className="calender_9hd">
                        <Typography className="title" id="modal-modal-title" variant="h5" component="h2">
                            <span className="is9_fields">{popupdata.title}</span>
                        </Typography>
                        <Typography
                            id="modal-modal-title"
                            style={{ fontSize: '15px', margin: '10px 0px' }}
                            className="dates_8s"
                            variant="h5"
                            component="h2"
                        >
                            {popupdata.start && popupdata.end ? (
                                <span className="is9_fields">
                                    {datesss == new Date(popupdata.end.getTime() - 24 * 60 * 60 * 1000).toLocaleDateString() ? (
                                        <>{datesss}</>
                                    ) : (
                                        <>
                                            <b>{datesss ? datesss : 'N/A'}</b> to
                                            <b>
                                                {popupdata.end &&
                                                    new Date(popupdata.end.getTime() - 24 * 60 * 60 * 1000).toLocaleDateString()}
                                            </b>
                                        </>
                                    )}
                                    {/* <b>{datesss ? datesss : 'N/A'}</b> to
                                    <b>{popupdata.end && new Date(popupdata.end.getTime() - 24 * 60 * 60 * 1000).toLocaleDateString()}</b> */}
                                </span>
                            ) : (
                                <span className="is9_fields">
                                    <b>{datesss ? datesss : 'N/A'}</b> to <b>{datesss ? datesss : 'N/A'}</b>
                                    <b>{popupdata.end && new Date(popupdata.end.getTime() - 24 * 60 * 60 * 1000).toLocaleDateString()}</b>
                                </span>
                            )}
                        </Typography>

                        <Typography
                            style={{ fontSize: '15px', textAlign: 'center' }}
                            className="des_p"
                            id="modal-modal-title"
                            variant=""
                            component=""
                        >
                            <span className="is9_fields">{popupdata?._def?.extendedProps.description}</span>
                        </Typography>
                    </div>
                    <Box sx={{ mt: 2 }} className="popup_scrum right_btn">
                        <AnimateButton>
                            <Button
                                className="ds_sclose"
                                size="large"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setOpen3(false);
                                }}
                            >
                                Close
                            </Button>
                        </AnimateButton>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default CalendarComponent;
