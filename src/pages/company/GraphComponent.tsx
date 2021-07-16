import * as React from 'react';
import './GraphComponent.css';

import { useEffect } from 'react';
import { Graph } from '../../classes/dashboardClasses/graphClasses/Graph';
import { useState, useRef } from 'react';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
import { DraggableProvided } from 'react-beautiful-dnd';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AlertDialogue from '../../components/AlertDialogue';

interface Props {
    graph: Graph;
    isEditModeOn: boolean;
    provided: DraggableProvided
    setAddGraphPopupOn(isAddGraphPopupOn: boolean): void;
    setEditingGraphIndex(index: number): void;
    deleteGraph(index: number): void;
    index: number;
}

const GraphComponent = (props: Props, ref: React.Ref<HTMLDivElement>) => {

    const [graphData, setGraphData] = useState<{}[]>([]);
    const [graphApiType, setGraphApiType] = useState(props.graph.apiType);
    const [graphApiUrl, setGraphApiUrl] = useState(props.graph.apiUrl);
    const [graphXCoordinate, setGraphXCoordinate] = useState(props.graph.xCoordinatePath);
    const [graphYCoordinate, setGraphYCoordinate] = useState(props.graph.yCoordinatePath);
    const [graphInstance, setGraphInstance] = useState<Chart<keyof ChartTypeRegistry, {}[], unknown>>();
    const [isDeleteDialogueOpen, setDeleteDialogueOpen] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    Chart.register(...registerables);

    const componentDidMount = async () => {
        renderGraph();
        await getGraphData();
    }

    useEffect(() => {
        componentDidMount();
    }, []);

    const getGraphData = async (): Promise<void> => {
        setGraphData(await props.graph.fetchGraphData(props.graph.apiUrl, props.graph.apiType));
    }

    const renderGraph = (): void => {
        if (!canvasRef.current) return;
        //@ts-ignore // nothing will be null/undefined because this is in componentDidMount()
        const canvasContext: CanvasRenderingContext2D = canvasRef.current.getContext('2d');
        if (!graphInstance)
            setGraphInstance(props.graph.generateGraph(canvasContext, graphData));
    }

    const getIsApiUpdated = (): boolean => {
        return graphApiType !== props.graph.apiType || graphApiUrl !== props.graph.apiUrl ||
            graphXCoordinate !== props.graph.xCoordinatePath || graphYCoordinate !== props.graph.yCoordinatePath;
    }

    const updateGraph = (): void => {
        if (!graphInstance || graphData.length <= 0) return;
        const isApiUpdated = getIsApiUpdated();
        if (isApiUpdated) {
            setGraphApiType(props.graph.apiType);
            setGraphApiUrl(props.graph.apiUrl);
            setGraphXCoordinate(props.graph.xCoordinatePath);
            setGraphYCoordinate(props.graph.yCoordinatePath);
        }
        props.graph.update(props.graph, graphInstance, graphData, isApiUpdated);
    }

    const handleEditGraphClick = (): void => {
        props.setEditingGraphIndex(props.index);
        props.setAddGraphPopupOn(true);
    }

    const handleGraphDelete = (isSuccess: boolean): void => {
        handleGraphDeleteClick();
        if (isSuccess)
            props.deleteGraph(props.index);
    }

    const handleGraphDeleteClick = (): void => {
        setDeleteDialogueOpen(!isDeleteDialogueOpen);
    }

    const getEditControls = (): JSX.Element => {
        return (
            <div className="graphEditControlsContainer">
                <IconButton aria-label="edit" color="primary"
                    onClick={handleEditGraphClick}>
                    <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" color="primary" onClick={handleGraphDeleteClick}>
                    <DeleteIcon />
                </IconButton>
                <AlertDialogue open={isDeleteDialogueOpen} title={"Want to Delete this Graph ?"}
                    onClose={handleGraphDelete} />
            </div>
        );
    }

    return (
        <div className="graphCanvasContainer" ref={ref} {...props.provided.draggableProps}
            {...props.provided.dragHandleProps}>
            {props.isEditModeOn && getEditControls()}
            <div className="graphSecondCanvasContainer">
                <canvas ref={canvasRef} />
            </div>
            {updateGraph()}
        </div>
    );
}

export default React.forwardRef(GraphComponent);