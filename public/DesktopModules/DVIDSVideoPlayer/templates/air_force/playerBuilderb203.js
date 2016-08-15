// GLOBAL VARIABLES
var myPlayer = null;
var defaultVideoHeight = 406;
var currentVideoHeight = 0;

(function ($) {
  $(document).ready(function () {

    // CREATE JQUERY OBJECTS FOR LATER MANIPULATION
    var pageLimiter = 9;
    var containerDiv = $("#playerModuleContainer");
    var playerMetaWrapper = $("#playerMetadataWrapper");
    var shareBox = $("#playerShareInfo");
    var addThisDiv = $("div.addthis_toolbox");
    var embedBox = $("#playerEmbedInfo");
    var embedInput = $("#embedCodeInput");
    var downloadLink = $("#playerDownload");
    var searchBox = $("#searchTerms");
    var searchClearButton = $("#searchClear");
    var videos = $("#videoList");
    var pager = $("#pager");
    var tagList = $("#videoTagList");
    var playlistTitle = $("#videoPlaylistTitleText");
    var firstTagAnchor = tagList.children("a").eq(0);
    var searchLeft = $("#searchLeft").eq(0);

    // FEATURED TAG SETUP
    var featuredVideosPlaylistId = "126fe9e1f16cdab197f7cbe436e24824";
    var featuredTag = $("#featuredTag");
    var doesFeaturedTagExist = (featuredTag.val() === undefined) ? false : true;
    var featuredTagTitle = featuredTag.children("a").eq(0).children("div.tagName").eq(0).html();
 
    // SET CURRENT TAG
    var currentTag = (videoSettings.videoTag === null || videoSettings.videoTag == "") ? ((doesFeaturedTagExist) ? featuredTagTitle : firstTagAnchor.children("div.tagName").eq(0).html()) : videoSettings.videoTag;
    
    // CHECK QUERYSTRING FOR VIDEO ID OR PLAYLIST HASH
    var videoId = getVideoIdentifier(videoSettings.key, "search");
    if (videoId !== "") {
      videoIdPassed(videoSettings.key, videoId, "air_force", 922, 519);
    }

    // HIGHLIGHT CURRENT TAG, SET PLAYLIST TITLE AND GET VIDEOS
    highlightCurrentTag(currentTag, doesFeaturedTagExist, featuredTag, featuredTagTitle, tagList);
    getVideos("", setTitleAndCurrentTag(currentTag, doesFeaturedTagExist, featuredTagTitle, playlistTitle));

    // Encode HTML Entities 
    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // LOAD UNIT VIDEOS
    function getVideos(search, keyword) {
      $("#noSearchMatch").remove();
      videos.children("div.vidBlock,#noMatch").empty().remove();
      videos.css("left", "0px");
      var getJSONData;
      if (keyword !== undefined && keyword !== null && keyword == featuredTagTitle) {
        getJSONData = {
          api_type: "playlist/get",
          api_key: videoSettings.key,
          hash: featuredVideosPlaylistId
        };
      }
      else {
        getJSONData = {
          api_type: "search",
          api_key: videoSettings.key,
          max_results: videoSettings.maxResults,
          category: videoSettings.categoryList,
          tag_exclude: "extra",
          sort: "date"
        };
      }
      if (search != "") { getJSONData["q"] = search };
      if (keyword != "" && getJSONData["api_type"] != "playlist/get") { getJSONData["keywords"] = keyword };
      if (videoSettings.unitOrBranch == "branch") { getJSONData["branch"] = videoSettings.branch; }
      if (videoSettings.unitOrBranch == "unit" || videoSettings.unitOrBranch == null) { getJSONData["unit_name"] = videoSettings.unitName; }
      if (videoSettings.takenAfterDate != "" && videoSettings.takenAfterDate != null) { getJSONData["from_date"] = videoSettings.takenAfterDate; }

      $.getJSON("/desktopmodules/DVIDSVideoPlayer/handlers/vidHandler.ashx?", getJSONData, function (items) {
        var anchorArray = [];
        $.each(items.results, function () {
          anchorArray.push(buildShell(this));
        });
        videos.html(anchorArray.join(""));
        pager.show();
        var anchors = videos.children("a");
        if (anchors.length > 0) {
          for (var i = 0; i < anchors.length; i = i + pageLimiter) {
            anchors.slice(i, i + pageLimiter).wrapAll("<div class='vidBlock'></div>");
          }
          var currentVidBlock = videos.children("div.vidBlock").eq(videoSettings.videoPage - 1);
          shellFiller(currentVidBlock);
          videos.width(Math.ceil(anchors.length / pageLimiter) * 660);
          videos.css("left", (videoSettings.videoPage - 1) * -660);
        }
        else {
          if (search !== "") {
            videos.html("<div id='noSearchMatch'>No videos match your search criteria</div>");
            pager.hide();
            videos.width(containerDiv.width());
          }
          else {
            containerDiv.html("<div>No videos available</div>");
          }
        }

        // SET UP PAGING
        var pagerIsAnimating = false;
        pager.riboPager("destroy").riboPager({
          CurrentPage: videoSettings.videoPage,
          MaxPages: Math.ceil(anchors.length / pageLimiter),
          NextPageObject: pager.children("a.next").eq(0),
          PreviousPageObject: pager.children("a.previous").eq(0),
          FirstPageObject: pager.children("input.first").eq(0),
          LastPageObject: pager.children("input.last").eq(0),
          BeforeNext: function () {
            return !pagerIsAnimating;
          },
          OnNext: function (currentPage, nextPage, settings) {
          	pagerIsAnimating = true;
          	videoSettings.videoPage = currentPage;
            var nextVidBlock = videos.children("div.vidBlock").eq(currentPage - 1);
            shellFiller(nextVidBlock, function () {
              var currentLeftValue = parseInt(videos.css("left").replace("px", ""), 10);
              videos.animate({ left: currentLeftValue - 660 + "px" }, 500, function () { pagerIsAnimating = false; });
            });
          },
          BeforePrevious: function () {
            return !pagerIsAnimating;

          },
          OnPrevious: function (currentPage, nextPage, settings) {
          	pagerIsAnimating = true;
          	videoSettings.videoPage = currentPage;
            var prevVidBlock = videos.children("div.vidBlock").eq(currentPage - 1);
            shellFiller(prevVidBlock, function () {
              var currentLeftValue = parseInt(videos.css("left").replace("px", ""), 10);
              videos.animate({ left: currentLeftValue + 660 + "px" }, 500, function () { pagerIsAnimating = false; });
            });
          },
          LoopPages: false,
          PagerTextObject: pager.children("div.pagerText").eq(0),
          PagerTextFormat: "{currentPage} / {maxPages}"
        });
      });
    }

    // BUILD VIDEO ANCHOR SHELLS
    function buildShell(video) {
      var idString = video.id;
      var idInt = idString.substring(6);
      return "<a href='" + videoSettings.cleanUrl + idInt + "&videotag=" + currentTag + "' data-videoid='" + video.id + "' data-videotitle='" + escape(video.title) + "' data-videocity='" + video.city + "' data-videostate='" + video.state + "' data-videocountry='" + video.country + "' data-videoidinteger='" + idInt + "' class='vidLink'><div class='metadata'><div class='videoThumbnailPlayButton'></div><div class='thumbnail'></div></div></a>";
    }

    // FILL VIDEO ANCHOR SHELLS WITH THUMBNAIL AND METADATA
    function shellFiller(vidBlock, callbackFunction) {
      var isFilled = vidBlock.data("alreadyFilled");
      if (isFilled == true) {
        if (callbackFunction) {
          callbackFunction();
          return;
        }
        else { return; }
      }
      $.each(vidBlock.children("a"), function () {
        var vidObj = $(this);
        $.getJSON("/desktopmodules/DVIDSVideoPlayer/handlers/vidHandler.ashx?api_type=asset&api_key={apiKey}&id={videoId}&thumb_width=197".replace("{apiKey}", videoSettings.key).replace("{videoId}", vidObj.data("videoid")), function (items) {
          var img = (items.results.thumbnail !== undefined && items.results.thumbnail.url !== undefined) ? "<img src='" + items.results.thumbnail.url + "' alt='" + items.results.title + "' />" : "<img src='/desktopmodules/DVIDSVideoPlayer/templates/air_force/images/AFTV_defaultThumbnail.jpg' alt='" + items.results.title + "' />";
          vidObj.data("videoFiles", items.results.files).data("videoThumbnail", img).data("videoImage", items.results.image).data("videoDuration", convertSecsToTime(items.results.duration)).data("videoDescription", items.results.description).data("videoDate", createDateString(items.results.date));
          vidObj.children("div.metadata").children("div.thumbnail").html(vidObj.data("videoThumbnail"));
          vidObj.children("div.metadata").append("<div class='vidDateDuration'>" + vidObj.data("videoDate") + " - " + vidObj.data("videoDuration") + "</div>").append("<div class='vidTitleText'>" + unescape(vidObj.data("videotitle")) + "</div>");
          textChopper(vidObj.children("div.metadata").eq(0), vidObj, "title");
          

          // CHECK IF FIRST BLOCK AND CHECK IF FIRST ANCHOR BEING LOADED; IF BOTH ARE TRUE, LOAD VIDEO IN PLAYER, SET EMBED AND SET RSS                   
          if (vidBlock.index() == 0) {
            if (vidObj.index() == 0) {
              if (videoId == "") {
                videoFilesObj = vidObj.data("videoFiles");
                var selectedVideoFile = selectVideoFile(currentVideoHeight);
                $("#player").html("<video id='dvidsPlayer' class='dvidsPlayer' width='922' height='519' preload='none' controls='controls=' src='" + selectedVideoFile + "' poster='" + vidObj.data("videoImage") + "'>" + getCaptions(items.results) + "</video>");
                initializePlayer();
                playerBuilder(vidObj);
                embedInput.val("<iframe width='500' height='300' scrolling='no' frameborder='0' style='border: none; overflow: hidden; width: 500px; height: 300px;' allowtransparency='true' src='http://www.dvidshub.net/video/embed/" + vidObj.data("videoidinteger") + "'></iframe>");
                buildAddThisButtons(addThisDiv, vidObj.data("videoidinteger"), vidObj.data("videotitle"), vidObj.data("videoDescription"));
                downloadLink.attr("href", selectedVideoFile);
                vidObj.addClass("chosenVid");
              }
            }
          }
          if (callbackFunction) {
            if (vidObj.index() + 1 == vidBlock.children("a").size()) {
              callbackFunction();
            }
          }
        });
      });
      vidBlock.data("alreadyFilled", true);
    }

    // LISTENER TO LOAD VIDEOS IN PLAYER WHEN CLICKED
    videos.delegate("a", "click", function () {
      var obj = $(this);
      if (obj.hasClass("chosenVid")) {
        return false;
      }
      else {
        videos.find("a.chosenVid").removeClass("chosenVid");
        videos.find("div.chosen").removeClass("chosen");
        obj.attr("href", obj.attr("href") + "&videopage=" + videoSettings.videoPage + "&ccenabled=" + videoSettings.ccEnabled);
      }
      return true;
    });

    // LISTENER TO HANDLE FEATURED TAG LINK
    featuredTag.delegate("a", "click", function () {
      var obj = $(this);
      if (obj.hasClass("chosenTag")) {
        return false;
      }
      else {
        tagList.find("a.chosenTag").removeClass("chosenTag");
        tagList.find("img.chosenImg").removeClass("chosenImg");
        featuredTag.children("a").addClass("chosenTag").children("img").addClass("chosenImg");
        currentTag = featuredTagTitle;
        videoSettings.videoPage = 1;
        playlistTitle.html(featuredTagTitle);
        getVideos("", featuredTagTitle);
        searchBox.val("Search");
      }
      return false;
    });
    
    // LISTENER TO HANDLE TAG LIST LINKS
    tagList.delegate("a", "click", function () {
      var obj = $(this);
      if (obj.hasClass("chosenTag")) {
        return false;
      }
      else {
        tagList.find("a.chosenTag").removeClass("chosenTag");
        tagList.find("img.chosenImg").removeClass("chosenImg");
        if (doesFeaturedTagExist) {
          featuredTag.children("a").removeClass("chosenTag").children("img").removeClass("chosenImg");
        }
        obj.addClass("chosenTag");
        obj.children("img").addClass("chosenImg");
        var tag = obj.children("div.tagName").html();
        currentTag = tag;
        videoSettings.videoPage = 1;
        playlistTitle.html(tag);
        getVideos("", tag);
        searchBox.val("Search");
      }
      return false;
    });

    // SEARCH BLOCK EVENT HANDLERS
    searchBox.on("keydown", function (evt) {
      if (evt.which === 13) {
          searchLeft.trigger("click");
          return false;
      }
    });

    searchClearButton.click(function () {
      if (doesFeaturedTagExist) {
        featuredTag.children("a").addClass("chosenTag").children("img").addClass("chosenImg");
        playlistTitle.html(featuredTagTitle);
        getVideos("", featuredTagTitle);
      }
      else {
        tagList.find("a:contains(" + currentTag + ")").addClass("chosenTag").children("img.tagArrow").addClass("chosenImg");
        playlistTitle.html(currentTag);
        getVideos("", currentTag);
      }
      searchBox.val("Search");
      searchClearButton.hide();
      return false;
    });

    searchBox.click(function () {
      if (searchBox.val() == "Search") {
        searchBox.val("");
      }
    });

    searchBox.blur(function () {
      if (searchBox.val() == "") {
        searchBox.val("Search");
      }
    });

    searchLeft.on("click", function () {
        var terms = document.getElementById("searchTerms").value;
        terms = htmlEntities(terms);
        if (terms != "") {
            getVideos(terms, "");
            tagList.find("a.chosenTag").removeClass("chosenTag");
            tagList.find("img.chosenImg").removeClass("chosenImg");
            if (doesFeaturedTagExist) {
                featuredTag.children("a").removeClass("chosenTag").children("img").removeClass("chosenImg");
            }
            playlistTitle.html("Search Results");
            searchClearButton.show();
        }
        return false;
    });

    // SHARE INFO HANDLERS
    $("#playerShare").click(function () {
      embedBox.hide();
      shareBox.show();
      return false;
    });

    $("#closeShareBox").click(function () {
      shareBox.hide();
    });

    // EMBED INFO HANDLERS
    $("#playerEmbed").click(function () {
      shareBox.hide();
      embedBox.show();
      return false;
    });

    $("#closeEmbedBox").click(function () {
      embedBox.hide();
    });

    if (window['addthis'] != undefined) {
        addthis.init();
    }

  });
})(jQuery);

