import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { TbRotateClockwise2 } from 'react-icons/tb';
import { FaHome } from 'react-icons/fa';
import { API } from 'Constants/API';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HiExternalLink } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&>div': {
        position: 'relative',
        zIndex: 5
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        zIndex: 1,
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        zIndex: 1,
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const Charts = ({ isLoading }) => {
    const token = localStorage.getItem('Token');
    const userId = localStorage.getItem('userId');
    const theme = useTheme();
    const [inProgressTask, setInprogressTasks] = useState([]);
    const [timeValue, setTimeValue] = useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };

    const InprogressTasks = async () => {
        const user_id = userId;
        const URL = API.ASSIGNED_TASKS;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_all_active_projects',
                { user_id, status: 2 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                // console.log(result.data.total_projects, 'hello In Progress tasks');
                setInprogressTasks(result.data.total_projects);
            }
        } catch (err) {
            console.log(err);
        }
    };

    console.log(inProgressTask, 'inprogress');

    useEffect(() => {
        InprogressTasks();
    }, []);
    const dispatch = useDispatch();

    return (
        <>
            {isLoading ? (
                <SkeletonTotalOrderCard />
            ) : (
                <Link
                    onClick={() => {
                        dispatch({ type: MENU_OPEN, id: 'task' });
                    }}
                    to={'/task-management'}
                    style={{ textDecoration: 'none' }}
                >
                    <CardWrapper border={false} content={false} sx={{ mt: 4 }}>
                        <Box sx={{ p: 2.25 }}>
                            <Grid container direction="column">
                                <Grid item>
                                    <Grid container justifyContent="space-between">
                                        <Grid item>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    ...theme.typography.commonAvatar,
                                                    ...theme.typography.largeAvatar,
                                                    backgroundColor: theme.palette.primary[800],
                                                    color: '#fff'
                                                    // mt: 1
                                                }}
                                            >
                                                {/* <LocalMallOutlinedIcon fontSize="inherit" /> */}
                                                {/* <FaHome /> */}
                                                <TbRotateClockwise2 />
                                            </Avatar>
                                        </Grid>
                                        {/* <Grid item>
                                        <Button
                                            disableElevation
                                            variant={timeValue ? 'contained' : 'text'}
                                            size="small"
                                            sx={{ color: 'inherit' }}
                                            onClick={(e) => handleChangeTime(e, true)}
                                        >
                                            Month
                                        </Button>
                                        <Button
                                            disableElevation
                                            variant={!timeValue ? 'contained' : 'text'}
                                            size="small"
                                            sx={{ color: 'inherit' }}
                                            onClick={(e) => handleChangeTime(e, false)}
                                        >
                                            Year
                                        </Button>
                                    </Grid> */}
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    //  sx={{ mb: 0.75 }}
                                >
                                    <Grid container alignItems="center">
                                        <Grid item xs={6}>
                                            <Grid container alignItems="center">
                                                <Grid item>
                                                    {timeValue ? (
                                                        <Typography
                                                            sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}
                                                        >
                                                            $0
                                                        </Typography>
                                                    ) : (
                                                        <Typography
                                                            sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}
                                                        >
                                                            {inProgressTask === undefined || inProgressTask.length === 0
                                                                ? '0'
                                                                : inProgressTask}
                                                        </Typography>
                                                    )}
                                                </Grid>
                                                <Grid item>
                                                    <Avatar
                                                        sx={{
                                                            ...theme.typography.smallAvatar,
                                                            cursor: 'pointer',
                                                            backgroundColor: theme.palette.primary[200],
                                                            color: theme.palette.primary.dark
                                                        }}
                                                    >
                                                        {/* <ArrowDownwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} /> */}
                                                        <Link to={'/task-management'}>
                                                            <HiExternalLink style={{ marginTop: 2, color: '#1e88e5' }} fontSize={18} />
                                                        </Link>
                                                    </Avatar>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '1rem',
                                                            fontWeight: 500,
                                                            color: theme.palette.primary[200]
                                                        }}
                                                    >
                                                        {/* Remaining Leaves */}
                                                        In-Progress Tasks
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* <Grid item xs={6}>
                                        {timeValue ? <Chart {...ChartDataMonth} /> : <Chart {...ChartDataYear} />}
                                    </Grid> */}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardWrapper>
                </Link>
            )}
        </>
    );
};

Charts.propTypes = {
    isLoading: PropTypes.bool
};

export default Charts;
