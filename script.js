// Variables
const cardContainerElem = document.querySelector('.card-container');
const selectSearch = document.getElementById('selectSearch');
const liveSearch = document.getElementById('liveSearch');
const episodeDisplayCount = document.getElementById('episodeDisplayCount');

// Get all episodes
let allEpisodes = null;

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

//Function that displays every episode
function displayAllEpisodes(allEpisodes) {
  allEpisodes.forEach( episode => addEpisode(episode));
  allEpisodes.forEach( episode => {
    const option = document.createElement('option');
    option.value = `${episode.name}`;
    option.innerText = `S${padZero(episode.season)}E${padZero(episode.number)} - ${episode.name}`;
    selectSearch.appendChild(option);
  })
  let count = allEpisodes.length;
  episodeDisplayCount.innerHTML = `Displaying ${count}/${allEpisodes.length} episodes`;
}

//Fetch
fetch('https://api.tvmaze.com/shows/82/episodes')
  .then(response => response.json())
  .then(data => {
    console.log('made an api call')
    allEpisodes = data;
    displayAllEpisodes(allEpisodes);
  })
  .catch(error => console.log(error))
