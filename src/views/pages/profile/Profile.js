// // material-ui
// import { Box, Button, FormHelperText, Input, InputLabel, Modal, Stack, TextField, Typography } from '@mui/material';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import { HiUser } from 'react-icons/hi';
// import './index.css';
// import AnimateButton from 'ui-component/extended/AnimateButton';
// import FirstnameIcon from './FirstnameIcon';
// import { useState } from 'react';
// import React from 'react';
// import image from '../../../assets/images/user.png';
// import ChangePassword from './ChangePassword';
// import axios from 'axios';
// import { useEffect } from 'react';
// import { width } from '@mui/system';
// import Message from '../Snackbar/Toaster';
// import { API } from 'Constants/API';
// import { useNavigate } from 'react-router';

// // ==============================|| SAMPLE PAGE ||============================== //

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 600,
//     bgcolor: 'background.paper',
//     // border: '2px solid #000',
//     boxShadow: 24,
//     p: 4
// };

// const Profile = ({ Open }) => {
//     const [open, setOpen] = React.useState(false);
//     // const [data, setdata] = useState([]);
//     const [errors, setErrors] = useState({
//         first_name: false,
//         middle_name: false,
//         last_name: false,
//         address: false,
//         mobile: false,
//         mobileNotvalid: false
//     });

//     const [user, setUser] = useState({
//         first_name: '',
//         middle_name: '',
//         last_name: '',
//         email: '',
//         mobile: '',
//         address: '',
//         Designation: '',
//         EmployeeID: ''
//     });

//     const { first_name, email, middle_name, last_name, mobile, address, Designation, EmployeeID } = user;

//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: ''
//     });

//     // const handleOpen = () => setOpen(true);
//     // const handleClose = () => setOpen(false);
//     const navigate = useNavigate();

//     const handleCloseSnackbar = () => {
//         setSnackbar({
//             open: false,
//             message: ''
//         });
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUser({ ...user, [name]: value });
//         // setErrors({ first_name: false, middle_name: false, last_name: false, address: false, mobile: false, mobileNotvalid: false });
//     };
//     console.log(user);

//     const token = localStorage.getItem('Token');
//     const userId = localStorage.getItem('userId');

//     const hello = async () => {
//         const URL = API.PROFILE;
//         await axios
//             .post(
//                 URL,
//                 // '/user/get-user-info',
//                 { userId },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             )
//             .then((res) => {
//                 // console.log(res.data.data.jsonsend);
//                 const data = res.data.data.users;
//                 // setdata(data);

//                 // localStorage.setItem('roleId', data.roleId);
//                 localStorage.setItem('designation', data.Designation);
//                 setUser({
//                     first_name: data.first_name,
//                     middle_name: data.middle_name,
//                     last_name: data.last_name,
//                     email: data.email,
//                     mobile: data.mobile,
//                     address: data.address,
//                     Designation: data.desgnation_name,
//                     // EmployeeID: data.EmployeeID
//                     EmployeeID: data.emp_id
//                 });
//             })
//             .catch((err) => {
//                 console.log(err);
//                 if (err.response.status === 401) {
//                     localStorage.clear();
//                     navigate('/login');
//                 }
//             });
//     };

//     const mobileNumberRegex = /^[0-9]{10}$/;
//     // const mobileNumberRegex = /^[^e\d]{10}$/;

//     const handleSubmit = async (e) => {
//         const URL = API.EDIT_PROFILE;
//         const emp_id = EmployeeID;
//         e.preventDefault();
//         if (!first_name) {
//             setErrors({ first_name: true });
//         }
//         //  else if (!middle_name) {
//         //     setErrors({ middle_name: true });
//         // }
//         else if (!last_name) {
//             setErrors({ last_name: true });
//         } else if (!mobile) {
//             setErrors({ mobile: true });
//         } else if (!mobileNumberRegex.test(mobile)) {
//             setErrors({ mobileNotvalid: true });
//         }
//         //  else if (!address) {
//         //     setErrors({ address: true });
//         // }
//         else {
//             try {
//                 const result = await axios.post(
//                     URL,
//                     // '/user/edit-profile',
//                     { userId, first_name, middle_name, last_name, address, mobile, emp_id, Designation },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     }
//                 );

