import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Stack, TextField, Checkbox } from '@mui/material';
import { useState } from 'react';
import '../attendance/index.css';
import { formatDate } from 'function/FormatTime';

export default function ResponsiveDialog(props) {
    // const [open, setOpen] = props;
    const { open, setOpen } = props;

    // const [checked, setChecked] = useState(false);
    const { checked, setChecked } = props;

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                // onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{props.dialogTitle}</DialogTitle>
                <DialogContent style={{ paddingBottom: 0 }}>
                    <DialogContentText>{props.dialogContent}</DialogContentText>
                    <Stack spacing={3}>
                        <div className="duedate" style={{ display: props.display }}>
                            <div style={{ paddingTop: 15 }}>
                                <div style={{ marginBottom: checked ? '10px' : '0' }}>
                                    <Checkbox
                                        // {props.checkboxlabel}
                                        checked={props.checked}
                                        onChange={props.handleCheckboxChange}
                                        style={{ margin: 0, padding: 0, display: props.displaycheckbox }}
                                    />
                                    <span style={{ display: props.displaycheckbox }}>{props.checkboxlabel}</span>
                                </div>
                            </div>
                            <span style={{ display: checked ? 'block' : 'none', marginBottom: 8 }}>Expected Date</span>
                            <div style={{ marginBottom: 10, display: !checked ? 'none' : 'block' }}>
                                <input
                                    style={{ display: checked ? 'block' : 'none', width: '100%' }}
                                    type="date"
                                    id="start-date"
                                    defaultValue={props.date}
                                    max={formatDate(new Date())}
                                    value={props.startDate}
                                    onChange={props.handleCheckboxDate}
                                />
                                <span style={{ color: '#f44336', marginLeft: 10 }}>{props.dateError}</span>
                            </div>
                            <TextField
                                variant="outlined"
                                // multiline
                                // rows={4}
                                fullWidth
                                className="reasonField"
                                style={{ display: checked ? 'block' : 'none' }}
                                name={props.name}
                                autoComplete="off"
                                label={props.reasonlabel}
                                value={props.reasonvalue}
                                onChange={props.handleChangeReason}
                                error={props.DateReason}
                                helperText={props.datehelper}
                            />
                        </div>
                        <TextField
                            fullWidth
                            type="text"
                            style={{ margin: '15px 0', display: checked ? 'none' : 'block' }}
                            required
                            className="reasonField"
                            name={props.name}
                            autoComplete="off"
                            label={props.label}
                            value={props.value}
                            onChange={props.handleChange}
                            error={props.Reasonerror}
                            helperText={props.helpers}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions style={{ paddingBottom: 20, marginRight: 18 }}>
                    <Button variant="contained" color="secondary" onClick={props.agree}>
                        {props.agreeButtonText}
                    </Button>
                    <Button variant="contained" color="primary" onClick={props.disagree}>
                        {props.disagreeButtonText}
                    </Button>
                </DialogActions>
                {/* <span>{props.date}</span> */}
            </Dialog>
        </div>
    );
}
