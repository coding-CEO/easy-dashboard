import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Button, DialogActions, DialogContent, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useState } from 'react';
import { Employee } from '../../classes/dashboardClasses/Employee';
import { Privilage } from '../../utils/enums';

interface Props {
    open: boolean;
    onClose: (employee?: Employee) => void;
}

const CreateEmployeeDialogue = (props: Props) => {

    const [employee, setEmployee] = useState<Employee>(new Employee("", Privilage.USER));
    const [privilage, setPrivilage] = useState<Privilage>(Privilage.USER);

    const handleClose = (isComplete?: boolean) => {
        let temp_employee = employee;
        setEmployee(new Employee("", Privilage.USER));
        setPrivilage(Privilage.USER);
        if (isComplete)
            props.onClose(temp_employee);
        else
            props.onClose();
    }

    const setPrivilageCustom = (newPrivialge: Privilage): void => {
        let temp_emp = employee;
        temp_emp.privilage = newPrivialge;
        setEmployee(temp_emp);
        setPrivilage(newPrivialge);
    }

    return (
        <Dialog onClose={() => handleClose(false)} aria-labelledby="simple-dialog-title" open={props.open}>
            <DialogTitle id="simple-dialog-title">Add Employee</DialogTitle>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleClose(true);
            }}>
                <DialogContent>
                    <TextField className="input" label="Employee Email" variant="outlined"
                        style={{ marginBottom: '15px' }} type="email" onChange={(input) => {
                            input.target.value = input.target.value.trim();
                            let temp_employee = employee;
                            temp_employee.email = input.target.value;
                            setEmployee(temp_employee);
                        }} required fullWidth />
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Privilage</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={privilage}
                            onChange={(input) => {
                                let val = Number(input.target.value);
                                switch (val) {
                                    case Privilage.ADMIN:
                                        setPrivilageCustom(Privilage.ADMIN);
                                        return;
                                    default:
                                        setPrivilageCustom(Privilage.USER);
                                        return;
                                }
                            }}
                            label="Privilage"
                        >
                            <MenuItem value={Privilage.ADMIN}>ADMIN</MenuItem>
                            <MenuItem value={Privilage.USER}>USER</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default CreateEmployeeDialogue;