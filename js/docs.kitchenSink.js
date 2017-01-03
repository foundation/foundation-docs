/**
 * This module activates on a Kitchen Sink page, and changes how code examples are rendered.
 * The code example is hidden, and can be revealed with a toggle.
 */

!function() {

var $ks = $('#docs-kitchen-sink');
if (!$ks.length) return;

$ks.find('[data-docs-code]').each(function() {
  var $code = $(this);

  $link = $('<a class="docs-code-toggle">Toggle Code</a>');
  $link.on('click.docs', function() {
    $code.slideToggle(250);
  });
  $link.insertBefore(this);
  $code.addClass('kitchen-sink').hide(0);
});

}();
