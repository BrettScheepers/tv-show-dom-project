// Variables
const cardContainerElem = document.querySelector('.card-container');
const showSearch = document.querySelector('#showSearch');
const selectSearch = document.getElementById('selectSearch');
const liveSearch = document.getElementById('liveSearch');
const episodeDisplayCount = document.getElementById('episodeDisplayCount');
const filteringDiv = document.getElementById('filtering-text')
const showLiveSearch = document.getElementById('showLiveSearch')
const showDisplayCount = document.getElementById('showDisplayCount')

// Get all episodes
let allEpisodes = getAllEpisodes();
let allShows = getAllShows().sort((a, b) => a.name.localeCompare(b.name));
let oneShow = getOneShow();

// Functions
//Displays episode number with padded zeros
function padZero(num) {
  if (num < 10) return `0${num}`;
  else return num;
}

// Creates an episode card and appends it to the card container
function addEpisode(episode) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
                      <div class="name-div">
                        <h3>${episode.name} - S${padZero(episode.season)}E${padZero(episode.number)}</h3>
                      </div>
                      <img src="${episode.image.medium}" alt="">
                      ${episode.summary}
                   `
  cardContainerElem.appendChild(card);
}

//Function to check image
function checkForImage(showImage) {
  if (showImage === null) return ''
  else return showImage;
}

// Creates an show card and appends it to the card container
function addShow(show) {
  const showCard = document.createElement('div');
  showCard.classList.add('show-card');
  showCard.innerHTML = `
                        <div class="show-name-div">
                          <h1>${show.name}</h1>
                        </div>         
                        <img src="${checkForImage(show.image.medium)}" alt=""></img>
                        <div class="summary-div">
                          ${show.summary}
                        </div>
                        <div class="show-info-div">
                          <ul>
                            <li><strong>Rated</strong>: ${show.rating.average}</li>
                            <li><strong>Genres</strong>: ${show.genres.join(' | ')}</li>
                            <li><strong>Status</strong>: ${show.status}</li>
                            <li><strong>Runtime</strong>: ${show.runtime}</li>
                          </ul>
                        </div>
                   `
  cardContainerElem.appendChild(showCard);
}

//Function to display all shows
function displayAllShows() {
  cardContainerElem.innerHTML = '';
  allShows.forEach(show => addShow(show));
  let showListLength = allShows.length;
  console.log(showListLength)
  showDisplayCount.textContent = `Found ${showListLength} shows`;
}

//Function to add every show to showSearch
function addShowsToShowList(showList) {
  showSearch.innerHTML = `<option value="all">All Shows</option>`
  showList.forEach( show => {
    const option = document.createElement('option');
    option.value = `${show.name}`;
    option.innerText = `${show.name}`;
    showSearch.appendChild(option);
  })
  console.log(showList);
}

//Function that displays every episode
function displayAllEpisodes(allEpisodes) {
  cardContainerElem.innerHTML = '';
  allEpisodes.forEach( episode => addEpisode(episode));
  selectSearch.innerHTML = `<option value="all">All</option>`;
  allEpisodes.forEach( episode => {
    const option = document.createElement('option');
    option.value = `${episode.name}`;
    option.innerText = `S${padZero(episode.season)}E${padZero(episode.number)} - ${episode.name}`;
    selectSearch.appendChild(option);
  })
  let count = allEpisodes.length;
  episodeDisplayCount.innerHTML = `Displaying ${count}/${allEpisodes.length} episodes`;
}

//Fetch Function
function fetchEpisodes(id) {
  //Fetch
  fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
    .then(response => response.json())
    .then(data => {
      console.log('made an api call')
      allEpisodes = data;
      displayAllEpisodes(allEpisodes);
    })
    .catch(error => console.log(error))
}

//Live Search event listener
liveSearch.addEventListener('input', (e) => {
  selectSearch.value = 'all';
  let regex = new RegExp(e.currentTarget.value, 'gi');

  cardContainerElem.innerHTML = '';
  allEpisodes.filter( episode => regex.test(episode.name) || regex.test(episode.summary))
             .forEach( episode => addEpisode(episode));
  let count = allEpisodes.filter( episode => regex.test(episode.name) || regex.test(episode.summary)).length;
  episodeDisplayCount.innerHTML = `Displaying ${count}/${allEpisodes.length} episodes`;
})

//Select search event listener
selectSearch.addEventListener('change', (e) => {
  liveSearch.value = '';
  cardContainerElem.innerHTML = '';
  if (e.currentTarget.value === 'all') {
    allEpisodes.forEach( episode => addEpisode(episode));
    let count = allEpisodes.length;
    episodeDisplayCount.innerHTML = `Displaying ${count}/${allEpisodes.length} episodes`;
  } 
  else {
    allEpisodes.filter( episode => episode.name === e.currentTarget.value)
               .forEach( episode => addEpisode(episode));
    let count = allEpisodes.filter( episode => episode.name === e.currentTarget.value).length;
    episodeDisplayCount.innerHTML = `Displaying ${count}/${allEpisodes.length} episodes`;
  }
})

//Live Search event listener for shows
showLiveSearch.addEventListener('input', (e) => {
  let regex = new RegExp(e.currentTarget.value, 'gi');
  console.log(regex)

  cardContainerElem.innerHTML = '';
  let filteredShows = allShows.filter( show => regex.test(show.name) || regex.test(show.summary));
  filteredShows.forEach( show => addShow(show));
  let count = filteredShows.length;
  showDisplayCount.innerHTML = `Found ${count} shows`;
  addShowsToShowList(filteredShows);
})

//EventListener that displays episode list when showSearch has input
showSearch.addEventListener('change', (e) => {
  if (e.currentTarget.value == 'all') {
    selectSearch.classList.add('on-show-hide')
    liveSearch.classList.add('on-show-hide')
    episodeDisplayCount.classList.add('on-show-hide')

    filteringDiv.classList.remove('on-episode-hide')
    showLiveSearch.classList.remove('on-episode-hide')
    showDisplayCount.classList.remove('on-episode-hide')

    displayAllShows(allShows)
  } else {
    selectSearch.classList.remove('on-show-hide')
    liveSearch.classList.remove('on-show-hide')
    episodeDisplayCount.classList.remove('on-show-hide')

    filteringDiv.classList.add('on-episode-hide')
    showLiveSearch.classList.add('on-episode-hide')
    showDisplayCount.classList.add('on-episode-hide')

    let selectedShow = allShows.filter(show => show.name === e.currentTarget.value);
    let selectedShowId = selectedShow[0].id;

    fetchEpisodes(selectedShowId);
  }
})

addShowsToShowList(allShows);
displayAllShows(allShows);