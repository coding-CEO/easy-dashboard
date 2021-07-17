import * as React from 'react';
import { useEffect } from 'react';

const Template = () => {

    const componentDidMount = async () => {

    }

    useEffect(() => {
        componentDidMount();
    }, []);

    return (
        <div>
            <h2>This is Template</h2>
        </div>
    );
}

export default Template;