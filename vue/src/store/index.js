import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'


Vue.use(Vuex)

/*
 * The authorization header is set for axios when you login but what happens when you come back or
 * the page is refreshed. When that happens you need to check for the token in local storage and if it
 * exists you should set the header so that it will be attached to each request
 */
const currentToken = localStorage.getItem('token')
const currentUser = JSON.parse(localStorage.getItem('user'));


if(currentToken != null) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
}

export default new Vuex.Store({
  plugins: [createPersistedState(
    {
      storage: window.sessionStorage,
    }
    )],
  state: {
    token: currentToken || '',
    user: currentUser || {},
    currentUserCollections: [],
    currentUserRecords: [],
    userNumberOfRecords: 0,
    userNumberOfCollections: 0,
    activeRecord: {},
    allCollections: [],
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user',JSON.stringify(user));
    },
    LOGOUT(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = '';
      state.user = {};
      axios.defaults.headers.common = {};
      sessionStorage.clear();
    },
    UPDATE_ALL_COLLECTIONS(state, collections) {
      state.allCollections = collections;
    },
    UPDATE_NUMBER_OF_RECORDS(state) {
      state.userNumberOfRecords = state.currentUserRecords.length;
    },
    UPDATE_NUMBER_OF_COLLECTIONS(state) {
      state.userNumberOfCollections = state.currentUserCollections.length;
    },
    SET_ACTIVE_RECORD(state, record) {
      state.activeRecord = record;
    },
    SET_USER_RECORDS(state, records) {
      state.currentUserRecords = records;
    },
    SET_USER_COLLECTIONS(state, collections) {
      state.currentUserCollections = collections;
    },
    ADD_RECORD_TO_LIBRARY(state, record) {
      state.currentUserRecords.push(record);
    },
    ADD_COLLECTION_TO_COLLECTIONS(state, collection) {
      state.currentUserCollections.push(collection);
    },
  }
})
