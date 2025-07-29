// const API_KEY = 'af0720b9';
// let movies = [];
// let users = [];
// let currentUser = null;

// // Create User
// function createUser() {
//   const newUser = document.getElementById('newUserName').value.trim();
//   if (newUser) {
//     users.push(newUser);
//     currentUser = newUser;
//     updateUserSelect();
//     document.getElementById('newUserName').value = '';
//   }
// }

// function updateUserSelect() {
//   const userSelect = document.getElementById('userSelect');
//   userSelect.innerHTML = '';
//   users.forEach(user => {
//     const option = document.createElement('option');
//     option.text = user;
//     option.value = user;
//     userSelect.appendChild(option);
//   });
//   if (currentUser) userSelect.value = currentUser;
// }

// // OMDb Search
// async function searchOMDb() {
//   const title = document.getElementById('omdbSearchInput').value.trim();
//   const resultDiv = document.getElementById('omdbResults');
//   resultDiv.innerHTML = '';

//   if (!title) return;

//   try {
//     const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}`);
//     const data = await res.json();

//     if (data.Response === 'True') {
//       const moviesList = data.Search.slice(0, 10); // show top 10 results

//       for (let movie of moviesList) {
//         const fullDetails = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
//         const movieData = await fullDetails.json();

//         const card = document.createElement('div');
//         card.className = 'omdb-result-card';
//         card.innerHTML = `
//           <img src="${movieData.Poster !== 'N/A' ? movieData.Poster : ''}" alt="${movieData.Title}">
//           <h4>${movieData.Title} (${movieData.Year})</h4>
//           <p><strong>Genre:</strong> ${movieData.Genre}</p>
//           <p><strong>Rating:</strong> ${movieData.imdbRating}/10</p>
//           <button onclick='addOMDbMovie(${JSON.stringify(movieData)})'>Add to Library</button>
//         `;
//         resultDiv.appendChild(card);
//       }
//     } else {
//       resultDiv.innerHTML = `<p style="color:red">❌ No results found for "${title}". Try another title.</p>`;
//     }
//   } catch (err) {
//     resultDiv.innerHTML = `<p style="color:red">❌ Error fetching data.</p>`;
//     console.error(err);
//   }
// }


// // Add Movie from OMDb
// function addOMDbMovie(data) {
//   const movie = {
//     title: data.Title,
//     genre: data.Genre.split(',')[0],
//     rating: parseFloat(data.imdbRating) || 0,
//     user: currentUser || 'Unknown',
//     poster: data.Poster !== 'N/A' ? data.Poster : null
//   };
//   movies.push(movie);
//   displayMovies();
//   document.getElementById('omdbSearchInput').value = '';
//   document.getElementById('omdbResults').innerHTML = '';
// }

// // Display Movies
// function displayMovies() {
//   const container = document.getElementById('movieLibrary');
//   const search = document.getElementById('searchInput').value.toLowerCase();
//   const filter = document.getElementById('filterGenre').value;

//   container.innerHTML = '';

//   const filtered = movies.filter(m =>
//     m.title.toLowerCase().includes(search) &&
//     (filter === '' || m.genre === filter)
//   );

//   filtered.forEach(movie => {
//     const div = document.createElement('div');
//     div.className = 'movie';
//     div.innerHTML = `
//       <h3>${movie.title}</h3>
//       ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}" style="width:100px;float:right;margin-left:10px">` : ''}
//       <p>Genre: ${movie.genre}</p>
//       <p>Rating: ${movie.rating}/10</p>
//       <p>Added by: ${movie.user}</p>
//     `;
//     container.appendChild(div);
//   });
// }

// // Events
// document.getElementById('searchInput').addEventListener('input', displayMovies);
// document.getElementById('filterGenre').addEventListener('change', displayMovies);
// document.getElementById('userSelect').addEventListener('change', function () {
//   currentUser = this.value;
// });

// // Dark mode init
// document.getElementById('toggleDark').addEventListener('click', () => {
//   document.body.classList.toggle('dark');
//   const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
//   localStorage.setItem('theme', theme);
// });
// if (localStorage.getItem('theme') === 'dark') {
//   document.body.classList.add('dark');
// }
const API_KEY = 'af0720b9';
let movies = [];
let users = [];
let currentUser = null;