//                 if (result.status === 200) {
//                     // console.log(result.data.data.msg, 'helllsl');
//                     // setOpen(false);
//                     // hello();
//                     setSnackbar({
//                         open: true,
//                         message: result.data.data.msg
//                     });
//                     setErrors({
//                         first_name: false,
//                         middle_name: false,
//                         last_name: false,
//                         address: false,
//                         mobile: false,
//                         mobileNotvalid: false
//                     });
//                 }
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     };

//     useEffect(() => {
//         hello();
//     }, []);

//     return (
//         <MainCard title="Profile">
//             <div>
//                 <form onSubmit={handleSubmit}>
//                     <Stack spacing={3}>
//                         <div className="idanddesignation">
//                             <TextField
//                                 className="designation"
//                                 style={{ marginTop: '15px' }}
//                                 name="first_name"
//                                 autoComplete="off"
//                                 label="First Name *"
//                                 value={first_name}
//                                 onChange={handleChange}
//                                 error={errors.first_name}
//                                 helperText={errors.first_name && 'Please enter the First Name'}
//                             />
//                             <TextField
//                                 className="designation"
//                                 style={{ marginTop: '15px' }}
//                                 name="middle_name"
//                                 autoComplete="off"
//                                 label="Middle Name"
//                                 value={middle_name}
//                                 onChange={handleChange}
//                                 error={errors.middle_name}
//                                 helperText={errors.middle_name && 'Please enter the Middle Name'}
//                             />
//                         </div>
//                         <div className="idanddesignation">
//                             <TextField
//                                 className="designation"
//                                 style={{ marginTop: '15px' }}
//                                 name="last_name"
//                                 autoComplete="off"
//                                 label="Last Name *"
//                                 value={last_name}
//                                 onChange={handleChange}
//                                 error={errors.last_name}
//                                 helperText={errors.last_name && 'Please enter the Last Name'}
//                             />
//                             <TextField
//                                 className="designation"
//                                 type="number"
//                                 inputProps={{
//                                     inputMode: 'numeric',
//                                     pattern: '[0-9]*'
//                                     // maxLength: 10 // restrict input to 10 digits
//                                     // max: 100
//                                 }}
//                                 style={{ marginTop: '15px' }}
//                                 name="mobile"
//                                 autoComplete="off"
//                                 label="Mobile Number *"
//                                 value={mobile}
//                                 onChange={handleChange}
//                                 error={errors.mobile || errors.mobileNotvalid}
//                                 helperText={
//                                     (errors.mobile && 'Please enter the Mobile Number') ||
//                                     (errors.mobileNotvalid && 'Please enter the valid mobile number')
//                                 }
//                                 onKeyDown={(event) => {
//                                     if (event.keyCode === 69) {
//                                         event.preventDefault();
//                                     }
//                                 }}
//                             />
//                         </div>
//                         <TextField
//                             style={{ marginBottom: '15px' }}
//                             disabled
//                             name="email"
//                             autoComplete="off"
//                             label="Email ID"
//                             value={email}
//                             onChange={handleChange}
//                             // error={error}
//                             // helperText={error ? 'Please enter the Email First' : ''}
//                         />
//                         <div className="idanddesignation">
//                             <TextField
//                                 className="designation"
//                                 style={{ marginBottom: '15px' }}
//                                 name="EmployeeID"
//                                 autoComplete="off"
//                                 label="Employee ID"
//                                 value={EmployeeID}
//                                 onChange={handleChange}
//                                 disabled
//                                 // error={error}
//                                 // helperText={error ? 'Please enter the Email First' : ''}
//                             />
//                             <TextField
//                                 className="designation"
//                                 style={{ marginBottom: '15px' }}
//                                 name="Designation"
//                                 autoComplete="off"
//                                 label="Designation"
//                                 value={Designation}
//                                 disabled
//                                 // value={
//                                 //     data.roleId === 5
//                                 //         ? 'Employee'
//                                 //         : data.roleId === 1
//                                 //         ? 'Project Manager'
//                                 //         : data.roleId === 2
//                                 //         ? 'Quality Assurance'
//                                 //         : data.roleId === 3
//                                 //         ? 'Admin'
//                                 //         : 'Hello'
//                                 // }
//                                 onChange={handleChange}
//                                 // error={error}
//                                 // helperText={error ? 'Please enter the Email First' : ''}
//                             />
//                         </div>
//                         <TextField
//                             style={{ marginBottom: '15px' }}
//                             name="address"
//                             autoComplete="off"
//                             label="Address"
//                             value={address}
//                             onChange={handleChange}
//                             error={errors.address}
//                             helperText={errors.address && 'Please enter the Address'}
//                         />
//                     </Stack>

