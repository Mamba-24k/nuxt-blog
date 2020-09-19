export const state = () => ({
  map_user_info: {},
  vuex_skin_obj: {
    name: 'Mamba',
    chinaName: '曼巴',
    first: 'M',
    icon: 'icon-M',
    behind: 'amba',
    headerUp: '曼巴 out ?',
    headerDown: '未完待续。。。',
    footerUp: 'Mamba is not out',
    footerDown: "I'm here all the time!",
  },
  limit_count: 0
})

export const mutations = {
  map_set_user_info(state,data) {
    state.userInfo = data
  },
  vuex_set_skin_obj(state,data) {
    state.vuex_skin_obj = data
  },
  vuex_set_limit_count(state,data) {
    state.limit_count = data
  }
}