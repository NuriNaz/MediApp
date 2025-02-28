import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import Alert from '@mui/material/Alert';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
// import { LoadingButton } from '@mui/lab';
// components

// import {AiFillEye, AiFillEyeInvisible} from 'react-icons'
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    // Link,
    TextField,
    Button,
    Checkbox,
    Divider,
    // FormControl,
    // FormControlLabel,
    // FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    // InputLabel,
    // OutlinedInput,
    Stack,
    Typography,
    useMediaQuery,
    // Snackbar,
    Alert,
    AlertTitle
} from '@mui/material';

// third party
// import * as Yup from 'yup';
// import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Google from 'assets/images/icons/social-google.svg';
import Iconify from 'components/iconify/Iconify';
import { API } from 'Constants/API';
import { Bars } from 'react-loader-spinner';

// ============================|| FIREBASE - LOGIN ||============================ //

const Password = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const [checked, setChecked] = useState(true);

    const googleHandler = async () => {
        console.error('Login');
    };

    // const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const { email, password } = user;
    const [success, setSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [notFound, setnotFound] = useState(false);
    const [message, setmessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // const handleClick = () => {
    //   navigate('/dashboard', { replace: true });
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!email) {
        //     seterror(true);
        // } else
        if (!regex.test(email)) {
            console.log('Email is Not Valid ');
            setOpenError(true);
            setSuccess(false);
            setmessage(null);
            setnotFound(false);
        } else {
            setIsLoading(true);
            await axios
                .post(
                    API.FORGOT_PASSWORD,
                    // '/user/forgotpassword',
                    { email },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then((res) => {
                    if (res.status === 200) {
                        // console.log(res.data.msg);
                        setSuccessMessage(res.data.msg);
                        // console.log('An Email is sent To your ID ');
                        setUser({ email: '' });
                        setSuccess(true);
                        setOpenError(false);
                    }
                })
                .catch((err) => {
                    console.log(err, 'hjfaskdjhfsa');
                    if (err.response.status === 401) {
                        // console.log('Please Enter Valid Email');
                        setmessage(err.response.data.message);
                        setOpenError(false);
                        setnotFound(true);
                    }
                });
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        name="email"
                        autoComplete="off"
                        label="Email address"
                        value={email}
                        onChange={handleChange}
                        error={openError}
                        required
                        helperText={openError ? 'Please enter valid email address' : ''}
                    />
                </Stack>

                {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                    <Checkbox name="remember" label="Remember me" />
                    {/* <h6>
                        <Link variant="subtitle2" underline="hover">
                            Forgot password?
                        </Link>
                    </h6> 
                    <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                        Forgot Password?
                    </Typography>
                </Stack> */}

                {/* <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    // onClick={handleClick}
                >
                    Login
                </LoadingButton> */}

                <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                        <Button
                            // disableElevation
                            // disabled={isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="secondary"
                        >
                            Send
                        </Button>
                    </AnimateButton>
                    {success ? (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            <AlertTitle>Success</AlertTitle>
                            Please check your Email ID — <strong>{successMessage}</strong>
                        </Alert>
                    ) : notFound ? (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            <AlertTitle>Warning</AlertTitle>
                            Invalid Email — <strong>{message}</strong>
                        </Alert>
                    ) : (
                        ''
                    )}

                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <Link to="/login" style={{ textDecoration: 'none', color: '#673ab7' }}>
                            <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                                Login
                            </Typography>{' '}
                        </Link>
                    </div>
                </Box>
            </form>
            <div className="loading">
                {isLoading && (
                    <Bars
                        height="80"
                        width="80"
                        color="#5a49ae"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                )}
            </div>
        </>
    );
};

export default Password;
