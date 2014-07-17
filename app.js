
/**
 * Module dependencies.
 */

var express = require('express');
var os = require('os');
var http = require('http');
var path = require('path');
var sharejs = require('share').server;
var app = express();

var iface = os.networkInterfaces()['eth0'];
var IP;
iface && iface.forEach(function(connection) {
   if (connection.family === 'IPv4') {
      IP = connection.address;
   }
});

// all environments
app.set('port',process.env.PORT || 8950);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', renderEditor);
app.get('/user',cursorUser);

var ip_address = new Array();
var name = ['Scott','Harvey','Nikita','Wing'];
function renderEditor(req, res) {
    var IP = req.connection.remoteAddress;
    if(ip_address.length == 0 ){
        ip_address.push(IP);
        deal_ip(IP,name,res);
    }
    else{
        var exist = false;
        for(var i=0;i<ip_address.length;i++){
            if(IP == ip_address[i]){
                exist = true;
                deal_ip(IP,name,res);
            }
        }
        if(exist == false){
            ip_address.push(IP);
            deal_ip(IP,name,res);
        }
    }
}
function deal_ip(IP,name,res){
    var index = ip_address.indexOf(IP);
    res.render('editor', { title: 'Editor using ace',
        name: name[index] });
}
function cursorUser(req,res){
    var IP = req.connection.remoteAddress;
    var index = ip_address.indexOf(IP);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(200,name[index]);
}

var sessonid = new Array();
var index = 1;
var shareJS_options = {
   staticpath: '/js/lib/sharejs'
   , db: {type: 'none'},
    auth: function(client, action) {
        // This auth handler rejects any ops bound for docs starting with 'readonly'.
        if (action.name === 'submit op' && action.docName.match(/^readonly/)) {
            action.reject();
        }
        else {
            action.accept();
            //agent.id = client.sessionId;
            /*var id = client.sessionId;
            if(sessonid.length == 0){
                sessonid.push(id);
            }
            else{
                for(var i=0;i<sessonid.length;i++){
                    if(id != sessonid[i]){
                        sessonid.push(id);
                    }
                }
            }
            console.log(client);*/

        }

    }
};

sharejs.attach(app, shareJS_options);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on: '+ app.get('port'));
});

