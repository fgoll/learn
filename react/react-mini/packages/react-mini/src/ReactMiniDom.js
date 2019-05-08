export function render(element, container) {
  const { type, props } = element;
  
  if (!type) return;

  const { children } = props;

  let dom;

  const elementType = typeof type;

  if (elementType === 'function') {

  }else if (elementType === 'string') {
    dom = document.createElement(type);
  }

  for (let propName in props) {
    if (propName === 'children') continue;
    if (propName === 'style') {

      const style = props[propName];

      for (let styleName in style) {
        dom.style[styleName] = style[styleName];
      }
      continue;
    }

    dom[propName] = props[propName];
  }

  if (children) {
    if (Array.isArray(children)) {
      children.forEach((elem) => {
        render(elem, dom);
      })
    }else {
      render(children, dom);
    }
  }

  container.appendChild(dom);
}