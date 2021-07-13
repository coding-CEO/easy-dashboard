import { Graph } from "./graphClasses/Graph";

export class Dashboard {
  public id: string = "";
  public name: string = "";
  public graphs: Graph[] = [];

  constructor(id?: string, name?: string, graphs?: Graph[]) {
    if (id) this.id = id;
    if (name) this.name = name;
    if (graphs) this.graphs = graphs;
  }
}
