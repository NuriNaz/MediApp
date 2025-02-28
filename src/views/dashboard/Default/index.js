import { useEffect, useState } from 'react';

// material-ui
import { Box, Button, Grid, Modal, Stack, Typography } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router';
import Charts from './Chart';
import Data from './Data';
import Timer from 'views/pages/attendance/Timer';
import { useDispatch } from 'react-redux';
import { MENU_OPEN } from 'store/actions';
import AnimateButton from 'ui-component/extended/AnimateButton';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const navigate = useNavigate();
    const auth = localStorage.getItem('Token');
    const [isLoading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [popup, setPopup] = useState(false);

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
    useEffect(() => {
        dispatch({ type: MENU_OPEN, id: 'default' });
        setLoading(false);
        if (auth) {
            navigate('/dashboard/');
        } else {
            navigate('/login');
        }
    }, [auth]);

    useEffect(() => {
        const popup = localStorage.getItem('popup');
        if (!popup) {
            // setPopup(true);
        } else {
            // setPopup(false);
        }
    }, [0]);

    function handlepopup(e) {
        setPopup(false);
        localStorage.setItem('popup', 'true');
        e.preventDefault();
    }

    return (
        <div style={{ marginTop: 15 }}>
            {/* <Timer /> */}
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <EarningCard isLoading={isLoading} />
                            {/* <TotalOrderLineChartCard isLoading={isLoading} /> */}
                            <Charts isLoading={isLoading} />
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <TotalOrderLineChartCard isLoading={isLoading} />
                            <Data isLoading={isLoading} />
                        </Grid>
                        <Grid item lg={4} md={12} sm={12} xs={12}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item sm={6} xs={12} md={6} lg={12}>
                                    <TotalIncomeDarkCard isLoading={isLoading} />
                                </Grid>
                                <Grid item sm={6} xs={12} md={6} lg={12}>
                                    <TotalIncomeLightCard isLoading={isLoading} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            {/* <TotalGrowthBarChart isLoading={isLoading} /> */}
                        </Grid>
                        {/* <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} />
                    </Grid> */}
                    </Grid>
                </Grid>
            </Grid>
            {/* popup */}
            <Modal
                open={popup}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography style={{ marginBottom: '15px' }} id="modal-modal-title" variant="h3" component="h2">
                        Term & Conditions
                    </Typography>
                    <form onSubmit={handlepopup}>
                        <Box className="scroll-container" sx={{ maxHeight: '400px', overflow: 'auto' }}>
                            <Stack spacing={3} className="scrum_to">
                                {/* Large amount of data */}
                                {Array.from({ length: 1 }, (_, index) => (
                                    <p key={index}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                        industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                                        and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                                        leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                                        with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                                        publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                    </p>
                                ))}
                            </Stack>
                            <Box sx={{ mt: 2 }} className="popup_scrum ">
                                <AnimateButton>
                                    <Button
                                        size="large"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            handlepopup();
                                        }}
                                    >
                                        Agree
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default Dashboard;
