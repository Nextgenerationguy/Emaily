// SurveyFrom shows a form to create a survey in the form

import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import FIELDS from './formFields';

class SurveyForm extends Component{
    // renderFields(){
    //     return _.map(FIELDS, field=>{
    //         return <Field component={SurveyField} type="text" label={field.label} name={field.name} />
    //     });
    // };   
    // Refactored Code 
    renderFields(){
        return _.map(FIELDS, ({label, name})=>{
            return <Field key={name} component={SurveyField} type="text" label={label} name={name} />
        });
    };

    render(){
        return(
            <div>
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    {this.renderFields()}
                    <Link to='/surveys' className='red btn-flat white-text left'>Cancel</Link>
                    <button className="btn waves-effect waves-light right" type="submit">Next<i className="material-icons right">send</i></button>
                </form>
            </div>
        );
    }
}

function validate(values){
    const errors = {};
    errors.recipients = validateEmails(values.recipients || '');
    _.each(FIELDS, ({ name })=>{
        if(!values[name]){
            errors[name] = "Please provide a value";
        }
    });


    return errors;
}

export default reduxForm({
    validate: validate,
    form: 'surveyForm',
    destroyOnUnmount: false
})(SurveyForm);
