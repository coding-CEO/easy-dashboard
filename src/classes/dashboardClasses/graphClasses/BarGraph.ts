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
  public update = async (
    graph: BarGraph,
    graphInstance: Chart<keyof ChartTypeRegistry, {}[], unknown>,
    graphData: {}[],
    isApiUpdated: boolean
  ): Promise<void> => {
    if (!graphInstance) return;
    graphInstance.config.type = "bar";
    graphInstance.data.datasets[0].label = graph.name;
    graphInstance.data.datasets[0].backgroundColor = graph.colorHex;
    graphInstance.config.options = {
      parsing: {
        xAxisKey: graph.xCoordinatePath,
        yAxisKey: graph.yCoordinatePath,
      },
    };
    if (isApiUpdated) {
      graphData = await this.fetchGraphData(graph.apiUrl, graph.apiType);
    }
    graphInstance.data.datasets[0].data = graphData;
    graphInstance.update();
  };
}
