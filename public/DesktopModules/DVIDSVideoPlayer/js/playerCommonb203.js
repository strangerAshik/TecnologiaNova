// GLOBAL VARIABLES
var autoPlayTimer = null;
var mbOptions = null;
var videoFilesObj = {};
var videoHasPlayed = false;
var restartTimer = 0;
var captionsSelector = null;

// CHECK FOR VALID VIDEO ID OR PLAYLIST HASH, RETURN IF VALID
function getVideoIdentifier(key, type) {
    var videoIdOrPlaylistHash = "";
    if (videoSettings.videoId == 0 && videoSettings.featuredVideoId == 0 && videoSettings.playlistId == null) {
        return videoIdOrPlaylistHash;
    }
    var videoIdOrPlaylistHashObj = (type == "search") ? "id" : "hash";
    var videoIdOrPlaylistHashObjValue = (type == "search") ? "video:" : "";
    if (type == "search") {
        if (videoSettings.featuredVideoId == 0) {
            videoIdOrPlaylistHashObjValue += videoSettings.videoId;
        }
        else {
            videoIdOrPlaylistHashObjValue += videoSettings.featuredVideoId;
        }
    }
    else {
        videoIdOrPlaylistHashObjValue += videoSettings.playlistId;
    }
    var dataOptions = {
        api_type: type,
        api_key: key,
        max_results: "1"
    };
    dataOptions[videoIdOrPlaylistHashObj] = videoIdOrPlaylistHashObjValue;
    $.ajax({
        type: "GET",
        url: "/desktopmodules/DVIDSVideoPlayer/handlers/vidHandler.ashx",
        data: dataOptions,
        async: false,
        dataType: "json",
        success: function (item) {
            if (item.results && item.results.length != 0) {
                if (type == "search") {
                    if (videoSettings.featuredVideoId == "") {
                        videoIdOrPlaylistHash = videoSettings.videoId;
                    }
                    else {
                        videoIdOrPlaylistHash = videoSettings.featuredVideoId;
                    }
                }
                else {
                    videoIdOrPlaylistHash = videoSettings.playlistId;
                }
            }
        }
    });
    return videoIdOrPlaylistHash;
}

// HIGHLIGHT CURRENT TAG
function highlightCurrentTag(currentTag, doesFeaturedTagExist, featuredTag, featuredTagTitle, tagList) {
    tagList.find("a.chosenTag").removeClass("chosenTag");
    tagList.find("img.chosenImg").removeClass("chosenImg");
    if (doesFeaturedTagExist) {
        if (currentTag == featuredTagTitle || currentTag == "") {
            return;
        }
        else {
            featuredTag.children("a").removeClass("chosenTag").children("img").removeClass("chosenImg");
            tagList.children("a:contains(" + currentTag + ")").addClass("chosenTag").children("img").addClass("chosenImg");
        }
    }
    else {
        if (currentTag == "") {
            tagList.children("a").eq(0).addClass("chosenTag").children("img").addClass("chosenImg");
        }
        else {
            tagList.children("a:contains(" + currentTag + ")").addClass("chosenTag").children("img").addClass("chosenImg");
        }
    }
}

// DETERMINE TAG TO PASS TO PLAYER FOR INITIALIZATION
function setTitleAndCurrentTag(currentTag, doesFeaturedTagExist, featuredTagTitle, playlistTitle) {
    if (doesFeaturedTagExist && (currentTag == featuredTagTitle || currentTag == "")) {
        playlistTitle.html(featuredTagTitle);
        return featuredTagTitle;
    }
    else {
        playlistTitle.html(currentTag);
        if (currentTag == "Latest Videos") { currentTag = ""; }
        return currentTag;
    }
}

