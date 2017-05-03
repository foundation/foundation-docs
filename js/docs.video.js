$('.docs-video-trigger').click(function() {
  var container = $(this).next('.docs-video-container');
  container.toggleClass('is-Open');
  var embed = container.find('.responsive-embed');
  var iframe = embed.find('iframe');
  iframe.detach().appendTo(embed);
});
