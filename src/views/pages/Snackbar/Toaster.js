import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//     error: {
//         backgroundColor: '#d84315'
//     }
// }));

function Alert(props) {
    // const classes = useStyles();

    return (
        <MuiAlert
            elevation={6}
            variant="filled"
            // className={classes.error}
            {...props}
        />
    );
}

function Message({ snackbar, handleCloseSnackbar }) {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            open={snackbar.open}
            message={snackbar.message}
            onClose={handleCloseSnackbar}
            autoHideDuration={3000} // Optional, will automatically close after 3 seconds
        >
            <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
    );
}

export default Message;
