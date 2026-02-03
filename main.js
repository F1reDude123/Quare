async function getQueryResults(query) {
  var res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`);
  var page = await res.json();
  var data = [];
  for (var i of page.query.search) {
    var dataRes = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(i.title)}&prop=wikitext&format=json&origin=*`);
    var pageData = await dataRes.json();
    data.push(...pageData.parse.wikitext["*"].split(/[\s.,;:]/));
  }
  var similarities = {};
  for (var i of data) {
    similarities[i] = (similarities[i] || 0) + 1;
  }
  return similarities;
}