// DOM Elements
const userInput = document.getElementById('newUserName');
const addUserBtn = document.getElementById('addUserBtn');
const userSelect = document.getElementById('userSelect');
const omdbInput = document.getElementById('omdbSearchInput');
const omdbResults = document.getElementById('omdbResults');
const filterGenre = document.getElementById('filterGenre');
const searchInput = document.getElementById('searchInput');
const movieLibrary = document.getElementById('movieLibrary');
const toggleDarkBtn = document.getElementById('toggleDark');

// Create User
const createUser = () => {
  const newUser = userInput.value.trim();
  if (!newUser) return;

  if (!users.includes(newUser)) users.push(newUser);
  currentUser = newUser;
  updateUserSelect();
  userInput.value = '';
};

const updateUserSelect = () => {
  userSelect.innerHTML = users.map(user => `
    <option value="${user}">${user}</option>
  `).join('');
  if (currentUser) userSelect.value = currentUser;
};

// Search OMDb
const searchOMDb = async () => {
  const query = omdbInput.value.trim();
  omdbResults.innerHTML = '';
  if (!query) return;

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.Response === 'True') {
      const topResults = data.Search.slice(0, 10);

      for (const item of topResults) {
        const detailsRes = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${item.imdbID}`);
        const movie = await detailsRes.json();

        const card = document.createElement('div');
        card.className = 'omdb-result-card';
        card.innerHTML = `
          <img src="${movie.Poster !== 'N/A' ? movie.Poster : ''}" alt="${movie.Title}">
          <h4>${movie.Title} (${movie.Year})</h4>
          <p><strong>Genre:</strong> ${movie.Genre}</p>
          <p><strong>Rating:</strong> ${movie.imdbRating}/10</p>
          <button class="add-btn">Add to Library</button>
        `;
        card.querySelector('.add-btn').addEventListener('click', () => addOMDbMovie(movie));
        omdbResults.appendChild(card);
      }
    } else {
      omdbResults.innerHTML = `<p style="color:red">❌ No results found for "${query}".</p>`;
    }
  } catch (error) {
    console.error(error);
    omdbResults.innerHTML = `<p style="color:red">❌ Failed to fetch movie data.</p>`;
  }
};

// Add movie to library
const addOMDbMovie = (data) => {
  const movie = {
    title: data.Title,
    genre: data.Genre?.split(',')[0] || 'Unknown',
    rating: parseFloat(data.imdbRating) || 0,
    user: currentUser || 'Unknown',
    poster: data.Poster !== 'N/A' ? data.Poster : null
  };

  movies.push(movie);
  displayMovies();
  omdbInput.value = '';
  omdbResults.innerHTML = '';
};

// Render movie library
const displayMovies = () => {
  const searchVal = searchInput.value.toLowerCase();
  const genreFilter = filterGenre.value;

  const filtered = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchVal) &&
    (genreFilter === '' || movie.genre === genreFilter)
  );

  movieLibrary.innerHTML = filtered.map(movie => `
    <div class="movie">
      <h3>${movie.title}</h3>
      ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}" style="width:100px;float:right;margin-left:10px">` : ''}
      <p>Genre: ${movie.genre}</p>
      <p>Rating: ${movie.rating}/10</p>
      <p>Added by: ${movie.user}</p>
    </div>
  `).join('');
};

// Theme toggling
const initTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark');
};

const toggleDarkMode = () => {
  document.body.classList.toggle('dark');
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
};

// Event listeners
addUserBtn.addEventListener('click', createUser);
userSelect.addEventListener('change', () => currentUser = userSelect.value);
searchInput.addEventListener('input', displayMovies);
filterGenre.addEventListener('change', displayMovies);
toggleDarkBtn.addEventListener('click', toggleDarkMode);
window.addEventListener('DOMContentLoaded', initTheme);
document.getElementById('searchBtn').addEventListener('click', searchOMDb);


