import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
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

    const handleClose = (isSubmit: boolean) => {
        let DashName = dashboardName.trim();
        setError(false);
        setErrorText("");
        setDashboardName("");

        if (DashName.length > 0 && isSubmit)
            props.onClose(DashName);
        else
            props.onClose();
    }

    return (
        <Dialog onClose={() => handleClose(false)} aria-labelledby="simple-dialog-title" open={props.open}>
            <DialogTitle id="simple-dialog-title">Create Your Dashboard</DialogTitle>
            <DialogContent>
                <TextField className="input" label="Dashboard Name" variant="outlined"
                    style={{ marginBottom: '15px' }} type="text" onChange={(input) => {
                        setDashboardName(input.target.value);
                        setError(false);
                        setErrorText('');
                    }} required error={error} helperText={errorText} fullWidth />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)}>
                    Cancel
                </Button>
                <Button type="submit" onClick={() => {
                    if (dashboardName.length <= 0) {
                        setError(true);
                        setErrorText("Please Enter a Name");
                        return;
                    }
                    handleClose(true);
                }} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateDashboardDialogue;