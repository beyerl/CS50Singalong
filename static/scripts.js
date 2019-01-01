var player;

// This function creates an <iframe> (and YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: 'sOEAD-gfJ_M',
        events: {
        //'onReady': onPlayerReady,
        //'onStateChange': onPlayerStateChange
        }
    });

    $("#player").hide();
}

// Execute when the DOM is fully loaded
$(document).ready(function() {
    //Make search button trigger search on click
    $("#search").on("click", function(){
        q = $("#searchInput").val();

        if(q != ""){
            search(q);
        }
    });
});

function search(q){
    let result;
    let error;

    // Escape spaces
    q = q.replace(" ", "%20")

    // Get song results for query from backend
    let parameters = {
        q: q
    };
    let audDURL = "https://api.audd.io/findLyrics/?q=" + q;
    $.getJSON(audDURL, function(data, textStatus, jqXHR) {
        console.log(data);
        // If no data returned, show error message
        if (!data)
        {
            error = "<p>Sorry, I didn't get data back</p>";
            displayError(error);
        }

        // If query not sucessfull show error message
        else if(data.status != "success"){
            error = "<p>Sorry, something when wrong when talking to audD. Status-Code: " + data.status + "</p>";
            displayError(error);
        }

        else if(data.status == "success" && data.result.length == 0){
            error = "<p>Sorry, no songs were found</p>";
            displayError(error);
        }

        else {
            // Empty result list
            $("#result-list").empty();

            // Check if results contain youtube-links
            for (i in data.result){

                result = data.result[i];

                let media = JSON.parse(result.media);

                for(j in media)
                {
                    if (media[j].provider == "youtube" && media[j].url != undefined){
                        youtubeLink = media[j].url;
                        
                        result["videoId"] = youtubeLink.replace("http://www.youtube.com/watch?v=", "");

                        // Display results if found
                        displayResult(result); 
                    }
                }
            }
        }
    });        
}

function displayError(error){
    // Empty result list
    $("#result-list").empty();

    $("#result-list").append(error);    
}

function displayResult(result){

    let artist = result.artist;
    let title = result.title;

    let resultText = "<li><a href=#>" + artist + " - " + title + "</a></li>";

    $("#result-list").append(resultText);

    // Get build clickhandler for entries in list
    let parameters = {
        result: result
    };
    $("#result-list a").last().on("click", parameters, openResult);
}

function openResult(event){
    let result = event.data.result;

    // Load video into player
    $("#player").show();

    let mediaContentUrl = "https://www.youtube.com/embed/" + result["videoId"];
    console.log(mediaContentUrl);
    player.loadVideoByUrl(mediaContentUrl);
    //loadVideoById(result["videoId"]);

    //Load lyrics into view
    $("#lyrcontent").empty();

    let lyrics = result.lyrics.replace(/\r\n/g,"<br>");
    
    $("#lyrcontent").append(lyrics);
}

