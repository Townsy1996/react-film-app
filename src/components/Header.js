import { Link } from 'react-router-dom';
import "../styles/main.css";


function Header() {



    return (

        <header className="header" data-testid="header">
            <div className="banner-container">
                <img id="logo" src={'/assets/images/flick-finder-logo.png'} alt="website logo" />
            </div>

            <div className="navigation-links">
                <Link to="/">
                    <button id="homeButton">Home</button>
                </Link>

                <Link to="/findafilm">
                    <button id="findAFilmButton">Find a Film</button>
                </Link>

                <Link to="/starlist">
                    <button id="starListButton">Star List</button>
                </Link>


            </div>

        </header>

    );
}

export default Header;