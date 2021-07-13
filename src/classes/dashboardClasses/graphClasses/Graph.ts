import { ApiType, GraphType } from "../../../utils/enums";

export class Graph {
  public type: GraphType;
  public name: string;
  public apiType: ApiType;
  public apiUrl: string;
  public colorHex: string;
  public xCoordinatePath: string;
  public yCoordinatePath: string;

  constructor(
    type: GraphType,
    name: string,
    apiType: ApiType,
    apiUrl: string,
    colorHex: string,
    xCoordinatePath: string,
    yCoordinatePath: string
  ) {
    this.type = type;
    this.name = name;
    this.apiType = apiType;
    this.apiUrl = apiUrl;
    this.colorHex = colorHex;
    this.xCoordinatePath = xCoordinatePath;
    this.yCoordinatePath = yCoordinatePath;
  }
}
