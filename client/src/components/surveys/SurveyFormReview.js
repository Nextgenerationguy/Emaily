import _ from 'lodash';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FIELDS from './formFields';
import * as actions from '../../actions';


const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) =>{
    const reviewFields = _.map(FIELDS, field=>{
        return (
            <div key={field.name}>
                <label>{field.label}</label>
                <div>
                    {formValues[field.name]}
                </div>
            </div>
        )
    });
    
    return(
        <div>
            <h5>Please review your entries:</h5>
            {reviewFields}
            <button
                className="yellow darken-3 btn-flat white-text"
                onClick={onCancel}
            >Back</button>
            <button onClick={()=> submitSurvey(formValues, history)} className="btn waves-effect waves-light right green" type="submit">Send Survey<i className="material-icons right">send</i></button>

        </div>
    )
}

function mapStateToProps(state){
    return{
        formValues : state.form.surveyForm.values 
    };
    
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));