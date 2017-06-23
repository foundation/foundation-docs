/**
 * This module activates on a Kitchen Sink page, and changes how code examples are rendered.
 * The code example is hidden, and can be revealed with a toggle.
 */

!function() {

var $ks = $('#docs-kitchen-sink');
if (!$ks.length) return;

$ks.find('[data-ks-codepen]').each(function() {
  var $codepen = $(this);
  var $code = $codepen.next('[data-docs-code]');

  $link = $('<a class="docs-code-toggle">Toggle Code</a>');
  $link.on('click.docs', function() {
    $codepen.slideToggle(250);
    $code.slideToggle(250);
  });
  $link.insertBefore(this);
  $code.addClass('kitchen-sink').hide(0);
  $codepen.addClass('kitchen-sink').hide(0);
});

}();
