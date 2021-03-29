//You can edit ALL of the code here
// function setup() {
//   const allEpisodes = getAllEpisodes();
//   makePageForEpisodes(allEpisodes);
// }

// function makePageForEpisodes(episodeList) {
//   const rootElem = document.getElementById("main");
//   rootElem.textContent = `Got ${episodeList.length} episode(s)`;
// }

// window.onload = setup;

// Variables
const cardContainerElem = document.querySelector('.card-container');
const selectSearch = document.getElementById('selectSearch');
const liveSearch = document.getElementById('liveSearch');
const episodeDisplayCount = document.getElementById('episodeDisplayCount');

const testEpisode = getOneEpisode();
const allEpisodes = getAllEpisodes();

// Functions
function padZero(num) {
  if (num < 10) return `0${num}`;
  else return num;
}

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

liveSearch.addEventListener('input', (e) => {
  selectSearch.value = 'all';
  let regex = new RegExp(e.currentTarget.value, 'gi');

  cardContainerElem.innerHTML = '';
  allEpisodes.filter( episode => regex.test(episode.name) || regex.test(episode.summary))
             .forEach( episode => addEpisode(episode));
  let count = allEpisodes.filter( episode => regex.test(episode.name) || regex.test(episode.summary)).length;
  episodeDisplayCount.innerHTML = `Displaying ${count}/${allEpisodes.length} episodes`;
})

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

// Action
// On Load
allEpisodes.forEach( episode => addEpisode(episode));
allEpisodes.forEach( episode => {
  const option = document.createElement('option');
  option.value = `${episode.name}`;
  option.innerText = `S${padZero(episode.season)}E${padZero(episode.number)} - ${episode.name}`;
  selectSearch.appendChild(option);
})