//                     <Box sx={{ mt: 2 }} className="popup_scrum changepassandSubmit">
//                         <AnimateButton>
//                             <Button size="large" type="submit" variant="contained" color="secondary">
//                                 Submit
//                             </Button>
//                         </AnimateButton>
//                     </Box>
//                 </form>
//                 <div className="usePass">
//                     <Box
//                         sx={{ mt: 2, ml: 0 }}
//                         className="ChangePassword"
//                         // style={{ position: 'absolute', right: 0, left: '81%' }}
//                     >
//                         <AnimateButton>
//                             <ChangePassword />
//                         </AnimateButton>
//                     </Box>
//                 </div>
//             </div>

//             {/* <Typography variant="body2">
//             Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa.
//         </Typography> */}
//             <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
//         </MainCard>
//     );
// };

// export default Profile;

// // material-ui
// import {
//     Box,
//     Button,
//     FormControl,
//     FormHelperText,
//     Input,
//     InputLabel,
//     MenuItem,
//     Modal,
//     Select,
//     Stack,
//     TextField,
//     Typography
// } from '@mui/material';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import { HiUser } from 'react-icons/hi';
// import './index.css';
// import AnimateButton from 'ui-component/extended/AnimateButton';
// import FirstnameIcon from './FirstnameIcon';
// import { useState } from 'react';
// import React from 'react';
// import image from '../../../assets/images/user.png';
// import ChangePassword from './ChangePassword';
// import axios from 'axios';
// import { useEffect } from 'react';
// import { width } from '@mui/system';
// import Message from '../Snackbar/Toaster';
// import { API } from 'Constants/API';
// import { useNavigate } from 'react-router';

// // ==============================|| SAMPLE PAGE ||============================== //

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 600,
//     bgcolor: 'background.paper',
//     // border: '2px solid #000',
//     boxShadow: 24,
//     p: 4
// };

// const Profile = ({ Open }) => {
//     const [open, setOpen] = React.useState(false);
//     // const [data, setdata] = useState([]);
//     const [errors, setErrors] = useState({
//         first_name: false,
//         middle_name: false,
//         last_name: false,
//         address: false,
//         mobile: false,
//         mobileNotvalid: false
//     });

//     const [user, setUser] = useState({
//         first_name: '',
//         middle_name: '',
//         last_name: '',
//         email: '',
//         mobile: '',
//         address: '',
//         Designation: '',
//         EmployeeID: '',
//         date_of_birth: '',
//         maritalStatus: '',
//         anniversary: ''
//     });

//     const {
//         first_name,
//         email,
//         middle_name,
//         last_name,
//         mobile,
//         address,
//         Designation,
//         EmployeeID,
//         date_of_birth,
//         maritalStatus,
//         anniversary
//     } = user;
//     const [selectedOption, setSelectedOption] = useState('');

//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: ''
//     });

//     const navigate = useNavigate();

//     const handleCloseSnackbar = () => {
//         setSnackbar({
//             open: false,
//             message: ''
//         });
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUser({ ...user, [name]: value });
//         // setErrors({ first_name: false, middle_name: false, last_name: false, address: false, mobile: false, mobileNotvalid: false });
//     };
//     console.log(user);

//     const token = localStorage.getItem('Token');
//     const userId = localStorage.getItem('userId');

//     const SelecthandleChange = (e) => {
//         console.log(e);
//         setSelectedOption(e.target.value);
//     };

//     const hello = async () => {
//         const URL = API.PROFILE;
//         await axios
//             .post(
//                 URL,
//                 // '/user/get-user-info',
//                 { userId },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             )
//             .then((res) => {
//                 // console.log(res.data.data.jsonsend);
//                 const data = res.data.data.users;
//                 // setdata(data);

