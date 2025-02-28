import { Alert, AlertTitle, Box, Button, IconButton, InputAdornment, Modal, Snackbar, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import Iconify from 'components/iconify/Iconify';
import React from 'react';
import { useState } from 'react';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Message from '../Snackbar/Toaster';
import { API } from 'Constants/API';

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

const ChangePassword = () => {
    const [open, setOpen] = React.useState(false);
    const [error, seterror] = useState(false);

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        seterror(false);
        setNewpass(false);
        setmatch(false);
        setNewpass1(false);
        setUser({ oldpassword: '', newpass: '', newpassword: '' });
    };
    const [user, setUser] = useState({
        oldpassword: '',
        newpass: '',
        newpassword: ''
    });
    const { oldpassword, newpass, newpassword } = user;
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [match, setmatch] = useState(false);
    const [newPass, setNewpass] = useState(false);
    const [newPass1, setNewpass1] = useState(false);

    const [snackbars, setSnackbar] = useState({
        open: false,
        message: '',
        severity: ''
    });

    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false,
            message: ''
        });
    };

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('Token');
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const URL = API.CHANGE_PASSWORD_PROFILE;

        // if (!passwordPattern.test(newpassword)) {
        //     console.log(
        //         'Password must contain at least 8 characters, including one uppercase letter, one numeric character, and one special character.'
        //     );
        //     setErrorMessage(true);
        // }
        if (!oldpassword) {
            seterror(true);
            setNewpass(false);
            setNewpass1(false);
        } else if (!newpass) {
            setNewpass(true);
            seterror(false);
        } else if (!newpassword) {
            setNewpass1(true);
            setNewpass(false);
        } else if (newpass !== newpassword) {
            setNewpass(false);
            setNewpass1(false);
            seterror(false);
            // setmatch(true);
            setSnackbar({
                open: true,
                message: 'New password and Confirm password not matched.',
                severity: 'error'
            });
        } else if (newpassword === oldpassword) {
            setSnackbar({
                open: true,
                message: 'New password cannot be the same as the old password.',
                severity: 'error'
            });
            return false;
        } else {
            try {
                const result = await axios.post(
                    URL,
                    // '/user/change_password',
                    { userId, oldpassword, newpassword },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (result.status === 200) {
                    console.log(result.data, 'hello');
                    setOpen(false);
                    setSnackbar({
                        open: true,
                        message: 'Password Changed Successfully.',
                        severity: 'success'
                    });
                    setUser({ oldpassword: '', newpass: '', newpassword: '' });
                    setOpen(false);
                    // setTimeout(() => {
                    // }, 2000);
                }
            } catch (err) {
                console.log(err, 'hello error');
                if (err.response.status === 400) {
                    setSnackbar({
                        open: true,
                        message: err.response.data.data.msg,
                        severity: 'error'
                    });
                }
            }
        }
    };
    return (
        <div>
            <Button
                type="button"
                onClick={handleOpen}
                size="large"
                variant="contained"
                color="primary"
                className="changing"
                // style={{ marginTop: '-35%' }}
            >
                Change Password
            </Button>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h3" component="h2">
                        Change Password
                    </Typography>
                    {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography> */}
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                name="oldpassword"
                                label="Old password *"
                                style={{ marginTop: '15px' }}
                                value={oldpassword}
                                onChange={handleChange}
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                error={error}
                                helperText={error ? 'Please enter current password ' : ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                name="newpass"
                                label="New password *"
                                style={{ marginTop: '15px' }}
                                value={newpass}
                                // required
                                onChange={handleChange}
                                type={showPassword1 ? 'text' : 'password'}
                                autoComplete="new-password"
                                error={newPass}
                                helperText={newPass ? 'Please enter New password ' : ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword1(!showPassword1)} edge="end">
                                                <Iconify icon={showPassword1 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                name="newpassword"
                                label="Confirm password *"
                                style={{ marginTop: '15px' }}
                                value={newpassword}
                                // required
                                onChange={handleChange}
                                type={showPassword2 ? 'text' : 'password'}
                                autoComplete="new-password"
                                error={newPass1}
                                helperText={newPass1 ? 'Please Enter Confirm Password ' : ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                                                <Iconify icon={showPassword2 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Stack>

                        <Box sx={{ mt: 2 }} className="popup_scrum">
                            <AnimateButton>
                                <Button
                                    // disableElevation
                                    // disabled={isSubmitting}
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Submit
                                </Button>
                            </AnimateButton>
                            <AnimateButton>
                                <Button
                                    className="cancellation"
                                    // disableElevation
                                    // disabled={isSubmitting}
                                    size="large"
                                    // type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                    {/* {errorMessage ? (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            <AlertTitle>Password Error</AlertTitle>
                            Error-
                            <strong>
                                Password must contain at least 8 characters, including one uppercase letter, one numeric character, and one
                                special character.
                            </strong>
                        </Alert>
                    ) : (
                        ''
                    )} */}
                    {/* {match ? (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            <AlertTitle>Password Not Matched</AlertTitle>
                            Password Error-<strong>Password and Confirm Password Not Matched</strong>
                        </Alert>
                    ) : errorMessage ? (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            <AlertTitle>Password Error</AlertTitle>
                            Error-
                            <strong>
                                Password must contain at least 8 characters, including one uppercase letter, one numeric character, and one
                                special character.
                            </strong>
                        </Alert>
                    ) : success ? (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            <AlertTitle>Success</AlertTitle>
                            Sucess-
                            <strong>Password Changed Successfully.</strong>
                        </Alert>
                    ) : (
                        ''
                    )} */}
                </Box>
            </Modal>
            <Message snackbar={snackbars} handleCloseSnackbar={handleCloseSnackbar} />
        </div>
    );
};

export default ChangePassword;
