/**
 * Returns the value of a given attribute
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @return {String} attribute's value
 */
export function get(aom, attributeName) {
	return aom._values[attributeName] || null;
}

/**
 * Sync the new value to the DOM
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @param {String | Number } status 
 */
export function set(aom, attributeName, status) {
	if (status == undefined) {
		aom._node.removeAttribute(attributeName);
	} else {
		aom._node.setAttribute(attributeName, status);
	}
	
	aom._values[attributeName] = status;
	return status;
}

export default { get, set };