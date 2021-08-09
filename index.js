const form = document.querySelector('.js-search-form')
form.addEventListener('submit', handleSubmit)

async function handleSubmit(e) {
  e.preventDefault()

  const input = document.querySelector('.js-search-input')
  const searchQuery = input.value.trim()

  const searchResults = document.querySelector('.js-search-results')
  searchResults.innerHTML = ""

  const spinner = document.querySelector('.js-spinner')
  spinner.classList.remove('hidden')

  try {
    let results = await wikiSearch(searchQuery)
    console.log(results)
    console.log(results.query)
    console.log(results.query.search.length)
    if (results.query.search.length > 0) {
      // results.query.search.forEach(res => console.log(`${res.title}`))
      displayResults(results.query.search)
    } else {
      displayResults([{ pageid: 0, title: "No results found: ", snippet: "Please try another search term!" }])
    }
  } catch (error) {
    console.log(`Oops: ${error}`)
  } finally {
    spinner.classList.add('hidden')
  }
}

function displayResults(results) {
  const searchResults = document.querySelector('.js-search-results');

  results.forEach(result => {
    const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

    searchResults.insertAdjacentHTML(
      'beforeend',
      `<div class="result-item">
        <h3 class="result-title">
          <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
        </h3>
        <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
        <span class="result-snippet">${result.snippet}</span><br>
      </div>`
    );
  });
}

async function wikiSearch(q) {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${q}`
  const response = await fetch(endpoint)

  if (!response.ok) {
    throw Error(response.statusText)
  }
  const json = await response.json()

  return json
}