//                 // localStorage.setItem('roleId', data.roleId);
//                 localStorage.setItem('designation', data.Designation);
//                 setUser({
//                     first_name: data.first_name,
//                     middle_name: data.middle_name,
//                     last_name: data.last_name,
//                     email: data.email,
//                     mobile: data.mobile,
//                     address: data.address,
//                     Designation: data.desgnation_name,
//                     // EmployeeID: data.EmployeeID
//                     EmployeeID: data.emp_id,
//                     date_of_birth: data.date_of_birth,
//                     maritalStatus: data.marital_status,
//                     anniversary: data.anniversary_date
//                 });
//             })
//             .catch((err) => {
//                 console.log(err);
//                 if (err.response.status === 401) {
//                     localStorage.clear();
//                     navigate('/login');
//                 }
//             });
//     };

//     const mobileNumberRegex = /^[0-9]{10}$/;

//     const handleSubmit = async (e) => {
//         const URL = API.EDIT_PROFILE;
//         const emp_id = EmployeeID;
//         e.preventDefault();
//         if (!first_name) {
//             setErrors({ first_name: true });
//         } else if (!last_name) {
//             setErrors({ last_name: true });
//         } else if (!mobile) {
//             setErrors({ mobile: true });
//         } else if (!mobileNumberRegex.test(mobile)) {
//             setErrors({ mobileNotvalid: true });
//         } else {
//             try {
//                 const result = await axios.post(
//                     URL,
//                     { userId, first_name, middle_name, last_name, address, mobile, emp_id, Designation },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     }
//                 );

//                 if (result.status === 200) {
//                     setSnackbar({
//                         open: true,
//                         message: result.data.data.msg
//                     });
//                     setErrors({
//                         first_name: false,
//                         middle_name: false,
//                         last_name: false,
//                         address: false,
//                         mobile: false,
//                         mobileNotvalid: false
//                     });
//                 }
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     };

//     useEffect(() => {
//         hello();
//     }, []);

