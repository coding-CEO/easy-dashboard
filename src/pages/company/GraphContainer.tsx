import * as React from 'react';
import './GraphContainer.css';

import { User } from '../../classes/dashboardClasses/User';
import { Graph } from '../../classes/dashboardClasses/graphClasses/Graph';
import GraphComponent from './GraphComponent';

interface Props {
    user: User;
}

const GraphContainer = (props: Props) => {
    return (
        <div className="graphsContainer">
            {/* @ts-ignore // below dashboard is never undefined */}
            {props.user.dashboard.graphs.map((graph: Graph) => {
                return <GraphComponent graph={graph} />;
            })}
        </div>
    );
}

export default GraphContainer;