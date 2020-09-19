import Vue from 'vue'
import {
  Pagination,
  Dialog,
  // Dropdown,
  // DropdownMenu,
  // DropdownItem,
  Input,
  Switch,
  Button,
  ButtonGroup,
  Tooltip,
  Form,
  FormItem,
  Tag,
  Alert,
  Slider,
  Upload,
  Progress,
  Badge,
  Card,
  ColorPicker,
  Loading,
  MessageBox,
  Message,
  Notification,
  drawer
} from 'element-ui';

// 可配置按需引入我们所需的组件的样式
// import '../assets/css/element.scss'

Vue.use(Pagination);
Vue.use(Dialog);
// Vue.use(Dropdown);
// Vue.use(DropdownMenu);
// Vue.use(DropdownItem);
Vue.use(Input);
Vue.use(Switch);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tag);
Vue.use(Alert);
Vue.use(Slider);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Badge);
Vue.use(Card);
Vue.use(ColorPicker);
Vue.use(drawer);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;