document.addEventListener('DOMContentLoaded', () => {
    const movieDetailContainer = document.getElementById('movie-detail-container');
    
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        movieDetailContainer.innerHTML = '<p class="loading-placeholder">Movie ID not found. Please go back to the <a href="index.html">movie list</a>.</p>';
        return;
    }

    const movie = moviesData.find(m => m.id === movieId);

    if (!movie) {
        movieDetailContainer.innerHTML = '<p class="loading-placeholder">Movie details not found. Please go back to the <a href="index.html">movie list</a>.</p>';
        return;
    }

    document.title = movie.title + " - Details"; 

    movieDetailContainer.innerHTML = `
        <div class="movie-banner" style="background-image: url('${movie.posterUrl}');">
            <div class="detail-poster">
                <img src="${movie.posterUrl}" alt="${movie.title} Poster">
            </div>
            <div class="detail-info">
                <h1>${movie.title}</h1>
                ${movie.likes ? `<div class="detail-rating-likes">✔ ${movie.likes} are interested <button class="interest-button">I'm interested</button></div>` : ''}
                ${movie.rating ? `<div class="detail-rating-likes">⭐ ${movie.rating} (${movie.votes}) <button class="interest-button">Rate Now</button></div>` : ''}
                
                <div class="detail-tags">
                    ${movie.formats.map(format => `<span>${format}</span>`).join('')}
                    ${movie.languages.map(lang => `<span>${lang}</span>`).join('')}
                </div>
                <div class="detail-meta">
                    <span>${movie.duration}</span> • 
                    <span>${movie.genres.join(', ')}</span> • 
                    <span>${movie.ageRating}</span> • 
                    <span>${movie.releaseDate}</span>
                </div>
                <a href="http://127.0.0.1:5501/html/html/seatbooking.html"><button class="book-tickets-btn">Book tickets</button></a>
            </div>
        </div>

        <div class="movie-summary-cast">
            <h2>About the movie</h2>
            <p>${movie.synopsis}</p>

            ${movie.cast && movie.cast.length > 0 ? `
                <h2>Cast</h2>
                <div class="cast-grid">
                    ${movie.cast.map(actor => `
                        <div class="cast-member">
                            <img src="${actor.imageUrl}" alt="${actor.name}">
                            <div class="cast-name">${actor.name}</div>
                            <div class="cast-role">${actor.role}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
});