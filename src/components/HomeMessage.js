import React from 'react';
import "../styles/main.css";

function HomeMessage (){
    
    return(

        <div className='home-message' id='message-container'>
            <h2 id='welcomeTitle'>Welcome to Flick Finder!</h2>
            <p>
                Find your favourite movies, explore new releases and create your star list. Flick Finder is here 
                to help.
            </p>

        </div>

    );
}

export default HomeMessage;
