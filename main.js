async function getQueryResults(query) {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`);
    const page = await res.json();

    if (!page.query || !page.query.search) return {};

    const similarities = {};

    for (const entry of page.query.search) {
      try {
        // Use pageid instead of title for more reliability
        const dataRes = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&pageid=${entry.pageid}&prop=wikitext&format=json&origin=*`);
        const pageData = await dataRes.json();

        // Safety check: skip if parse failed
        if (!pageData.parse || !pageData.parse.wikitext) continue;

        const wikitext = pageData.parse.wikitext["*"];
        
        // Use a better regex to get actual words and avoid empty strings
        const words = wikitext.toLowerCase().split(/[^a-z0-9']+/);

        for (const word of words) {
          if (word.length > 1) { // Skip empty strings and single letters
            similarities[word] = (similarities[word] || 0) + 1;
          }
        }
      } catch (innerError) {
        console.warn(`Skipping a page due to error: ${innerError}`);
      }
    }

    return similarities;
  } catch (outerError) {
    console.error("Primary fetch failed:", outerError);
    return {};
  }
}
