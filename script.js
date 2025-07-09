const urls = [
   'https://www.catholic.org/xml/rss_dailyreadings.php',
  'https://www.onelittlelightofmine.com/feed/',
  'https://feeds.feedburner.com/catholicnewsagency/dailynews'
];
const textarea = document.querySelector('#feed-textarea > ul');

const date = new Date();
document.querySelector('#date').innerHTML = date.toLocaleString();

// Function to get the first three sentences or lines
function getFirstThreeSentences(text) {
  // Split by sentences (using .!? as delimiters) or newlines
  const sentences = text.split(/[.!?]+|\n/).filter(s => s.trim().length > 0);
  // Take first three, join back, and ensure a period at the end
  return sentences.slice(0, 3).join('. ') + (sentences.length > 0 ? '.' : '');
}

Promise.all(urls.map(url => feednami.load(url)))
  .then(feeds => {
    textarea.value = '';
    // Combine and sort entries by publication date (newest first)
    const allEntries = feeds.flatMap(feed => feed.entries)
      .sort((a, b) => new Date(b.date || b.pubDate) - new Date(a.date || a.pubDate))
      .slice(0, 20); // Take top 20
    for (let entry of allEntries) {
      // create a list element
      let li = document.createElement('li');
      // Truncate description to first three sentences/lines
      const shortDesc = getFirstThreeSentences(entry.description);
      // add HTML content to list items
      li.innerHTML = `<h4><a target="_blank" href="${entry.link}">${entry.title}</a></h4><p>${shortDesc}</p>`;
      // append HTML content to list 
      textarea.appendChild(li);
    }
  })
  .catch(error => {
    console.error('Error loading feeds:', error);
  });