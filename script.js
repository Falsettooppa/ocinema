// Simulate private rating field using closure
function RatingManager() {
    var rating = null;

    return {
        setRating: function(r) {
            if (r >= 0 && r <= 5) rating = r;
        },
        getRating: function() {
            return rating;
        }
    };
}

// Movie Class
function Movie(title, genre, year, poster) {
    this.title = title;
    this.genre = genre;
    this.year = year;
    this.poster = poster;
    this.ratingManager = RatingManager();
}

Movie.prototype.display = function() {
    var card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = '<h2>' + this.title + ' (' + this.year + ')</h2>' +
                     '<p><strong>Genre:</strong> ' + this.genre + '</p>' +
                     '<img src="' + this.poster + '" width="100">';
    return card;
};

// Inheritance
function ActionMovie(title, genre, year, poster) {
    Movie.call(this, title, genre, year, poster);
}
ActionMovie.prototype = Object.create(Movie.prototype);
ActionMovie.prototype.constructor = ActionMovie;
ActionMovie.prototype.display = function() {
    var card = Movie.prototype.display.call(this);
    card.style.borderLeft = '5px solid crimson';
    return card;
};

function ComedyMovie(title, genre, year, poster) {
    Movie.call(this, title, genre, year, poster);
}
ComedyMovie.prototype = Object.create(Movie.prototype);
ComedyMovie.prototype.constructor = ComedyMovie;
ComedyMovie.prototype.display = function() {
    var card = Movie.prototype.display.call(this);
    card.style.borderLeft = '5px solid orange';
    return card;
};

// User Class
function User(name) {
    this.name = name;
    this.collection = [];
}

User.prototype.addMovie = function(movie) {
    this.collection.push(movie);
};

User.prototype.displayCollection = function(container) {
    container.innerHTML = '';
    for (var i = 0; i < this.collection.length; i++) {
        var card = this.collection[i].display();
        container.appendChild(card);
    }
};

// Review Class
function Review(user, movie, comment, stars) {
    this.user = user;
    this.movie = movie;
    this.comment = comment;
    this.stars = stars;
}

// Instantiate default user
var currentUser = new User('DefaultUser');

// Handle DOM
document.getElementById('addMovieBtn').addEventListener('click', function() {
    var title = document.getElementById('movieTitle').value;
    if (!title) return alert('Please enter a movie title');

    fetchMovieFromOMDb(title, function(data) {
        if (!data || data.Response === "False") {
            alert('Movie not found!');
            return;
        }

        var genre = data.Genre || 'Unknown';
        var movie;
        if (genre.indexOf('Action') !== -1) {
            movie = new ActionMovie(data.Title, genre, data.Year, data.Poster);
        } else if (genre.indexOf('Comedy') !== -1) {
            movie = new ComedyMovie(data.Title, genre, data.Year, data.Poster);
        } else {
            movie = new Movie(data.Title, genre, data.Year, data.Poster);
        }

        movie.ratingManager.setRating(Math.floor(Math.random() * 5) + 1); // Simulate rating
        currentUser.addMovie(movie);
        currentUser.displayCollection(document.getElementById('library'));
    });
});

// OMDb API call
function fetchMovieFromOMDb(title, callback) {
    var apiKey = 'af0720b9';
    var url = 'https://www.omdbapi.com/?apikey=' + apiKey + '&t=' + encodeURIComponent(title);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        var data = JSON.parse(xhr.responseText);
        callback(data);
    };
    xhr.send();
}
