const express = require("express");
const bodyParser = require('body-parser');
const axios = require('axios');
const CircularJSON = require('circular-json');
const request = require('request');
const app = express.Router();

app.get('/list', function(req, res, next) {
  axios('http://15.165.173.37:3000/list')
  .then(docs => {
           res.writeHead(200);
           var template = `
           <!doctype html>
           <html>
           <head>
             <title>Result</title>
             <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css" integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==" crossorigin="" />
             <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.css" />
             <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.Default.css" />

             <script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js" integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==" crossorigin=""></script>
             <script src="https://unpkg.com/leaflet.markercluster@1.3.0/dist/leaflet.markercluster.js"></script>
             <meta charset="utf-8">
           </head>
           <body>
            <table border="1" margin: auto; text-align: center;>
              <tr>
                <th> 이름 </th>
                <th> 주소 </th>
                <th> 가격 </th>
                <th> 잔량(L) </th>
              </th>`;
              for(var i=0;i<docs['data'].length;i++){
                if(docs['data'][i]['lat'] >0 && docs['data'][i]['lng']>0){
                template += `
              <tr onclick="map_submit('${docs['data'][i]['addr']}')">
                <th>${docs['data'][i]['name']}</th>
                <th>${docs['data'][i]['addr']}</th>
                <th>${docs['data'][i]['price']}</th>
                <th>${docs['data'][i]['inventory']}</th>
              </tr>`
              }
            }
             template +=`</table>
             <script>
             function map_submit(addr){
              if(addr.indexOf("(")> 0) parent.mapform.addr.value = addr.substring(0,addr.indexOf("("));
              else parent.mapform.addr.value = addr;
              parent.mapform.submit();
             }
             </script>
           </body>
           </html>
          `;
           res.end(template);
  })
  .catch(error=>{
    console.log(error);
  })
});

app.get("/api/finds",(req,res) => {
  console.log(req.query.addr);
  if(req.query.addr == null){
    urls = "http://15.165.173.37:3000/api/finds?addr=서울"
  }else{
    urls = "http://15.165.173.37:3000/api/finds?addr="+encodeURI(req.query.addr);
  }
  request(urls, {json:true},(err,result,body)=>{
    if(err) {return console.log(err);}
    res.writeHead(200);
    var template = `
    <!doctype html>
    <html>
    <head>
      <title>Result</title>
      <meta charset="utf-8">
    </head>
    <body>
     <table border="1" margin: auto; text-align: center;>
       <tr>
         <th> 이름 </th>
         <th> 주소 </th>
         <th> 가격 </th>
         <th> 잔량(L) </th>
       </th>`;
       for(var i=0;i<result['body'].length;i++){
         template += `
       <tr onclick="map_submit('${result['body'][i]['addr']}')">
         <th>${result['body'][i]['name']}</th>
         <th>${result['body'][i]['addr']}</th>
         <th>${result['body'][i]['price']}</th>
         <th>${result['body'][i]['inventory']}</th>
       </tr>`
     }
      template +=`</table>
      <script>
      function map_submit(addr){
       if(addr.indexOf("(")> 0) parent.mapform.addr.value = addr.substring(0,addr.indexOf("("));
       else parent.mapform.addr.value = addr;
       parent.mapform.submit();
      }
      </script>
    </body>
    </html>
   `;
    res.end(template);
  })
});

