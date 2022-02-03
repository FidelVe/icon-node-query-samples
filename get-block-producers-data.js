// This sample code gets the IP addresses, node name and wallet addresses
// of the block producers in the ICON network.
// It connects with a node to directly get the IP address and the queries
// the ICON blockchain to get the node names and wallet addresses.
//

// Imports
const fs = require("fs");
const { httpsRequest } = require("./api");

// Global constants
const NODES = JSON.parse(fs.readFileSync("data/nodes.json"));

// Global constants
const PARAMS = {
  hostname: NODES.NODES[2],
  path: "/admin/chain/0x1"
};
const PARAMS2 = {
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
        endRanking: "0x1E"
      }
    }
  }
});
async function asyncRun() {
  // run the entire program inside an async function to be able to use await
  // and wait for the servers to reply to the different queries
  //
  let resultQuery1 = await httpsRequest(PARAMS);
  let resultQuery2 = await httpsRequest(PARAMS2, DATA);
  let roots = resultQuery1.module.network.p2p;
  let preps = resultQuery2.result.preps;
  console.log(roots);
  console.log(preps);
  let parsedPreps = [];

  preps.forEach(prep => {
    for (eachIp in roots) {
      if (
        roots[eachIp] === prep.address ||
        roots[eachIp] === prep.nodeAddress
      ) {
        console.log(
          `name: ${prep.name}` +
            "\n" +
            `address: ${prep.address}` +
            "\n" +
            `ip: ${eachIp.split(":")[0]}` +
            "\n"
        );
        parsedPreps.push({
          name: prep.name,
          address: roots[eachIp],
          ip: eachIp.split(":")[0]
        });
      }
    }
  });
  console.log("async run ended");
}

asyncRun();

process.on("uncaughtException", function(err) {
  console.log(err);
});
