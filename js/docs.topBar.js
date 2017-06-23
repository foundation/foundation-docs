(function() {
  var prev = 0;
  var $window = $(window);
  var nav = $('.docs-sticky-top-bar');

  $window.on('scroll', function(){
    var scrollTop = $window.scrollTop();
    nav.toggleClass('mobile-hidden', scrollTop > prev && scrollTop > 100);
    prev = scrollTop;
  });

  $('#inline-search').on('on.zf.toggler', function() {
    $(this).find('input').focus();
    $('.search-button').addClass('search-open');
  });
  $('#inline-search').on('off.zf.toggler', function() {
    $(this).find('input').blur();
    $('.search-button').removeClass('search-open');
  });
})();
