// server/src/db.js
const { v4: uuid } = require('uuid');

const db = {
  backlog: [
    {
      id: "BL-000001",
      sr: "SR-1001",
      description: "Setup skeleton",
      site: "DLVN",
      status: "NEW",
      owner: "Jonathan",
      priority: "HIGH",
      startDate: null,
      endDate: null
    }
  ],
  tasks: [
    {
      id: "TK-000001",
      sr: "SR-1001",
      title: "BS Working Hour",
      description: "init",
      site: "DLVN",
      pic: "Nga",
      status: "TODO",
      priority: "MEDIUM",
      startDate: null,
      endDate: null,
      hours: 0
    }
  ]
};

function newId(prefix){
  return `${prefix}-${uuid().slice(0,6).toUpperCase()}`;
}

module.exports = { db, newId };
