import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {environment} from "./environments/environment";

if (environment.production) {
    window.console.log = () => {};
    window.console.debug = () => {};
    window.console.warn = () => {};
    window.console.info = () => {};
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
