/**
 * Returns the value of a given attribute as Number
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @return {Number} attribute's value
 */
export function get(aom, attributeName) {
	var value = aom._values[attributeName] || aom._node.getAttribute(attributeName);;
	if (value == undefined) return null;
	return Number(value);
}

/**
 * Sync the new value to the DOM
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @param {String | Number } status 
 */
export function set(aom, attributeName, str) {
	if(str == null) {
		aom._node.removeAttribute(attributeName);
	} else {
		aom._node.setAttribute(attributeName, str);
	}

	aom._values[attributeName] = status.toString();
	return status;
}

export default { get, set };