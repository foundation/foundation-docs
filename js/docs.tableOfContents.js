/**
 * This module generates a table of contents from the <h2>s on a page.
 */

!function() {

var $h2s = $('.docs-component h2');
var $toc = $('[data-docs-toc]');

$h2s.each(function() {
  // Ignore <h2>s inside of a rendered code sample
  if ($(this).parents('.docs-code-live').length) return;

  var text = $(this).text();
  var anchor = $(this).children('a').attr('href');

  $toc.append('<li><a href="'+anchor+'">'+text+'</a></li>');
});

}();

//var $window = $(window);
//var $container = $('.docs-component');
//var $TOC = $('#docsToc');
//var $TOCparent = $TOC.parent();
//
//if($TOC.is('*')) {
//  var fixedTop = $container.offset().top;
//  var innerHeight = 0;
//  $container.children().each(function() {innerHeight += $(this).height()});
//  var containerHeight = $container.height();
//  var handler = function() {
//    var tocHeight = $TOC.height();
//    var parentOffset = $TOCparent.offset().top;
//    var windowScroll = $window.scrollTop();
//    var containerScroll = $container.scrollTop();
//    var visibleNav = (containerHeight + fixedTop) - windowScroll;
//
//    if (visibleNav < tocHeight || containerScroll + tocHeight >= innerHeight) {
//      $TOC.removeClass('is-fixed');
//      $TOC.addClass('is-docked').css({top: 'auto'});
//    } else if ((windowScroll > fixedTop && parentOffset < windowScroll)|| (parentOffset < fixedTop - windowScroll)) {
//      var offset = Math.max(fixedTop - windowScroll, 0)
//      $TOC.removeClass('is-docked');
//      $TOC.addClass('is-fixed').css({top: offset});
//    } else {
//      $TOC.removeClass('is-fixed');
//      $TOC.removeClass('is-docked');
//    }
//  };
//  $(document).on('load scroll', handler);
//  $container.on('scroll', handler);
//}
