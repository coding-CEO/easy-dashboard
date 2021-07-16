import { DashboardList } from "../classes/DashboardList";
import { v4 as uuid } from "uuid";
import { GraphType, Privilage } from "../utils/enums";
import { Dashboard } from "../classes/dashboardClasses/Dashboard";
import { Graph } from "../classes/dashboardClasses/graphClasses/Graph";
import { LineGraph } from "../classes/dashboardClasses/graphClasses/LineGraph";
import { PieGraph } from "../classes/dashboardClasses/graphClasses/PieGraph";
import { BarGraph } from "../classes/dashboardClasses/graphClasses/BarGraph";
import { Employee } from "../classes/dashboardClasses/Employee";

export class BackendLocal {
  private static main_key: string = "main";

  private static setItem = (mainArray: {}[]): void => {
    localStorage.setItem(BackendLocal.main_key, JSON.stringify(mainArray));
  };
  private static getItem = (): {}[] => {
    let data = localStorage.getItem(BackendLocal.main_key);
    if (data === null) return [];
    return JSON.parse(data);
  };

  public static getDashboards = (email: string): DashboardList[] => {
    let data = [];
    let mainArray = BackendLocal.getItem();
    try {
      for (let dashboard of mainArray) {
        //@ts-ignore
        for (let employee of dashboard.employees) {
          if (employee.email === email) {
            data.push(
              new DashboardList(
                //@ts-ignore
                dashboard.id,
                //@ts-ignore
                dashboard.name,
                employee.privilage
              )
            );
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return data;
  };
  public static addDashboard = (name: string, email: string): string => {
    let mainArray = BackendLocal.getItem();
    const id = uuid();
    mainArray.push({
      id: id,
      name: name,
      graphs: [],
      graphSequence: [],
      employees: [
        {
          email: email,
          privilage: Privilage.ADMIN,
        },
      ],
    });
    BackendLocal.setItem(mainArray);
    return id;
  };
  public static userPrivilage = (
    dashboardId: string,
    email: string
  ): Privilage => {
    let mainArray = BackendLocal.getItem();
    try {
      for (let dashboard of mainArray) {
        //@ts-ignore
        if (dashboard.id !== dashboardId) continue;
        //@ts-ignore
        for (let employee of dashboard.employees) {
          if (employee.email === email) {
            return employee.privilage;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return -1;
  };
  public static getDashboard = (dashboardId: string): Dashboard | undefined => {
    let mainArray = BackendLocal.getItem();
    try {
      for (let dashboard of mainArray) {
        //@ts-ignore
        if (dashboard.id !== dashboardId) continue;
        let graphs: Graph[] = [];
        //@ts-ignore
        for (let graph of dashboard.graphs) {
          switch (graph.type) {
            case GraphType.LINE:
              graphs.push(
                new LineGraph(
                  graph.id,
                  graph.name,
                  graph.apiType,
                  graph.apiUrl,
                  graph.colorHex,
                  graph.xCoordinatePath,
                  graph.yCoordinatePath,
                  graph.dataPath,
                  graph.fill
                )
              );
              break;
            case GraphType.BAR:
              graphs.push(
                new BarGraph(
                  graph.id,
                  graph.name,
                  graph.apiType,
                  graph.apiUrl,
                  graph.colorHex,
                  graph.xCoordinatePath,
                  graph.yCoordinatePath,
                  graph.dataPath
                )
              );
              break;
            case GraphType.PIE:
              graphs.push(
                new PieGraph(
                  graph.id,
                  graph.name,
                  graph.apiType,
                  graph.apiUrl,
                  graph.colorHex,
                  graph.xCoordinatePath,
                  graph.yCoordinatePath,
                  graph.dataPath,
                  graph.innerRadiusPercent
                )
              );
              break;
          }
          graphs.push();
        }
        dashboard = new Dashboard(
          dashboardId,
          //@ts-ignore
          dashboard.name,
          graphs,
          //@ts-ignore
          dashboard.graphSequence
        );
        //@ts-ignore
        return dashboard;
      }
    } catch (e) {
      console.error(e);
    }
    return undefined;
  };
  public static getEmployees = (dashboardId: string): Employee[] => {
    let data = [];
    let mainArray = BackendLocal.getItem();
    try {
      for (let dashboard of mainArray) {
        //@ts-ignore
        if (dashboard.id !== dashboardId) continue;
        //@ts-ignore
        for (let employee of dashboard.employees) {
          data.push(new Employee(employee.email, employee.privilage));
        }
        break;
      }
    } catch (e) {
      console.error(e);
    }
    return data;
  };
  public static addEmployee = (
    dashboardId: string,
    employee: Employee
  ): void => {
    let mainArray = BackendLocal.getItem();
    try {
      for (let dashboard of mainArray) {
        //@ts-ignore
        if (dashboard.id !== dashboardId) continue;
        //@ts-ignore
        dashboard.employees = [employee, ...dashboard.employees];
        break;
      }
    } catch (e) {
      console.error(e);
    }
    BackendLocal.setItem(mainArray);
  };
  public static changeEmployee = (
    dashboardId: string,
    employeeEmail: string,
    employeePrivilage: Privilage
  ): void => {
    let mainArray = BackendLocal.getItem();
    try {
      for (let dashboard of mainArray) {
        //@ts-ignore
        if (dashboard.id !== dashboardId) continue;
        //@ts-ignore
        dashboard.employees = dashboard.employees.map((employee) => {
          if (employee.email === employeeEmail) {
            employee.privilage = employeePrivilage;
          }
          return employee;
        });
        break;
      }
    } catch (e) {
      console.error(e);
    }
    BackendLocal.setItem(mainArray);
  };
  public static removeEmployee = (
    dashboardId: string,
    employeeEmail: string
  ): void => {
    let mainArray = BackendLocal.getItem();
    try {
      for (let dashboard of mainArray) {
        //@ts-ignore
        if (dashboard.id !== dashboardId) continue;
        //@ts-ignore
        dashboard.employees = dashboard.employees.filter((employee) => {
          if (employee.email === employeeEmail) {
            return false;
          }
          return true;
        });
        break;
      }
    } catch (e) {
      console.error(e);
    }
    BackendLocal.setItem(mainArray);
  };
  public static updateGraph = (
    dashboardId: string,
    graph: Graph,
    isUpdate: boolean
  ): string => {
    let mainArray = BackendLocal.getItem();
    graph.id = isUpdate ? graph.id : uuid();
    let jsonGraph = {
      type: 0,
    };
    Object.assign(jsonGraph, JSON.parse(JSON.stringify(graph)));
    if (graph instanceof LineGraph) jsonGraph.type = GraphType.LINE;
    else if (graph instanceof BarGraph) jsonGraph.type = GraphType.BAR;
    else if (graph instanceof PieGraph) jsonGraph.type = GraphType.PIE;
    try {
      for (let dashboard of mainArray) {
        //@ts-ignore
        if (dashboard.id !== dashboardId) continue;
        if (isUpdate) {
          //@ts-ignore
          dashboard.graphs = dashboard.graphs.map((mapGraph) => {
            //@ts-ignore
            if (mapGraph.id === jsonGraph.id) {
              return jsonGraph;
            }
            return mapGraph;
          });
        } else {
          //@ts-ignore
          dashboard.graphs = [jsonGraph, ...dashboard.graphs];
          //@ts-ignore
          dashboard.graphSequence = [jsonGraph.id, ...dashboard.graphSequence];
        }
        break;
      }
    } catch (e) {
      console.error(e);
    }
    BackendLocal.setItem(mainArray);
    return graph.id;
  };
  public static deleteGraph = (dashboardId: string, graphId: string): void => {
    let mainArray = BackendLocal.getItem();
    try {
      for (let dashboard of mainArray) {
        //@ts-ignore
        if (dashboard.id !== dashboardId) continue;
        //@ts-ignore
        dashboard.graphs = dashboard.graphs.filter((graph) => {
          if (graph.id === graphId) {
            return false;
          }
          return true;
        });
        //@ts-ignore
        dashboard.graphSequence = dashboard.graphSequence.filter((graphSeq) => {
          if (graphSeq === graphId) {
            return false;
          }
          return true;
        });
        break;
      }
    } catch (e) {
      console.error(e);
    }
    BackendLocal.setItem(mainArray);
  };
  public static moveGraphs = (
    dashboardId: string,
    graphSequence: string[]
  ): void => {
    let mainArray = BackendLocal.getItem();
    try {
      for (let dashboard of mainArray) {
        //@ts-ignore
        if (dashboard.id !== dashboardId) continue;
        //@ts-ignore
        dashboard.graphSequence = graphSequence;
        break;
      }
    } catch (e) {
      console.error(e);
    }
    BackendLocal.setItem(mainArray);
  };
}
