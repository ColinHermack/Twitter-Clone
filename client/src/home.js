import React from 'react';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather, faHouse, faMagnifyingGlass, faEnvelope, faX } from '@fortawesome/free-solid-svg-icons';
import defaultProfile from './default-profile.png';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'normal',
            feed: {
                profilePicture: defaultProfile
            }
        }

        this.ScrollToTop = this.ScrollToTop.bind(this);
        this.renderNewsArticles = this.renderNewsArticles.bind(this);
        this.homeScreen = this.homeScreen.bind(this);
    }

    componentDidMount() {
        //Get the current path and split into an array
        const currentPath = (window.location.pathname).split('/');
        const request = new XMLHttpRequest();
        request.open("GET", `/api/feed/${currentPath[currentPath.length - 1]}`);
        this.setState({id: currentPath[currentPath.length - 1]});
        
        request.onload = () => {
            if (!request.responseText.includes("<")) {
                if (JSON.parse(request.responseText).error === 'User does not exist.') {
                    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                    window.location.replace('/');
                }
                this.setState({
                    feed: JSON.parse(request.responseText)
                })
                document.getElementById('')
            }
            
        }
        request.send();

    }

    ScrollToTop() {
        window.scrollTo(0, 0);
    }

    renderNewsArticles() {
        if (this.state.feed.headlines === undefined) {
            return;
        } else {
            return this.state.feed.headlines.map((item) => {
                return (
                    <a href={item.url} target='_blank' rel='noreferrer'><div className='headline-container'>
                        <h2>{item.title}</h2>
                        <img src={item.image} alt='News article' />
                    </div></a>
                )
            })
        }
    }

    newPostScreen() {
        const calculateRemainingCharacters = () => {
            document.getElementById('characters-remaining').innerHTML = 280 - document.getElementById('new-post-input-box').value.length
            if (280 - document.getElementById('new-post-input-box').value.length <= 0) {
                document.getElementById('characters-remaining').style.border = "2px solid red";
                document.getElementById('characters-remaining').style.color = "red";
            }
            else if (280 - document.getElementById('new-post-input-box').value.length <= 20) {
                document.getElementById('characters-remaining').style.border = "2px solid yellow";
                document.getElementById('characters-remaining').style.color = "yellow";
            } else {
                document.getElementById('characters-remaining').style.border = "none";
                document.getElementById('characters-remaining').style.color = "rgb(70, 70, 70)";
            }
        }

        const createNewPost = () => {
            if (document.getElementById('new-post-input-box').value.length <= 280) {
                const request = new XMLHttpRequest();
                request.open("POST", "/api/new-post", true);
                request.setRequestHeader("Content-Type", "application/json");

                //Create the request body
                const body = JSON.stringify({
                    author: this.state.id,
                    content: document.getElementById('new-post-input-box').value
                })

                request.onload = () => {
                    this.setState({ status: 'normal' });
                }

                request.send(body);
            }
            
        }
        return (
        <div id='main-container'>
            <nav>
                <button id='navbar-logo'><FontAwesomeIcon icon={faFeather} /></button>
                <button className='navbar-button'><FontAwesomeIcon icon={faHouse} /></button>
                <button className='navbar-button'><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                <button className='navbar-button'><FontAwesomeIcon icon={faEnvelope} /></button>
                <button className='navbar-button'><img src={this.state.feed.profilePicture} alt="user's profile" className='navbar-item'/></button>
                <div className='divider navbar-item'></div>
            </nav>
            <div id='top-menu'><FontAwesomeIcon icon={faFeather} id='top-menu-logo' /></div>
            <div id='feed'></div>
            <div id='news-panel'>
                <h1>What's happening</h1>
                {this.renderNewsArticles()}
            </div>
            <button id='post-button' onClick={() => {this.setState({status: 'create-post'})}}><FontAwesomeIcon icon={faFeather} /></button>
            <div id='new-post-container'>
                <div id='new-post-input-container'>
                    <button id='new-post-close' onClick={() => {this.setState({ status: "normal" }) }}><FontAwesomeIcon icon={faX} /></button>
                    <div id='input-upper' className='new-post-section'>
                        <img src={this.state.feed.profilePicture} alt='' />
                        <textarea id='new-post-input-box' placeholder="What's happening?" onChange={calculateRemainingCharacters}></textarea>
                    </div>
                    <div className='divider' style={{marginLeft: '5%'}}></div>
                    <div id='input-lower' className='new-post-section'>
                        <div id='characters-remaining'></div>
                        <button id='new-post-button' onClick={createNewPost}>Post</button>
                    </div>
                </div>   
            </div>
        </div>
    )
    }

    homeScreen() {
        return(<div id='main-container'>
            <nav>
                <button id='navbar-logo'><FontAwesomeIcon icon={faFeather} /></button>
                <button className='navbar-button'><FontAwesomeIcon icon={faHouse} /></button>
                <button className='navbar-button'><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                <button className='navbar-button'><FontAwesomeIcon icon={faEnvelope} /></button>
                <button className='navbar-button'><img src={this.state.feed.profilePicture} alt="user's profile" className='navbar-item'/></button>
                <div className='divider navbar-item'></div>
            </nav>
            <div id='top-menu'><FontAwesomeIcon icon={faFeather} id='top-menu-logo' /></div>
            <div id='feed'></div>
            <div id='news-panel'>
                <h1>What's happening</h1>
                {this.renderNewsArticles()}
            </div>
            <button id='post-button' onClick={() => {this.setState({status: 'create-post'})}}><FontAwesomeIcon icon={faFeather} /></button>
        </div>)
    }


    render() {
        console.log(this.state.feed);
        if (this.state.status === 'normal') {
            return this.homeScreen();
        } else if (this.state.status === 'create-post') {
            return this.newPostScreen();
        }
        
    }
}

export default Home;