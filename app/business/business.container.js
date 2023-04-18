'use strict';
import paramManager from './param.manager';


function getter(manager, request) {
  return function () {
    return manager.create(request, this);
  };
}

export default {
    getParamManager: getter(paramManager),
};
