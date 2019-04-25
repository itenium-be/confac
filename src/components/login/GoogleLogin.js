import React, { Component } from 'react';
import {connect} from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import { authenticateUser } from '../../actions/index.js';
import { PropTypes} from 'prop-types';
import {Col} from 'react-bootstrap';

class GoogleLoginComponent extends Component {
    
    static propTypes = {
        authenticateUser: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.state = { isAuthenticated: false, user: null, token:''};
    }

    logout = () => {
        sessionStorage.removeItem('jwt');
        this.setState({isAuthenticated: false, token: '', user: null});
    };

    onSuccess = (response) => {
        console.log(JSON.stringify(response));
        //mapdispatchtoprops? because if accessed directly the dispatch wont fire
        this.props.authenticateUser(JSON.stringify(response));
    };

    onFailure = (error) => {
         console.log(JSON.stringify(error));
    }

    render() {
        let content = !!sessionStorage.jwt ? //this could be tampered with by adding your own key value in sessionstorage but it wouldnt matter because the token would be invalid in backend
        (
            <div>
                <p>Testing if authenticated</p>
                <div>
                    {this.state.token}
                </div>
                <div>
                    <button onClick={this.logout} className="button">
                        Log out
                    </button>
                </div>
            </div>
        ) : (
            <Col sm={3}>
                <GoogleLogin
                    clientId="436216511900-0dc8av7rbqlrgp2ka3gsjn5bk99hchjr.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={this.onSuccess}
                    onFailure={this.onFailure}
                    />
            </Col>
        );

        return (
            <div>
                {content}
            </div>
        )
    }
}
//connect redux store
export default connect(state => ({authenticateUser})) (GoogleLoginComponent);