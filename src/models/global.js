import * as services from '../services/global';
import { message } from 'antd';
import router from 'umi/router';

export default {
  namespace: 'global',
  state: {
    loginKey: '',
    lotteryData: '',
    luckyTimes: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    * getCode({ payload: { phone, type } }, { call, put }) {
      const { data } = yield call(services.getCode, phone, type);
      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            loginKey: data.data.key,
          },
        })
        :
        message.error(data.msg);
    },
    * login({ payload: { phone, key, code, imei, activityId } }, { call, put }) {
      const { data } = yield call(services.login, phone, key, code, imei, activityId);
      if (parseInt(data.code, 10) === 1) {
        localStorage.setItem('token', data.data.token);
        if (data.data.category - 0 === 1) {
          router.push({
            pathname: '/bigWheel',
            query: {
              activityId: data.data.activityId,
            },
          });
        } else if (data.data.category - 0 === 2) {
          router.push({
            pathname: '/soduku',
            query: {
              activityId: data.data.activityId,
            },
          });
        } else {
          router.push({
            pathname: '/goldenEggs',
            query: {
              activityId: data.data.activityId,
            },
          });
        }
        message.success(data.msg);
      } else {
        message.error(data.msg);
      }
    },
    * lottery({ payload: { token, activityId } }, { call, put }) {
      const { data } = yield call(services.lottery, token, activityId);
      parseInt(data.code, 10) === 1 ?
        yield put({
          type: 'save',
          payload: {
            lotteryData: data.data,
            luckyTimes: data.data.luckyTimes,
          },
        })
        :
        message.error(data.msg);
    },
    * postUserData({ payload: { name, address, id } }, { call, put }) {
      const { data } = yield call(services.postUserData, name, address, id);
      parseInt(data.code, 10) === 1 ?
        message.success(data.msg)
        :
        message.error(data.msg);
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};