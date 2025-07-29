const API_KEY = 'af0720b9';
let movies = [];
let users = [];
let currentUser = null;

// Create User
function createUser() {
  const newUser = document.getElementById('newUserName').value.trim();
  if (newUser) {
    users.push(newUser);
    currentUser = newUser;
    updateUserSelect();
    document.getElementById('newUserName').value = '';
  }
}

function updateUserSelect() {
  const userSelect = document.getElementById('userSelect');
  userSelect.innerHTML = '';
  users.forEach(user => {
    const option = document.createElement('option');
    option.text = user;
    option.value = user;
    userSelect.appendChild(option);
  });
  if (currentUser) userSelect.value = currentUser;
}

// OMDb Search
async function searchOMDb() {
  const title = document.getElementById('omdbSearchInput').value.trim();
  const resultDiv = document.getElementById('omdbResults');
  resultDiv.innerHTML = '';

  if (!title) return;

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}`);
    const data = await res.json();

    if (data.Response === 'True') {
      const moviesList = data.Search.slice(0, 10); // show top 10 results

      for (let movie of moviesList) {
        const fullDetails = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
        const movieData = await fullDetails.json();

        const card = document.createElement('div');
        card.className = 'omdb-result-card';
        card.innerHTML = `
          <img src="${movieData.Poster !== 'N/A' ? movieData.Poster : ''}" alt="${movieData.Title}">
          <h4>${movieData.Title} (${movieData.Year})</h4>
          <p><strong>Genre:</strong> ${movieData.Genre}</p>
          <p><strong>Rating:</strong> ${movieData.imdbRating}/10</p>
          <button onclick='addOMDbMovie(${JSON.stringify(movieData)})'>Add to Library</button>
        `;
        resultDiv.appendChild(card);
      }
    } else {
      resultDiv.innerHTML = `<p style="color:red">❌ No results found for "${title}". Try another title.</p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red">❌ Error fetching data.</p>`;
    console.error(err);
  }
}


// Add Movie from OMDb
function addOMDbMovie(data) {
  const movie = {
    title: data.Title,
    genre: data.Genre.split(',')[0],
    rating: parseFloat(data.imdbRating) || 0,
    user: currentUser || 'Unknown',
    poster: data.Poster !== 'N/A' ? data.Poster : null
  };
  movies.push(movie);
  displayMovies();
  document.getElementById('omdbSearchInput').value = '';
  document.getElementById('omdbResults').innerHTML = '';
}

// Display Movies
function displayMovies() {
  const container = document.getElementById('movieLibrary');
  const search = document.getElementById('searchInput').value.toLowerCase();
  const filter = document.getElementById('filterGenre').value;

  container.innerHTML = '';

  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(search) &&
    (filter === '' || m.genre === filter)
  );

  filtered.forEach(movie => {
    const div = document.createElement('div');
    div.className = 'movie';
    div.innerHTML = `
      <h3>${movie.title}</h3>
      ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}" style="width:100px;float:right;margin-left:10px">` : ''}
      <p>Genre: ${movie.genre}</p>
      <p>Rating: ${movie.rating}/10</p>
      <p>Added by: ${movie.user}</p>
    `;
    container.appendChild(div);
  });
}

// Events
document.getElementById('searchInput').addEventListener('input', displayMovies);
document.getElementById('filterGenre').addEventListener('change', displayMovies);
document.getElementById('userSelect').addEventListener('change', function () {
  currentUser = this.value;
});

// Dark mode init
document.getElementById('toggleDark').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}
