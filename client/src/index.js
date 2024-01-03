import React from 'react';
import ReactDOM  from 'react-dom/client';
import { Route, Link, Routes, useLocation, BrowserRouter } from 'react-router-dom';
import SignInPage from './SignInPage.js';
import Home from './home.js';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id='container'>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<SignInPage />} />
                        <Route path="/home/:id" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </div>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)