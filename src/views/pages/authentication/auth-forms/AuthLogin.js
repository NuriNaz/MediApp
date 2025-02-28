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

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
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
    const [error, seterror] = useState({ email: false, emailInvalid: false, password: false });
    const [passerror, setPasserror] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [message, setMessage] = useState('');

    // const handleClick = () => {
    //   navigate('/dashboard', { replace: true });
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        seterror({ email: false, emailInvalid: false, password: false });
    };

    // console.log(user, 'hello');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSubmit = async (e) => {
        const URL = API.LOGIN;
        e.preventDefault();

        if (!email) {
            seterror({ email: true });
        } else if (!regex.test(email)) {
            // console.log('Email is Not Valid ');
            seterror({ emailInvalid: true });
        } else if (!password) {
            seterror({ password: true });
        }
        // if (!passwordPattern.test(password)) {
        //     console.log(
        //         'Password must contain at least 8 characters, including one uppercase letter, one numeric character, and one special character.'
        //     );
        //     setPasserror(true);
        // }
        // if (!email) {
        //     seterror(true);
        // } else if (!password) {
        //     setPasserror(true);
        // }
        else {
            const response = await axios
                .post(
                    URL,
                    { email, password },
                    {
                        headers: {
                            'content-Type': 'application/json'
                        }
                    }
                )
                .then((res) => {
                    const data = res.data.data;
                    if (data.address === '' || data.address === null) {
                        navigate('/profile');
                    } else if (data.date_of_birth === '' || data.date_of_birth === null) {
                        navigate('/profile');
                    } else if (data.moblileno === '' || data.moblileno === null) {
                        navigate('/profile');
                    } else if (data.name === '' || data.name === null) {
                        navigate('/profile');
                    } else if (data.marital_status === '' || data.marital_status === null) {
                        navigate('/profile');
                    } else if (data.marital_status === '1' || data.marital_status === 1) {
                        if (data.anniversary_date === '' || data.anniversary_date === null) {
                            navigate('/profile');
                        }
                    } else {
                        console.log('dddddddddd');
                        navigate('/dashboard');
                        window.location.reload();
                    }
                    window.location.reload();
                    //
                    //
                    localStorage.setItem('Token', res.data.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data));
                    localStorage.setItem('userId', JSON.stringify(res.data.data.userId));
                })
                .catch((err) => {
                    console.log(err.response.data.data.message, 'hello');
                    const messages = err.response.data.data.message;
                    setMessage(messages);
                    setOpenError(true);
                });
        }
    };

    const date = new Date();
    const year = date.getFullYear();
    // console.log(year);

    // riredirection
    // function redirection() {
    //     console.log()
    // }
    // function redirectToURL(url) {
    //     window.location.href = url;
    // }

    // function getOperatingSystemName() {
    //     var userAgent = navigator.userAgent;
    //     var platform = navigator.platform;
    //     var osName = 'Unknown';

    //     if (platform.includes('Win')) {
    //         redirectToURL('https://s3-us-west-2.amazonaws.com/courses-images/wp-content/uploads/sites/1844/2017/05/09231938/desktop.png');
    //         osName = 'Windows';
    //     } else if (platform.includes('Mac')) {
    //         redirectToURL(' https://www.pexels.com/search/mac/');
    //         osName = 'MacOS';
    //     } else if (platform.includes('Linux')) {
    //         // Extract the desired URL and redirect for Linux
    //         // redirect
    //         redirectToURL('https://www.pexels.com/search/Linux%20computer/');
    //         osName = 'Linux';
    //     } else if (platform.includes('iPhone')) {
    //         redirectToURL(' https://www.pexels.com/search/i%20phone/');
    //         osName = 'iOS';
    //     } else if (platform.includes('Android')) {
    //         redirectToURL(' https://www.pexels.com/search/Android/');
    //         osName = 'Android';
    //     }

    //     return osName;
    // }

    // // Example usage
    // var osName = getOperatingSystemName();
    // console.log('Operating System: ' + osName);

    useEffect(() => {
        // getOperatingSystemName();
        const auth = localStorage.getItem('Token');
        if (auth) {
            navigate('/dashboard/');
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        name="email"
                        autoComplete="off"
                        label="Email address *"
                        value={email}
                        onChange={handleChange}
                        // required
                        error={error.email || error.emailInvalid}
                        helperText={(error.email && 'Please enter Email') || (error.emailInvalid && 'Please enter valid email address')}
                    />

                    <TextField
                        name="password"
                        label="Password *"
                        value={password}
                        // required
                        onChange={handleChange}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        error={error.password}
                        helperText={error.password && 'Please enter Password'}
                        // error={passerror}
                        // helperText={
                        //     passerror
                        //         ? 'Password must contain at least 8 characters, including one uppercase letter, one numeric character, and one special character.'
                        //         : ''
                        // }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {/* <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} /> */}
                                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
                    {/* <Checkbox name="rememberMe" label="Remember me" /> */}
                    <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#673ab7' }}>
                        <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                            Forgot Password?
                        </Typography>
                    </Link>
                </Stack>
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
                            Sign in
                        </Button>
                    </AnimateButton>
                </Box>
                <Typography
                    variant="subtitle1"
                    color="secondary"
                    style={{ textAlign: 'center', fontSize: 12, paddingTop: 10 }}
                    sx={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                    EMS Copyright ©{year}
                </Typography>
                {openError ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        <AlertTitle>Warning</AlertTitle>
                        Invalid Creds — <strong>{message} </strong>
                    </Alert>
                ) : (
                    ''
                )}
            </form>
        </>
    );
};

export default FirebaseLogin;
