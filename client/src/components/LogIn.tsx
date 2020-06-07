import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'
import Pb from "../assets/pb.png"


interface LogInProps {
  auth: Auth
}

interface LogInState {}

const styleObj = {
  display: 'flex',
  justifyContent: 'center',
  fontSize: 36,
  fontFamily: 'Arial',
  fontWeight: 100
}

const buttonObj = {
  justifyContent: 'center',
  margin: '50px',
  display: 'flex'
}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <img src={Pb}/>

        <h1 style={styleObj}>Log in to access your blog posts</h1>
        <div style={buttonObj}>
          <Button onClick={this.onLogin} size="huge" color="blue">
            Login
          </Button>

        </div>
      </div>
    )
  }
}
