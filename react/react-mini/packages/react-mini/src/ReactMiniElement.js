const hasOwnProperty = Object.prototype.hasOwnProperty;

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

const ReactMiniElement = function(type, key, ref, props) {
  const element = Object.create(null);
  element['type'] = type;
  element['key'] = key;
  element['ref'] = ref;
  element['props'] = props;

  return element;
}

export function createElement(type, config, children) {

  let props = {},
    key = null,
    ref = null;

  if (config != null) {
    // 将key转换为字符串
    (config.key !== undefined) && (key = '' + config.key);
    (config.ref !== undefined) && (ref = config.ref);

    // 将所有属性添加到新的props里
    for (propName in config) {
      // hasOwnProperty.call 与 obj.hasOwnProperty的区别见:
      https://stackoverflow.com/questions/12017693/why-use-object-prototype-hasownproperty-callmyobj-prop-instead-of-myobj-hasow
      if (hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // 将children添加到新的props里
  const childLength = arguments.length - 2;
  if (childLength === 1) {
    props.children = children;
  }else if (childLength > 1) {
    const childArr = Array(childLength);
    for (let i = 0; i < childLength; i ++) {
      childArr[i] = arguments[i + 2];
    }
    props.children = childArr;
  }

  // 设置default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  return ReactMiniElement(type, key, ref, props);
}