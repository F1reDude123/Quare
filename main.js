async function getQueryResults(query) {
  var page = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json`);
  var data = [];
  for (var i in page.query.search) {
    var pageData = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${i}&prop=wikitext&format=json`);
    data.push(...pageData.split(/ \.,;/));
  }
  var similarities = {};
  for (var i in data) {
    similarities[i] = (similarities[i] || 0) + 1;
  }
  return similarities;
}
