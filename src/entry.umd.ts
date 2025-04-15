import Client from './index';
import SbFetch from './sbFetch';
import * as sbHelpers from './sbHelpers';

const extend = (to: Record<any, any>, _from: Record<any, any>) => {
  for (const key in _from) {
    to[key] = _from[key];
  }
};

extend(Client, { SbFetch });
extend(Client, sbHelpers);

// Single default export object for UMD friendly bundle
export default Client;
