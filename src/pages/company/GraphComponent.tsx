import * as React from 'react';
import './GraphComponent.css';

import { useEffect } from 'react';
import { Graph } from '../../classes/dashboardClasses/graphClasses/Graph';
import { useState, useRef } from 'react';
import { setTimeout } from 'timers';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
import { DraggableProvided } from 'react-beautiful-dnd';
import { Button } from '@material-ui/core';

interface Props {
    graph: Graph;
    isEditModeOn: boolean;
    provided: DraggableProvided
    setAddGraphPopupOn(isAddGraphPopupOn: boolean): void;
    setEditingGraphIndex(index: number): void;
    index: number;
}

const GraphComponent = (props: Props, ref: React.Ref<HTMLDivElement>) => {

    const [graphData, setGraphData] = useState<{}[]>([]);
    const [graphApiType, setGraphApiType] = useState(props.graph.apiType);
    const [graphApiUrl, setGraphApiUrl] = useState('');
    const [graphInstance, setGraphInstance] = useState<Chart<keyof ChartTypeRegistry, {}[], unknown>>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    Chart.register(...registerables);

    const componentDidMount = async () => {
        await getGraphData();
        renderGraph();
    }

    useEffect(() => {
        componentDidMount();
    }, []);

    const getGraphData = (): Promise<void> => {
        //TODO: complete this
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                setGraphData(await props.graph.fetchGraphData());
                resolve();
            }, 2000);
        });
    }

    const renderGraph = (): void => {
        if (!canvasRef.current) return;
        //@ts-ignore // nothing will be null/undefined because this is in componentDidMount()
        const canvasContext: CanvasRenderingContext2D = canvasRef.current.getContext('2d');
        if (!graphInstance)
            setGraphInstance(props.graph.generateGraph(canvasContext, graphData));
    }

    const getIsApiUpdated = (): boolean => {
        return graphApiType !== props.graph.apiType || graphApiUrl !== props.graph.apiUrl;
    }

    const updateGraph = (): void => {
        if (!graphInstance || graphData.length <= 0) return;
        const isApiUpdated = getIsApiUpdated();
        if (isApiUpdated) {
            setGraphApiType(props.graph.apiType);
            setGraphApiUrl(props.graph.apiUrl);
        }
        props.graph.update(graphInstance, graphData, isApiUpdated);
    }

    const handleEditGraphClick = (): void => {
        props.setEditingGraphIndex(props.index);
        props.setAddGraphPopupOn(true);
    }

    return (
        <div className="graphCanvasContainer" ref={ref} {...props.provided.draggableProps}
            {...props.provided.dragHandleProps}>
            {props.isEditModeOn && <Button variant="outlined" size="small" color="primary"
                onClick={handleEditGraphClick}>
                Edit
            </Button>}
            <div className="graphSecondCanvasContainer">
                <canvas ref={canvasRef} />
            </div>
            {updateGraph()}
        </div>
    );
}

export default React.forwardRef(GraphComponent);