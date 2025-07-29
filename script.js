
const searchBtn = document.getElementById('searchBtn');
const omdbSearchInput = document.getElementById('omdbSearchInput');
const omdbResults = document.getElementById('omdbResults');
const toggleDark = document.getElementById('toggleDark');
const userSelect = document.getElementById('userSelect');
const addUserBtn = document.getElementById('addUserBtn');
const newUserName = document.getElementById('newUserName');
const movieLibrary = document.getElementById('movieLibrary');

let currentUser = null;
let movieData = JSON.parse(localStorage.getItem('movieData')) || {};

// 🔄 Load dark mode on page load
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
}

// 🌗 Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const mode = document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled';
  localStorage.setItem('darkMode', mode);
}

// 👤 Create New User
addUserBtn.addEventListener('click', () => {
  const username = newUserName.value.trim();
  if (!username) return;
  if (!movieData[username]) {
    movieData[username] = [];
    saveToStorage();
    populateUserSelect();
  }
  newUserName.value = '';
  userSelect.value = username;
  currentUser = username;
  renderLibrary();
});

// 👥 User Selection
userSelect.addEventListener('change', () => {
  currentUser = userSelect.value;
  renderLibrary();
});

// 🔍 OMDb Search
searchBtn.addEventListener('click', () => {
  const query = omdbSearchInput.value.trim();
  if (!query) return;

  fetch(`https://www.omdbapi.com/?apikey=af0720b9&s=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      omdbResults.innerHTML = '';
      if (data.Search) {
        data.Search.forEach(movie => {
          fetch(`https://www.omdbapi.com/?apikey=af0720b9&i=${movie.imdbID}`)
            .then(res => res.json())
            .then(fullMovie => renderOMDbResult(fullMovie));
        });
      } else {
        omdbResults.innerHTML = `<p>No results found.</p>`;
      }
    });
});

// 🧠 Save Data to Storage
function saveToStorage() {
  localStorage.setItem('movieData', JSON.stringify(movieData));
}

// 🖼️ Render OMDb Result Card
function renderOMDbResult(movie) {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225?text=No+Image';

  const card = document.createElement('div');
  card.className = 'omdb-result-card';
  card.innerHTML = `
    <h3>${movie.Title}</h3>
    <img src="${poster}" alt="${movie.Title}">
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
    <button class="add-to-library" data-id="${movie.imdbID}">Add to Library</button>
  `;

  card.querySelector('button').addEventListener('click', () => {
    if (!currentUser) return alert('Please select a user first.');
    const userMovies = movieData[currentUser] || [];
    const alreadyAdded = userMovies.some(m => m.imdbID === movie.imdbID);
    if (!alreadyAdded) {
      userMovies.push(movie);
      movieData[currentUser] = userMovies;
      saveToStorage();
      renderLibrary();
    }
  });

  omdbResults.appendChild(card);
}

// 🎞️ Render User's Movie Library
function renderLibrary() {
  movieLibrary.innerHTML = '';
  if (!currentUser || !movieData[currentUser]) return;

  movieData[currentUser].forEach(movie => {
    const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225?text=No+Image';

    const card = document.createElement('div');
    card.className = 'library-card';
    card.innerHTML = `
      <h3>${movie.Title}</h3>
      <img src="${poster}" alt="${movie.Title}">
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <button class="remove-btn">Remove</button>
    `;

    card.querySelector('button').addEventListener('click', () => {
      movieData[currentUser] = movieData[currentUser].filter(m => m.imdbID !== movie.imdbID);
      saveToStorage();
      renderLibrary();
    });

    movieLibrary.appendChild(card);
  });
}

// 🔁 Populate User Dropdown
function populateUserSelect() {
  userSelect.innerHTML = '<option value="">Select user</option>';
  Object.keys(movieData).forEach(user => {
    const option = document.createElement('option');
    option.value = user;
    option.textContent = user;
    userSelect.appendChild(option);
  });
}

// 🔃 Initial Load
populateUserSelect();
renderLibrary();
