import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
    return (
        <Router>
            <div>
                <Navbar />
                <div className="container mt-4">
                    <Switch>
                        <Route path="/login" component={() => <h1>Login</h1>} />
                        <Route path="/dashboard" component={() => <h1>Dashboard</h1>} />
                        <Route path="/" component={() => <h1>Home</h1>} />
                    </Switch>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;