import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {



    return (

        <header className="header" data-testid="header">
            <div className="banner-container">
                <img id="logo" src="{'/assets/images/flick-finder-logo.png'}" alt="website logo" />
            </div>

            <div className="navigation-links">
                <button id="homeButton">Home</button>
                <button id="findAFilmButton">Find a Film</button>
                <button id="starListButton">Star List</button>



            </div>

        </header>

    );
}

export default Header;