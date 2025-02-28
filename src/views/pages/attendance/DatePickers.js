import { Box, Button } from '@mui/material';
import { formatDate } from 'function/FormatTime';
import React, { useState } from 'react';
import AnimateButton from 'ui-component/extended/AnimateButton';

function DatePickers() {
    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };
    console.log(startDate, endDate);

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };
    return (
        <div className="settingbutton">
            <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} />
            <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />

            <Box sx={{ mt: 2, mb: 2 }} style={{ textAlign: 'center', display: 'flex' }}>
                <AnimateButton>
                    <Button
                        size="large"
                        // type="submit"
                        variant="contained"
                        color="secondary"
                        style={{ padding: '10px 50px' }}
                    >
                        Submit
                    </Button>
                </AnimateButton>
                <AnimateButton>
                    <Button
                        // disableElevation
                        // disabled={isSubmitting}
                        // fullWidth
                        size="large"
                        // type="submit"
                        variant="contained"
                        color="primary"
                        style={{ padding: '10px 50px' }}
                    >
                        Clear
                    </Button>
                </AnimateButton>
            </Box>
        </div>
    );
}

export default DatePickers;
