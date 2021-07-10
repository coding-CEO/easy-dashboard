import * as React from 'react';
import loadingImg from '../static/images/loading_icon.gif';
import './LoadingPage.css';

const LoadingPage = () => {
    return (
        <div id="loadingDiv">
            <img src={loadingImg} alt="Loading" />
        </div>
    );
}

export default LoadingPage;