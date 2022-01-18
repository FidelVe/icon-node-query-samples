// This sample code gets the IP addresses, node name and wallet addresses
// of the block producers in the ICON network.
// It connects with a node to directly get the IP address and the queries
// the ICON blockchain to get the node names and wallet addresses.
//

// Imports
//
const http = require("http");

// Global constants
//
const NODES = [
  "ctz.solidwallet.io",
  "api.icon.geometry.io",
  "52.196.159.184",
  "35.170.9.187",
  "104.21.5.198"
];
const PARAMS = {
  hostname: NODES[2],
  port: 9000,
  path: "/admin/chain/0x1"
};
const PARAMS2 = {
  hostname: NODES[2],
  port: 9000,
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

async function asyncQuery(params, data = false) {
  // Async http request made with an http.request wrapped in a Promise
  //
  const promisifiedQuery = new Promise((resolve, reject) => {
    const query = http.request(params, res => {
      // Print status code on console
      console.log("Status Code: " + res.statusCode);

      // Process chunked data
      let rawData = "";
      res.on("data", chunk => {
        rawData += chunk;
      });

      // when request completed, pass the data to the 'resolve' callback
      res.on("end", () => {
        let queryResponse = JSON.parse(rawData);
        resolve(queryResponse);
      });

      // if error, print on console
      res.on("error", err => {
        console.log("Got error: ", +err.message);
      });
    });
    if (data != false) {
      // If data param is passed into function then we assume the call is
      // for path '/api/v3' and method is 'POST' so we send a .write to
      // the server.
      //
      query.write(data);
    }
    // end request
    query.end();
  });
  // wait for the response and return it
  let result = await promisifiedQuery;
  return result;
}

async function asyncRun() {
  // run the entire program inside an async function to be able to use await
  // and wait for the servers to reply to the different queries
  //
  let resultQuery1 = await asyncQuery(PARAMS);
  let resultQuery2 = await asyncQuery(PARAMS2, DATA);
  let roots = resultQuery1.module.network.p2p.roots;
  let preps = resultQuery2.result.preps;
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
