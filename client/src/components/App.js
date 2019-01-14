import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Header from './Header';
import Landing from './Landing';

const Dashboard = () => <h6>I am the Dashboard</h6>
const SurveyNew = () => <h6>Create a ew Survey</h6>
// const Landing = () => <h6>Landing page</h6>
// const NotFound = () => <h2>404 not found</h2>


 class App extends Component {
    componentDidMount(){
        this.props.fetchUser();
    }

    render (){
        return(
            <div>
                <BrowserRouter>
                    <div className="container">
                        <Header/>                   
                        <Route exact path='/' component={Landing} />
                        <Route exact path='/surveys' component={Dashboard} />
                        <Route path='/surveys/new' component={SurveyNew} />
                        {/* <Route component={NotFound} /> */}
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(null, actions)(App);