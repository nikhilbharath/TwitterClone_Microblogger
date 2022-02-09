 const url ="https://api.twitter.com/1.1/search/tweets.json" ;
 const axios = require("axios");
 

class Twitter {
  get(query, count, result_type, tweetmode, max_id) {
    return axios.get(url, {
      params: {
        q: query,
        count: count,
        result_type: result_type,
        tweet_mode: tweetmode,
        max_id:max_id
      },
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`,
      },
    });
  }
}

module.exports = Twitter;