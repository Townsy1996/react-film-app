import React from 'react';
import Header from '../components/Header';
import FilmCategorySelector from '../components/FilmCatergorySelector';

function Findafilm (){

    return (
        <div data-testid="findafilm-page"> 
            <Header />
            <br></br>
            <FilmCategorySelector />
          
        </div>
    );
}

export default Findafilm;