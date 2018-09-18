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

    // (function (getAttribute) {
    //     Element.prototype.getAttribute = function (name) {
    //         var attribute = getAttribute.call(this, name);

    //         if(
    //             name.indexOf("aria-") == 0
    //             && this.accessibleNode 
    //             && typeof this.accessibleNode._defaultValues[name] != "undefined"
    //         ) {
    //             console.log("get", this.accessibleNode._defaultValues[name])
    //             return this.accessibleNode._defaultValues[name];
    //         }

    //         return attribute;
    //     }
    // })(Element.prototype.getAttribute);

// }