// INITIALIZE PLAYER
function initializePlayer() {
    myPlayer = new MediaElementPlayer('#dvidsPlayer', {
        pluginPath: "/DesktopModules/OMNITECShared/Plugins/MediaElement/",
        features: ["playpause", "progress", "current", "duration", "tracks", "multiBandwidth", "volume", "fullscreen"],
        success: function (mediaElement, domObject) {

            // EVENT LISTENER FOR WHEN VIDEO TIME HAS BEEN UPDATED
            mediaElement.addEventListener('timeupdate', function (e) {

                // IF VIDEO HAS NOT BEEN PLAYED AND SAVED POSITION IS GREATER THAN 0
                if (!videoHasPlayed && restartTimer > 0) {

                    // SET THE START TIME FROM THE RELATION IN SECONDS
                    myPlayer.setCurrentTime(restartTimer);

                    // SET THE VIDEO HAS PLAYED FLAG AND CLEAR THE TIMER
                    // OTHERWISE KEEP CONTINUAL LOOP GOING BACK TO THIS TIME
                    // THIS EVENT GETS CALLED AROUND EVERY 250MS
                    videoHasPlayed = true;
                    restartTimer = 0;
                }
            }, false);

            mbOptions.delegate("a", "click", function () {
                var obj = $(this);
                if (obj.hasClass("chosenMBLink")) {
                    return false;
                }
                else {
                    mbOptions.find("a.chosenMBLink").removeClass("chosenMBLink");
                    obj.addClass("chosenMBLink");
                    currentVideoHeight = obj.html().substring(0, obj.html().length - 1);
                    setPlayerSource(obj.attr("fileurl"));
                }
                return false;
            });
            // ASSIGN CAPTIONS SELECTOR TO JQUERY OBJECT, SET CLICK DELEGATE AND TURN ON CAPTIONS IF PREVIOUSLY ENABLED
            captionsSelector = $("div.mejs-captions-selector");
            captionsSelector.delegate("input:radio", "click", function () {
                var lang = this.value;
                if (lang == "none") {
                    videoSettings.ccEnabled = false;
                }
                else {
                    videoSettings.ccEnabled = true;
                }
            });
            turnOnCaptionsIfEnabled();
        }
    });
}

// SELECT VIDEO FILE FROM LIST OF FILES IN OBJECT
function selectVideoFile(height) {
    height = checkVideoHeight(height);
    for (var i = 0; i < videoFilesObj.length; i++) {
        if (videoFilesObj[i].height == height) {
            if (i != videoFilesObj.length - 1) {
                if (videoFilesObj[i + 1].height != height) {
                    return videoFilesObj[i].src;
                }
            }
            else {
                return videoFilesObj[i].src;
            }
        }
    }
}

// DEFINE MULTI-BANDWIDTH BUTTON CONTROL
MediaElementPlayer.prototype.buildmultiBandwidth = function (player, controls, layers, media) {
    var multiBandwidth = $("<div class='multiBandwidthButton'><button type='button' title='Multi-bandwidth Button'></button></div><div id='multiBandwidthOptions'></div>").appendTo(controls);
    mbOptions = $("#multiBandwidthOptions");
    createMultiBandwithAnchors(currentVideoHeight);
    multiBandwidth.hover(function () {
        mbOptions.show();
    },
    function () {
        mbOptions.hide();
    });
}

// BUILD MULTI-BANDWIDTH PLAYER TOOL
function createMultiBandwithAnchors(videoHeight) {
    videoHeight = checkVideoHeight(videoHeight);
    var mbOptions = $("#multiBandwidthOptions");
    var multiBandwidthHTML = [];
    for (var i = 0; i < videoFilesObj.length; i++) {
        if (i == videoFilesObj.length - 1) {
            multiBandwidthHTML.unshift("<a href='#' class='multiBandwidthAnchor' fileurl='" + videoFilesObj[i].src + "'>" + videoFilesObj[i].height + "p</a>");
        }
        else {
            if (videoFilesObj[i].height != videoFilesObj[i + 1].height) {
                multiBandwidthHTML.unshift("<a href='#' class='multiBandwidthAnchor' fileurl='" + videoFilesObj[i].src + "'>" + videoFilesObj[i].height + "p</a>");
            }
        }
    }
    multiBandwidthHTML.push("<div style='clear:both;'></div>");
    mbOptions.html(multiBandwidthHTML.join(""));
    var mbAnchors = mbOptions.children("a");
    for (i = 0; i < mbAnchors.length; i++) {
        if (mbAnchors.eq(i).html() == videoHeight + "p") {
            mbAnchors.eq(i).addClass("chosenMBLink");
        }
    }
    mbOptions.css("height", 20 * mbAnchors.length);
}

