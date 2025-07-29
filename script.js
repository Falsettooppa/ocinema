
const API_KEY = 'af0720b9';

const userSelect = document.getElementById('userSelect');
const newUserName = document.getElementById('newUserName');
const addUserBtn = document.getElementById('addUserBtn');
const movieLibrary = document.getElementById('movieLibrary');
const omdbSearchInput = document.getElementById('omdbSearchInput');
const searchBtn = document.getElementById('searchBtn');
const omdbResults = document.getElementById('omdbResults');
const searchInput = document.getElementById('searchInput');
const filterGenre = document.getElementById('filterGenre');
const toggleDark = document.getElementById('toggleDark');

let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = localStorage.getItem('currentUser') || '';
let movieData = JSON.parse(localStorage.getItem('movieData')) || {};

function saveToStorage() {
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('movieData', JSON.stringify(movieData));
  localStorage.setItem('currentUser', currentUser);
}

function renderUsers() {
  userSelect.innerHTML = '';
  users.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    userSelect.appendChild(option);
  });
  if (currentUser && users.includes(currentUser)) {
    userSelect.value = currentUser;
  }
}

function renderLibrary() {
  movieLibrary.innerHTML = '';
  const movies = movieData[currentUser] || [];
  const filterText = searchInput.value.toLowerCase();
  const genre = filterGenre.value;

  movies
    .filter(movie => {
      const matchesText = movie.Title.toLowerCase().includes(filterText);
      const matchesGenre = genre ? (movie.Genre && movie.Genre.includes(genre)) : true;
      return matchesText && matchesGenre;
    })
    .forEach(movie => {
      const div = document.createElement('div');
      div.className = 'movie';
      div.innerHTML = `
        <h2>${movie.Title}</h2>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <img src="${movie.Poster}" alt="${movie.Title}">
        <button class="remove-btn" data-id="${movie.imdbID}">Remove</button>
      `;
      movieLibrary.appendChild(div);
    });
}

// Add user
addUserBtn.addEventListener('click', () => {
  const name = newUserName.value.trim();
  if (name && !users.includes(name)) {
    users.push(name);
    movieData[name] = [];
    currentUser = name;
    saveToStorage();
    renderUsers();
    renderLibrary();
  }
  newUserName.value = '';
});

// Change active user
userSelect.addEventListener('change', () => {
  currentUser = userSelect.value;
  saveToStorage();
  renderLibrary();
});

// Search and display OMDb results
searchBtn.addEventListener('click', () => {
  const query = omdbSearchInput.value.trim();
  if (!query) return;

  omdbResults.innerHTML = '<p>Loading...</p>';

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      omdbResults.innerHTML = '';
      if (data.Search) {
        data.Search.forEach(movie => {
          fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
            .then(res => res.json())
            .then(fullMovie => {
              const card = document.createElement('div');
              card.className = 'omdb-result-card';
              card.innerHTML = `
                <h3>${fullMovie.Title}</h3>
                <img src="${fullMovie.Poster}" alt="${fullMovie.Title}">
                <p><strong>Director:</strong> ${fullMovie.Director}</p>
                <p><strong>Actors:</strong> ${fullMovie.Actors}</p>
                <p><strong>Plot:</strong> ${fullMovie.Plot}</p>
                <button class="add-to-library" data-id="${fullMovie.imdbID}">Add to Library</button>
              `;
              card.querySelector('button').addEventListener('click', () => {
                if (!currentUser) return alert('Please select a user first.');
                const userMovies = movieData[currentUser] || [];
                const alreadyAdded = userMovies.some(m => m.imdbID === fullMovie.imdbID);
                if (!alreadyAdded) {
                  userMovies.push(fullMovie);
                  movieData[currentUser] = userMovies;
                  saveToStorage();
                  renderLibrary();
                }
              });
              omdbResults.appendChild(card);
            });
        });
      } else {
        omdbResults.innerHTML = `<p style="color:red">❌ No results found for "${query}".</p>`;
      }
    })
    .catch(err => {
      console.error(err);
      omdbResults.innerHTML = `<p style="color:red">❌ Failed to fetch movie data.</p>`;
    });
});

// Remove movie from library
movieLibrary.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-btn')) {
    const id = e.target.dataset.id;
    movieData[currentUser] = movieData[currentUser].filter(m => m.imdbID !== id);
    saveToStorage();
    renderLibrary();
  }
});

// Search/filter library
searchInput.addEventListener('input', renderLibrary);
filterGenre.addEventListener('change', renderLibrary);

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

toggleDark.addEventListener('click', toggleDarkMode);

// Initialize theme
function initDarkMode() {
  const isDark = JSON.parse(localStorage.getItem('darkMode'));
  if (isDark) {
    document.body.classList.add('dark-mode');
  }
}

// Initialization
renderUsers();
renderLibrary();
initDarkMode();
