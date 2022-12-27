import { createApp } from 'vue';
import dayjs from 'dayjs';

import App from './App.vue';

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

createApp(App).mount('#app');
