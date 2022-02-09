var express = require("express");
var app = express();
const url = "mongodb://localhost:27017/";
const Twitter = require("./api/helpers/twitter");
const twitter = new Twitter();
require("dotenv").config();
const { MongoClient } = require("mongodb");
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var assert = require("assert");
const map = new Map();
const redditmap = new Map();

//either use query strings in req.query and then build the api url as "url" below
//or
//use axios params -> to get the query strings and headers to pass header
// axios.get("/user", {
//   params: {
//   q: q,
//   count: count
//   },{
// headers:{
//   "Authorization" : "Bearer AAAAAAAAAAAAAAAAAAAAANxoKgEAAAAAPHqmxMNPB%2Bdmh9ULEFETehVC%2FG4%3DGpLhhrH1HNidYlOFdnkG08afsSjsvvoQkkHRGCDmtVOTbcPNjM"
// }
// });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("Twitter API working !!!");
});

app.get("/twitter", (req, res) => {
  //simplyfiying using the helpers from twitter class and get method within it
  twitter
    .get(
      req.query.q,
      req.query.count,
      req.query.result_type,
      req.query.tweet_mode,
      req.query.max_id
    )
    .then(function (response) {
      // handle success
      res.status(200).send(response.data);
    })
    .catch(function (error) {
      // handle error
      res.status(400).send(error);
    });
});

app.get("/api/getstats", async function (req, res) {
  await client.connect();
  const db = client.db("myDb");
  const filtercollection = db.collection("twitterDataAllFilter");
  const allcollection = db.collection("twitterDataSampleAll");
  // const countDocuments = await collection.countDocuments();
  const filterstats = await filtercollection.stats();
  const allstats = await allcollection.stats();
  // console.log('count of documents =>', countDocuments);
  // console.log('filterstats =>', filterstats);
  res.status(200).send([filterstats, allstats]);
});

app.get("/api/getRedditstats", async function (req, res) {
  await client.connect();
  const db = client.db("myDbreddit");
  const filtercollection = db.collection("redditCommentsNew");
  // const countDocuments = await collection.countDocuments();
  const filterstats = await filtercollection.stats();
  // console.log('count of documents =>', countDocuments);
  res.status(200).send([filterstats]);
});

app.get("/api/redditdataCollection", async function (req, res) {});

app.get("/api/getall", async function (req, res) {
  const arr = [];
  // console.log("entered getall");
  await client.connect();
  const db = client.db("myDb");
  const filtercollection = db.collection("twitterDataAllFilter");
  try {
    const result = await filtercollection
      .find()
      .limit(50000)
      .forEach((x) => arr.push(x));
    // console.log(result);
    res.status(200).send(arr);
  } catch {
    console.log("error");
  }
});

