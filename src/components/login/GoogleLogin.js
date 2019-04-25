import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import { authenticateUser } from '../../actions/index.js';
import { PropTypes} from 'prop-types';

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
        //mapdispatchtoprops?
        this.props.authenticateUser(JSON.stringify(response));
    };

    onFailure = (error) => {
         console.log(JSON.stringify(error));
    }

    render() {
        let content = !!sessionStorage.jwt ?
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
            <GoogleLogin
                        clientId="436216511900-0dc8av7rbqlrgp2ka3gsjn5bk99hchjr.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={this.onSuccess}
                        onFailure={this.onFailure}
                    />
        );

        return (
            <div>
                {content}
            </div>
        )
    }
}
//connect redux store
export default GoogleLoginComponent;