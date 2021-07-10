import * as React from 'react';
import { useState } from 'react';
import App from './App';
import LoadingPage from './pages/LoadingPage';

const Main = () => {
    const [isLoading, setLoading] = useState<Boolean>(true);
    const handleSetLoading = (currIsLoading: Boolean): void => {
        if (isLoading === currIsLoading) return;
        setLoading(currIsLoading);
    }
    return (
        <React.Fragment>
            {isLoading && <LoadingPage />}
            <App setLoading={handleSetLoading} />
        </React.Fragment>
    );
}

export default Main;