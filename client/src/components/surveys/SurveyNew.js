// SurveyNew shows SurveyForm and SurveyReview

import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

class SurveyNew extends Component{

    // constructor(props){
    //     super(props);
    //     this.state={}
    // }
    // Using babel plugin there is a shortcut below
        state={showFormReview: false};

        renderContent(){
            if(this.state.showFormReview===true){
                return <SurveyFormReview onCancel={() => this.setState({showFormReview: false})} />;
            }
            return <SurveyForm onSurveySubmit={() => this.setState({showFormReview: true})} />;
        }

    render(){
        return(
            <div>
                {this.renderContent()}
            </div>
        );
    }
}

export default reduxForm({
    // for dumping data from form 
    form: 'surveyForm'}) (SurveyNew);
