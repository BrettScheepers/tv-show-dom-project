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

const containerElem = document.querySelector('.container');
const testShow = getOneEpisode();
const allShows = getAllEpisodes();
const footer = document.createElement('footer');

footer.innerHTML = `<p>Data came from <a href="https://www.tvmaze.com/">TVMaze.com</a></p>`

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
  containerElem.appendChild(card);
}

allShows.forEach( show => addEpisode(show));
containerElem.appendChild(footer)