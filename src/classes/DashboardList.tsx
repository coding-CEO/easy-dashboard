import { Privilage } from "../utils/enums";

export class DashboardList {
    private dashboardId: string;
    private dashboardName: string;
    private yourPrivilage: string;

    constructor(dashboardId: string, dashboardName: string, privilageEnum?: Privilage) {
        this.dashboardId = dashboardId;
        this.dashboardName = dashboardName;
        this.yourPrivilage = this.getPrivilage(privilageEnum);
    }

    private getPrivilage = (privilageEnum?: Privilage): string => {
        switch (privilageEnum) {
            case Privilage.ADMIN:
                return 'ADMIN';
            case Privilage.USER:
                return 'USER';
            default:
                return "";
        }
    }

    public getDashboardId = (): string => {
        return this.dashboardId;
    }
    public getDashboardName = (): string => {
        return this.dashboardName;
    }
    public getYourPrivilage = (): string => {
        return this.yourPrivilage;
    }
}