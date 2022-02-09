// const URL = "https://twitterclone-1.herokuapp.com/twitter";
const URL = "http://localhost:3000/twitter";
onNextPage = () => {
  if (nextpageUrl) {
    getTwitterData(true);
  }
};
/**
 * Retrive Twitter Data from API
 */
const getTwitterData = (nextPage = false) => {
  var keyword = document.querySelector(".searchclass").value;
  var encodedkey = encodeURIComponent(keyword);
  if (!keyword) {
    return;
  }
  let fullurl = `${URL}?q=${encodedkey}&count=10&result_type=recent&tweet_mode=extended`;
  if (nextPage && nextpageUrl) {
    fullurl = nextpageUrl+"&tweet_mode=extended";
  }
  fetch(fullurl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      buildTweets(data.statuses, nextPage);
      saveNextPage(data.search_metadata.next_results);
      nextPageButtonVisibility(data.search_metadata);
    })
    .catch((err) => {
      console.log(err);
    });
};
onEnter = (e) => {
  if (e.key == "Enter") {
    getTwitterData();
  }
};

/**
 * Save the next page data
 */
let nextpageUrl = null;
const saveNextPage = (data) => {
  if (data) {
    nextpageUrl = `${URL}${data}`;
  } else {
    nextpageUrl = null;
  }
};

/**
 * Handle when a user clicks on a trend
 */
const selectTrend = (e) => {
  document.querySelector(".searchclass").value = e.innerText;
  getTwitterData();
};

/**
 * Set the visibility of next page based on if there is data on next page
 */
const nextPageButtonVisibility = (metadata) => {
  if (metadata.next_results) {
    document.querySelector(".next-page").style.visibility = "visible";
  } else {
    document.querySelector(".next-page").style.visibility = "hidden";
  }
};

/**
 * Build Tweets HTML based on Data from API
 */
const buildTweets = (tweets, nextPage) => {
  let twitercontent = "";
  tweets.map((item) => {
    let createdtime = moment(item.created_at).fromNow();
    twitercontent += `
   <div class="single-tweet">
          <div class="tweet-user">
            <div class="tweet-user-pic">
              <div class="profile-img-test" style=" background-image: url(${item.user.profile_image_url_https})"></div>
            </div>
            <div class="tweet-user-name">
              <div class="tweet-user-fullname">
                <p>${item.user.name}</p>
              </div>
              <div class="tweet-user-id">
                <p>@${item.user.screen_name}</p>
              </div>
            </div>
          </div>`;
    if (item.extended_entities && item.extended_entities.media.length > 0) {
      twitercontent += buildImages(item.extended_entities.media);
      twitercontent += buildVideo(item.extended_entities.media);
    }
    twitercontent += `<div class="tweet-content">
              <p>${item.full_text}</p>
            </div>
            <div class="tweet-time">
              <p>${createdtime}</p>
            </div>
          </div>
    `;
  });
  if (nextPage) {
    document
      .querySelector(".tweet-api")
      .insertAdjacentHTML("beforeend", twitercontent);
  } else {
    document.querySelector(".tweet-api").innerHTML = twitercontent;
  }
};
/**
 * Build HTML for Tweets Images
 */
const buildImages = (mediaList) => {
  let imagecontent = "";
  let imagExists = false;
  imagecontent += `<div class="tweet-container-img">`;
  mediaList.map((item) => {
    if (item.type == "photo") {
      imagExists = true;
      let media = item.media_url_https;
      imagecontent += ` <div class="tweet-img" style="background-image:url(${media})" ></div>`;
    }
  });
  imagecontent += `</div>`;
  return imagExists ? imagecontent : "";
};

/**
 * Build HTML for Tweets Video
 */
const buildVideo = (mediaList) => {
  let videocontent = "";
  let videoExists = false;
  let videogifExists = false;
  mediaList.map((item) => {
    if (item.type == "video") {
      videoExists = true;
      // let video = item.video_info.variants[0]["url"];
      let video = item.video_info.variants.find((variant)=>variant.content_type=='video/mp4');
      videocontent += `<div class="tweet-video">
            <video controls>
              <source src="${video.url}" type="video/mp4">                        
            </video>
       </div>`;
    } else if (item.type == "animated_gif") {
      videogifExists = true;
      let videogif = item.video_info.variants.find(
        (variant) => variant.content_type == "video/mp4"
      );
      videocontent += `<div class="tweet-video">
            <video loop autoplay>
              <source src="${videogif.url}" type="video/mp4">                        
            </video>
       </div>`;
    }
  });
  return videogifExists ? videocontent : "";
};

const trendReport = () =>{
  //console.log("onclick working");
  location.href = 'report.html';
}
