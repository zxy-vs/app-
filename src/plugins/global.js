import globalCom from '../globalCom/globalCom.vue'
import globalCom1 from '../globalCom/globalCom1.vue'

export default {
    install(Vue){
        Vue.component('globalCom',globalCom)
        Vue.component('globalCom1',globalCom1)
    }
}