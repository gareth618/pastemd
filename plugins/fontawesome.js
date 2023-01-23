import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import {
  faHeart,
  faOtter, faEye, faPaperPlane, faClipboard as faClipboardSolid
} from '@fortawesome/free-solid-svg-icons';
import { faClipboard as faClipboardRegular } from '@fortawesome/free-regular-svg-icons';

config.autoAddCss = false;
library.add(faHeart);
library.add(faOtter, faEye, faPaperPlane, faClipboardSolid, faClipboardRegular);

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon, { });
});
