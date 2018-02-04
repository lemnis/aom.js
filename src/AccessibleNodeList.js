import AccessibleNode from "./AccessibleNode";

export let AccessibleNodeListConstructor = class AccessibleNodeList extends Array {
	item(index) {
		if(isNaN(index)) return;
		return this[index];
	}

	add(accessibleNode, before = null) {
		if (!(accessibleNode instanceof AccessibleNode)) {
			throw new TypeError("Failed to execute 'add' on 'AccessibleNodeList': parameter 1 is not of type 'AccessibleNode'.");
		}

		if(before !== null) {
			var beforeIndex = this.indexOf(before);
			if(beforeIndex > -1) {
				return this.splice(beforeIndex - 1, 0, accessibleNode);
			}
		}

		return this.push(accessibleNode);
	}

	remove(index) {
		// update DOM attribute
		if (this.parentAOM && this[index]._node && this[index]._node.id) {
			let ids = [];

			if (this.parentAOM._node.hasAttribute(this.attribute)) {
				ids = this.parentAOM._node.getAttribute(this.attribute).split(" ");
			} else {
				ids = [];
			}

			var filteredIds = ids.filter(e => e !== this[index]._node.id);

			// remove generated ids as long it was previously referenced
			if (this[index].generated_id === true && filteredIds.length < ids.length) {
				this[index]._node.id = "";
			}

			this.parentAOM._node.setAttribute(this.attribute, filteredIds.join(" "));
		}

		return this.pop(index);
	}
}

var arrayChangeHandler = {
	set: function (target, property, value) {
		// adding or changing a value inside the array
		if (!isNaN(property)) {

			// check if its valid type
			if (value instanceof AccessibleNode) {
				target[property] = value;

				// update DOM attribute
				if (target.parentAOM && value && value._node) {
					if(!value._node.id) {
						value._node.id = "aom-" + Date.now();
						value.generated_id = true;
					}

					let ids = [];
					if (target.parentAOM._node.hasAttribute(target.attribute)) {
						ids = target.parentAOM._node.getAttribute(target.attribute).split(" ");
					} else {
						ids = [];
					}

					ids.push(value._node.id);

					target.parentAOM._node.setAttribute(target.attribute, ids.join(" "));
				}

				target[property] = value;
				return true;
			}
			
			throw new Error("Only instances of AccessibleNode are allowed");
		}
		
		target[property] = value;
		// you have to return true to accept the changes
		return true;
	}
};

/**
 * 
 */
function AccessibleNodeListProxy() {
	let accessibleNodeList = new AccessibleNodeListConstructor();	
	return new Proxy(accessibleNodeList, arrayChangeHandler);
}

export default AccessibleNodeListProxy;