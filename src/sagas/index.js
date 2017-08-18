/* eslint-disable no-constant-condition */
import { take, put, call, fork, select, all, takeLatest } from 'redux-saga/effects';
import { api } from '../utils/index';
import * as actions from '../actions';
import { HumaniqProfileApiLib, HumaniqTokenApiLib } from 'react-native-android-library-humaniq-api';
import IMEI from 'react-native-imei';

function* fetchEntity(entity, apiFn, body, errorCodes) {
  const { response } = yield call(apiFn, body);
  let result = null;
  console.log(response);
  if (response && response.code) {
    const responseCode = parseInt(response.code, 10);
    const errorCode = errorCodes.find(errCode => errCode === responseCode);

    if (!errorCode) {
      console.log('response ok', response);
      result = response;
      yield put(entity.success(result));
    } else {
      result = { ...response };
      console.log('response fail', result);
      yield put(entity.failure(result));
    }
  } else {
    result = { ...response };
    console.log('unknown response fail', result);
    yield put(entity.failure(result));
  }
  return result;
}

export const fetchValidate = fetchEntity.bind(
  null,
  actions.validate,
  api.validate
);
export const fetchLogin = fetchEntity.bind(
  null,
  actions.validatePassword,
  api.login
);
export const fetchSignup = fetchEntity.bind(
  null,
  actions.signup,
  api.signup
);
export const fetchPhoneNumberCreate = fetchEntity.bind(
  null,
  actions.phoneNumberCreate,
  api.phoneNumberCreate,
);
export const fetchPhoneNumberValidate = fetchEntity.bind(
  null,
  actions.phoneNumberValidate,
  api.phoneNumberValidate,
);
export const fetchFaceEmotionCreate = fetchEntity.bind(
  null,
  actions.faceEmotionCreate,
  api.faceEmotionCreate,
);
export const fetchFaceEmotionValidate = fetchEntity.bind(
  null,
  actions.faceEmotionValidate,
  api.faceEmotionValidate,
);
export const fetchSmsCodeRepeat = fetchEntity.bind(
  null,
  actions.smsCodeRepeat,
  api.smsCodeRepeat,
);

/*export const fetchAccountProfile = fetchEntity.bind(
  null,
  actions.smsCodeRepeat,
  HumaniqProfileApiLib.getAccountProfile,
);*/


// Сallers 

/* Validate facial image */

function* validate({ facial_image }) {
  const errorCodes = [3000, 3001, 6000];
  // do we need cache? place it here and wrap with conditional statement below call
  return yield call(fetchValidate, { facial_image }, errorCodes);
}

/* Initiate emotial recognition process */

function* faceEmotionCreate({ facial_image_id }) {
  const errorCodes = [3000, 6000, 3003];
  yield call(fetchFaceEmotionCreate, { facial_image_id }, errorCodes);
}

/* Finish emotial recognition process */
// 
function* faceEmotionValidate({ facial_image_validation_id, facial_image }) {
  const errorCodes = [3000, 3011, 3009, 3007, 6000];
  yield call(fetchFaceEmotionValidate, { facial_image_validation_id, facial_image }, errorCodes);
}

/* Login into App [Resolve all things here] */

function* login({ facial_image, password, device_imei }) {
  let response = yield call(validate, { facial_image });
  
  // Additional request.
  if (response && response.payload.facial_image_id) {
    const errorCodes = [2002, 3003, 6000];
    const body = {
      facial_image_id: response.payload.facial_image_id,
      password,
      metadata: {
        react_native_imei: {
          device_imei,
        },
      },
    };
    response = yield call(fetchLogin, body, errorCodes);
    if (response && response.code == 2001 && response.payload && response.payload.account_id) {
      const credentials = yield select(state => {
        return {
          token: state.user.account.payload.payload.token,
          account_id: state.user.account.payload.payload.account_id,
          facial_image_id: state.user.validate.payload.payload.facial_image_id,
          password: password,
          device_imei: IMEI.getImei(),
        }
      });
      // Save credentials to preferences
      yield HumaniqTokenApiLib.saveCredentials(credentials);
      response = yield HumaniqProfileApiLib.getAccountProfile(response.payload.account_id);
      yield put(actions.getProfile.success(response));
      yield put(actions.login.success());
    } else {
      actions.login.failure();
    }
  } else {
    actions.login.failure();
  }
}

function* signup({ facial_image_id, password, device_imei }) {
  const errorCodes = [1003, 2002, 3003, 6000];
  const body = {
    facial_image_id,
    password,
    metadata: {
      react_native_imei: {
        device_imei,
      },
    },
  };
  yield call(fetchSignup, body, errorCodes);
}

/* Initiate phone number validation process */

function* phoneNumberCreate({ phone_number, account_id }) {
  const errorCodes = [4011, 6000];
  const code = phone_number.toString().slice(0, 1);
  const number = phone_number.toString().slice(1);
  const body = {
    account_id,
    phone_number: {
      country_code: code,
      phone_number: number,
    },
  };
  yield call(fetchPhoneNumberCreate, body, errorCodes);
}

/* Finish phone number validation process*/

function* phoneNumberValidate({ phone_number, validation_code, account_id }) {
  const errorCodes = [6000, 4010, 4004, 4003, 4001, 4009];
  // let code = phone_number.toString().slice(0, 1);
  // let number = phone_number.toString().slice(1);
  const body = {
    validation_code: validation_code.toString(),
    account_id: account_id.toString(),
    phone_number,
    // phone_number: {
    // country_code: code,
    // phone_number: number,
    // },
  };
  console.log('validate sms body', body);
  yield call(fetchPhoneNumberValidate, body, errorCodes);
}

/* Resend sms code to user*/

function* smsCodeRepeat({ account_id, phone_number, imei }) {
  const errorCodes = [6000, 4010, 4004, 4003, 4001, 4009];
  // let code = phone_number.toString().slice(0, 1);
  // let number = phone_number.toString().slice(1);
  const body = {
    account_id,
    phone_number,
    imei,
  };
  console.log('sms code repeat', body);
  yield call(fetchSmsCodeRepeat, body, errorCodes);
}

// WATCHERS

function* watchValidate() {
  yield takeLatest(actions.VALIDATE.REQUEST, validate);
}

function* watchLogin() {
  yield takeLatest(actions.LOGIN.REQUEST, login);
}

function* watchSignup() {
  yield takeLatest(actions.SIGNUP.REQUEST, signup);
}

function* watchPhoneNumberCreate() {
  yield takeLatest(actions.PHONE_NUMBER_CREATE.REQUEST, phoneNumberCreate);
}

function* watchPhoneNumberValidate() {
  yield takeLatest(actions.PHONE_NUMBER_VALIDATE.REQUEST, phoneNumberValidate);
}

function* watchSmsCodeRepeat() {
  yield takeLatest(actions.SMS_CODE_REPEAT.REQUEST, smsCodeRepeat);
}

function* watchFaceEmotionCreate() {
  yield takeLatest(actions.FACE_EMOTION_CREATE.REQUEST, faceEmotionCreate);
}

function* watchFaceEmotionValidate() {
  yield takeLatest(actions.FACE_EMOTION_VALIDATE.REQUEST, faceEmotionValidate);
}

export default function* root() {
  yield all([
    fork(watchValidate),
    fork(watchSignup),
    fork(watchLogin),
    fork(watchPhoneNumberCreate),
    fork(watchPhoneNumberValidate),
    fork(watchSmsCodeRepeat),
    fork(watchFaceEmotionCreate),
    fork(watchFaceEmotionValidate),
  ]);
}
