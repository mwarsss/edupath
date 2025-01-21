import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"
import { reportWebVitals } from './reportWebVitals';

const App = () => (
    <Router>
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
        </Switch>
    </Router>
);

export default App;

reportWebVitals();
