document.addEventListener('DOMContentLoaded', () => {
    const movieGrid = document.getElementById('movie-grid');
    const languageFilterOptions = document.getElementById('language-filter-options');
    const genreFilterOptions = document.getElementById('genre-filter-options');
    const formatFilterOptions = document.getElementById('format-filter-options');
    const quickLanguagePills = document.querySelector('.language-pills');

    let activeFilters = {
        language: null,
        genre: null,
        format: null
    };

    function renderMovieCard(movie) {
        const card = document.createElement('a');
        card.classList.add('movie-card');
        card.href = `movie-details.html?id=${movie.id}`; 

        const poster = document.createElement('img');
        poster.src = movie.posterUrl;
        poster.alt = movie.title;

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('movie-info');

        const ratingLikes = document.createElement('div');
        ratingLikes.classList.add('rating-likes');
        if (movie.likes) {
            ratingLikes.innerHTML = `<span class="icon">👍</span> ${movie.likes}`;
        } else if (movie.rating) {
            ratingLikes.innerHTML = `<span class="icon">⭐</span> ${movie.rating} (${movie.votes})`;
        }
        
        const title = document.createElement('h4');
        title.textContent = movie.title;
        
        const languagesDiv = document.createElement('div');
        languagesDiv.classList.add('movie-languages');
        languagesDiv.textContent = movie.languages.join(', ');

        infoDiv.appendChild(ratingLikes);
        infoDiv.appendChild(title);
        
        card.appendChild(poster);
        card.appendChild(infoDiv);
        card.appendChild(languagesDiv);

        return card;
    }

    function displayMovies(moviesToDisplay) {
        movieGrid.innerHTML = ''; 
        moviesToDisplay.forEach(movie => {
            movieGrid.appendChild(renderMovieCard(movie));
        });
        if (moviesToDisplay.length === 0) {
            movieGrid.innerHTML = '<p>No movies match your current filters.</p>';
        }
    }

    function applyFilters() {
        let filteredMovies = moviesData;

        if (activeFilters.language) {
            filteredMovies = filteredMovies.filter(movie => movie.languages.includes(activeFilters.language));
        }
        if (activeFilters.genre) {
            filteredMovies = filteredMovies.filter(movie => movie.genres.includes(activeFilters.genre));
        }
        if (activeFilters.format) {
            filteredMovies = filteredMovies.filter(movie => movie.formats.includes(activeFilters.format));
        }
        displayMovies(filteredMovies);
    }

    function handleFilterClick(event, filterType, optionsContainer) {
        if (event.target.tagName === 'BUTTON' && event.target.dataset.filter) {
            const filterValue = event.target.dataset.filter;

            optionsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            if (activeFilters[filterType] === filterValue) { 
                activeFilters[filterType] = null;
            } else {
                event.target.classList.add('active');
                activeFilters[filterType] = filterValue;
            }

            if (filterType === 'language') {
                quickLanguagePills.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.filter === activeFilters.language || (!activeFilters.language && btn.dataset.filter === "All")) {
                        btn.classList.add('active');
                    }
                });
                 if (!activeFilters.language) {
                    quickLanguagePills.querySelector('button[data-filter="All"]').classList.add('active');
                }
            }
            applyFilters();
        }
    }
    
    function handleQuickLanguagePillClick(event) {
        if (event.target.tagName === 'BUTTON' && event.target.dataset.filter) {
            const filterValue = event.target.dataset.filter;

            quickLanguagePills.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            if (filterValue === "All") {
                activeFilters.language = null;
            } else {
                activeFilters.language = filterValue;
            }

            languageFilterOptions.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === activeFilters.language) {
                    btn.classList.add('active');
                }
            });
            applyFilters();
        }
    }

    languageFilterOptions.addEventListener('click', (e) => handleFilterClick(e, 'language', languageFilterOptions));
    genreFilterOptions.addEventListener('click', (e) => handleFilterClick(e, 'genre', genreFilterOptions));
    formatFilterOptions.addEventListener('click', (e) => handleFilterClick(e, 'format', formatFilterOptions));
    quickLanguagePills.addEventListener('click', handleQuickLanguagePillClick);

    document.querySelectorAll('.clear-filter').forEach(button => {
        button.addEventListener('click', (e) => {
            const filterType = e.target.dataset.filterType;
            activeFilters[filterType] = null;

            if (filterType === 'language') languageFilterOptions.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            if (filterType === 'genre') genreFilterOptions.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            if (filterType === 'format') formatFilterOptions.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));

            if (filterType === 'language') {
                quickLanguagePills.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                quickLanguagePills.querySelector('button[data-filter="All"]').classList.add('active');
            }
            applyFilters();
        });
    });

    displayMovies(moviesData);
});


