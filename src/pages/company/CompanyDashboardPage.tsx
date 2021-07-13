import * as React from 'react';
import './CompanyDashboardPage.css'

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Admin } from '../../classes/dashboardClasses/Admin';
import { Dashboard } from '../../classes/dashboardClasses/Dashboard';
import { User } from '../../classes/dashboardClasses/User';
import { GuestUser } from '../../classes/GuestUser';
import { ApiType, Privilage } from '../../utils/enums';
import { Button, Divider, Drawer, FormControl, InputLabel, List, MenuItem, Select } from '@material-ui/core';
import { Employee } from '../../classes/dashboardClasses/Employee';
import GraphContainer from './GraphContainer';
import { LineGraph } from '../../classes/dashboardClasses/graphClasses/LineGraph';
import { BarGraph } from '../../classes/dashboardClasses/graphClasses/BarGraph';

interface Props {
    guestUser: GuestUser;
}

interface ParamsProps {
    companyId: string;
}

const CompanyDashboardPage = (props: Props) => {

    const [user, setUser] = useState<User | undefined>();
    const [isEditModeOn, setEditModeOn] = useState(false);
    const [isEmployeesListOn, setEmployeesListOn] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const params = useParams<ParamsProps>();

    const componentDidMount = async () => {
        await setUserAuthorization();
    }

    useEffect(() => {
        componentDidMount();
    }, []);

    const setUserAuthorization = async () => {
        // TODO: complete this.
        // use companyID and props.guestUser.getEmail() to check if user is valid
        // get the privilage of user

        // if(not authorized) then => setUser(new User());

        let privilage = Privilage.ADMIN;

        // use company ID to get dashboard data mentioned in the dashboard class
        await getDashboard(params.companyId);
        let dashboard = new Dashboard('1', 'ABC Sales', [new LineGraph('1', "GName",
            ApiType.REST, "fakeurl", "#fc4103", 'xco', 'yco', true), new BarGraph('2', "GName",
                ApiType.REST, "fakeurl", "#fc4103", 'xco', 'yco'), new LineGraph('3', "GName",
                    ApiType.REST, "fakeurl", "#fc4103", 'xco', 'yco', true)]);

        //@ts-ignore
        if (privilage === Privilage.ADMIN)
            setUser(new Admin(dashboard));
        else
            setUser(new User(dashboard));
    }

    const getDashboard = (companyId: string) => {
        //TODO: complete this.
    }

    const handleEditModeButtonClick = (): void => {
        setEditModeOn(!isEditModeOn);
    }

    const handleEmployeesButtonClick = (): void => {
        const isON = !isEmployeesListOn
        setEmployeesListOn(isON);
        if (isON)
            getEmployees();
    }

    const handlePrivilageChange = (value: number, index: number) => {
        let tempEmployees = employees.slice();
        switch (value) {
            case Privilage.ADMIN:
                //TODO: make admin in database
                tempEmployees[index].privilage = Privilage.ADMIN;
                break;
            case Privilage.USER:
                //TODO: make user in database
                tempEmployees[index].privilage = Privilage.USER;
                break;
            default:
                // remove from database
                console.log('removed');
                break;
        }
        setEmployees(tempEmployees);
    };

    const getEmployees = (): void => {
        //TODO: complete this
        setEmployees([new Employee('abc@gmail.com', Privilage.ADMIN),
        new Employee('xyz@gmail.com', Privilage.USER)]);
    }

    const getEmployeesListView = (): JSX.Element => {
        return (
            <div className="employeesListContainer">
                <h3>Employees</h3>
                <Divider />
                <List>
                    {employees.map((employee: Employee, index: number) => {
                        return (
                            <div className="listItem" key={employee.email}>
                                <h5>{employee.email}</h5>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Privilage</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={employee.privilage}
                                        onChange={(input) => handlePrivilageChange(Number(input.target.value),
                                            index)}
                                        label="Privilage"
                                    >
                                        <MenuItem value={-1}>
                                            <em>Remove Employee</em>
                                        </MenuItem>
                                        <MenuItem value={Privilage.ADMIN}>ADMIN</MenuItem>
                                        <MenuItem value={Privilage.USER}>USER</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        )
                    })}
                </List>
            </div>
        );
    }

    const handleGraphAdd = (): void => {
        //TODO: complete add graph code...
    }

    const getEditControls = (): JSX.Element => {
        return (
            <div className="editControlContainer">
                <Button variant="outlined" color="primary" size="small"
                    onClick={handleEditModeButtonClick}>
                    Turn {isEditModeOn ? "OFF" : "ON"} Edit Mode
                </Button>
                <Button variant="outlined" size="small" onClick={handleEmployeesButtonClick}>
                    Employees
                </Button>
                <Button variant="outlined" size="small" onClick={handleGraphAdd}>
                    Add Graph
                </Button>
                <Drawer anchor="right" open={isEmployeesListOn} onClose={handleEmployeesButtonClick}>
                    {getEmployeesListView()}
                </Drawer>
            </div>
        );
    }

    const getUserView = (): JSX.Element => {
        return (
            <div className="dashboardPageContainer">
                <nav>
                    {/*@ts-ignore // Both user and dashboard are never undefined below*/}
                    <h2>{user.dashboard.name}</h2>
                    {(user instanceof Admin) && getEditControls()}
                </nav>
                {/*@ts-ignore // user is never undefined below*/}
                <GraphContainer user={user} isEditModeOn={isEditModeOn} />
            </div>
        );
    }

    const getProperView = (): JSX.Element => {
        if (user) {
            if (user.dashboard !== undefined)
                return getUserView();
            // Access Denied
            return <h2>403: Access Denied</h2>
        }
        // loading
        return <div>loading...</div>
    }

    return (
        getProperView()
    );
}

export default CompanyDashboardPage;