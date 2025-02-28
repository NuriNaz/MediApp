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

const ResetPasswordurl = ({ ...others }) => {
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
        setShowPassword1(!showPassword1);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);

    const [user, setUser] = useState({
        password: '',
        cpassword: ''
    });
    const { cpassword, password } = user;
    const [errorMessage, setErrorMessage] = useState(false);
    const [match, setmatch] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [message, setmessage] = useState('');

    // const handleClick = () => {
    //   navigate('/dashboard', { replace: true });
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };
    // const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    const url = new URL(window.location.href);
    // console.log(url, 'hello');
    const paraobject = {};
    url.searchParams.forEach(function (val, key) {
        if (key.startsWith('userId')) paraobject[key] = val;
    });
    url.searchParams.forEach(function (val1, key1) {
        if (key1.startsWith('token')) paraobject[key1] = val1;
    });
    const response = {
        userId: paraobject.userId,
        resettoken: paraobject.token,
        password: cpassword
    };
    // console.log(response, 'bottle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== cpassword) {
            setmatch(true);
        } else if (!passwordPattern.test(cpassword)) {
            console.log(
                'Password must contain at least 8 characters, including one uppercase letter, one numeric character, and one special character.'
            );
            setmatch(false);
            setErrorMessage(true);
        } else {
            try {
                setIsLoading(true);
                const result = await axios.post(
                    API.RESET_PASSWORD,
                    // '/user/reset-password',
                    { userId: paraobject.userId, resettoken: paraobject.token, password: cpassword },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if (result.status === 200) {
                    console.log(result.data);
                    setmatch(false);
                    setErrorMessage(false);
                    setSuccess(true);
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                }
            } catch (err) {
                console.log(err);
            }
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        name="password"
                        required
                        label="Password"
                        value={password}
                        onChange={handleChange}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        // error={error}
                        // helperText={error ? 'Please Enter the Password First' : ''}
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
                    <TextField
                        name="cpassword"
                        required
                        label="Confirm Password"
                        value={cpassword}
                        onChange={handleChange}
                        type={showPassword1 ? 'text' : 'password'}
                        autoComplete="new-password"
                        // error={error}
                        // helperText={error ? 'Please Enter the Password First' : ''}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword1(!showPassword1)} edge="end">
                                        {/* <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} /> */}
                                        <Iconify icon={showPassword1 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    {/* <TextField
                        name="cpassword"
                        autoComplete="new-password"
                        type={password}
                        required
                        // autoComplete="off"
                        label="Confirm Password"
                        value={cpassword}
                        onChange={handleChange}
                        // error={error}
                        // helperText={error ? 'Please Enter the Confirm Password' : ''}
                    /> */}
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
                            disabled={success}
                        >
                            Submit
                        </Button>
                    </AnimateButton>
                    {match ? (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            <AlertTitle>Password Not Matched</AlertTitle>
                            Password Error-<strong>Password and Confirm Password Not Matched</strong>
                        </Alert>
                    ) : errorMessage ? (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            <AlertTitle>Password Error</AlertTitle>
                            Error-
                            <strong>The password must contain at least 8 characters, including at least one letter and one number.</strong>
                        </Alert>
                    ) : success ? (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            <AlertTitle>Success</AlertTitle>
                            Success-
                            <strong>Password Changed Successfully.</strong>
                        </Alert>
                    ) : (
                        ''
                    )}
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

export default ResetPasswordurl;
