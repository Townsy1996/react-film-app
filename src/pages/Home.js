import React from 'react';
import Header from '../components/Header';
import HomeMessage from '../components/HomeMessage';

function Home (){

    return (
        <div data-testid='home-comp'>
            <Header />
            <br></br>
            <HomeMessage />
        </div>
    );
}

export default Home;