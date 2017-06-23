// From http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();

// 2. This code loads the IFrame Player API code asynchronously.
if ($('#main-video').is('*')) {
  var $videoOuter = $('#subpage-intro-video');
  var $videoInner = $videoOuter.find('.docs-video-inner');
  var $videoOverlay = $videoOuter.find('.video-overlay');
  var videoId = $('#main-video').data().video;
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube mainPlayer)
  //    after the API code downloads.
  var mainPlayer, embeddedPlayers = [];

  function onYouTubeIframeAPIReady() {
    mainPlayer = new YT.Player('main-video', {
      height: '385',
      width: '690',
      videoId: videoId,
      playerVars: {showinfo: '0'},
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });

    $('[data-linkable-video]').each(function() {
      var $vid= $(this);
      var id = this.id;
      var videoId = $vid.data().linkableVideo;
      embeddedPlayers.push({id: id, video: videoId, player: new YT.Player(id, {
        events: {
          'onReady': onPlayerReady
        }
      })});
    });
  }

  // 4. The API will call this function when the video mainPlayer is ready.
  function onPlayerReady(event) {
    if(QueryString.video == videoId) {
      mainPlayer.playVideo();
    } else if(QueryString.video) {
      for(var i = 0; i < embeddedPlayers.length; i++) {
        if(QueryString.video == embeddedPlayers[i].video) {
          $(window).scrollTop($('#' + embeddedPlayers[i].id).offset().top - 200);

          // Don't show the main vid if we're autoplaying a different one.
          $videoInner.removeClass('autostick').removeClass('expanded');
          $videoOverlay.removeClass('expanded');
          embeddedPlayers[i].player.playVideo();
        }
      }
    }
  }

  // 5. The API calls this function when the mainPlayer's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the mainPlayer should play for six seconds and then stop.
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      $videoInner.addClass('playing').addClass('autostick');
    } else {
      $videoInner.removeClass('playing');
    }
  }

  var $window = $(window);
  
  $(window).on("scroll", function() {
    var videoOffset = $videoOuter.offset().top;
    var videoHeight = $videoOuter.height();
    var myScrollPosition = $(this).scrollTop();
 
    if (myScrollPosition > (videoOffset + videoHeight - 300)) {
      $videoInner.addClass('is-stuck');
      $videoOverlay.addClass('is-stuck');
    } else {
      $videoInner.removeClass('is-stuck');
      $videoOverlay.removeClass('is-stuck');
    }
  });

  $('[data-close-video]').on('click', function() {
    mainPlayer.stopVideo();
    $videoInner.removeClass('autostick').removeClass('expanded');
    $videoOverlay.removeClass('expanded');
  });

  $('[data-expand-contract-video]').on('click', function() {
    $videoInner.toggleClass('expanded');
    $videoOverlay.toggleClass('expanded');
  });

  var getSeconds = function(link) {
    var time = $(link).data().openVideo;
    var sections = String(time).split(':');
    var seconds;
    if(sections.length > 1) { 
      seconds = (60 * Number(sections[0])) + Number(sections[1]);
    } else {
      seconds = Number(sections[0]);
    }
    return seconds;
  }
  var href = $('#docs-mobile-video-link').attr('href');
  $('[data-open-video]').each(function() {
    var seconds = getSeconds(this);
    this.href = href + '&t=' + seconds;
    this.target = '_blank';
  });

  $('[data-open-video]').on('click', function(e) {
    if(Foundation.MediaQuery.is('small only')) {
      return;
    }
    e.preventDefault();
    var seconds = getSeconds(this)
    mainPlayer.seekTo(seconds, true);
    mainPlayer.playVideo();
    $videoOverlay.addClass('expanded');
    $videoInner.addClass('expanded').addClass('autostick');
  });
}

