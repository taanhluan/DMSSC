import { route, startRouter } from './router.js';
import Dashboard from './views/dashboard.js';
import Backlog from './views/backlog.js';
import Tasks from './views/tasks.js';
import Report from './views/report.js';

route('#/dashboard', Dashboard);
route('#/backlog', Backlog);
route('#/tasks', Tasks);
route('#/report', Report);

startRouter();
