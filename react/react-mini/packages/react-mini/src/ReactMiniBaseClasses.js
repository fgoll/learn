
const dirtyComponents = []

const ReactInstanceMap = {
  remove: function(key) {
    return key._reactInternalInstance = undefined;
  },

  get: function(key) {
    return key._reactInternalInstance;
  },

  has: function(key) {
    return key._reactInternalInstance !== undefined;
  },

  set: function(key, value) {
    key._reactInternalInstance = value;
  }
}

const updater = {
  enqueueSetState(instance, partialState) {
    const internalInstance = ReactInstanceMap.get(instance);
    if (!internalInstance) return;
    const queue = internalInstance._pendingStateQueue || 
                  (internalInstance._pendingStateQueue = []);
    queue.push(partialState);
    enqueueUpdate(internalInstance);
  }
}

const batchingStrategy = {
  isBatchingUpdates: false,

  batchedUpdates: function(callback, component) {
    var alreadyBatchingUpdates = batchingStrategy.isBatchingUpdates;

    batchingStrategy.isBatchingUpdates = true;

    if (alreadyBatchingUpdates) {
      callback(component);
    }else {

    }
  }
}

function enqueueUpdate(component) {
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }

  dirtyComponents.push(component);
}

class Component {
  constructor(props, context) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater;
  }

  setSate(partialState, callback) {
    this.updater.enqueueSetState(this, partialState);
    callback && (this.updater.enqueueCallback(this, callback));
  }
}