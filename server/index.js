const https = require('https');
const express = require('express');
const async = require('async');
const { resolve } = require('dns');
const { json } = require('stream/consumers');


const app = express();

const port = 3001;
var c;

app.get('/', (req, res) => {
    res.send('Hello World, from express this is the server for serving up tickets');
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))

//In the future make this so it returns tickets for any projects specified.  For now, just have it return tickets for 
//Pierce Transit
app.get('/tickets', (req,res) => {

    c = req.query.customers
    c = '"' + c + '"' 
    console.log(c)
    var local_data;
    console.log("i'm in the get statement");

    somefunction(c).then((value) =>  {
        console.log("promise value:", value)
        // console.log("from callback:" + response) // check if response is valid
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

         res.send(value)
     });
     
    
    
});
function somefunction(c){


var promise1 = new Promise ((resolve, reject)=> {
        console.log("In promise")
        //c = '"' +"Pierce Transit – Lakewood, WA" + '"'
        //c = '"' + c + '"' 
        console.log("Customers:", c)
        
        var jqlstring = "project=\"Systems Engineering\" and status not in (closed)"
        jqlstring = jqlstring + " and customers = " +c

        bodydata = JSON.stringify({
            "jql":jqlstring,
            "fields":["Milestone","summary", "Customers", "key","progress", "customfield_15761"]
        })
        // prepare the header
        var postheaders = {
            'Content-Type' : 'application/json',
            'Content-Length' : Buffer.byteLength(bodydata, 'utf8'),
            'Authorization':'Basic YmJhZmZvcmQ6REBsbGFzNTA1MDUw'
        };

        // the post options
        var optionspost = {
            host : 'jira.cleverdevices.com',
            port : 8443,
            path : '/rest/api/2/search',
            method : 'POST',
            headers : postheaders
        };

        
        // do the POST call
        var reqPost = https.request(optionspost, function(res) {
            console.log("statusCode: ", res.statusCode)
            console.log("Response", res.bodydata);
            // uncomment it for header details
            //  console.log("headers: ", res.headers);
            //resolve(res.JSON)
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
                //resolve(JSON.stringify(body));
            });
            /*
            res.on('data', function(d) {
                console.info('POST result:\n');
                
               // process.stdout.write(d);
                console.log(d);
                console.info('\n\nPOST completed');

                resolve(JSON.stringify(d)) ;
            });
            */
        });
        
        // write the json data
        reqPost.write(bodydata);
        reqPost.end();
        reqPost.on('error', function(e) {
            console.error(e);
        });
    
    });
    return promise1
}