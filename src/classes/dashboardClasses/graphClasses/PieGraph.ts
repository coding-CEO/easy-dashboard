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
        labels: this.getLables(graphData),
        datasets: [
          {
            label: this.name,
            data: this.getData(graphData),
            backgroundColor: this.colorHex,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        cutout: this.innterRadiusPercent,
      },
    });
  }

  private generatePath = (pathLoc: string): string => {
    return "." + pathLoc;
  };

  public getLables = (graphData: {}[]): string[] => {
    if (graphData.length <= 0) return [];
    let lables: string[] = [];
    let xpath = this.generatePath(this.xCoordinatePath);
    try {
      for (let data of graphData) {
        lables.push(eval("data" + xpath));
      }
    } catch (error) {
      return [];
    }
    return lables;
  };

  public getData = (graphData: {}[]): number[] => {
    if (graphData.length <= 0) return [];
    let datas: number[] = [];
    let ypath = this.generatePath(this.yCoordinatePath);
    try {
      for (let data of graphData) {
        datas.push(eval("data" + ypath));
      }
    } catch (error) {
      return [];
    }
    return datas;
  };
}