document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.poster-slider-container');
    const slider = document.querySelector('.poster-slider');
    const prevButton = document.querySelector('.slider-nav.prev');
    const nextButton = document.querySelector('.slider-nav.next');
    const dotsContainer = document.querySelector('.slider-dots');

    let slides = [];
    let currentSlideIndex = 0;
    let slideInterval;
    const AUTOPLAY_DELAY = 5000;

    function initializeSlider() {
        if (!slider || typeof sliderItemsData === 'undefined' || sliderItemsData.length === 0) {
            if(sliderContainer) sliderContainer.style.display = 'none'; 
            console.warn("Slider not initialized: No data or slider element found.");
            return;
        }

        sliderItemsData.forEach((item, index) => {
            const slideElement = document.createElement('div');
            slideElement.classList.add('slide');

            const linkElement = document.createElement('a');
            linkElement.href = item.link || '#';
            if (item.link && item.link !== '#') { 
                const url = new URL(item.link, window.location.origin); 
                if (url.hostname !== window.location.hostname) {
                    linkElement.target = '_blank';
                    linkElement.rel = 'noopener noreferrer';
                }
            }


            const imgElement = document.createElement('img');
            imgElement.src = item.imageUrl;
            imgElement.alt = item.altText || `Promotional slide ${index + 1}`;
            
            linkElement.appendChild(imgElement);
            slideElement.appendChild(linkElement);
            slider.appendChild(slideElement);
            slides.push(slideElement);

            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = index;
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        });

        if (slides.length > 0) {
            updateSlider();
            startAutoplay();
        } else {
             if(sliderContainer) sliderContainer.style.display = 'none';
        }
    }

    function updateSlider() {
        if (slides.length === 0) return;
        slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlideIndex);
        });

    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        updateSlider();
    }

    function prevSlide() {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        updateSlider();
    }

    function goToSlide(index) {
        currentSlideIndex = index;
        updateSlider();
    }

    function startAutoplay() {
        if (slides.length <= 1) return; 
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function resetAutoplay() {
        clearInterval(slideInterval);
        startAutoplay();
    }
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });

        nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderContainer.addEventListener('mouseleave', startAutoplay);
    }

    initializeSlider(); 
    const movieGrid = document.getElementById('movie-grid');
});

const sliderItemsData = [
    {
      id: "promo1",
      imageUrl: "https://i.postimg.cc/13JbQ2kw/good-bad-ugly-2.jpg", 
      altText: "mm",
      link: "http://127.0.0.1:5501/html/html/movie-details.html?id=ET00375421"
    },
    {
      id: "promo2",
      imageUrl: "https://i.postimg.cc/L59X0hGj/6192796512858261594-121.jpg",
      altText: " mm",
      link: "#internal-promo-page"
    },
    { 
      id: "ET00375421", 
      imageUrl: "https://i.postimg.cc/YS2tHTdw/veera-dheera-sooran-long.jpg", 
      altText: "mm",
      link: `movie-details.html?id=ET00375421`
    },
    {
      id: "promo3",
      imageUrl: "https://i.postimg.cc/YSMJFgFN/Alapuzha-gymkhana-long.jpg", 
      altText: "mm",
      link: "#"
    }
];