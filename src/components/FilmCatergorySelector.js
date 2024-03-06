import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function FilmCategorySelector() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [minRuntime, setMinRuntime] = useState(null);
    const [maxRuntime, setMaxRuntime] = useState(null);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);

    const overlayRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://16.171.0.136:8080/cat/getAll');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = async (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        setLoading(true);
        try {
            const response = await axios.get(`http://16.171.0.136:8080/film/getByCatName/${category}`);
            setFilms(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching films by category:', error);
            setLoading(false);
        }
    };

    const handleFilmClick = (film) => {
        setSelectedFilm(film);
        setShowOverlay(true);
    };

    const handleOverlayClick = (e) => {
        if (!overlayRef.current.contains(e.target)) {
            setShowOverlay(false);
        }
    };

    const handleRuntimeChange = async (min, max) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://16.171.0.136:8080/film/getByRuntimeRange?minRuntime=${min}&maxRuntime=${max}`);
            setFilms(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching films by runtime range:', error);
            setLoading(false);
        }
    };

    const handleFilterByRuntime = async () => {
        setLoading(true);
        try {
            let filteredFilms = films; 

          
            if (selectedCategory) {
                const response = await axios.get(`http://16.171.0.136:8080/film/getByCatName/${selectedCategory}`);
                filteredFilms = response.data;
            }

          
            if (minRuntime !== null && maxRuntime !== null) {
                filteredFilms = filteredFilms.filter(film => film.runTime >= minRuntime && film.runTime <= maxRuntime);
            }

            setFilms(filteredFilms);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching films:', error);
            setLoading(false);
        }
    };

    return (
        <div className='film-category-selector' data-testid='film-cat-select'>
            <div id='cat-select'>
                <label htmlFor="categorySelect" id="categoryLabel">What are you in the mood for?</label>
                <select id="categorySelect" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="" id="defaultOption">Select a category</option>
                    {categories.map(category => (
                        <option key={category.categoryId} value={category.name} id={`categoryOption-${category.categoryId}`}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <br></br>
            <div id='runtime-filter' data-testid='time-filter'>
                <label htmlFor="minRuntime">Minimum Runtime:</label>
                <input type="number" id="minRuntime" value={minRuntime} onChange={(e) => setMinRuntime(e.target.value)} />
                <label htmlFor="maxRuntime">Maximum Runtime:</label>
                <input type="number" id="maxRuntime" value={maxRuntime} onChange={(e) => setMaxRuntime(e.target.value)} />
                <button onClick={handleFilterByRuntime}>Filter</button>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {films.length === 0 ? (
                        <p id="noFilmsMessage">No films found for the selected category and runtime range.</p>
                    ) : (
                        <ul id="filmsList">
                            {films.map(film => (
                                <li key={film.filmId} id={`filmItem-${film.filmId}`} onClick={() => handleFilmClick(film)}>{film.title}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {showOverlay && selectedFilm && (
                <div className="film-overlay" data-testid='film-overlay' onClick={handleOverlayClick} ref={overlayRef}>
                    <div className="film-overlay-content">
                    <h2>{selectedFilm.title}</h2>
                    <p>{selectedFilm.description}</p>
                    <p>Release Year: {selectedFilm.releaseYear}</p>
                    <p>Rating: {selectedFilm.rating}</p>
                    <p>Runtime: {selectedFilm.runTime} minutes</p>
                    <button onClick={() => setShowOverlay(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilmCategorySelector;
