import { Chart, ChartTypeRegistry } from "chart.js";
import { ApiType } from "../../../utils/enums";
import { Graph } from "./Graph";

export class PieGraph extends Graph {
  public innterRadiusPercent: number = 0;
  constructor(
    id: string,
    name: string,
    apiType: ApiType,
    apiUrl: string,
    colorHex: string,
    xCoordinatePath: string,
    yCoordinatePath: string,
    innerRadiusPercent?: number
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
    if (innerRadiusPercent) this.innterRadiusPercent = innerRadiusPercent;
  }
  public generateGraph(
    canvasContext: CanvasRenderingContext2D,
    graphData: {}[]
  ): Chart<keyof ChartTypeRegistry, {}[], unknown> {
    return new Chart(canvasContext, {
      type: "doughnut",
      data: {
        labels: this.getLables(graphData, this.xCoordinatePath),
        datasets: [
          {
            label: this.name,
            data: this.getData(graphData, this.yCoordinatePath),
            backgroundColor: this.colorHex,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        // cutout: this.innterRadiusPercent,
      },
    });
  }

  public update = async (
    graph: PieGraph,
    graphInstance: Chart<keyof ChartTypeRegistry, {}[], unknown>,
    graphData: {}[],
    isApiUpdated: boolean
  ): Promise<void> => {
    if (!graphInstance) return;
    graphInstance.config.type = "doughnut";
    graphInstance.data.datasets[0].label = graph.name;
    graphInstance.data.datasets[0].backgroundColor = graph.colorHex;
    graphInstance.config.options = {
      //@ts-ignore
      cutout: `${graph.innterRadiusPercent}%`,
    };
    if (isApiUpdated) {
      graphData = await this.fetchGraphData(graph.apiUrl, graph.apiType);
    }
    graphInstance.data.labels = this.getLables(
      graphData,
      graph.xCoordinatePath
    );
    graphInstance.data.datasets[0].data = this.getData(
      graphData,
      graph.yCoordinatePath
    );

    graphInstance.update();
  };

  private getObjectData = (o: {}, s: string): any => {
    s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    s = s.replace(/^\./, ""); // strip a leading dot
    let a: string[] = s.split(".");
    for (let k of a) {
      //@ts-ignore
      o = o[k];
    }
    return o;
  };

  public getLables = (graphData: {}[], xpath: string): string[] => {
    if (graphData.length <= 0) return [];
    let lables: string[] = [];
    try {
      for (let data of graphData) {
        lables.push(this.getObjectData(data, xpath));
      }
    } catch (error) {
      console.error(error, lables);
      return [];
    }
    return lables;
  };

  public getData = (graphData: {}[], ypath: string): number[] => {
    if (graphData.length <= 0) return [];
    let datas: number[] = [];
    try {
      for (let data of graphData) {
        datas.push(this.getObjectData(data, ypath));
      }
    } catch (error) {
      console.error(error);
      return [];
    }
    return datas;
  };
}
