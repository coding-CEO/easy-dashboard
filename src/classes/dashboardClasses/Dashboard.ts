import { Graph } from "./graphClasses/Graph";

export class Dashboard {
  public id: string = "";
  public name: string = "";
  public graphs: Graph[] = [];
  public graphSequence: string[] = [];

  constructor(
    id?: string,
    name?: string,
    graphs?: Graph[],
    graphSequence?: string[]
  ) {
    if (id) this.id = id;
    if (name) this.name = name;
    if (graphs) this.graphs = graphs;
    if (graphSequence) this.graphSequence = graphSequence;
  }
}
