function createVNode(tag, props) {
  return {
    tag,
    props,
    dom: null,
    parent: null,
    child: null,
    sibling: null
  };
}

const EVENTS = ["onClick", "onChange"];

function createDom(vnode) {
  const dom =
    vnode.tag === "TEXT_ELEMENT"
      ? document.createTextNode(vnode.props.textContent)
      : document.createElement(vnode.tag);
  if (vnode.tag !== "TEXT_ELEMENT") {
    const isProperty = (key) => key !== "children";
    Object.keys(vnode.props)
      .filter(isProperty)
      .forEach((name) => {
        if (name === "style") {
          const style = vnode.props.style;
          Object.keys(style).forEach((styleKey) => {
            dom.style[styleKey] = style[styleKey];
          });
        } else {
          dom[EVENTS.includes(name) ? name.toLowerCase() : name] =
            vnode.props[name];
        }
      });
  }

  return dom;
}

let nextUnitOfWork = null;
let wipRoot = null;

function render(element, container) {
  const rootVNode = createVNode("ROOT", { children: [element] });
  nextUnitOfWork = rootVNode;
  wipRoot = rootVNode;
  wipRoot.dom = container;

  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (wipRoot) {
    commitRoot(wipRoot);
  }
}

function performUnitOfWork(vnode) {
  if (!vnode.dom) {
    vnode.dom = createDom(vnode);
  }

  if (vnode.props.children) {
    renderChildren(vnode, vnode.props.children);
  }

  if (vnode.child) {
    return vnode.child;
  }
  let nextVNode = vnode;
  while (nextVNode) {
    if (nextVNode.sibling) {
      return nextVNode.sibling;
    }
    nextVNode = nextVNode.parent;
  }

  return null;
}

function renderChildren(wipVNode, elements) {
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];
    let newVNode = null;
    if (typeof element !== "string") {
      newVNode = createVNode(element.tag, element.props);
    } else {
      newVNode = createVNode("TEXT_ELEMENT", { textContent: element });
    }

    newVNode.parent = wipVNode;

    if (index === 0) {
      wipVNode.child = newVNode;
    } else {
      prevSibling.sibling = newVNode;
    }

    prevSibling = newVNode;
    index++;
  }
}

function commitRoot(rootVNode) {
  commitWork(rootVNode.child);
  console.log(wipRoot);
  wipRoot = null;
}

function commitWork(vnode) {
  if (!vnode) return;

  const domParent = vnode.parent.dom;
  domParent.appendChild(vnode.dom);

  commitWork(vnode.child);

  commitWork(vnode.sibling);
}

export { render };