// CHECK IF CURRENT VIDEO HEIGHT EXISTS
function checkVideoHeight(heightToCheck) {
    tempHeight = videoFilesObj[videoFilesObj.length - 1].height;
    for (var i = 0; i < videoFilesObj.length; i++) {
        if (videoFilesObj[i].height == heightToCheck) {
            tempHeight = videoFilesObj[i].height;
            break;
        }
    }
    return tempHeight;
}

// SET PLAYER SOURCE AND PLAY VIDEO
function setPlayerSource(src) {
    videoHasPlayed = false;  // INIT
    createMultiBandwithAnchors(currentVideoHeight); // RECREATE THE ANCHORS
    var time = myPlayer.getCurrentTime(); // GET THE CURRENT TIME
    myPlayer.setSrc(src);
    myPlayer.load();
    playVideo();
    // SET THE TIMER TO THE CURRENT TIME SO IT WILL BE AVAILABLE WHEN THE PLAYER IS RELOADED
    if (time > 0) {
        restartTimer = time;
    }
}

// CREATE MM/DD/YYYY DATE STRING
function createDateString(date) {
    var justDate = date.substr(0, date.indexOf("T"));
    var dateParts = justDate.split("-");
    var formattedDate = parseInt(dateParts[1], 10) + "/" + parseInt(dateParts[2], 10) + "/" + parseInt(dateParts[0], 10);
    return formattedDate;
}

// AUTOMATICALLY PLAY VIDEO IF ID PASSED OR VIDEO CLICKED
function playVideo() {
    autoPlayTimer = setInterval(startVideo, 1000);
}

function startVideo() {
    var playButton = $(".mejs-overlay-play");
    if (playButton.size() != 0) {
        playButton.trigger("click");
        clearInterval(autoPlayTimer);
    }
}

// RENDER ADDTHIS BUTTONS USING TOOLBOX
function buildAddThisButtons(addThisObj, addThisVideoId, addThisTitle, addThisDescription) {
    if (window['addthis'] != undefined) {
        addthis.toolbox(".addthis_toolbox", { ui_508_compliant: true, services_exclude: "print", data_use_cookies: false }, { url: location.protocol + "//" + location.host + location.pathname + "?videoid=" + addThisVideoId, title: addThisTitle, description: addThisDescription });
    }
    }

// CONVERT INTEGER SECONDS TO hh:mm:ss FORMAT
function convertSecsToTime(num) {
    var hrs = Math.floor(num / 3600);
    var mins = Math.floor((num % 3600) / 60);
    var secs = num % 60;
    return (hrs > 0 ? hrs + ":" : "") + (((hrs > 0) && (mins < 10)) ? ("0" + mins) : mins) + ":" + (secs < 10 ? "0" : "") + secs;
}

