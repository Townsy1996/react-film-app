import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FilmCategorySelector() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch available categories from the backend
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
            // Fetch films based on the selected category
            const response = await axios.get(`http://16.171.0.136:8080/film/getByCatName/${category}`);
            setFilms(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching films by category:', error);
            setLoading(false);
        }
    };

    return (
        <div className='catergory-selector' id='cat-select'>
    <label htmlFor="categorySelect" id="categoryLabel">What are you in the mood for?</label>
    <select id="categorySelect" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="" id="defaultOption">Select a category</option>
        
        {categories.map(category => (
            <option key={category.categoryId} value={category.name} id={`categoryOption-${category.categoryId}`}>
                {category.name}
            </option>
        ))}
        
    </select>

    {loading ? (
        <div>Loading...</div>
    ) : (
        <div>
            {films.length === 0 ? (
                <p id="noFilmsMessage">No films found for the selected category.</p>
            ) : (
                <ul id="filmsList">
                    {films.map(film => (
                        <li key={film.filmId} id={`filmItem-${film.filmId}`}>{film.title}</li>
                    ))}
                </ul>
            )}
        </div>
    )}
</div>

    );
}

export default FilmCategorySelector;
