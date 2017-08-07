import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SmsListener from 'react-native-android-sms-listener';
import EStyleSheet from 'react-native-extended-stylesheet';
import Keyboard from '../Shared/Components/Keyboard';
import Confirm from '../Shared/Buttons/Confirm';
import { vh, vw } from '../../utils/units';
import { phoneNumberValidate } from '../../actions';

const ic_user = require('../../assets/icons/ic_user.png');

// SmsListener.addListener(message => {
//   console.log(message);
//   console.info(message);
// });

class CodeInput extends Component {
  static propTypes = {
    user: PropTypes.shape({
      account: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,
      phoneValidate: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,
      phoneNumber: PropTypes.string,
    }).isRequired,

    phoneNumberValidate: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
  };

  state = {
    code: 55555,
    maxPasswordLength: 5,
    password: '',
  };

  componentDidMount() {
    this.listener = SmsListener.addListener((message) => {
      const body = message.body;
      const hmqRegEx = /humaniq/gi;

      if (body.match(hmqRegEx)) {
        // request server;
        const smsCode = body.replace(/\D/g, '');

        this.props.phoneNumberValidate({
          account_id: this.props.user.account.payload.payload.account_information.account_id,
          phone_number: this.props.user.phoneNumber,
          validation_code: smsCode.toString(),
        });
        this.setState({ password: smsCode });
      }
    });
  }


  componentWillReceiveProps(nextProps) {
    // TODO: MOVE TO SAGA TO PREVENT LAG
    // console.log('📞 nextProps', nextProps.user.validate);
    if (nextProps.user.phoneValidate.payload) {
      const code = nextProps.user.phoneValidate.payload.code;

      if (true) {
        switch (code) {
          case 6000:
            // alert(nextProps.user.validate.payload.message);
            break;

          case 4002:
            // registered user
            // this.props.setAvatarLocalPath(this.state.path);
            this.props.navigation.navigate('Dashboard');
            break;

          case 3003:
            // new user
            // this.props.setAvatarLocalPath(this.state.path);
            // this.props.navigation.navigate('Tutorial', { nextScene: 'Password' });
            break;

          case 3000:
            // this.setState({ path: '' });
            // alert(nextProps.user.validate.payload.message);
            // reset payload?
            break;

          default:
            alert(`Unknown code ${nextProps.user.phoneValidate.payload.code}, no info in Postman`);
        }
      }
    }
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  handleNumberPress = (number) => {
    if (this.state.password.length < this.state.maxPasswordLength) {
      this.setState({ password: this.state.password += number });
    }
  };

  handleBackspacePress = () => {
    const password = this.state.password.slice(0, -1);
    this.setState({ password });
  };

  handleHelpPress = () => {
    // TODO: support button action
  };

  handleNavigate = () => {
    // open camera
    this.props.navigation.navigate(this.state.nextScene);
  };

  renderBullets = () => {
    const { password, maxPasswordLength } = this.state;
    const passLen = password.length;
    const bullets = [];

    /*
    let error;
    if (passLen == maxPasswordLength) {
      error = password === this.state.code;
    }
    */

    for (let i = 0; i < maxPasswordLength; i += 1) {
      bullets.push(
        <View key={i}>
          {password[i] ?
            <View style={[
              styles.passFilled,
              passLen === maxPasswordLength && styles.passMaxLen,
            ]}
            >
              <Text style={styles.number}>{password[i]}</Text>
            </View> :
            <View style={styles.passEmpty} />
          }
        </View>,
      );
    }
    return bullets;
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.userPhoto} source={ic_user} />
          <Text>{`sms code ${this.state.code}`}</Text>
          <View style={styles.passContainer}>
            {this.renderBullets()}
          </View>
        </View>
        <Confirm
          active={this.state.password.length === this.state.maxPasswordLength}
          onPress={this.handleNavigate}
        />
        <Keyboard
          onNumberPress={this.handleNumberPress}
          onBackspacePress={this.handleBackspacePress}
          // onHelpPress={this.handleHelpPress}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  phoneNumberValidate: phoneNumberValidate.request,
})(CodeInput);

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  header: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: vh(20),
  },
  userPhoto: {
    alignSelf: 'center',
  },
  passContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: vw(18),
  },
  passEmpty: {
    width: vh(25),
    height: vh(25),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '$cGray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 25,
    color: '$cGray',
  },
  passFilled: {
    width: vh(25),
    height: vh(25),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '$cGray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passMaxLen: {
    borderWidth: 4,
    borderColor: '#B8E986',
  },
  wrong: {
    borderWidth: 4,
    borderColor: 'tomato',
  },
});

