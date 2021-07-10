import * as React from 'react';
import { TextField, Button } from '@material-ui/core';
import './HomePage.css';
import { GuestUser } from '../classes/GuestUser';
import { useState } from 'react';

interface Props {
    setGuestUser(guestUser: GuestUser): void;
}

const HomePage = (props: Props) => {

    const [emailField, setEmailField] = useState("");

    const handleLogin = (e: any) => {
        e.preventDefault();
        props.setGuestUser(new GuestUser(emailField));
    }

    return (
        <div id="LoginContainer">
            <form onSubmit={handleLogin}>
                <h2>Login</h2>
                <TextField className="input" label="Email" variant="outlined"
                    type="email" onChange={(input) => {
                        setEmailField(input.target.value);
                    }} required />
                <TextField className="input" label="Password (optional)" variant="outlined"
                    type="password" />
                <Button variant="contained" color="primary" type="submit">LogIn</Button>
            </form>
        </div>
    );
}

export default HomePage;