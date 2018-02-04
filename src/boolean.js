/**
 * Returns the value of given attribute as Boolean
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @return {Boolean} attribute's value
 */
export function get(aom, attributeName) {
	var value = aom._values[attributeName];
	if(value == undefined ) return null;
	return value  == "true" || false;
}

/**
 * Sync the new value to the property
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @param {String | Boolean} status 
 */
export function set(aom, attributeName, status) {
	if(status == undefined) {
		aom._node.removeAttribute(attributeName);
	} else {
		aom._node.setAttribute(attributeName, status);
	}

	aom._values[attributeName] = status;
	return status;
}

export default { get, set };