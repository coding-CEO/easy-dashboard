import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, DialogActions, DialogContent } from '@material-ui/core';
import { useState } from 'react';

interface Props {
    open: boolean;
    onClose: (dashboardName?: string) => void;
}

const CreateDashboardDialogue = (props: Props) => {

    const [dashboardName, setDashboardName] = useState("");
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const handleClose = () => {
        let DashName = dashboardName;
        setError(false);
        setErrorText("");
        setDashboardName("");

        if (DashName.length > 0)
            props.onClose(DashName);
        else
            props.onClose();
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={props.open}>
            <DialogTitle id="simple-dialog-title">Create Your Dashboard</DialogTitle>
            <DialogContent>
                <TextField className="input" label="Dashboard Name" variant="outlined"
                    style={{ marginBottom: '15px' }} type="text" onChange={(input) => {
                        input.target.value = input.target.value.trim();
                        setDashboardName(input.target.value);
                        setError(false);
                        setErrorText('');
                    }} required error={error} helperText={errorText} fullWidth />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" onClick={() => {
                    if (dashboardName.length <= 0) {
                        setError(true);
                        setErrorText("Please Enter a Name");
                        return;
                    }
                    handleClose();
                }} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateDashboardDialogue;