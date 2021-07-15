import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';

interface Props {
    open: boolean;
    title: string;
    message?: string;
    onClose: (isSuccess: boolean) => void;
}

const AlertDialogue = (props: Props) => {

    return (
        <Dialog onClose={() => props.onClose(false)} aria-labelledby="simple-dialog-title" open={props.open}>
            <DialogTitle id="simple-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose(false)}>
                    Cancel
                </Button>
                <Button type="submit" onClick={() => props.onClose(true)} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialogue;