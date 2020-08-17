/**
 * This module adds a copy button to all code examples in the docs.
 */

!function() {

// Look for code samples and set up a copy button on each
$('[data-docs-code]').each(function(index, value) {
  var copyBtnId = 'copy-btn-' + index.toString();
  var $button = $('<button class="docs-code-copy" id="' + copyBtnId + '">Copy</button>');

  var text = $(this).find('code').text()
    .replace('&lt;', '<')
    .replace('&gt;', '>');

  $(this).prepend($button);

  $(document).on('click', '#' + copyBtnId, function() {
    navigator.clipboard.writeText(text).then(function() {
      // Change the text of the copy button when it's clicked on
      $button.text('Copied!');
      window.setTimeout(function() {
        $button.text('Copy');
      }, 3000);
    }, function() {
      // Log errors on copy failure
      console.error('Action:', event.action);
      console.error('Trigger:', event.trigger);
    });
  });

});

}();
