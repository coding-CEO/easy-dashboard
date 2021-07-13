import { Chart } from "chart.js";
import { ApiType } from "../../../utils/enums";
import { Graph } from "./Graph";

export class LineGraph extends Graph {
  public fill: boolean;
  constructor(
    id: string,
    name: string,
    apiType: ApiType,
    apiUrl: string,
    colorHex: string,
    xCoordinatePath: string,
    yCoordinatePath: string,
    fill: boolean
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
    this.fill = fill;
  }

  public generateGraph(
    canvasContext: CanvasRenderingContext2D | null,
    graphData: {}[]
  ): void {
    if (!canvasContext) return;

    if (this.graphInstance) {
      this.graphInstance.destroy();
    }

    this.graphInstance = new Chart(canvasContext, {
      type: "line",
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
