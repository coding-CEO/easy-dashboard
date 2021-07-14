import * as React from 'react';
import './GraphContainer.css';

import { User } from '../../classes/dashboardClasses/User';
import { Graph } from '../../classes/dashboardClasses/graphClasses/Graph';
import GraphComponent from './GraphComponent';
import CreateGraphDialogue from './CreateGraphDialogue';
import { GraphType } from '../../utils/enums';
import { useState } from 'react';

interface Props {
    user: User;
    isEditModeOn: boolean;
    isAddGraphPopupOn: boolean;
    setAddGraphPopupOn(isAddGraphPopupOn: boolean): void;
    addGraph(graph: Graph, index?: number): void;
}

const GraphContainer = (props: Props) => {

    const [editingGraphIndex, setEditingGraphIndex] = useState(-1);

    const fakeId = '-1';

    const handleGraphAdd = (graph?: Graph, graphType?: GraphType): void => {
        props.setAddGraphPopupOn(false);
        let index = editingGraphIndex;
        setEditingGraphIndex(-1);
        if (!graph || graphType === undefined) return;
        if (graph.id === fakeId) {
            props.addGraph(graph);
        } else {
            props.addGraph(graph, index);
        }
    }

    const getEditingGraph = (): Graph | undefined => {
        /* @ts-ignore // below dashboard is never undefined */
        if (editingGraphIndex < 0 || editingGraphIndex >= props.user.dashboard.graphs.length) return undefined;
        /* @ts-ignore // below dashboard is never undefined */
        return props.user.dashboard.graphs[editingGraphIndex];
    }

    return (
        <div className="graphsContainer">
            {/* @ts-ignore // below dashboard is never undefined */}
            {props.user.dashboard.graphs.map((graph: Graph, index: number) => {
                return <GraphComponent key={graph.id} graph={graph} isEditModeOn={props.isEditModeOn}
                    setAddGraphPopupOn={props.setAddGraphPopupOn} setEditingGraphIndex={setEditingGraphIndex} />;
            })}
            <CreateGraphDialogue open={props.isAddGraphPopupOn} fakeId={fakeId}
                graph={getEditingGraph()} onClose={handleGraphAdd} />
        </div>
    );
}

export default GraphContainer;