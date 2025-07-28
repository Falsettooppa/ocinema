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
    this.reviews = []; // Store Review instances
}

Movie.prototype.addReview = function(review) {
    this.reviews.push(review);
};

Movie.prototype.display = function() {
    var card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML =
        '<h2>' + this.title + ' (' + this.year + ')</h2>' +
        '<p><strong>Genre:</strong> ' + this.genre + '</p>' +
        '<img src="' + this.poster + '" width="100">' +
        '<p><strong>Rating:</strong> ' + (this.ratingManager.getRating() || 'N/A') + '/5</p>' +
        '<button class="review-btn">Add Review</button>' +
        '<div class="review-list"></div>';

    var reviewList = card.querySelector('.review-list');
    this.reviews.forEach(function(review) {
        var reviewDiv = document.createElement('div');
        reviewDiv.className = 'review';
        reviewDiv.innerHTML =
            '<p><strong>' + review.user.name + ':</strong> ' +
            getStars(review.stars) + ' - ' + review.comment + '</p>';
        reviewList.appendChild(reviewDiv);
    });

    var self = this;
    card.querySelector('.review-btn').addEventListener('click', function() {
        showReviewForm(self, reviewList);
    });

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

// Display stars as ★
function getStars(num) {
    var stars = '';
    for (var i = 0; i < 5; i++) {
        stars += i < num ? '★' : '☆';
    }
    return stars;
}

// Show review form
function showReviewForm(movie, container) {
    var form = document.createElement('form');
    form.className = 'review-form';

    form.innerHTML =
        '<input type="text" placeholder="Your comment" required>' +
        '<select required>' +
        '<option value="">Rate</option>' +
        '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="3">3</option>' +
        '<option value="4">4</option>' +
        '<option value="5">5</option>' +
        '</select>' +
        '<button type="submit">Submit</button>';

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var comment = form.querySelector('input').value;
        var stars = parseInt(form.querySelector('select').value, 10);
        if (!stars || !comment) return;

        var review = new Review(currentUser, movie, comment, stars);
        movie.addReview(review);

        // Re-render collection
        currentUser.displayCollection(document.getElementById('library'));
    });

    container.innerHTML = ''; // Clear form if already exists
    container.appendChild(form);
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
