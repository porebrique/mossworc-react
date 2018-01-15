import * as lodash from 'lodash';

export default (functionNames) => ({
  to: context => {
    lodash.bindAll(context, functionNames);
  }
});