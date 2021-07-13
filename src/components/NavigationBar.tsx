import * as React from 'react';
import { useHistory } from 'react-router-dom';
import './NavigationBar.css'

const NavigationBar = () => {
    const history = useHistory();
    return (
        <nav>
            <h3 onClick={() => history.push('/')}>Easy Dashboard</h3>
        </nav>
    );
}

export default NavigationBar;