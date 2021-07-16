import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Button, Checkbox, DialogActions, DialogContent, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { ApiType, GraphType } from '../../utils/enums';
import { Graph } from '../../classes/dashboardClasses/graphClasses/Graph';
import { LineGraph } from '../../classes/dashboardClasses/graphClasses/LineGraph';
import { BarGraph } from '../../classes/dashboardClasses/graphClasses/BarGraph';
import { PieGraph } from '../../classes/dashboardClasses/graphClasses/PieGraph';

interface Props {
    fakeId: string;
    open: boolean;
    graph?: Graph;
    onClose: (graph?: Graph, graphType?: GraphType) => void;
}

const CreateGraphDialogue = (props: Props) => {

    const [graph, setGraph] = useState<Graph>(new LineGraph(props.fakeId, "", ApiType.REST, "", '#f1a135', '', '', ''));
    const [graphType, setGraphType] = useState<GraphType>(GraphType.LINE);

    const handleClose = (isComplete?: boolean) => {
        let temp_graph = graph;
        let temp_graph_type = graphType;
        setGraph(new LineGraph(props.fakeId, "", ApiType.REST, "", '#f1a135', '', '', ''));
        setGraphType(GraphType.LINE);
        if (isComplete)
            props.onClose(temp_graph, temp_graph_type);
        else
            props.onClose();
    }

    const updateGraph = (): void => {
        if (props.graph && graph.id !== props.graph.id)
            setGraph(props.graph);
    }

    const updateGraphType = (): void => {
        if (props.graph && graph.id !== props.graph.id) {
            if (props.graph instanceof LineGraph) setGraphType(GraphType.LINE);
            if (props.graph instanceof BarGraph) setGraphType(GraphType.BAR);
            if (props.graph instanceof PieGraph) setGraphType(GraphType.PIE);
        }
    }

    const convertGraph = (Graph: new (id: string,
        name: string,
        apiType: ApiType,
        apiUrl: string,
        colorHex: string,
        xCoordinatePath: string,
        yCoordinatePath: string, dataPath: string) => Graph): Graph => {
        return new Graph(graph.id, graph.name, graph.apiType, graph.apiUrl, graph.colorHex,
            graph.xCoordinatePath, graph.yCoordinatePath, graph.dataPath);
    }

    const setGraphTypeCustom = (newGraphType: GraphType): void => {
        setGraphType(newGraphType);
        switch (newGraphType) {
            case GraphType.LINE:
                setGraph(convertGraph(LineGraph));
                return;
            case GraphType.BAR:
                setGraph(convertGraph(BarGraph));
                return;
            case GraphType.PIE:
                setGraph(convertGraph(PieGraph));
                return;
            default:
                return;
        }
    }

    const getLineView = (): JSX.Element => {
        let temp_graph: LineGraph = Object.create(graph);
        Object.assign(temp_graph, graph);
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={temp_graph.fill}
                        onChange={(input) => {
                            let val = Boolean(input.target.checked);
                            temp_graph.fill = val;
                            setGraph(temp_graph);
                        }}
                        color="primary"
                    />
                }
                label="Area Fill: "
                labelPlacement="start"
            />
        );
    }
    const getBarView = (): JSX.Element => {
        return (
            <React.Fragment>.</React.Fragment>
        );
    }

    const getPieView = (): JSX.Element => {
        // let temp_graph = graph as PieGraph;
        return (
            <React.Fragment>.</React.Fragment>
            // <TextField className="input" label="Inner Radius Percentage (0% - 99%)" variant="outlined"
            //     style={{ marginBottom: '15px' }} type="number" onChange={(input) => {
            //         let val = Number(input.target.value);
            //         if (val < 0 || val > 99) {
            //             input.target.value = '0';
            //             temp_graph.innterRadiusPercent = 0;
            //         } else {
            //             temp_graph.innterRadiusPercent = val;
            //         }
            //         setGraph(temp_graph);
            //     }} defaultValue={temp_graph.innterRadiusPercent} required fullWidth />
        );
    }

    const getGraphTypeView = (): JSX.Element => {
        switch (graphType) {
            case GraphType.LINE:
                return getLineView();
            case GraphType.BAR:
                return getBarView();
            case GraphType.PIE:
                return getPieView();
            default:
                return <div></div>;
        }
    }

    return (
        <Dialog onClose={() => handleClose(false)} aria-labelledby="simple-dialog-title" open={props.open}>
            {updateGraph()}
            {updateGraphType()}
            <DialogTitle id="simple-dialog-title">Add Graph</DialogTitle>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleClose(true);
            }}>
                <DialogContent>
                    <FormControl variant="outlined" style={{ marginBottom: '15px' }} fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">Graph Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={graphType}
                            onChange={(input) => {
                                let val = Number(input.target.value);
                                switch (val) {
                                    case GraphType.LINE:
                                        setGraphTypeCustom(GraphType.LINE);
                                        return;
                                    case GraphType.BAR:
                                        setGraphTypeCustom(GraphType.BAR);
                                        return;
                                    case GraphType.PIE:
                                        setGraphTypeCustom(GraphType.PIE);
                                        return;
                                    default:
                                        return;
                                }
                            }}
                            label="Graph Type"
                        >
                            <MenuItem value={GraphType.LINE}>LINE</MenuItem>
                            <MenuItem value={GraphType.BAR}>BAR</MenuItem>
                            <MenuItem value={GraphType.PIE}>PIE</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField className="input" label="Graph Name" variant="outlined"
                        style={{ marginBottom: '15px' }} type="text" onChange={(input) => {
                            let temp_graph = graph;
                            temp_graph.name = input.target.value;
                            setGraph(temp_graph);
                        }} defaultValue={graph.name} required fullWidth />

                    <FormControlLabel
                        control={
                            <div style={{ marginBottom: '15px', marginLeft: '15px' }}>
                                <ChromePicker color={graph.colorHex} onChange={(color) => {
                                    let temp_graph: Graph = Object.create(graph);
                                    Object.assign(temp_graph, graph);
                                    temp_graph.colorHex = color.hex;
                                    setGraph(temp_graph);
                                }} />
                            </div>
                        }
                        label="Background Colour: "
                        labelPlacement="start"
                    />

                    <FormControl variant="outlined" style={{ marginBottom: '15px' }} fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">API Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={graph.apiType}
                            onChange={(input) => {
                                let temp_graph: Graph = Object.create(graph);
                                Object.assign(temp_graph, graph);
                                let val = Number(input.target.value);
                                switch (val) {
                                    case ApiType.REST:
                                        temp_graph.apiType = ApiType.REST;
                                        break;
                                    case ApiType.SOAP:
                                        temp_graph.apiType = ApiType.SOAP;
                                        break;
                                    default:
                                        break;
                                }
                                setGraph(temp_graph);
                            }}
                            label="API Type"
                        >
                            <MenuItem value={ApiType.REST}>REST</MenuItem>
                            {/* TODO: add these apis in future */}
                            {/* <MenuItem value={ApiType.SOAP}>SOAP</MenuItem>
                            <MenuItem value={ApiType.GRAPH_QL}>GRAPH_QL</MenuItem> */}
                        </Select>
                    </FormControl>

                    <TextField className="input" label="API Url" variant="outlined"
                        style={{ marginBottom: '15px' }} type="text" onChange={(input) => {
                            input.target.value = input.target.value.trim();
                            let temp_graph = graph;
                            temp_graph.apiUrl = input.target.value;
                            setGraph(temp_graph);
                        }} defaultValue={graph.apiUrl} required fullWidth />

                    <TextField className="input" label="Data Array Path in API (optional)" variant="outlined"
                        style={{ marginBottom: '15px' }} type="text" onChange={(input) => {
                            input.target.value = input.target.value.trim();
                            let temp_graph = graph;
                            temp_graph.dataPath = input.target.value;
                            setGraph(temp_graph);
                        }} defaultValue={graph.dataPath} fullWidth />

                    <TextField className="input" label="x-coordinate Variable Path in Data" variant="outlined"
                        style={{ marginBottom: '15px' }} type="text" onChange={(input) => {
                            input.target.value = input.target.value.trim();
                            let temp_graph = graph;
                            temp_graph.xCoordinatePath = input.target.value;
                            setGraph(temp_graph);
                        }} defaultValue={graph.xCoordinatePath} required fullWidth />

                    <TextField className="input" label="y-coordinate Variable Path in Data" variant="outlined"
                        style={{ marginBottom: '15px' }} type="text" onChange={(input) => {
                            input.target.value = input.target.value.trim();
                            let temp_graph = graph;
                            temp_graph.yCoordinatePath = input.target.value;
                            setGraph(temp_graph);
                        }} defaultValue={graph.yCoordinatePath} required fullWidth />

                    {getGraphTypeView()}

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default CreateGraphDialogue;