export const createElement = (tagName, props = {}, innerHTML = '') => {
  if (tagName === '') return document.createTextNode(innerHTML);

  const $el = document.createElement(tagName);

  Object.keys(props).forEach((propName) => {
    if (propName === 'children' && props.children) {
      $el.append(...props.children);
    } else if (typeof props[propName] !== 'undefined') {
      $el[propName] = props[propName];
    }
  });

  if (innerHTML) {
    $el.innerHTML = innerHTML;
  }

  return $el;
};

export const debaunce = (fn, ms) => {
  let timeout;

  return function debounced(...arg) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => fn.apply(this, arg), ms);
  };
};

export const formatDate = (stringDate) => {
  const date = new Date(stringDate);
  return date.toLocaleString();
};
