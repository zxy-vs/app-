import {
    Field,
    Button,
    NumberKeyboard,
    Cell,
    Icon,
    Tab,
    Tabs,
    Divider,
    NavBar,
    PullRefresh,
    List,
    Grid,
    GridItem,
    ContactCard,
    Image,
    Badge,
    Toast,
    Dialog,
    ActionSheet,
    Uploader,DatetimePicker ,CountDown ,Popup
} from 'vant';


export default {
    install(Vue) {
        Vue.use(Field);
        Vue.use(Popup);
        Vue.use(Button);
        Vue.use(NumberKeyboard);
        Vue.use(Cell);
        Vue.use(Icon);
        Vue.use(Tab);
        Vue.use(Tabs);
        Vue.use(Divider);
        Vue.use(NavBar);
        Vue.use(PullRefresh);
        Vue.use(List);
        Vue.use(Grid);
        Vue.use(GridItem);
        Vue.use(ContactCard);
        Vue.use(Image);
        Vue.use(Badge);
        Vue.use(Dialog);
        Vue.use(Toast);
        Vue.use(ActionSheet);
        Vue.use(Uploader);
        Vue.use(DatetimePicker);
        Vue.use(CountDown);
    }
}