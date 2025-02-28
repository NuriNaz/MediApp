import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import { MdHolidayVillage } from 'react-icons/md';
// import { BiTask } from 'react-icons/bs';
import { BiTask } from 'react-icons/bi';
import { API } from 'Constants/API';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HiExternalLink } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
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
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
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

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const TotalIncomeDarkCard = ({ isLoading }) => {
    const token = localStorage.getItem('Token');
    const userId = localStorage.getItem('userId');
    const theme = useTheme();
    const [acknowledgeTasks, setAcknowledgeTasks] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getAcknowledgedTasks = async () => {
        const user_id = userId;
        const URL = API.ASSIGNED_TASKS;
        try {
            const result = await axios.post(
                URL,
                // '/user/get_all_active_projects',
                { user_id, status: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (result.status === 200) {
                // console.log(result.data.total_projects, 'hello acknowledged tasks');
                setAcknowledgeTasks(result.data.total_projects);
                // setAssignedTasks(result.data.total_projects);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAcknowledgedTasks();
    }, []);

    const dispatch = useDispatch();

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <Link
                    onClick={() => {
                        dispatch({ type: MENU_OPEN, id: 'task' });
                    }}
                    to={'/task-management'}
                    style={{ textDecoration: 'none' }}
                >
                    <CardWrapper border={false} content={false} sx={{ mt: 2 }}>
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
                                                    backgroundColor: theme.palette.secondary[800],
                                                    mt: 1
                                                }}
                                            >
                                                {/* <img src={EarningIcon} alt="Notification" /> */}
                                                {/* <MdHolidayVillage style={{ color: 'white' }} /> */}
                                                <BiTask style={{ color: 'white' }} />
                                            </Avatar>
                                        </Grid>
                                        {/* <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.mediumAvatar,
                                                backgroundColor: theme.palette.secondary.dark,
                                                color: theme.palette.secondary[200],
                                                zIndex: 1
                                            }}
                                            aria-controls="menu-earning-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreHorizIcon fontSize="inherit" />
                                        </Avatar>
                                        <Menu
                                            id="menu-earning-card"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            variant="selectedMenu"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                        >
                                            <MenuItem onClick={handleClose}>
                                                <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Card
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Copy Data
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Export
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Archive File
                                            </MenuItem>
                                        </Menu>
                                    </Grid> */}
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                                {/* 10 */}
                                                {/* {acknowledgeTasks?.length !== 0 ? acknowledgeTasks : '0'} */}
                                                {acknowledgeTasks === undefined || acknowledgeTasks.length === 0 ? '0' : acknowledgeTasks}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Avatar
                                                sx={{
                                                    cursor: 'pointer',
                                                    ...theme.typography.smallAvatar,
                                                    backgroundColor: theme.palette.secondary[200],
                                                    color: theme.palette.secondary.dark
                                                }}
                                            >
                                                {/* <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} /> */}
                                                <Link
                                                    onClick={() => {
                                                        dispatch({ type: MENU_OPEN, id: 'task' });
                                                    }}
                                                    to={'/task-management'}
                                                >
                                                    <HiExternalLink style={{ marginTop: 2, color: '#5e35b1' }} fontSize={18} />
                                                </Link>
                                            </Avatar>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item sx={{ mb: 1.25 }}>
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            color: theme.palette.secondary[200]
                                        }}
                                    >
                                        {/* Total Leaves */}
                                        Acknowledge Tasks
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardWrapper>
                </Link>
            )}
        </>
    );
};

TotalIncomeDarkCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalIncomeDarkCard;

// import PropTypes from 'prop-types';

// // material-ui
// import { styled, useTheme } from '@mui/material/styles';
// import { Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
// import EarningIcon from 'assets/images/icons/earning.svg';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// // assets
// import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
// import EarningCard from './EarningCard';
// import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// // styles
// const CardWrapper = styled(MainCard)(({ theme }) => ({
//     // backgroundColor: theme.palette.primary.dark,
//     color: theme.palette.primary.light,
//     overflow: 'hidden',
//     position: 'relative'
//     // '&:after': {
//     //     content: '""',
//     //     position: 'absolute',
//     //     width: 210,
//     //     height: 210,
//     //     background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
//     //     borderRadius: '50%',
//     //     top: -30,
//     //     right: -180
//     // },
//     // '&:before': {
//     //     content: '""',
//     //     position: 'absolute',
//     //     width: 210,
//     //     height: 210,
//     //     background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
//     //     borderRadius: '50%',
//     //     top: -160,
//     //     right: -130
//     // }
// }));

// // ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

// const TotalIncomeDarkCard = (props, { isLoading }) => {
//     const theme = useTheme();
//     return (
//         <>
//             {isLoading ? (
//                 <SkeletonEarningCard />
//             ) : (
//                 <CardWrapper border={false} content={false}>
//                     <EarningCard />
//                     {/* <Box sx={{ p: 2 }}>
//                         <List sx={{ py: 0 }}>
//                             <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
//                                 <ListItemAvatar>
//                                     <Avatar
//                                         variant="rounded"
//                                         sx={{
//                                             ...theme.typography.commonAvatar,
//                                             ...theme.typography.largeAvatar,
//                                             backgroundColor: theme.palette.primary[800],
//                                             color: '#fff'
//                                         }}
//                                     >
//                                         <TableChartOutlinedIcon fontSize="inherit" />
//                                     </Avatar>
//                                 </ListItemAvatar>
//                                 <ListItemText
//                                     sx={{
//                                         py: 0,
//                                         mt: 0.45,
//                                         mb: 0.45
//                                     }}
//                                     primary={
//                                         <Typography variant="h4" sx={{ color: '#fff' }}>
//                                             $203k
//                                         </Typography>
//                                     }
//                                     secondary={
//                                         <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
//                                             Total Income
//                                         </Typography>
//                                     }
//                                 />
//                             </ListItem>
//                         </List>
//                     </Box> */}
//                 </CardWrapper>
//             )}
//         </>
//     );
// };

// TotalIncomeDarkCard.propTypes = {
//     isLoading: PropTypes.bool
// };

// export default TotalIncomeDarkCard;
