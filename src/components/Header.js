import { Link } from 'react-router-dom';
import "../styles/main.css";


function Header() {



    return (

        <header className="header" data-testid="header">
            <div className="banner-container">

            </div>
            <h1 id='main-title'>Flick Finder</h1>

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

                <Link to="/">
                    <button id="loginButton">Login</button>
                </Link>

                <Link to="/">
                    <button id="registerButton">Register</button>
                </Link>


            </div>

        </header>

    );
}

export default Header;