import React from 'react';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather, faHouse, faMagnifyingGlass, faEnvelope } from '@fortawesome/free-solid-svg-icons';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.ScrollToTop = this.ScrollToTop.bind(this);
    }

    componentDidMount() {
        //Get the current path and split into an array
        const currentPath = (window.location.pathname).split('/');
        console.log(currentPath);
    }

    ScrollToTop() {
        window.scrollTo(0, 0);
    }

    render() {
        return(<div id='main-container'>
            <nav>
                <button id='navbar-logo'><FontAwesomeIcon icon={faFeather} /></button>
                <button className='navbar-button'><FontAwesomeIcon icon={faHouse} /></button>
                <button className='navbar-button'><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                <button className='navbar-button'><FontAwesomeIcon icon={faEnvelope} /></button>
                <button className='navbar-button'><img src={undefined} alt="user's profile" className='navbar-item'/></button>
                <div className='divider navbar-item'></div>
            </nav>
            <div id='top-menu'><FontAwesomeIcon icon={faFeather} id='top-menu-logo' /></div>
            <div id='feed'></div>
            <div id='news-panel'>
                <h1>What's happening</h1>
            </div>
            <button id='post-button'><FontAwesomeIcon icon={faFeather} /></button>
        </div>)
    }
}

export default Home;