app.post("/api/find/addr",(req,res) => {
  const options = {
    uri : 'http://15.165.173.37:3000/api/find/addr',
    method: 'POST',
    form: {
      addr: req.body.addr
    },
    json : true
  }
  request.post(options,(err,result,body)=>{
    if(err) {return console.log(err);}
    res.writeHead(200);
    var template = `
    <!doctype html>
    <html>
    <head>
      <title>Result</title>
      <meta charset="utf-8">
    </head>
    <body>
     <table border="1" margin: auto; text-align: center;>
       <tr>
         <th> 이름 </th>
         <th> 주소 </th>
         <th> 가격 </th>
         <th> 잔량(L) </th>
       </th>`;
       for(var i=0;i<result['body'].length;i++){
         template += `
       <tr onclick="map_submit('${result['body'][i]['addr']}')">
         <th>${result['body'][i]['name']}</th>
         <th>${result['body'][i]['addr']}</th>
         <th>${result['body'][i]['price']}</th>
         <th>${result['body'][i]['inventory']}</th>
       </tr>`
     }
      template +=`</table>
      <script>
      function map_submit(addr){
       if(addr.indexOf("(") > 0) parent.mapform.addr.value = addr.substring(0,addr.indexOf("("));
       else parent.mapform.addr.value = addr;
       parent.mapform.submit();
      }
      </script>
    </body>
    </html>
   `;
    res.end(template);
  }
)
});
app.get('/api/map', function(req, res, next) {
  axios('http://15.165.173.37:3000/list')
  .then(docs => {
    res.writeHead(200);
    var template = `
    <!doctype html>
    <html>
    <head>
      <title>Result</title>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css" integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==" crossorigin="" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.Default.css" />

      <script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js" integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==" crossorigin=""></script>
      <script src="https://unpkg.com/leaflet.markercluster@1.3.0/dist/leaflet.markercluster.js"></script>
         <style>
          #map { height: 600px;
                  width: 800px;
                }
         </style>
    </head>
    <body>
     <div id="map"></div>
     <script style ="visibility:none">
       const map = L.map('map').setView([37.27538, 127.05488], 7);
       const attribution =
       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
       const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
       const tiles = L.tileLayer(tileUrl,{attribution})
       tiles.addTo(map);

       var markers = new L.MarkerClusterGroup();
       `
       for(var i=0;i<docs['data'].length;i++){
         if(docs['data'][i]['lat'] >0 && docs['data'][i]['lng']>0){
        template += `markers.addLayer(L.marker([${docs['data'][i]['lat']}, ${docs['data'][i]['lng']}])
         .bindPopup("이름 : ${docs['data'][i]['name']}<br/> 주소 : ${docs['data'][i]['addr']} <br/> 가격 : ${docs['data'][i]['price']}<br/> 잔량 : ${docs['data'][i]['inventory']} L"));`
       }
       }
       template+=`


       // add more markers here...

       map.addLayer(markers);
     </script>
    </body>
    </html>
   `;
    res.end(template);
  })
  .catch(error=>{
    console.log(error);
  })
});
app.post("/api/map/addr",(req,res) => {
  const options = {
    uri : 'http://15.165.173.37:3000/api/find/addr',
    method: 'POST',
    form: {
      addr: req.body.addr
    },
    json : true
  }
  request.post(options,(err,result,body)=>{
    if(err) {return console.log(err);}
    res.writeHead(200);
    var lat=0;
    var lng=0;
    var total=0;
    var template = `
    <!doctype html>
    <html>
    <head>
      <title>Result</title>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css" integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==" crossorigin="" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.Default.css" />

      <script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js" integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==" crossorigin=""></script>
      <script src="https://unpkg.com/leaflet.markercluster@1.3.0/dist/leaflet.markercluster.js"></script>
         <style>
          #map { height: 600px;
                  width: 800px;
                }
         </style>
    </head>
    <body>
     <div id="map"></div>
     <script style ="visibility:none">

       var markers = new L.MarkerClusterGroup();
       `
       var zoom = 10;
       if(result['body'].length<5) zoom+=6;
       for(var i=0;i<result['body'].length;i++){
         if(result['body'][i]['lat'] >0 && result['body'][i]['lng']){
           lat+=result['body'][i]['lat'];
           lng+=result['body'][i]['lng'];
           total+=1;
        template += `markers.addLayer(L.marker([${result['body'][i]['lat']}, ${result['body'][i]['lng']}])
         .bindPopup("이름 : ${result['body'][i]['name']}<br/> 주소 : ${result['body'][i]['addr']} <br/> 가격 : ${result['body'][i]['price']}<br/> 잔량 : ${result['body'][i]['inventory']} L"));`
       }
       }
       template+=`

       const map = L.map('map').setView([${lat}/${total}, ${lng}/${total}], ${zoom});
       const attribution =
       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
       const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
       const tiles = L.tileLayer(tileUrl,{attribution})
       tiles.addTo(map);

       // add more markers here...

       map.addLayer(markers);
     </script>
    </body>
    </html>
   `;
    res.end(template);
  }
)
});
module.exports = app;
