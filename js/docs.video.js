// 2. This code loads the IFrame Player API code asynchronously.

if ($('#main-video').is('*')) {
  var $videoOuter = $('#subpage-intro-video');
  var $videoInner = $videoOuter.find('.docs-video-inner');
  var videoId = $('#main-video').data().video;
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('main-video', {
      height: '385',
      width: '690',
      videoId: videoId,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      $videoInner.addClass('playing');
    } else {
      if(!$videoInner.hasClass('is-stuck')) {
        $videoInner.removeClass('playing');
      }
    }
  }

  var $window = $(window);
  
  $(window).on("scroll", function() {
    var videoOffset = $videoOuter.offset().top;
    var myScrollPosition = $(this).scrollTop();
 
    if (myScrollPosition > videoOffset) {
      $videoInner.addClass('is-stuck');
    } else {
      $videoInner.removeClass('is-stuck');
    }
  });

  $('[data-close-video]').on('click', function() {
    player.stopVideo();
    $videoInner.removeClass('playing');
  });

  $('[data-open-video]').on('click', function() {
    var time = $(this).data().openVideo;
    var sections = String(time).split(':');
    var seconds;
    if(sections.length > 1) { 
      seconds = (60 * Number(sections[0])) + Number(sections[1]);
    } else {
      seconds = Number(sections[0]);
    }
    player.seekTo(seconds, true);
    player.playVideo();
  });

}
