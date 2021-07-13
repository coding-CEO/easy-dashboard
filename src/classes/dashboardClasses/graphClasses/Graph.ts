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

  public abstract generateGraph(
    canvasContext: CanvasRenderingContext2D | null,
    graphData: {}[]
  ): Chart<keyof ChartTypeRegistry, {}[], unknown>;
}
