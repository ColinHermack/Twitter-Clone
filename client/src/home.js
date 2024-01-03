import React from 'react';
import './home.css';
import useLocation from 'react-router-dom';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //Get the current path and split into an array
        const currentPath = (window.location.pathname).split('/');
        console.log(currentPath);
    }

    render() {
        return(<div id='container'>
            <h1>Homepage</h1>
        </div>)
    }
}

export default Home;