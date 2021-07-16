import * as React from 'react';
import './UserPage.css';

import { GuestUser } from '../../classes/GuestUser';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { useState, useEffect } from 'react';
import { Privilage } from '../../utils/enums';
import { DashboardList } from '../../classes/DashboardList';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import CreateDashboardDialogue from './CreateDashboardDialogue';
import { BackendLocal } from '../../backendLocal/backendLocal';

interface Props {
    guestUser: GuestUser;
    setGuestUser(guestUser: GuestUser): void;
}

const UserPage = (props: Props) => {

    const [dashboards, setDashboards] = useState<DashboardList[]>([]);
    const [openDialogue, setOpenDialogue] = useState(false);
    const history = useHistory();

    const componentDidMount = async () => {
        setDashboards(BackendLocal.getDashboards(props.guestUser.getEmail()));
    }

    useEffect(() => {
        componentDidMount();
    }, []);

    const goToCompany = (index: number): void => {
        history.push(`/company/${dashboards[index].getDashboardId()}`);
    }

    const handleLogout = (): void => {
        props.setGuestUser(new GuestUser(""));
    }

    const handleDialogueClose = (dashboardName?: string) => {
        setOpenDialogue(false);
        if (dashboardName === undefined) return;
        const dashboardId = BackendLocal.addDashboard(dashboardName, props.guestUser.getEmail());
        let dashboard = new DashboardList(dashboardId, dashboardName,
            Privilage.ADMIN);
        setDashboards([...dashboards, dashboard]);
    }

    const handleCreateYourDashboard = () => {
        setOpenDialogue(true);
    }

    return (
        <div className="UserPage_container">
            <h2>DASHBOARDS</h2>
            <div className="dashboardListButtons">
                <Button variant="contained" color="primary" onClick={handleCreateYourDashboard}>
                    Create Your Dashboard
                </Button>
                <Button variant="contained" onClick={handleLogout}>Logout</Button>
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Dashboard ID</TableCell>
                            <TableCell align="center">Dashboard Name</TableCell>
                            <TableCell align="right">Your Priviage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dashboards.map((dashboard: DashboardList, index: number) => (
                            <TableRow key={dashboard.getDashboardId()} className="dashboardRow"
                                onClick={() => goToCompany(index)}>
                                <TableCell component="th" scope="row">
                                    {dashboard.getDashboardId()}
                                </TableCell>
                                <TableCell align="center">{dashboard.getDashboardName()}</TableCell>
                                <TableCell align="right">{dashboard.getYourPrivilage()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CreateDashboardDialogue open={openDialogue} onClose={handleDialogueClose} />
        </div>
    );
}

export default UserPage;