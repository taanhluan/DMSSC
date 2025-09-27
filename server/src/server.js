require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const db = {
  backlog: [
    { id: 'BL-000001', sr: 'SR-1001', description: 'Setup skeleton', status: 'NEW', owner: 'Jonathan', priority: 'HIGH', dueDate: '2025-10-01', onOff: 'ON', progress: 0, complex: 'M' }
  ],
  tasks: [
    { id: 'TK-000001', title: 'Wire FE', description: 'Hook router + views', status: 'TODO', hours: 0, sr: 'SR-1001', pic: 'Jonathan' }
  ]
};

app.use('/api/dashboard', require('./routes/dashboard')(db));
app.use('/api/backlog', require('./routes/backlog')(db));
app.use('/api/tasks', require('./routes/tasks')(db));
app.use('/api/reports', require('./routes/reports')(db));

const clientDir = path.resolve(__dirname, '../../client');
console.log('[static] clientDir =', clientDir, 'exists:', fs.existsSync(clientDir));

if (fs.existsSync(clientDir)) {
  app.use(express.static(clientDir));
  app.get('*', (_, res) => res.sendFile(path.join(clientDir, 'index.html')));
} else {
  app.get('/', (_, res) => res.send('Frontend not found (no /client).'));
  app.get('/api/health', (_, res) => res.json({ ok: true, time: new Date().toISOString() }));
}

app.listen(PORT, () => {
  console.log(`✅ DMSSC Management System running at http://localhost:${PORT}`);
});
