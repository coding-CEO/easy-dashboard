import * as React from 'react';
import './GraphContainer.css';

import { User } from '../../classes/dashboardClasses/User';
import { Graph } from '../../classes/dashboardClasses/graphClasses/Graph';
import GraphComponent from './GraphComponent';
import CreateGraphDialogue from './CreateGraphDialogue';
import { GraphType } from '../../utils/enums';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
            console.log('new graph creating');
            props.addGraph(graph);
        } else {
            console.log('old graph editing');
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
            //TODO: handle drag drop logic
        }}>
            <Droppable droppableId="1">
                {(provided) => (
                    <div className="graphsContainer" {...provided.droppableProps} ref={provided.innerRef}>
                        {/* @ts-ignore // below dashboard is never undefined */}
                        {props.user.dashboard.graphs.map((graph: Graph, index: number) => {
                            return (
                                <Draggable key={graph.id} draggableId={graph.id} index={index}>
                                    {(provided) => (
                                        <GraphComponent graph={graph} isEditModeOn={props.isEditModeOn}
                                            setAddGraphPopupOn={props.setAddGraphPopupOn}
                                            setEditingGraphIndex={setEditingGraphIndex}
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