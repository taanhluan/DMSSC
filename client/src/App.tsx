import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './components/Dashboard';
import Backlog from './components/Backlog';
import Tasks from './components/Tasks';
import Reports from './components/Reports';

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/backlog" component={Backlog} />
                <Route path="/tasks" component={Tasks} />
                <Route path="/reports" component={Reports} />
            </Switch>
        </Router>
    );
};

export default App;