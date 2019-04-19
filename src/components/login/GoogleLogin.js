import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';

class GoogleLoginComponent extends Component {

    constructor() {
        super();
        this.state = { isAuthenticated: false, user: null, token:''};
    }

    logout = () => {
        this.setState({isAuthenticated: false, token: '', user: null});
    };

    onSuccess = (response) => {
        console.log(JSON.stringify(response));
        alert(JSON.stringify(response['Zi']['access_token']));
        
        const tokenBlob = new Blob([JSON.stringify({access_token: response['Zi']['access_token']}, null, 2)],
         {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        fetch('http://localhost:3001/api/users/auth', options).then(r => {
            const token = r.headers.get('x-auth-token');
            r.json().then(user => {
                if (token) {
                    this.setState({isAuthenticated: true, user, token})
                }
            });
        })
    };

    onFailure = (error) => {
        alert(JSON.stringify(error));
    }

    render() {
        let content = !!this.state.isAuthenticated ?
        (
            <div>
                <p>Authenticated</p>
                <div>
                    {this.state.user.email}
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

export default GoogleLoginComponent;