//     return (
//         <MainCard title="Profile">
//             <div>
//                 <form onSubmit={handleSubmit}>
//                     <Stack spacing={3}>
//                         <div className="idanddesignation">
//                             <TextField
//                                 className="designation"
//                                 style={{ marginTop: '15px' }}
//                                 name="first_name"
//                                 autoComplete="off"
//                                 label="First Name *"
//                                 value={first_name}
//                                 onChange={handleChange}
//                                 error={errors.first_name}
//                                 helperText={errors.first_name && 'Please enter the First Name'}
//                             />
//                             <TextField
//                                 className="designation"
//                                 style={{ marginTop: '15px' }}
//                                 name="middle_name"
//                                 autoComplete="off"
//                                 label="Middle Name"
//                                 value={middle_name}
//                                 onChange={handleChange}
//                                 error={errors.middle_name}
//                                 helperText={errors.middle_name && 'Please enter the Middle Name'}
//                             />
//                         </div>
//                         <div className="idanddesignation">
//                             <TextField
//                                 className="designation"
//                                 style={{ marginTop: '15px' }}
//                                 name="last_name"
//                                 autoComplete="off"
//                                 label="Last Name *"
//                                 value={last_name}
//                                 onChange={handleChange}
//                                 error={errors.last_name}
//                                 helperText={errors.last_name && 'Please enter the Last Name'}
//                             />
//                             <TextField
//                                 className="designation"
//                                 type="number"
//                                 inputProps={{
//                                     inputMode: 'numeric',
//                                     pattern: '[0-9]*'
//                                 }}
//                                 style={{ marginTop: '15px' }}
//                                 name="mobile"
//                                 autoComplete="off"
//                                 label="Mobile Number *"
//                                 value={mobile}
//                                 onChange={handleChange}
//                                 error={errors.mobile || errors.mobileNotvalid}
//                                 helperText={
//                                     (errors.mobile && 'Please enter the Mobile Number') ||
//                                     (errors.mobileNotvalid && 'Please enter a valid mobile number')
//                                 }
//                                 onKeyDown={(event) => {
//                                     if (event.keyCode === 69) {
//                                         event.preventDefault();
//                                     }
//                                 }}
//                             />
//                         </div>
//                         <TextField
//                             style={{ marginBottom: '15px' }}
//                             disabled
//                             name="email"
//                             autoComplete="off"
//                             label="Email ID"
//                             value={email}
//                             onChange={handleChange}
//                         />
//                         <div className="idanddesignation">
//                             <TextField
//                                 className="designation"
//                                 style={{ marginBottom: '15px' }}
//                                 name="EmployeeID"
//                                 autoComplete="off"
//                                 label="Employee ID"
//                                 value={EmployeeID}
//                                 onChange={handleChange}
//                                 disabled
//                             />
//                             <TextField
//                                 className="designation"
//                                 style={{ marginBottom: '15px' }}
//                                 name="Designation"
//                                 autoComplete="off"
//                                 label="Designation"
//                                 value={Designation}
//                                 disabled
//                             />
//                         </div>
//                         <TextField
//                             style={{ marginBottom: '15px' }}
//                             name="address"
//                             autoComplete="off"
//                             label="Address"
//                             value={address}
//                             onChange={handleChange}
//                             error={errors.address}
//                             helperText={errors.address && 'Please enter the Address'}
//                         />
//                         <TextField
//                             style={{ marginBottom: '15px' }}
//                             name="date_of_birth"
//                             autoComplete="off"
//                             label="Date of Birth"
//                             type="date"
//                             value={date_of_birth}
//                             onChange={handleChange}
//                             InputLabelProps={{
//                                 shrink: true
//                             }}
//                         />
//                         <div className="idanddesignation">
//                             {console.log(selectedOption, 'hello amit')}
//                             <FormControl style={{ width: '50%' }}>
//                                 <Select
//                                     id="select-label"
//                                     labelId="select-label"
//                                     value={selectedOption}
//                                     // value={maritalStatus}
//                                     onChange={SelecthandleChange}
//                                     // error={error.reasons}
//                                     displayEmpty
//                                     // onClick={LeaveTypes}
//                                 >
//                                     <MenuItem value="" disabled>
//                                         <span>Select Marital Status Type</span>
//                                     </MenuItem>
//                                     <MenuItem value={'Married'}>Married</MenuItem>
//                                     <MenuItem value={'Unmarried'}>Unmarried</MenuItem>
//                                 </Select>
//                                 {/* <FormHelperText style={{ color: 'red' }}>
//                                     {reasonErrors.leaveTypes && 'Please select the reason first'}
//                                 </FormHelperText> */}
//                             </FormControl>
//                             {selectedOption === 'Married' ? (
//                                 <TextField
//                                     className="designation"
//                                     style={{ marginBottom: '15px' }}
//                                     name="anniversary"
//                                     autoComplete="off"
//                                     label="Anniversary"
//                                     type="date"
//                                     value={anniversary}
//                                     onChange={handleChange}
//                                     InputLabelProps={{
//                                         shrink: true
//                                     }}
//                                 />
//                             ) : (
//                                 <TextField
//                                     disabled
//                                     className="designation"
//                                     style={{ marginBottom: '15px' }}
//                                     name="anniversary"
//                                     autoComplete="off"
//                                     label="Anniversary"
//                                     type="date"
//                                     value={anniversary}
//                                     onChange={handleChange}
//                                     InputLabelProps={{
//                                         shrink: true
//                                     }}
//                                 />
//                             )}
//                         </div>
//                     </Stack>

//                     <Box sx={{ mt: 2 }} className="popup_scrum changepassandSubmit">
//                         <AnimateButton>
//                             <Button size="large" type="submit" variant="contained" color="secondary">
//                                 Submit
//                             </Button>
//                         </AnimateButton>
//                     </Box>
//                 </form>
//                 <div className="usePass">
//                     <Box sx={{ mt: 2, ml: 0 }} className="ChangePassword">
//                         <AnimateButton>
//                             <ChangePassword />
//                         </AnimateButton>
//                     </Box>
//                 </div>
//             </div>

//             <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
//         </MainCard>
//     );
// };

// export default Profile;
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import ChangePassword from './ChangePassword';
import axios from 'axios';
import Message from '../Snackbar/Toaster';
import { API } from 'Constants/API';
import { useNavigate } from 'react-router';
import { MENU_OPEN } from 'store/actions';
import { useDispatch } from 'react-redux';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
};

