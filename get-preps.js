// This sample code gets the list of the top 22 PReps by delegation
// in the ICON blockchain by making an http POST request into a node API
// and calling the 'getPReps' method into the chain main smart contract
//
// From the queried data we get a list of the top 22 PReps
// in the chain and miscellaneous data from each of those PReps
// https://www.icondev.io/references/reference-manuals/icon-json-rpc-api-v3-specification#getpreps
//

// Imports
const fs = require("fs");
const { httpsRequest } = require("./api");

// Global constants
const NODES = JSON.parse(fs.readFileSync("data/nodes.json"));
const PARAMS = {
  hostname: NODES.NODES[1],
  path: "/api/v3",
  method: "POST",
  headers: {
    "content-type": "text/plain",
    charset: "UTF-8"
  }
};
const DATA = JSON.stringify({
  jsonrpc: "2.0",
  method: "icx_call",
  id: 1,
  params: {
    to: "cx0000000000000000000000000000000000000000",
    dataType: "call",
    data: {
      method: "getPReps",
      params: {
        startRanking: "0x1",
        endRanking: "0x16"
      }
    }
  }
});

// Run async httpsRequest and print response on console
(async () => {
  try {
    let response = await httpsRequest(PARAMS, DATA);
    console.log(response);
  } catch (err) {
    console.log("Error running httpsRequest");
    console.log(err);
  }
})();
