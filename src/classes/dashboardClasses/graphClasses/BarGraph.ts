import { Chart, ChartTypeRegistry } from "chart.js";
import { ApiType } from "../../../utils/enums";
import { Graph } from "./Graph";

export class BarGraph extends Graph {
  constructor(
    id: string,
    name: string,
    apiType: ApiType,
    apiUrl: string,
    colorHex: string,
    xCoordinatePath: string,
    yCoordinatePath: string
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
  }
  public generateGraph(
    canvasContext: CanvasRenderingContext2D,
    graphData: {}[]
  ): Chart<keyof ChartTypeRegistry, {}[], unknown> {
    return new Chart(canvasContext, {
      type: "bar",
      data: {
        datasets: [
          {
            label: this.name,
            data: graphData,
            backgroundColor: this.colorHex,
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
