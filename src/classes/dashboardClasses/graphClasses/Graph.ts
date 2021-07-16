import { Chart, ChartTypeRegistry } from "chart.js";
import { ApiType } from "../../../utils/enums";

export abstract class Graph {
  public id: string;
  public name: string;
  public apiType: ApiType;
  public apiUrl: string;
  public colorHex: string;
  public xCoordinatePath: string;
  public yCoordinatePath: string;

  constructor(
    id: string,
    name: string,
    apiType: ApiType,
    apiUrl: string,
    colorHex: string,
    xCoordinatePath: string,
    yCoordinatePath: string
  ) {
    this.id = id;
    this.name = name;
    this.apiType = apiType;
    this.apiUrl = apiUrl;
    this.colorHex = colorHex;
    this.xCoordinatePath = xCoordinatePath;
    this.yCoordinatePath = yCoordinatePath;
  }

  public fetchGraphData = async (
    apiUrl: string,
    apiType: ApiType
  ): Promise<{}[]> => {
    //TODO: fetch graph data from api
    console.log(apiUrl, apiType);

    let data: {}[] = [
      { xco: "5", yco: 5 },
      { xco: "8", yco: 8 },
      { xco: "9", yco: 9 },
      { xco: "15", yco: 15 },
    ];

    switch (apiType) {
      case ApiType.REST:
        data = await this.restFetch(apiUrl);
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

  private restFetch = (apiUrl: string): {}[] => {
    //TODO: complete this now
    throw new Error("Function not yet implemented");
  };

  private soapFetch = (apiUrl: string): {}[] => {
    //TODO: complete this in future
    throw new Error("Function not yet implemented");
  };

  private graphQlFetch = (apiUrl: string): {}[] => {
    //TODO: complete this in future
    throw new Error("Function not yet implemented");
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
