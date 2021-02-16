(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mySingleSpa = {}));
}(this, (function (exports) { 'use strict';

  var mySingleSpa = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get setBootstrapMaxTime () { return setBootstrapMaxTime; },
    get setMountMaxTime () { return setMountMaxTime; },
    get setUnloadMaxTime () { return setUnloadMaxTime; },
    get setUnmountMaxTime () { return setUnmountMaxTime; },
    get registerApplication () { return registerApplication; },
    get getAppNames () { return getAppNames; },
    get getAppStatus () { return getAppStatus; },
    get getRawApps () { return getRawApps; },
    get start () { return start; },
    get mountSystemService () { return mountSystemService; },
    get getSystemService () { return getSystemService; },
    get NOT_LOADED () { return NOT_LOADED; },
    get LOAD_RESOURCE_CODE () { return LOAD_RESOURCE_CODE; },
    get NOT_BOOTSTRAPPED () { return NOT_BOOTSTRAPPED; },
    get BOOTSTRAPPING () { return BOOTSTRAPPING; },
    get NOT_MOUNTED () { return NOT_MOUNTED; },
    get MOUNTED () { return MOUNTED; },
    get UNMOUNTING () { return UNMOUNTING; },
    get LOAD_ERROR () { return LOAD_ERROR; },
    get SKIP_BECAUSE_BROKEN () { return SKIP_BECAUSE_BROKEN; }
  });

  const DEFAULT_TIMEOUTS = {
    bootstrap: {
      // 超时毫秒数
      milliseconds: 3000,
      // 当超时，是否
      rejectWhenTimeout: false
    },
    mount: {
      // 超时毫秒数
      milliseconds: 3000,
      // 当超时，是否
      rejectWhenTimeout: false
    },
    unmount: {
      // 超时毫秒数
      milliseconds: 3000,
      // 当超时，是否
      rejectWhenTimeout: false
    },
    unload: {
      // 超时毫秒数
      milliseconds: 3000,
      // 当超时，是否
      rejectWhenTimeout: false
    }
  };
  function setBootstrapMaxTime(milliseconds, rejectWhenTimeout = false) {
    if (typeof milliseconds !== 'number' || milliseconds <= 0) {
      throw new Error(`${type} max time must be a positive integer number of milliseconds`);
    }

    DEFAULT_TIMEOUTS.bootstrap = {
      milliseconds,
      rejectWhenTimeout
    };
  }
  function setMountMaxTime(milliseconds, rejectWhenTimeout = false) {
    if (typeof milliseconds !== 'number' || milliseconds <= 0) {
      throw new Error(`${type} max time must be a positive integer number of milliseconds`);
    }

    DEFAULT_TIMEOUTS.mount = {
      milliseconds,
      rejectWhenTimeout
    };
  }
  function setUnmountMaxTime(milliseconds, rejectWhenTimeout = false) {
    if (typeof milliseconds !== 'number' || milliseconds <= 0) {
      throw new Error(`${type} max time must be a positive integer number of milliseconds`);
    }

    DEFAULT_TIMEOUTS.unmount = {
      milliseconds,
      rejectWhenTimeout
    };
  }
  function setUnloadMaxTime(milliseconds, rejectWhenTimeout = false) {
    if (typeof milliseconds !== 'number' || milliseconds <= 0) {
      throw new Error(`${type} max time must be a positive integer number of milliseconds`);
    }

    DEFAULT_TIMEOUTS.unload = {
      milliseconds,
      rejectWhenTimeout
    };
  }
  function ensureAppTimeouts(timeouts = {}) {
    return { ...DEFAULT_TIMEOUTS,
      ...timeouts
    };
  }
  function reasonableTime(promise, description, timeouts) {
    return new Promise((resolve, reject) => {
      let finished = false;
      promise.then(data => {
        finished = true;
        resolve(data);
      }).catch(e => {
        finished = true;
        reject(e);
      });
      setTimeout(maybeTimeout, timeouts.milliseconds);

      function maybeTimeout() {
        if (finished) return;
        let error = `${description} did not resolve or reject for ${timeouts.milliseconds} milliseconds`;

        if (timeouts.rejectWhenTimeout) {
          reject(new Error(error));
        } else {
          console.error(error);
        }
      }
    });
  }

  // 未加载
  const NOT_LOADED = 'NOT_LOADED'; // 加载app代码中

  const LOAD_RESOURCE_CODE = 'LOAD_RESOURCE_CODE'; // 加载成功，但为启动

  const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'; // 启动中

  const BOOTSTRAPPING = 'BOOTSTRAPPING'; // 启动成功，未挂载

  const NOT_MOUNTED = 'NOT_MOUNTED'; // 挂载中

  const MOUNTING = 'MOUNTING'; // 挂载成功

  const MOUNTED = 'MOUNTED'; // 卸载中

  const UNMOUNTING = 'UNMOUNTING'; // 加载时参数校验未通过，或非致命错误

  const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN'; // 加载时遇到致命错误

  const LOAD_ERROR = 'LOAD_ERROR'; // 更新service中

  const UPDATING = 'UPDATING';
  function notSkipped(app) {
    return app.status !== SKIP_BECAUSE_BROKEN;
  }
  function withoutLoadError(app) {
    return app.status !== LOAD_ERROR;
  }
  function isLoaded(app) {
    return app.status !== NOT_LOADED && app.status !== LOAD_ERROR && app.status !== LOAD_RESOURCE_CODE;
  }
  function isntLoaded(app) {
    return !isLoaded(app);
  }
  function isActive(app) {
    return app.status === MOUNTED;
  }
  function isntActive(app) {
    return !isActive(app);
  }
  function shouldBeActive(app) {
    try {
      return app.activityWhen(window.location);
    } catch (e) {
      app.status = SKIP_BECAUSE_BROKEN;
      throw e;
    }
  }
  function shouldntBeActive(app) {
    try {
      return !app.activityWhen(window.location);
    } catch (e) {
      app.status = SKIP_BECAUSE_BROKEN;
      throw e;
    }
  }

  let started = false;
  function start() {
    if (started) {
      return;
    }

    started = true;
    return invoke();
  }
  function isStarted() {
    return started;
  }

  function toBootstrapPromise(app) {
    if (app.status !== NOT_BOOTSTRAPPED) {
      return Promise.resolve(app);
    }

    app.status = BOOTSTRAPPING;
    return reasonableTime(app.bootstrap(getProps(app)), `app: ${app.name} bootstrapping`, app.timeouts.bootstrap).then(() => {
      app.status = NOT_MOUNTED;
      return app;
    }).catch(e => {
      console.log(e);
      app.status = SKIP_BECAUSE_BROKEN;
      return app;
    });
  }

  function toUnmountPromise(app) {
    if (app.status !== MOUNTED) {
      return Promise.resolve(app);
    }

    app.status = UNMOUNTING;

    function unmountThisApp(serviceUnmountError) {
      return reasonableTime(app.unmount(getProps(app)), `app: ${app.name} unmounting`, app.timeouts.unmount).catch(e => {
        console.log(e);
        app.status = SKIP_BECAUSE_BROKEN;
      }).then(() => {
        if (app.status !== SKIP_BECAUSE_BROKEN) {
          app.status = serviceUnmountError === true ? SKIP_BECAUSE_BROKEN : NOT_MOUNTED;
        }

        return app;
      });
    } // 优先卸载当前app中的service，如果存在的话


    let unmountServicePromise = Promise.all(Object.keys(app.services).map(name => app.services[name].unmountSelf()));
    return unmountServicePromise.catch(e => {
      console.log(e);
      return true;
    }).then(unmountThisApp);
  }

  function toMountPromise(app) {
    if (app.status !== NOT_MOUNTED) {
      return Promise.resolve(app);
    }

    app.status = MOUNTING;
    return reasonableTime(app.mount(getProps(app)), `app: ${app.name} mounting`, app.timeouts.mount).then(() => {
      app.status = MOUNTED;
    }).catch(e => {
      console.log(e);
      app.status = MOUNTED;
      return toUnmountPromise(app).catch(e => {
        console.log(e);
      }).then(() => {
        app.status = SKIP_BECAUSE_BROKEN;
        return app;
      });
    });
  }

  function toUpdatePromise(service) {
    if (service.status !== MOUNTED) {
      return Promise.resolve(service);
    }

    service.status = UPDATING;
    return reasonableTime(service.update(getProps(service)), `service: ${service.name} updating`, service.timeouts.mount).then(() => {
      service.status = MOUNTED;
      return service;
    }).catch(e => {
      console.log(e);
      service.status = SKIP_BECAUSE_BROKEN;
      return service;
    });
  }

  let serviceIndex = 0;
  const systemService = {
    services: {}
  };
  /**
   * 挂载系统服务
   * @return {{mount(): Promise, unmount(): Promise, update(Object): Promise, getStatus(): string}}
   */

  function mountSystemService() {
    return mountService.apply(systemService, arguments);
  }
  /**
   * 根据名称获取系统服务
   * @param {string} serviceName 系统服务名称
   * @return {*|null}
   */

  function getSystemService(serviceName) {
    return systemService[serviceName] || {};
  }
  /**
   * 挂载服务
   * @param {Object|Function<Promise>} config 服务配置或加载函数
   * @param {Object} props 传入服务的属性
   * @return {{mount(): Promise, unmount(): Promise, update(Object): Promise, getStatus(): string}}
   */

  function mountService(config, props = {}) {
    if (!config || !/^(object|function)$/.test(typeof config)) {
      throw new Error('cannot mount services without config or config load function');
    }

    const context = this;
    serviceIndex++;
    let loadServicePromise = typeof config === 'function' ? config() : () => Promise.resolve(config);

    if (!smellLikeAPromise(loadServicePromise)) {
      throw new Error('config load function must be a promise or thenable');
    }

    const service = {
      id: serviceIndex,
      // service 可以嵌套 service
      services: {},
      status: LOAD_RESOURCE_CODE,
      props,
      context
    };
    loadServicePromise = loadServicePromise.then(serviceConfig => {
      let errorMsg = [];
      const name = `service_${service.id}`;

      if (typeof serviceConfig !== 'object') {
        errorMsg.push(`service load function dose not export anything`);
      }

      ['bootstrap', 'mount', 'unmount', 'update'].forEach(lifecycle => {
        // update是可选的
        if (lifecycle === 'update' && !serviceConfig[lifecycle]) {
          return;
        }

        if (!validateLifeCyclesFn(serviceConfig[lifecycle])) {
          errorMsg.push(`service dost not export ${lifecycle} as a function or function array`);
        }
      });

      if (errorMsg.length) {
        service.status = SKIP_BECAUSE_BROKEN;
        throw new Error(errorMsg.toString());
      }

      service.name = name;
      service.status = NOT_BOOTSTRAPPED;
      service.bootstrap = flattenFnArray(serviceConfig.bootstrap, `service bootstrap functions`);
      service.mount = flattenFnArray(serviceConfig.mount, `service mount functions`);
      service.unmount = flattenFnArray(serviceConfig.unmount, `service unmount functions`);
      service.timeouts = ensureAppTimeouts(serviceConfig.timeouts);

      if (serviceConfig.update) {
        service.update = flattenFnArray(serviceConfig.update, 'service update functions');
      }
    });
    loadServicePromise = loadServicePromise.then(() => toBootstrapPromise(service));
    let actions = {
      mount() {
        return loadServicePromise.then(() => {
          context.services[service.name] = service;
          return toMountPromise(service);
        }).then(() => {
          if (service.status !== MOUNTED) {
            delete context.services[service.name];
          }
        });
      },

      unmount() {
        return toUnmountPromise(service).then(() => {
          delete context.services[service.name];
        });
      },

      update(props = {}) {
        service.props = props;
        return toUpdatePromise(service);
      },

      getStatus() {
        return service.status;
      },

      getRawData() {
        return { ...service
        };
      }

    };
    service.unmountSelf = actions.unmount;
    service.mountSelf = actions.mount;
    service.updateSelf = actions.update;
    return actions;
  }

  function getProps(app) {
    return { ...app.customProps,
      name: app.name,
      // 将此方法传入app中，让app可以在内部自由挂载服务
      mountService: mountService.bind(app),
      mySingleSpa
    };
  }
  function smellLikeAPromise(promise) {
    if (promise instanceof Promise) {
      return true;
    }

    return typeof promise === 'object' && promise.then === 'function' && promise.catch === 'function';
  }
  function validateLifeCyclesFn(fn) {
    if (typeof fn === 'function') {
      return true;
    }

    if (Array.isArray(fn)) {
      return fn.filter(item => typeof item !== 'function').length === 0;
    }

    return false;
  }
  function flattenFnArray(fns, description) {
    if (!Array.isArray(fns)) {
      fns = [fns];
    }

    if (fns.length === 0) {
      fns = [() => Promise.resolve()];
    }

    return function (props) {
      return new Promise((resolve, reject) => {
        waitForPromises(0);

        function waitForPromises(index) {
          let fn = fns[index](props);

          if (!smellLikeAPromise(fn)) {
            reject(`${description} at index ${index} did not return a promise`);
            return;
          }

          fn.then(() => {
            if (index === fns.length - 1) {
              resolve();
            } else {
              waitForPromises(++index);
            }
          }).catch(e => {
            reject(e);
          });
        }
      });
    };
  }

  function toLoadPromise(app) {
    // 状态不满足需要被load
    if (app.status !== NOT_LOADED && app.status !== LOAD_ERROR) {
      return Promise.resolve(app);
    }

    app.status = LOAD_RESOURCE_CODE;
    const loadPromise = app.loadApp(getProps(app));

    if (!smellLikeAPromise(loadPromise)) {
      console.log('app loadFunction must return a promise');
      app.status = SKIP_BECAUSE_BROKEN;
      return Promise.resolve(app);
    }

    return loadPromise.then(module => {
      let errorMsg = [];

      if (typeof module !== 'object') {
        errorMsg.push(`app:${app.name} dose not export anything`);
      }

      ['bootstrap', 'mount', 'unmount'].forEach(lifecycle => {
        if (!validateLifeCyclesFn(module[lifecycle])) {
          errorMsg.push(`app:${app.name} dost not export ${lifecycle} as a function or function array`);
        }
      });

      if (errorMsg.length) {
        console.log(errorMsg);
        app.status = SKIP_BECAUSE_BROKEN;
        return app;
      }

      app.status = NOT_BOOTSTRAPPED;
      app.bootstrap = flattenFnArray(module.bootstrap, `app:${app.name} bootstrap functions`);
      app.mount = flattenFnArray(module.mount, `app:${app.name} mount functions`);
      app.unmount = flattenFnArray(module.unmount, `app:${app.name} unmount functions`);
      app.unload = flattenFnArray(module.unload ? module.unload : [], `app:${app.name} unload functions`);
      app.timeouts = ensureAppTimeouts(module.timeouts);
      return app;
    }).catch(e => {
      console.log(e);
      app.status = LOAD_ERROR;
      return app;
    });
  }

  const HIJACK_EVENTS_NAME = /^(hashchange|popstate)$/i;
  const EVENTS_POOL = {
    hashchange: [],
    popstate: []
  };

  function reroute() {
    invoke([], arguments);
  }

  window.addEventListener('hashchange', reroute);
  window.addEventListener('popstate', reroute); // 拦截所有注册的事件，以便确保这里的事件总是第一个执行

  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  window.addEventListener = function (eventName, handler, args) {
    if (eventName && HIJACK_EVENTS_NAME.test(eventName) && typeof handler === 'function') {
      EVENTS_POOL[eventName].indexOf(handler) === -1 && EVENTS_POOL[eventName].push(handler);
    }

    return originalAddEventListener.apply(this, arguments);
  };

  window.removeEventListener = function (eventName, handler) {
    if (eventName && HIJACK_EVENTS_NAME.test(eventName) && typeof handler === 'function') {
      let eventList = EVENTS_POOL[eventName];
      eventList.indexOf(handler) > -1 && (EVENTS_POOL[eventName] = eventList.filter(fn => fn !== handler));
    }

    return originalRemoveEventListener.apply(this, arguments);
  }; // 拦截history的方法，因为pushState和replaceState方法并不会触发onpopstate事件，所以我们即便在onpopstate时执行了reroute方法，也要在这里执行下reroute方法。


  const originalHistoryPushState = window.history.pushState;
  const originalHistoryReplaceState = window.history.replaceState;

  window.history.pushState = function (state, title, url) {
    let result = originalHistoryPushState.apply(this, arguments);
    reroute(mockPopStateEvent(state));
    return result;
  };

  window.history.replaceState = function (state, title, url) {
    let result = originalHistoryReplaceState.apply(this, arguments);
    reroute(mockPopStateEvent(state));
    return result;
  };

  function mockPopStateEvent(state) {
    return new PopStateEvent('popstate', {
      state
    });
  } // 再执行完load、mount、unmout操作后，执行此函数，就可以保证微前端的逻辑总是第一个执行。然后App中的Vue或React相关Router就可以收到Location的事件了。


  function callCapturedEvents(eventArgs) {
    if (!eventArgs) {
      return;
    }

    if (Array.isArray(eventArgs)) {
      eventArgs = eventArgs[0];
    }

    let name = eventArgs.type;

    if (!HIJACK_EVENTS_NAME.test(name)) {
      return;
    }

    EVENTS_POOL[name].forEach(handler => handler.apply(window, eventArgs));
  }

  let loadAppsUnderway = false;
  let pendingPromises = [];
  function invoke(pendings, eventArgs) {
    if (loadAppsUnderway) {
      return new Promise((resolve, reject) => {
        pendingPromises.push({
          success: resolve,
          failure: reject,
          eventArgs
        });
      });
    }

    loadAppsUnderway = true;

    if (isStarted()) {
      return performAppChanges();
    }

    return loadApps(); // 找到需要load的app

    function loadApps() {
      let loadPromises = getAppsToLoad().map(toLoadPromise);
      return Promise.all(loadPromises).then(() => {
        callAllLocationEvents();
        return finish();
      }).catch(e => {
        callAllLocationEvents();
        console.log(e);
      });
    }

    function finish() {
      let resolveValue = getMountedApps();

      if (pendings) {
        pendings.forEach(item => item.success(resolveValue));
      }

      loadAppsUnderway = false;

      if (pendingPromises.length) {
        const backup = pendingPromises;
        pendingPromises = [];
        return invoke(backup);
      }

      return resolveValue;
    } // 启动app


    function performAppChanges() {
      // getAppsToUnmount
      let unmountApps = getAppsToUnmount();
      let unmountPromises = Promise.all(unmountApps.map(toUnmountPromise)); // getAppsToLoad

      let loadApps = getAppsToLoad();
      let loadPromises = loadApps.map(app => {
        return toLoadPromise(app).then(app => toBootstrapPromise(app)).then(() => unmountPromises).then(() => toMountPromise(app));
      });
      let mountApps = getAppsToMount().filter(app => loadApps.indexOf(app) === -1);
      let mountPromises = mountApps.map(app => {
        return toBootstrapPromise(app).then(() => unmountPromises).then(() => toMountPromise(app));
      });
      return unmountPromises.then(() => {
        callAllLocationEvents();
        let loadAndMountPromises = loadPromises.concat(mountPromises);
        return Promise.all(loadAndMountPromises).then(finish, ex => {
          pendings.forEach(item => item.reject(ex));
          throw ex;
        });
      }, e => {
        callAllLocationEvents();
        console.log(e);
        throw e;
      });
    }

    function callAllLocationEvents() {
      pendings && pendings.length && pendings.filter(item => item.eventArgs).forEach(item => callCapturedEvents(item.eventArgs));
      eventArgs && callCapturedEvents(eventArgs);
    }
  }

  const APPS = [];
  /**
   * 获取满足加载条件的app
   * 1、没有加载中断
   * 2、没有加载错误
   * 3、没有被加载过
   * 4、满足app.activityWhen()
   * @return {*[]}
   */

  function getAppsToLoad() {
    return APPS.filter(notSkipped).filter(withoutLoadError).filter(isntLoaded).filter(shouldBeActive);
  }
  /**
   * 需要mount的app
   * 1、没有加载中断
   * 2、加载过的
   * 3、当前没有mounted的
   * 4、需要被mounted的
   */

  function getAppsToMount() {
    return APPS.filter(notSkipped).filter(isLoaded).filter(isntActive).filter(shouldBeActive);
  }
  /**
   * 需要被unmount的app
   * 1、没有加载中断
   * 2、正在挂载的
   * 3、需要卸载的
   */

  function getAppsToUnmount() {
    return APPS.filter(notSkipped).filter(isActive).filter(shouldntBeActive);
  }
  /**
   * 获取所有的App名称
   * @return {string[]}
   */

  function getAppNames() {
    return APPS.map(function (item) {
      return item.name;
    });
  }
  function getAppStatus(name) {
    if (!name) {
      return APPS.map(item => item.status);
    }

    let app = APPS.find(item => item.name === name);
    return app ? app.status : null;
  }
  function getRawApps() {
    return [...APPS];
  }
  function getMountedApps() {
    return APPS.filter(isActive).map(item => item.name);
  }
  /**
   * 注册application
   * @param {string} appName application名称
   * @param {Object|Function<Promise>} applicationOrLoadFunction app配置或app异步加载函数
   * @param {Function<Boolean>} activityWhen 判断是否应该被挂载
   * @param {Object} customProps 自定义配置
   * @return {Promise}
   */

  function registerApplication(appName, applicationOrLoadFunction, activityWhen, customProps = {}) {
    if (!appName || typeof appName !== 'string') {
      throw new Error('the app name must be a non-empty string');
    }

    if (getAppNames().indexOf(appName) !== -1) {
      throw new Error('There is already an app declared with name ' + appName);
    }

    if (typeof customProps !== 'object' || Array.isArray(customProps)) {
      throw new Error('the customProps must be a pure object');
    }

    if (!applicationOrLoadFunction) {
      throw new Error('the application or load function is required');
    }

    if (typeof activityWhen !== 'function') {
      throw new Error('the activityWhen must be a function');
    }

    if (typeof applicationOrLoadFunction !== 'function') {
      applicationOrLoadFunction = () => Promise.resolve(applicationOrLoadFunction);
    }

    APPS.push({
      name: appName,
      loadApp: applicationOrLoadFunction,
      activityWhen,
      customProps,
      status: NOT_LOADED,
      services: {}
    });
    return invoke();
  }

  exports.BOOTSTRAPPING = BOOTSTRAPPING;
  exports.LOAD_ERROR = LOAD_ERROR;
  exports.LOAD_RESOURCE_CODE = LOAD_RESOURCE_CODE;
  exports.MOUNTED = MOUNTED;
  exports.NOT_BOOTSTRAPPED = NOT_BOOTSTRAPPED;
  exports.NOT_LOADED = NOT_LOADED;
  exports.NOT_MOUNTED = NOT_MOUNTED;
  exports.SKIP_BECAUSE_BROKEN = SKIP_BECAUSE_BROKEN;
  exports.UNMOUNTING = UNMOUNTING;
  exports.getAppNames = getAppNames;
  exports.getAppStatus = getAppStatus;
  exports.getRawApps = getRawApps;
  exports.getSystemService = getSystemService;
  exports.mountSystemService = mountSystemService;
  exports.registerApplication = registerApplication;
  exports.setBootstrapMaxTime = setBootstrapMaxTime;
  exports.setMountMaxTime = setMountMaxTime;
  exports.setUnloadMaxTime = setUnloadMaxTime;
  exports.setUnmountMaxTime = setUnmountMaxTime;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=my-single-spa.js.map
