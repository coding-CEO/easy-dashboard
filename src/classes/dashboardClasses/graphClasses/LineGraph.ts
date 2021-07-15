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
  public update = async (
    graphInstance: Chart<keyof ChartTypeRegistry, {}[], unknown>,
    graphData: {}[],
    isApiUpdated: boolean
  ): Promise<void> => {
    if (!graphInstance) return;
    graphInstance.config.type = "line";
    graphInstance.data.datasets[0].label = this.name;
    graphInstance.data.datasets[0].backgroundColor = this.colorHex;
    //@ts-ignore
    graphInstance.data.datasets[0].fill = this.fill;
    graphInstance.config.options = {
      parsing: {
        xAxisKey: this.xCoordinatePath,
        yAxisKey: this.yCoordinatePath,
      },
    };
    if (isApiUpdated) {
      graphData = await this.fetchGraphData();
    }
    graphInstance.data.datasets[0].data = graphData;
    graphInstance.update();
  };
}