// BUILD VIDEO PLAYER WITH ID PASSED IN QUERY STRING
function videoIdPassed(key, id, template, playerWidth, playerHeight) {
    var preLoad = (template == "marines_unit" || template == "usace") ? "none" : "auto";
    var tempAnchor = $("<a />");
    $.getJSON("/desktopmodules/DVIDSVideoPlayer/handlers/vidHandler.ashx?api_type=asset&api_key={apiKey}&id=video:{videoId}".replace("{apiKey}", key).replace("{videoId}", id), function (items) {
        tempAnchor.data("videotitle", items.results.title);
        tempAnchor.data("videoDescription", items.results.description);
        if (template == "marines" || template == "air_force" || template == "dgov" || template == "dod" || template == "usace_full") {
            tempAnchor.data("videocity", items.results.location.city).data("videostate", items.results.location.state).data("videocountry", items.results.location.country);
        }
        var file = items.results.files[(items.results.files.length > 1) ? 1 : 0].src;
        switch (template) {
            case "air_force":
            case "dod":
            case "marines":
            case "usace_full":
            case "tpc":
                videoFilesObj = items.results.files;
                var selectedFile = selectVideoFile(currentVideoHeight);
                $("#player").html("<video id='dvidsPlayer' class='dvidsPlayer' width='" + playerWidth + "' height='" + playerHeight + "' preload='" + preLoad + "' controls='controls=' src='" + selectedFile + "' poster='" + items.results.image + "'>" + getCaptions(items.results) + "</video>");
                tempAnchor.data("videoFile", selectedFile);
                initializePlayer();
                playVideo();
                break;
            case "dgov":
                videoFilesObj = items.results.files;
                var selectedFile = selectVideoFile(currentVideoHeight);
                $("#player").html("<video id='dvidsPlayer' style='width:100%;height:100%;' class='dvidsPlayer' width='100%' height='100%' preload='" + preLoad + "' controls='controls=' src='" + selectedFile + "' poster='" + items.results.image + "'>" + getCaptions(items.results) + "</video>");
                tempAnchor.data("videoFile", selectedFile);
                initializePlayer();
                playVideo();
                break;
            default:
                var playerHtml = "<video id='dvidsPlayer' class='dvidsPlayer' width='" + playerWidth + "' height='" + playerHeight + "' preload='" + preLoad + "' controls='controls=' src='" + file + "' poster='" + items.results.image + "'>" + getCaptions(items.results) + "</video>";
                tempAnchor.data("videoPlayer", playerHtml).data("videoFile", file);
                break;
        }
        if (template == "air_force" || template == "marines" || template == "marines_mobile" || template == "usace_full") {
            tempAnchor.data("videoDate", createDateString(items.results.date));
        }
        if (template == "air_force" || template == "dgov" || template == "dod" || template == "marines" || template == "tpc" || template == "tpc_show" || template=="usace_full") {
            $("#embedCodeInput").val("<iframe width='500' height='300' scrolling='no' frameborder='0' style='border: none; overflow: hidden; width: 500px; height: 300px;' allowtransparency='true' src='http://www.dvidshub.net/video/embed/" + id + "'></iframe>");
            $("#playerDownload").attr("href", tempAnchor.data("videoFile"));
            buildAddThisButtons($("div.addthis_toolbox"), id, tempAnchor.data("videotitle"), tempAnchor.data("videoDescription"));
        }
        playerBuilder(tempAnchor);
    });
}

// GET AND RETURN CAPTION TEXT FROM DVIDS
function getCaptions(results) {
    var closedCaption = "";
    if (results.closed_caption_urls != null) {
        closedCaption = "<track kind='subtitles' src='/desktopmodules/DVIDSVideoPlayer/Handlers/CaptionHandler.ashx?caption_url=" + escape(results.closed_caption_urls.srt) + "' srclang='en' />";
    }
    else {
        closedCaption = "<track kind='subtitles' src='/desktopmodules/DVIDSVideoPlayer/Handlers/CaptionHandler.ashx?caption_url=' srclang='en'>";
    }
    return closedCaption;
}

// TURN ON CAPTIONS IF PREVIOUSLY ENABLED
function turnOnCaptionsIfEnabled() {
    (function ($) {
        $(window).load(function () {
            if (captionsSelector.length > 0 && videoSettings.ccEnabled) {
                var englishCaptions = captionsSelector.find("input[value=en]");
                englishCaptions.click();
            }
        });
    })(jQuery);
}