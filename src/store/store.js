import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      usuarioId: null, // Estado para almacenar el usuarioId
      usuarioMovil: null, // Estado para almacenar el usuarioMovil
    };
  },
  mutations: {
    SET_USUARIO_ID(state, id) {
      state.usuarioId = id;
    },
    SET_USUARIO_MOVIL(state, movil) {
      state.usuarioMovil = movil;
    },
    CLEAR_USUARIO(state) {
      state.usuarioId = null;
      state.usuarioMovil = null;
    },
  },
  actions: {
    setUsuarioId({ commit }, id) {
      commit('SET_USUARIO_ID', id);
    },
    setUsuarioMovil({ commit }, movil) {
      commit('SET_USUARIO_MOVIL', movil);
    },
    limpiarUsuario({ commit }) {
      commit('CLEAR_USUARIO');
    },
  },
  getters: {
    getUsuarioId(state) {
      return state.usuarioId;
    },
    getUsuarioMovil(state) {
      return state.usuarioMovil;
    },
  },
});

export default store;
