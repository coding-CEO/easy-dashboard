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
import CreateEmployeeDialogue from './CreateEmployeeDialogue';
import CreateGraphDialogue from './CreateGraphDialogue';
import { Graph } from '../../classes/dashboardClasses/graphClasses/Graph';
import { PieGraph } from '../../classes/dashboardClasses/graphClasses/PieGraph';

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
    const [isAddEmployeePopupOn, setAddEmployeePopupOn] = useState(false);
    const [isAddGraphPopupOn, setAddGraphPopupOn] = useState(false);

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
        let dashboard = new Dashboard('1', 'ABC Sales', [new PieGraph('2', "GName",
            ApiType.REST, "fakeurl", "#fc4103", 'xco', 'yco'), new LineGraph('0', "GName",
                ApiType.REST, "fakeurl", "#fc4103", 'xco', 'yco', true), new BarGraph('1', "GName",
                    ApiType.REST, "fakeurl", "#fc4103", 'xco', 'yco')], ['0', '1', '2']);
        dashboard.sortGraphs();

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

    const handleAddEmployeeClick = (): void => {
        setAddEmployeePopupOn(!isAddEmployeePopupOn);
    }

    const handleAddEmployee = (employee?: Employee): void => {
        setAddEmployeePopupOn(false);
        if (employee === undefined) return;
        //TODO: add this employee to database
        setEmployees([employee, ...employees]);
    }

    const getEmployeesListView = (): JSX.Element => {
        return (
            <div className="employeesListContainer">
                <div style={{
                    width: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <h3>Employees</h3>
                    <Button variant="outlined" size="small" color="primary"
                        onClick={handleAddEmployeeClick}>
                        Add Employee
                    </Button>
                    <CreateEmployeeDialogue open={isAddEmployeePopupOn} onClose={handleAddEmployee} />
                </div>
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
                <Button variant="outlined" size="small" onClick={() => setAddGraphPopupOn(true)}>
                    Add Graph
                </Button>
                <Drawer anchor="right" open={isEmployeesListOn} onClose={handleEmployeesButtonClick}>
                    {getEmployeesListView()}
                </Drawer>
            </div>
        );
    }

    const addGraph = (graph: Graph, index?: number): void => {
        //TODO: add this index graph to database
        if (!user) return;
        let temp_user: User = Object.create(user);
        if (!temp_user.dashboard) return;
        if (index !== undefined) temp_user.dashboard.graphs[index] = graph;
        else {
            temp_user.dashboard.graphs = [graph, ...temp_user.dashboard.graphs];
            temp_user.dashboard.graphSequence = [graph.id, ...temp_user.dashboard.graphSequence];
        }
        setUser(temp_user);
    }

    const deleteGraph = (index: number): void => {
        //TODO: delete this index graph from database
        if (!user) return;
        let temp_user: User = Object.create(user);
        if (!temp_user.dashboard) return;
        const temp_graph = temp_user.dashboard.graphs[index];
        temp_user.dashboard.graphs.splice(index, 1);
        temp_user.dashboard.graphSequence.splice(temp_user.dashboard.graphSequence.indexOf(temp_graph.id), 1);
        setUser(temp_user);
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
                <GraphContainer user={user} isEditModeOn={isEditModeOn} isAddGraphPopupOn={isAddGraphPopupOn}
                    setAddGraphPopupOn={setAddGraphPopupOn} addGraph={addGraph} deleteGraph={deleteGraph}
                    setUser={setUser} />
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