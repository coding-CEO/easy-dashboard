import * as React from 'react';
import './GraphContainer.css';

import { User } from '../../classes/dashboardClasses/User';
import { Graph } from '../../classes/dashboardClasses/graphClasses/Graph';
import GraphComponent from './GraphComponent';
import CreateGraphDialogue from './CreateGraphDialogue';
import { GraphType } from '../../utils/enums';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BackendLocal } from '../../backendLocal/backendLocal';

interface Props {
    user: User;
    companyId: string;
    isEditModeOn: boolean;
    isAddGraphPopupOn: boolean;
    setAddGraphPopupOn(isAddGraphPopupOn: boolean): void;
    addGraph(graph: Graph, index?: number): void;
    deleteGraph(index: number): void;
    setUser(user: User): void;
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
        if (editingGraphIndex < 0 || editingGraphIndex >= props.user.dashboard.graphs.length)
            return undefined;
        /* @ts-ignore // below dashboard is never undefined */
        return props.user.dashboard.graphs[editingGraphIndex];
    }

    return (
        <DragDropContext onDragEnd={(arg) => {
            if (!arg.destination) return;
            if (!props.user.dashboard) return;
            let srcId = props.user.dashboard.graphSequence[arg.source.index];
            props.user.dashboard.graphSequence.splice(arg.source.index, 1);
            props.user.dashboard.graphSequence.splice(arg.destination.index, 0, srcId);
            BackendLocal.moveGraphs(props.companyId, props.user.dashboard.graphSequence);
            props.user.dashboard.sortGraphs();
            props.setUser(props.user);
        }}>
            <Droppable droppableId="1">
                {(provided) => (
                    <div className="graphsContainer" {...provided.droppableProps} ref={provided.innerRef}>
                        {/* @ts-ignore // below dashboard is never undefined */}
                        {props.user.dashboard.graphs.map((graph: Graph, index: number) => {
                            return (
                                <Draggable key={graph.id} draggableId={graph.id} index={index}
                                    isDragDisabled={!props.isEditModeOn}>
                                    {(provided) => (
                                        <GraphComponent graph={graph} isEditModeOn={props.isEditModeOn}
                                            setAddGraphPopupOn={props.setAddGraphPopupOn}
                                            setEditingGraphIndex={setEditingGraphIndex}
                                            deleteGraph={props.deleteGraph}
                                            ref={provided.innerRef} provided={provided} index={index} />
                                    )}
                                </Draggable>
                            );
                        })}
                        <CreateGraphDialogue open={props.isAddGraphPopupOn} fakeId={fakeId}
                            graph={getEditingGraph()} onClose={handleGraphAdd} />
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default GraphContainer;