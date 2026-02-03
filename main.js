async function getQueryResults(query) {
  var res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json`);
  var page = await res.json();
  var data = [];
  for (var i in page.query.search) {
    var dataRes = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${i.title}&prop=wikitext&format=json`);
    var pageData = await dataRes.json();
    data.push(...pageData.parse.wikitext["*"].split(/[\s.,;:]/));
  }
  var similarities = {};
  for (var i in data) {
    similarities[i] = (similarities[i] || 0) + 1;
  }
  return similarities;
}
