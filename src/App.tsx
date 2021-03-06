import React, { useState, useEffect } from 'react';
import './App.css';

import HomePage from './pages/HomePage';
import CompanyDashboardPage from './pages/company/CompanyDashboardPage';
import UserPage from './pages/user/UserPage';
import NavigationBar from './components/NavigationBar';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { GuestUser } from './classes/GuestUser';
import { LoginStatus } from './utils/enums';

interface Props {
  setLoading(isLoading: Boolean): void;
}

const App: React.FC<Props> = (props: Props) => {

  const userKey = 'user';
  const [guestUser, setGuestUser] = useState<GuestUser>();

  const componentDidMount = async () => {
    authenticate();
  }

  useEffect(() => {
    componentDidMount();
  }, []);

  const authenticate = (): void => {
    let userItemString = localStorage.getItem(userKey);
    if (!userItemString) setGuestUser(new GuestUser(''));
    else {
      let userItem = JSON.parse(userItemString);
      setGuestUser(new GuestUser(userItem.email));
    }
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
      <Router>
        <NavigationBar />
        <div className="App">
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
                  // @ts-ignore // Below guestUser will never be undefined
                  return <CompanyDashboardPage guestUser={guestUser} />;
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
        </div>
      </Router>
    </React.Fragment>
  );
}

export default App;