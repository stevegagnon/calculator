const WebSocket = require('ws');

const colors = [
  '#e4a672',
  '#b86f50',
  '#743f39',
  '#9e2835',
  '#e53b44',
  '#fb922b',
  '#ffe762',
  '#63c64d',
  '#327345',
  '#193d3f',
  '#4f6781',
  '#afbfd2',
  '#ffffff',
  '#2ce8f4',
  '#0484d1',
];

let id = 1;
let userCount = 0;
const calculations = [];

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

wss.on('connection', function connection(ws) {
  const clientId = ++userCount;

  ws.on('message', function incoming(data) {
    const fields = JSON.parse(data);

    const calculation = {
      id: id++,
      username: `user_${clientId}`,
      color: colors[clientId % colors.length],
      operations: fields.operations || []
    };

    calculations.push(calculation);

    if (calculations.length > 10) {
      calculations.shift();
    }

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'append', calculation }));
      }
    });
  });

  ws.send(JSON.stringify({ type: 'sync', color: colors[clientId % colors.length], clientId: `user_${clientId}`, calculations }));
});
