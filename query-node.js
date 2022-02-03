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
const { httpsRequest } = require("./api");

// Global constants
const NODES = JSON.parse(fs.readFileSync("data/nodes.json"));

const PARAMS = {
  hostname: NODES.NODES[1],
  path: "/admin/chain/0x1",
};

(async () => {
  let request = await httpsRequest(PARAMS);
  console.log(request);
})();