// BUILD VIDEO PLAYER
function playerBuilder(vidAnchor) {
  var playerCont = $("#playerContainer");
  $("#currentVidDate").html(vidAnchor.data("videoDate"));
  $("#currentVidTitle").html(unescape(vidAnchor.data("videotitle")));
  $("#currentVidDescription").html(vidAnchor.data("videoDescription"));

  var locationString = "";
  var cityExists = (vidAnchor.data("videocity") != "undefined" && vidAnchor.data("videocity") != "") ? true : false;
  var stateExists = (vidAnchor.data("videostate") != "undefined" && vidAnchor.data("videostate") != "") ? true : false;
  var countryExists = (vidAnchor.data("videocountry") != "undefined" && vidAnchor.data("videocountry") != "") ? true : false;

  // BUILD LOCATION STRING
  if (cityExists) {
    locationString += vidAnchor.data("videocity");
  }
  if (stateExists) {
    if (cityExists) {
      locationString += ", ";
    }
    locationString += vidAnchor.data("videostate");
  }
  if (countryExists) {
    if (cityExists || stateExists) {
      locationString += ", ";
    }
    locationString += vidAnchor.data("videocountry");
  }

  playerCont.children("#currentVidLocation").html(locationString);
  createMultiBandwithAnchors(currentVideoHeight);
  textChopper(playerCont, $("#videoPlayer"), "desc");
}

// SHORTEN LENGTHY TEXT
function textChopper(innerObj, outerObj, toChop) {
    var originalText = "";
    var maxRemoved = 2000;
  switch (toChop) {
    case "desc":
      var descriptionObj = innerObj.children("#currentVidDescription").eq(0);
      originalText = descriptionObj.text();
      originalText = originalText.substr(0, 1000);
      while (innerObj.height() > outerObj.height() && maxRemoved > 0 && originalText.length > 0) {
        originalText = originalText.substr(0, originalText.length - 1);
        descriptionObj.text(originalText + "...");
        maxRemoved = maxRemoved - 1;
      }
      break;
    case "title":
      var titleObj = innerObj.children("div.vidTitleText").eq(0);
      originalText = titleObj.text();
      while (innerObj.height() > outerObj.height() && maxRemoved > 0 && originalText.length > 0) {
        originalText = originalText.substr(0, originalText.length - 1);
        titleObj.text(originalText + "...");
        maxRemoved = maxRemoved - 1;
      }
      break;
  }
}