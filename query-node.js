// This sample code gets general info directly from an ICON Node
// by making an http GET request directly into the '/admin/chain/0x1' path
// E.G => http://NODE_IP:9000/admin/chain/0x1
//
// From the queried data we can obtain info specific to that node like
// status of the node, current block height, seeds, etc
//

// Imports
//
const fs = require("fs");
const http = require("http");

// Global constants
//
const NODES = JSON.parse(fs.readFileSync("files/nodes.json"));
const PARAMS = {
  hostname: NODES.NODES[2],
  port: 9000,
  path: "/admin/chain/0x1"
};

const query = http.get(PARAMS, res => {
  // Print status code on console
  console.log("Status Code: " + res.statusCode);

  // Process chunked data
  let rawData = "";
  res.on("data", chunk => {
    rawData += chunk;
  });

  // Print complete data on console
  res.on("end", () => {
    console.log(JSON.parse(rawData));
  });
});

query.on("error", err => {
  // Print error message on console
  console.log("Got error: " + err.message);
});
