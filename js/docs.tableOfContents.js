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

// Initialize Magellan on the generated table of contents
if ($toc.length) {
  if (typeof Foundation !== 'undefined') {
    new Foundation.Magellan($toc, {});
  }
}

}();


var $footer = $('#footer');
var $window = $(window);
var $TOC = $('#docsToc');

if($TOC.is('*')) {
  $(window).on("load scroll", function() {
      var footerOffset = $footer.offset().top;
      var myScrollPosition = $(this).scrollTop();
      var windowHeight = $window.height();
      var footerHeight = $footer.outerHeight();

      if ((myScrollPosition + windowHeight - footerHeight) > footerOffset) {
        $TOC.addClass('fixed');
      } else {
        $TOC.removeClass('fixed');
      }
  });
}
