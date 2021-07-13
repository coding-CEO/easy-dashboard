import { Privilage } from "../../utils/enums";

export class Employee {
  public email: string;
  public privilage: Privilage;
  constructor(email: string, privilage: Privilage) {
    this.email = email;
    this.privilage = privilage;
  }
}
