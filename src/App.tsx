import React, { useState, useEffect } from 'react';
import './App.css';

import HomePage from './pages/HomePage';
import CompanyDashboardPage from './pages/company/CompanyDashboardPage';
import UserPage from './pages/user/UserPage';
import NavigationBar from './components/NavigationBar';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { setTimeout } from 'timers';
import { GuestUser } from './classes/GuestUser';
import { LoginStatus } from './utils/enums';

interface Props {
  setLoading(isLoading: Boolean): void;
}

const App: React.FC<Props> = (props: Props) => {

  const [guestUser, setGuestUser] = useState<GuestUser>();

  const componentDidMount = async () => {
    await setUserLoggedIn(setGuestUser);
  }

  useEffect(() => {
    componentDidMount();
  }, []);

  const setUserLoggedIn = (setGuestUser: Function): Promise<void> => {
    return new Promise((resolve, reject) => {
      //TODO: check user login here and return status.
      setTimeout(() => {
        setGuestUser(new GuestUser("abc@xyz.com"));
        props.setLoading(false);
        resolve(console.log("Logged in"));
      }, 2000);
    });
  }

  const getLoginStatus = (): LoginStatus => {
    if (guestUser) {
      if (guestUser.getEmail().length > 0)
        return LoginStatus.LOGGED_IN;
      return LoginStatus.LOGGED_OUT;
    }
    return LoginStatus.UNDEFINED;
  }

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact render={(routeProps) => {
              switch (getLoginStatus()) {
                case LoginStatus.LOGGED_IN:
                  // @ts-ignore // Below guestUser will never be undefined
                  return <Redirect to={`/user/${guestUser.getEmail()}`} />;
                case LoginStatus.LOGGED_OUT:
                  return <HomePage setGuestUser={setGuestUser} />;
                default:
                  return <div></div>;
              }
            }} />

            <Route path="/company/:companyId/dashboard" exact render={(routeProps) => {
              switch (getLoginStatus()) {
                case LoginStatus.LOGGED_IN:
                  return <CompanyDashboardPage />;
                case LoginStatus.LOGGED_OUT:
                  return <Redirect to="/" />;
                default:
                  return <div></div>;
              }
            }} />
            <Redirect from="/company/:companyId" to="/company/:companyId/dashboard" />

            <Route path="/user/:userEmail" exact render={(routeProps) => {
              switch (getLoginStatus()) {
                case LoginStatus.LOGGED_IN:
                  // @ts-ignore // Below guestUser will never be undefined
                  if (routeProps.match.params.userEmail === guestUser.getEmail()) {
                    // @ts-ignore // Below guestUser will never be undefined
                    return <UserPage guestUser={guestUser} setGuestUser={setGuestUser} />
                  }
                  // @ts-ignore // Below guestUser will never be undefined
                  return <Redirect to={`/user/${guestUser.getEmail()}`} />;
                case LoginStatus.LOGGED_OUT:
                  return <Redirect to="/" />;
                default:
                  return <div></div>;
              }
            }} />

            <Route render={() => {
              return <h2>404 Page Not Found</h2>
            }} />
          </Switch>
        </Router>
      </div>
    </React.Fragment>
  );
}

export default App;