import * as React from 'react';
import './GraphComponent.css';

import { useEffect } from 'react';
import { Graph } from '../../classes/dashboardClasses/graphClasses/Graph';
import { useState, useRef } from 'react';
import { setTimeout } from 'timers';
import { Chart, registerables } from 'chart.js';

interface Props {
    graph: Graph;
    isEditModeOn: boolean;
}

const GraphComponent = (props: Props) => {

    const [graphData, setGraphData] = useState<{}[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    Chart.register(...registerables);

    const componentDidMount = async () => {
        await getGraphData();
    }

    useEffect(() => {
        componentDidMount();
    }, []);

    const getGraphData = (): Promise<void> => {
        //TODO: complete this
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setGraphData([{ xco: '5', yco: 5 }, { xco: '8', yco: 8 }, { xco: '9', yco: 9 },
                { xco: '15', yco: 15 }]);
                resolve();
            }, 2000);
        });
    }

    const renderGraph = (): void => {
        if (!canvasRef.current) return;
        const canvasContext: CanvasRenderingContext2D | null = canvasRef.current.getContext('2d');
        props.graph.generateGraph(canvasContext, graphData);
    }

    return (
        <div className="graphCanvasContainer">
            <canvas id={props.graph.id} ref={canvasRef} />
            {graphData && renderGraph()}
        </div>
    );
}

export default GraphComponent;