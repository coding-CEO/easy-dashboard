import { Chart, ChartTypeRegistry } from "chart.js";
import { ApiType } from "../../../utils/enums";
import { Graph } from "./Graph";

export class LineGraph extends Graph {
  public fill: boolean = false;
  constructor(
    id: string,
    name: string,
    apiType: ApiType,
    apiUrl: string,
    colorHex: string,
    xCoordinatePath: string,
    yCoordinatePath: string,
    fill?: boolean
  ) {
    super(
      id,
      name,
      apiType,
      apiUrl,
      colorHex,
      xCoordinatePath,
      yCoordinatePath
    );
    if (fill) this.fill = fill;
  }
  public generateGraph(
    canvasContext: CanvasRenderingContext2D,
    graphData: {}[]
  ): Chart<keyof ChartTypeRegistry, {}[], unknown> {
    return new Chart(canvasContext, {
      type: "line",
      data: {
        datasets: [
          {
            label: this.name,
            data: graphData,
            backgroundColor: this.colorHex,
            fill: this.fill,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        parsing: {
          xAxisKey: this.xCoordinatePath,
          yAxisKey: this.yCoordinatePath,
        },
      },
    });
  }
}