app.get("/api/getbitcoin", async function (req, res) {
  // console.log("entered getall");
  await client.connect();
  const db = client.db("myDb");
  const startdate = req.query.startDate;
  const endDate = req.query.endDate;
  console.log(startdate + " " + endDate);
  const filtercollection = db.collection("twitterDataAllFilter");
  try {
    const result = await filtercollection
      .find({
        text: { $regex: "bitcoin" },
        created_at: {
          $gte: new Date(startdate).toISOString(),
          $lte: new Date(endDate).toISOString(),
        },
      })
      .count();
    console.log("bitcoin count is :" + result);
    map.set("bitcoin", result);
    res.status(200).send(result + "");
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/getEthereum", async function (req, res) {
  const arr = [];
  // console.log("entered getall");
  await client.connect();
  const db = client.db("myDb");
  const startdate = req.query.startDate;
  const endDate = req.query.endDate;
  const filtercollection = db.collection("twitterDataAllFilter");
  try {
    const result = await filtercollection
      .find({
        text: { $regex: "ethereum" },
        created_at: {
          $gte: new Date(startdate).toISOString(),
          $lte: new Date(endDate).toISOString(),
        },
      })
      .count();
    console.log("ethereum count is :" + result);
    map.set("ethereum", result);
    res.status(200).send(result + "");
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/getshib", async function (req, res) {
  const arr = [];
  // console.log("entered getall");
  const startdate = req.query.startDate;
  const endDate = req.query.endDate;
  await client.connect();
  const db = client.db("myDb");
  const filtercollection = db.collection("twitterDataAllFilter");
  try {
    const result = await filtercollection
      .find({
        text: { $regex: "shib" },
        created_at: {
          $gte: new Date(startdate).toISOString(),
          $lte: new Date(endDate).toISOString(),
        },
      })
      .count();
    console.log("shib count is :" + result);
    map.set("shib", result);
    res.status(200).send(result + "");
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/getdodge", async function (req, res) {
  const arr = [];
  // console.log("entered getall");
  const startdate = req.query.startDate;
  const endDate = req.query.endDate;
  await client.connect();
  const db = client.db("myDb");
  const filtercollection = db.collection("twitterDataAllFilter");
  try {
    const result = await filtercollection
      .find({
        text: { $regex: "dodge" },
        created_at: {
          $gte: new Date(startdate).toISOString(),
          $lte: new Date(endDate).toISOString(),
        },
      })
      .count();
    console.log("dodge count is :" + result);
    map.set("dodge", result);
    res.status(200).send(result + "");
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/showtwittercoinscount", async function (req, res) {
  console.log(map);
  const temparr = [];
  // map.forEach(x => {
  //  temparr.push(x);
  //   // return temparr ;
  // });

  for (let i = 0; i < map.size; i++) {
    if (i == 0) {
      temparr.push(map.get("bitcoin"));
    } else if (i == 1) {
      temparr.push(map.get("ethereum"));
    } else if (i == 2) {
      temparr.push(map.get("shib"));
    } else if (i == 3) {
      temparr.push(map.get("dodge"));
    }
  }
  console.log(temparr);
  res.status(200).send(temparr);
});

app.get("/api/getDateTimeDiff", async function (req, res) {
  // console.log("entered getall");
  const startdate = req.query.startDate;
  const endDate = req.query.endDate;
  await client.connect();
  const db = client.db("myDb");
  const filtercollection = db.collection("twitterDataAllFilter");
  try {
    const result = await filtercollection
      .find({
        created_at: {
          $gte: new Date(startdate).toISOString(),
          $lte: new Date(endDate).toISOString(),
        },
      })
      .count();
    console.log("datetime difference count is :" + result);
    res.status(200).send(result + "");
  } catch (error) {
    console.log(error);
  }
});

// for Reddit
app.get("/api/getbitcoinFromReddit", async function (req, res) {
  // console.log("entered getall");
  await client.connect();
  const db = client.db("myDbreddit");
  const startdate = req.query.startDate;
  const endDate = req.query.endDate;
  console.log("here" + startdate + " " + endDate);
  const filtercollection = db.collection("redditCommentsNew");
  try {
    const result = await filtercollection
      .find({
        comments: { $regex: "bitcoin" },
        time: {
          $gte: new Date(startdate),
          $lte: new Date(endDate),
        },
      })
      .count();
    console.log("bitcoin count in Reddit is :" + result);
    redditmap.set("Bitcoin", result);
    res.status(200).send(result + "");
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/getDodgeFromReddit", async function (req, res) {
  // console.log("entered getall");
  await client.connect();
  const db = client.db("myDbreddit");
  const startdate = req.query.startDate;
  const endDate = req.query.endDate;
  console.log("here" + startdate + " " + endDate);
  const filtercollection = db.collection("redditCommentsNew");
  try {
    const result = await filtercollection
      .find({
        comments: { $regex: "dodge" },
        time: {
          $gte: new Date(startdate),
          $lte: new Date(endDate),
        },
      })
      .count();
    console.log("Dodge coin count in Reddit is :" + result);
    redditmap.set("Dodge", result);
    res.status(200).send(result + "");
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/getShibFromReddit", async function (req, res) {
  // console.log("entered getall");
  await client.connect();
  const db = client.db("myDbreddit");
  const startdate = req.query.startDate;
  const endDate = req.query.endDate;
  console.log("here" + startdate + " " + endDate);
  const filtercollection = db.collection("redditCommentsNew");
  try {
    const result = await filtercollection
      .find({
        comments: { $regex: "shib" },
        time: {
          $gte: new Date(startdate),
          $lte: new Date(endDate),
        },
      })
      .count();
    console.log("ShibInu count in Reddit is :" + result);
    redditmap.set("ShibInu", result);
    res.status(200).send(result + "");
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/getEthereumFromReddit", async function (req, res) {
  // console.log("entered getall");
  await client.connect();
  const db = client.db("myDbreddit");
  const startdate = req.query.startDate;
  const endDate = req.query.endDate;
  console.log("here" + startdate + " " + endDate);
  const filtercollection = db.collection("redditCommentsNew");
  try {
    const result = await filtercollection
      .find({
        comments: { $regex: "ethereum" },
        time: {
          $gte: new Date(startdate),
          $lte: new Date(endDate),
        },
      })
      .count();
    console.log("Ethereum count in Reddit is :" + result);
    redditmap.set("Ethereum", result);
    res.status(200).send(result + "");
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/showRedditcoinscount", async function (req, res) {
  console.log(redditmap);
  const temparr = [];
  redditmap.forEach((x) => {
    temparr.push(x);
    // return temparr ;
  });
  console.log(temparr);
  res.status(200).send(temparr);
});

app.get("/api/gethourly", async function (req, res) {
  const arr = [];
  // console.log("entered getall");
  const startdate = req.query.startDate;
  const endDate = req.query.endDate;
  await client.connect();
  const db = client.db("myDb");
  const filtercollection = db.collection("twitterDataAllFilter");
  let result;
  try {
    const myArray = startdate.split("-");
    const tmyArray = endDate.split("-");
    let array = [];
    let hour = 0;
    let day = myArray[2];
    let month = myArray[1];
    let year = myArray[0];
    let tday = tmyArray[2];
    let tmonth = tmyArray[1];
    let tyear = tmyArray[0];
    while(true) {
      hour = hour.toLocaleString('en-US',{minimumIntegerDigits: 2, useGrouping: false});
      let tthour = (parseInt(hour)+1).toLocaleString('en-US',{minimumIntegerDigits: 2, useGrouping: false});
      day = day.toLocaleString('en-US',{minimumIntegerDigits: 2, useGrouping: false});
      month = month.toLocaleString('en-US',{minimumIntegerDigits: 2, useGrouping: false});
      year = year.toLocaleString('en-US',{minimumIntegerDigits: 2, useGrouping: false});
      console.log(`${year}-${month}-${day}T${hour}:00:00.000Z`);
      if(hour == 24 || hour == 0){
        arr.push(day+"/"+month)
      }else{
        arr.push(hour+":00")
      }
      result = await filtercollection.find({
        created_at: {
          $gte: new Date(`${year}-${month}-${day}T${hour}:00:00.000Z`).toISOString(),
          $lt: new Date(`${year}-${month}-${day}T${tthour}:00:00.000Z`).toISOString()
        }
      }).count();
      day = parseInt(day);
      month = parseInt(month);
      year = parseInt(year);
      if(hour == 23){
        hour = 0;
        if([1,3,5,7,8,10,12].includes(month) && day == 31){
          day = 1;
          if(month == 12 ){
            month = 1;
            year++;
          }else{
            month++;
          }
        }else if([4,6,9,11].includes(month) && day == 30){
          day = 1;
          month++;
        }else if([2].includes(month) && day == 29 && (year % 4) == 0){
          day = 1;
          month++;
        }else if([2].includes(month) && day == 28 && (year % 4) != 0){
          day = 1;
          month++;
        }else{
          day++;
        }
      }else{
        hour++;
      }

      array.push(result);


      if(day == tday && month == tmonth && year == tyear){
        break;
      }


    }
    console.log("hourly count is :" + array);
    console.log("hourly label is :" + arr);
    res.status(200).send([array,arr]);
  } catch(error) {
    console.log(error);
  }
});

app.get("/api/gethourlyReddit", async function (req, res) {
  const arr = [];
  // console.log("entered getall");
  // const startdate = '2021-12-12';
  // const endDate = '2021-12-13';
  const startdate = req.query.startDate;
  const endDate = req.query.endDate;
  await client.connect();
  const db = client.db("myDbreddit");
  const filtercollection = db.collection("redditCommentsNew");
  let result;
  try {
    const myArray = startdate.split("-");
    const tmyArray = endDate.split("-");
    let array = [];
    let hour = 0;
    let day = myArray[2];
    let month = myArray[1];
    let year = myArray[0];
    let tday = tmyArray[2];
    let tmonth = tmyArray[1];
    let tyear = tmyArray[0];
    while(true) {
      hour = hour.toLocaleString('en-US',{minimumIntegerDigits: 2, useGrouping: false});
      let tthour = (parseInt(hour)+1).toLocaleString('en-US',{minimumIntegerDigits: 2, useGrouping: false});
      day = day.toLocaleString('en-US',{minimumIntegerDigits: 2, useGrouping: false});
      month = month.toLocaleString('en-US',{minimumIntegerDigits: 2, useGrouping: false});
      year = year.toLocaleString('en-US',{minimumIntegerDigits: 2, useGrouping: false});
      console.log(`${year}-${month}-${day}T${hour}:00:00.000+00:00` + "to" + `${year}-${month}-${day}T${tthour}:00:00.000+00:00`);
      if(hour == 24 || hour == 0){
        arr.push(day+"/"+month)
      }else{
        arr.push(hour+":00")
      }
      result = await filtercollection.find({
        time: {
          $gte: new Date(`${year}-${month}-${day}T${hour}:00:00.000+00:00`),
          $lt: new Date(`${year}-${month}-${day}T${tthour}:00:00.000+00:00`)
        }
      }).count();
      day = parseInt(day);
      month = parseInt(month);
      year = parseInt(year);
      if(hour == 23){
        hour = 0;
        if([1,3,5,7,8,10,12].includes(month) && day == 31){
          day = 1;
          if(month == 12 ){
            month = 1;
            year++;
          }else{
            month++;
          }
        }else if([4,6,9,11].includes(month) && day == 30){
          day = 1;
          month++;
        }else if([2].includes(month) && day == 29 && (year % 4) == 0){
          day = 1;
          month++;
        }else if([2].includes(month) && day == 28 && (year % 4) != 0){
          day = 1;
          month++;
        }else{
          day++;
        }
      }else{
        hour++;
      }
      console.log("result",result);
      array.push(result);


      if(day == tday && month == tmonth && year == tyear){
        break;
      }


    }
    console.log("hourly count is :" + array);
    console.log("hourly label is :" + arr);
    res.status(200).send([array,arr]);
  } catch(error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("app started and listening at http://localhost:3000/");
});
