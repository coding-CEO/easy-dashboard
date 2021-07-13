import * as React from 'react';
import './GraphComponent.css';

import { useEffect } from 'react';
import { Graph } from '../../classes/dashboardClasses/graphClasses/Graph';

interface Props {
    graph: Graph;
}

const GraphComponent = (props: Props) => {

    const componentDidMount = async () => {

    }

    useEffect(() => {
        componentDidMount();
    }, []);

    return (
        <div>
            <h2>This is GraphComponent</h2>
        </div>
    );
}

export default GraphComponent;