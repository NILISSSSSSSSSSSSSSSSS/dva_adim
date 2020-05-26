export default {
  namespace: 'user',
  state: {
    userInfo: {
      name: "333", age: 12
    }
  },

  effects: {
    * getUserInfo ({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save', payload });
    },
  },

  reducers: {
    save (state, action) {
      return { ...state, ...action.payload };
    },
  },

};