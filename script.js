// Variables
const cardContainerElem = document.querySelector('.card-container');
const showSearch = document.querySelector('#showSearch');
const selectSearch = document.getElementById('selectSearch');
const liveSearch = document.getElementById('liveSearch');
const episodeDisplayCount = document.getElementById('episodeDisplayCount');

// Get all episodes
let allEpisodes = getAllEpisodes();
let allShows = getAllShows().sort((a, b) => a.name.localeCompare(b.name));

console.log(allShows)

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

//Function to add every show to showSearch
function addShowsToShowList() {
  allShows.forEach( show => {
    const option = document.createElement('option');
    option.value = `${show.name}`;
    option.innerText = `${show.name}`;
    showSearch.appendChild(option);
  })
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

//EventListener that displays episode list when showSearch has input
showSearch.addEventListener('change', (e) => {
  let selectedShow = allShows.filter(show => show.name === e.currentTarget.value);
  let selectedShowId = selectedShow[0].id;

  fetchEpisodes(selectedShowId);
})

addShowsToShowList();
displayAllEpisodes(allEpisodes);