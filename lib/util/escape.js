module.exports = function(text) {
  if (typeof text === 'undefined') return '';
  return text.toLowerCase().replace(/[^\w]+/g, '-');
}
