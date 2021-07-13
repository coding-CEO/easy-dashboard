import * as React from 'react';
import './GraphComponent.css';

import { useEffect } from 'react';
import { Graph } from '../../classes/dashboardClasses/graphClasses/Graph';
import { useState, useRef } from 'react';
import { setTimeout } from 'timers';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';

interface Props {
    graph: Graph;
    isEditModeOn: boolean;
}

const GraphComponent = (props: Props) => {

    const [graphData, setGraphData] = useState<{}[]>([]);
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
            setTimeout(() => {
                setGraphData([{ xco: '5', yco: 5 }, { xco: '8', yco: 8 }, { xco: '9', yco: 9 },
                { xco: '15', yco: 15 }]);
                resolve();
            }, 2000);
        });
    }

    const renderGraph = (): void => {
        //@ts-ignore // nothing will be null/undefined because this is in componentDidMount()
        const canvasContext: CanvasRenderingContext2D = canvasRef.current.getContext('2d');
        if (!graphInstance)
            setGraphInstance(props.graph.generateGraph(canvasContext, graphData));
    }

    const updateGraph = (): void => {
        if (!graphInstance) return;
        graphInstance.data.datasets[0].data = graphData;
        graphInstance.update();
    }

    return (
        <div className="graphCanvasContainer">
            <canvas ref={canvasRef} />
            {updateGraph()}
        </div>
    );
}

export default GraphComponent;