/* eslint: source-type: module */

import AccessibleNode from './../src/AccessibleNode.js';
import AccessibleNodeList from './../src/AccessibleNodeList.js';

// if (!window.AccessibleNode && !window.AccessibleNodeList) {
    
    window.AccessibleNode = AccessibleNode;
    window.AccessibleNodeList = AccessibleNodeList;
    
    var elements = new WeakMap();
    
    Object.defineProperty(window.Element.prototype, 'accessibleNode', {
        get() {
            if(elements.has(this)) {
                return elements.get(this);
            }
    
            var aom = new AccessibleNode(this);
            elements.set(this, aom);
            return aom;
        }
    });

// }