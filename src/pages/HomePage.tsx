import * as React from 'react';
import './HomePage.css';

const HomePage = () => {
    return (
        <div>
            <form action="#">
                <h2>Login</h2>
                <h4>Email: </h4>
                <input type="email" name="userEmail" required maxLength={50} />
                <h4>Password (optional): </h4>
                <input type="password" name="userPassword" maxLength={50} />
                <button>Submit</button>
            </form>
        </div>
    );
}

export default HomePage;