// server.js
// where your node app starts

// init project
const http = require('http');
var express = require('express');
var app = express();
const WebSocket = require('ws');
var bodyParser = require('body-parser')

var clientList={};
 
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.json({extended: true}));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.get("/clients", function (request, response) {
  
  response.json(Object.keys(clientList));
});

app.post("/speechcommand", function (request, response) {
  console.log(request.body);
  let command=request.body.result.fulfillment.messages.filter((message)=>{
      return message.type===4;
  })
  

  if(command.length>0){
      console.log(">>>",command)
    command=command[0];
     command.payload && Object.keys(clientList).forEach((clientId)=>{
       console.log(clientId,command.payload)
       clientList[clientId].send(JSON.stringify(command.payload));
     });
  }
  response.setHeader('Content-Type', 'application/json');
  response.json({success:true})

});
app.post("/:command", function (request, response) {
  console.log(request.body,request.params);
  const command=request.params["command"];
  const clientId=request.body["clientId"];
  console.log(clientList[clientId]);
  if(command && clientId && clientList[clientId])
  {
      clientList[clientId].send(JSON.stringify({type:"command",data:command}));
      response.json({result:"success"});
  }
  else
  {
    response.json({result:"failure"});
  }
});
 


// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

function addNewClient(ws,clientIdentifier){
  clientList[clientIdentifier]=ws;
}

wss.on('connection', function connection(ws, req) {
 // const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  //console.log(req.headers);
  let clientIdentifier=req.headers["x-forwarded-for"].split(",")[0];
  if(clientList[clientIdentifier]){
    //delete and close the websocket
     clientList[clientIdentifier].close=function(){
 
       delete(clientList[clientIdentifier]);
 
       clientList[clientIdentifier]=null;
       addNewClient(ws,clientIdentifier)
     }

    clientList[clientIdentifier].close(); 
    
  }
  else{
    addNewClient(ws,clientIdentifier);
  }
 
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    message=JSON.parse(message);
    if(message.type==="ping"){
      console.log("sending pong")
      ws.send(JSON.stringify({type:"pong",data:null}));
    }
    else{
      
    }
  });
  
  ws.send(JSON.stringify({type:"acknowledgement",data:null}));
});

// listen for requests :)
var listener = server.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