const Profile = () => {
    const [errors, setErrors] = useState({
        first_name: false,
        middle_name: false,
        last_name: false,
        address: false,
        mobile: false,
        mobileNotvalid: false,
        date_of_birth: false,
        anniversary: false,
        marital_status: false
    });

    const [user, setUser] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        mobile: '',
        address: '',
        Designation: '',
        EmployeeID: '',
        date_of_birth: '',
        // maritalStatus: '',
        anniversary: ''
    });

    const {
        first_name,
        email,
        middle_name,
        last_name,
        mobile,
        address,
        Designation,
        EmployeeID,
        date_of_birth,
        // maritalStatus,
        anniversary
    } = user;

    const [selectedOption, setSelectedOption] = useState('');
    console.log(selectedOption);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const navigate = useNavigate();
    const token = localStorage.getItem('Token');
    const userId = localStorage.getItem('userId');

    const fetchData = async () => {
        try {
            const response = await axios.post(
                API.PROFILE,
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = response.data.data.users;
            // setSelectedOption('');
            if (data.marital_status === null) {
            } else {
                setSelectedOption(data.marital_status);
            }
            // setSnackbar({
            //     open: false,
            //     message: ''
            // });

            setUser({
                first_name: data.first_name,
                middle_name: data.middle_name,
                last_name: data.last_name,
                email: data.email,
                mobile: data.mobile,
                address: data.address,
                Designation: data.desgnation_name,
                EmployeeID: data.emp_id,
                date_of_birth: data.date_of_birth,
                // maritalStatus: data.marital_status,
                anniversary: data.anniversary_date
            });

            if (data.mobile === '' || data.mobile === null) {
                setSnackbar({
                    open: true,
                    message: 'Please add the mandatory field.',
                    severity: 'error'
                });
            } else if (data.address === '' || data.address === null) {
                setSnackbar({
                    open: true,
                    message: 'Please add the mandatory field.',
                    severity: 'error'
                });
            } else if (data.date_of_birth === '' || data.date_of_birth === null) {
                setSnackbar({
                    open: true,
                    message: 'Please add the mandatory field.',
                    severity: 'error'
                });
            } else if (data.marital_status === '' || data.marital_status === null) {
                setSnackbar({
                    open: true,
                    message: 'Please add the mandatory field.',
                    severity: 'error'
                });
            } else if ((data.marital_status === 1 && data.anniversary_date === '') || data.marital_status === null) {
                setSnackbar({
                    open: true,
                    message: 'Please add the mandatory field.',
                    severity: 'error'
                });
            }
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    const mobileNumberRegex = /^[0-9]{10}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!first_name) {
            setErrors({ first_name: true });
        } else if (!last_name) {
            setErrors({ last_name: true });
        } else if (!address) {
            setErrors({ address: true });
        } else if (!mobile) {
            setErrors({ mobile: true });
        } else if (!mobileNumberRegex.test(mobile)) {
            setErrors({ mobileNotvalid: true });
        } else if (!date_of_birth) {
            setErrors({ date_of_birth: true });
        } else if (selectedOption === '' || selectedOption === null) {
            setErrors({ marital_status: true });
        } else if (selectedOption === '1' && (anniversary === '' || anniversary === null)) {
            setErrors({ anniversary: true });
        } else {
            try {
                const response = await axios.post(
                    API.EDIT_PROFILE,
                    {
                        userId,
                        first_name,
                        middle_name,
                        last_name,
                        address,
                        mobile,
                        emp_id: EmployeeID,
                        Designation,
                        date_of_birth,
                        anniversary_date: anniversary,
                        marital_status: selectedOption
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    setSnackbar({
                        open: true,
                        message: response.data.data.msg
                    });
                    setErrors({
                        first_name: false,
                        middle_name: false,
                        last_name: false,
                        address: false,
                        mobile: false,
                        mobileNotvalid: false,
                        date_of_birth: false,
                        anniversary: false,
                        marital_status: false
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const SelecthandleChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false,
            message: ''
        });
    };
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: MENU_OPEN, id: '' });
        fetchData();
    }, []);

    return (
        <MainCard title="Profile">
            <div>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <div className="idanddesignation">
                            <TextField
                                className="designation"
                                style={{ marginTop: '15px' }}
                                name="first_name"
                                autoComplete="off"
                                label="First Name *"
                                value={first_name}
                                onChange={handleChange}
                                error={errors.first_name}
                                helperText={errors.first_name && 'Please enter the First Name'}
                            />
                            <TextField
                                className="designation"
                                style={{ marginTop: '15px' }}
                                name="middle_name"
                                autoComplete="off"
                                label="Middle Name"
                                value={middle_name}
                                onChange={handleChange}
                                error={errors.middle_name}
                                helperText={errors.middle_name && 'Please enter the Middle Name'}
                            />
                        </div>
                        <div className="idanddesignation">
                            <TextField
                                className="designation"
                                style={{ marginTop: '15px' }}
                                name="last_name"
                                autoComplete="off"
                                label="Last Name *"
                                value={last_name}
                                onChange={handleChange}
                                error={errors.last_name}
                                helperText={errors.last_name && 'Please enter the Last Name'}
                            />
                            <TextField
                                className="designation"
                                type="number"
                                inputProps={{
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*'
                                }}
                                style={{ marginTop: '15px' }}
                                name="mobile"
                                autoComplete="off"
                                label="Mobile Number *"
                                value={mobile}
                                onChange={handleChange}
                                error={errors.mobile || errors.mobileNotvalid}
                                helperText={
                                    (errors.mobile && 'Please enter the Mobile Number') ||
                                    (errors.mobileNotvalid && 'Please enter a valid mobile number')
                                }
                                onKeyDown={(event) => {
                                    if (event.keyCode === 69) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </div>
                        <TextField
                            style={{ marginBottom: '15px' }}
                            disabled
                            name="email"
                            autoComplete="off"
                            label="Email ID *"
                            value={email}
                            onChange={handleChange}
                        />
                        <div className="idanddesignation">
                            <TextField
                                className="designation"
                                style={{ marginBottom: '15px' }}
                                name="EmployeeID"
                                autoComplete="off"
                                label="Employee ID *"
                                value={EmployeeID}
                                onChange={handleChange}
                                disabled
                            />
                            <TextField
                                className="designation"
                                style={{ marginBottom: '15px' }}
                                name="Designation"
                                autoComplete="off"
                                label="Designation *"
                                value={Designation}
                                disabled
                            />
                        </div>
                        <div className="idanddesignation">
                            <TextField
                                className="designation"
                                style={{ marginBottom: '15px' }}
                                name="address"
                                autoComplete="off"
                                label="Address *"
                                value={address}
                                onChange={handleChange}
                                error={errors.address}
                                helperText={errors.address && 'Please enter the Address'}
                            />
                            <TextField
                                className="designation"
                                style={{ marginBottom: '15px' }}
                                name="date_of_birth"
                                autoComplete="off"
                                label="Date of Birth *"
                                type="date"
                                value={date_of_birth}
                                error={errors.date_of_birth}
                                helperText={errors.date_of_birth && 'Please enter the First Name'}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </div>
                        {console.log(selectedOption, 'selectedOption')}
                        <div className="idanddesignation">
                            <FormControl className="designation">
                                <Select
                                    id="select-label"
                                    labelId="select-label"
                                    // label="Select Marital Status Type *"
                                    value={selectedOption}
                                    onChange={SelecthandleChange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        <span>Select Marital Status Type *</span>
                                    </MenuItem>
                                    <MenuItem value="1">Married</MenuItem>
                                    <MenuItem value="0">Unmarried</MenuItem>
                                </Select>
                                <FormHelperText style={{ color: 'red' }}>
                                    {errors.marital_status && 'Please select the Marital Status first'}
                                </FormHelperText>
                            </FormControl>
                            {selectedOption === 1 || selectedOption === '1' ? (
                                <TextField
                                    className="designation"
                                    style={{ marginBottom: '15px' }}
                                    name="anniversary"
                                    autoComplete="off"
                                    label="Anniversary"
                                    type="date"
                                    value={anniversary}
                                    onChange={handleChange}
                                    error={errors.anniversary}
                                    helperText={selectedOption ? errors.anniversary && 'Please enter the anniversary date' : ''}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            ) : (
                                <TextField
                                    disabled
                                    className="designation"
                                    style={{ marginBottom: '15px' }}
                                    name="anniversary"
                                    autoComplete="off"
                                    label="Anniversary *"
                                    type="date"
                                    value={anniversary}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            )}
                        </div>
                    </Stack>

                    <Box sx={{ mt: 2 }} className="popup_scrum changepassandSubmit">
                        <Button size="large" type="submit" variant="contained" color="secondary">
                            Submit
                        </Button>
                    </Box>
                </form>
                <div className="usePass">
                    <Box sx={{ mt: 2, ml: 0 }} className="ChangePassword">
                        <ChangePassword />
                    </Box>
                </div>
            </div>

            <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
        </MainCard>
    );
};

export default Profile;
