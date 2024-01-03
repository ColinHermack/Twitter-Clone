import React from 'react';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather, faHouse, faMagnifyingGlass, faEnvelope } from '@fortawesome/free-solid-svg-icons';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

        this.ScrollToTop = this.ScrollToTop.bind(this);
        this.renderNewsArticles = this.renderNewsArticles.bind(this);
    }

    componentDidMount() {
        //Get the current path and split into an array
        const currentPath = (window.location.pathname).split('/');

        //Get the feed from the server
        const request = new XMLHttpRequest();
        request.open("GET", `/api/feed/${currentPath[currentPath.length - 1]}`);
        
        request.onload = () => {
            if (JSON.parse(request.responseText).error === 'User does not exist.') {
                document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                window.location.replace('/');
            }
            this.setState({
                feed: JSON.parse(request.responseText)
            })
        }

        request.send();

    }

    ScrollToTop() {
        window.scrollTo(0, 0);
    }

    renderNewsArticles() {
        if (this.state.feed === undefined) {
            return;
        } else {
            return this.state.feed.headlines.map((item) => {
                return (
                    <a href={item.url} target='_blank'><div className='headline-container'>
                        <h2>{item.title.substring(0, item.title.indexOf("-") - 1)}</h2>
                        <img src={item.image} alt='News article image' />
                    </div></a>
                )
            })
        }
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
                {this.renderNewsArticles()}
            </div>
            <button id='post-button'><FontAwesomeIcon icon={faFeather} /></button>
        </div>)
    }
}

export default Home;