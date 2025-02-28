// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Scrums from './Scrums';

// ==============================|| SAMPLE PAGE ||============================== //

const Report = () => (
    <MainCard title="Scrum Report">
        <Scrums />
    </MainCard>
);

export default Report;
