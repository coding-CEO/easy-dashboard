import { Dashboard } from "./Dashboard";

export class User {
  public dashboard: Dashboard | undefined;
  constructor(dashboard?: Dashboard) {
    this.dashboard = dashboard;
  }
}
