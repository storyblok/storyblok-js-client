import Client from './index';
import SbFetch from './sbFetch';
import * as utils from './utils';

const extend = (to: Record<any, any>, _from: Record<any, any>) => {
  for (const key in _from) {
    to[key] = _from[key];
  }
};

extend(Client, { SbFetch });
extend(Client, utils);

// Single default export object for UMD friendly bundle
export default Client;
