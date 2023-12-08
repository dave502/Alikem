import * as React from 'react';
import { Component } from 'react';
import { TLoginButton, TLoginButtonSize } from 'react-telegram-auth';

export class TelegramLoginButton extends Component {
  render() {
    return (
        <TLoginButton
        botName="my100friends_bot"
        buttonSize={TLoginButtonSize.Large}
        lang="en"
        usePic={true}
        cornerRadius={6}
        onAuthCallback={(user) => {
          console.log('Hello, user!', user);
        }}
        requestAccess={'write'}
        additionalClasses={'css-class-for-wrapper'}
      />
    );
  }
}

export default TelegramLoginButton;