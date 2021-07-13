import { Dashboard } from "./Dashboard";
import { User } from "./User";

export class Admin extends User {
  constructor(dashboard?: Dashboard) {
    super(dashboard);
  }
}
