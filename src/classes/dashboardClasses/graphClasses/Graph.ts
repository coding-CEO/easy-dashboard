import { Chart, ChartTypeRegistry } from "chart.js";
import { ApiType } from "../../../utils/enums";
import axios from "axios";

export abstract class Graph {
  public id: string;
  public name: string;
  public apiType: ApiType;
  public apiUrl: string;
  public colorHex: string;
  public xCoordinatePath: string;
  public yCoordinatePath: string;
  public dataPath: string;

  constructor(
    id: string,
    name: string,
    apiType: ApiType,
    apiUrl: string,
    colorHex: string,
    xCoordinatePath: string,
    yCoordinatePath: string,
    dataPath: string
  ) {
    this.id = id;
    this.name = name;
    this.apiType = apiType;
    this.apiUrl = apiUrl;
    this.colorHex = colorHex;
    this.xCoordinatePath = xCoordinatePath;
    this.yCoordinatePath = yCoordinatePath;
    this.dataPath = dataPath;
  }

  public fetchGraphData = async (
    apiUrl: string,
    apiType: ApiType,
    dataPath: string
  ): Promise<{}[]> => {
    let data: {}[] = [];

    switch (apiType) {
      case ApiType.REST:
        data = await this.restFetch(apiUrl, dataPath);
        break;
      case ApiType.SOAP:
        data = await this.soapFetch(apiUrl);
        break;
      case ApiType.GRAPH_QL:
        data = await this.graphQlFetch(apiUrl);
        break;
    }

    return data;
  };

  private restFetch = async (
    apiUrl: string,
    dataPath: string
  ): Promise<{}[]> => {
    let data: {} = await axios.get(apiUrl);
    //TODO: fetch data path here
    //@ts-ignore
    return this.getObjectData(data.data, dataPath);
  };

  private soapFetch = (apiUrl: string): {}[] => {
    //TODO: complete this in future
    throw new Error("Function not yet implemented");
  };

  private graphQlFetch = (apiUrl: string): {}[] => {
    //TODO: complete this in future
    throw new Error("Function not yet implemented");
  };

  public getObjectData = (o: {}, s: string): any => {
    if (s === undefined || s.length === 0) return o;
    s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    s = s.replace(/^\./, ""); // strip a leading dot
    let a: string[] = s.split(".");
    for (let k of a) {
      //@ts-ignore
      o = o[k];
    }
    return o;
  };

  public abstract generateGraph(
    canvasContext: CanvasRenderingContext2D,
    graphData: {}[]
  ): Chart<keyof ChartTypeRegistry, {}[], unknown>;

  public abstract update(
    graph: Graph,
    graphInstance: Chart<keyof ChartTypeRegistry, {}[], unknown>,
    graphData: {}[],
    isApiUpdated: boolean
  ): Promise<void>;
}
