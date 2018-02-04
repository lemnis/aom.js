/* eslint-env mocha */

require('./../src/index.js');
import { AccessibleNodeListConstructor as AccessibleNodeList } from './../src/AccessibleNodeList.js';

var assert = require('assert');

var attributes = {
	'role': { type: String },
	'roleDescription': { type: String },
	'label': { type: String },
	'labeledBy': { type: AccessibleNodeList },
	'describedBy': { type: AccessibleNodeList },
	'current': { type: String },
	'autocomplete': { type: String },
	'hidden': { type: Boolean },
	'keyShortcuts': { type: String },
	'modal': { type: Boolean },
	'multiline': { type: Boolean },
	'multiselectable': { type: Boolean },
	'orientation': { type: String },
	'readOnly': { type: Boolean },
	'required': { type: Boolean },
	'selected': { type: Boolean },
	'sort': { type: String },
	'checked': { type: String },
	'expanded': { type: Boolean },
	'disabled': { type: Boolean },
	'invalid': { type: String },
	'hasPopUp': { type: String },
	'pressed': { type: String },
	'valueText': { type: String },
	'placeholder': { type: String },
	'valueNow': { type: Number },
	'valueMin': { type: Number },
	'valueMax': { type: Number },
	'atomic': { type: Boolean },
	'busy': { type: Boolean },
	'live': { type: String },
	'relevant': { type: String },
	'activeDescendant': { type: window.AccessibleNode },
	'controls': { type: AccessibleNodeList },
	'details': { type: window.AccessibleNode },
	'errorMessage': { type: window.AccessibleNode },
	'flowTo': { type: AccessibleNodeList },
	'owns': { type: AccessibleNodeList },
	'colCount': { type: Number },
	'colIndex': { type: Number },
	'colSpan': { type: Number },
	'posInSet': { type: Number },
	'rowCount': { type: Number },
	'rowIndex': { type: Number },
	'rowSpan': { type: Number },
	'setSize': { type: Number },
	'level': { type: Number }
};

describe('AccessibleNode', function () {
	var div = document.createElement("div");

	it('constructor exist', function () {
		assert.ok(
			window.AccessibleNode.prototype
			&& window.AccessibleNode.prototype.constructor
			&& window.AccessibleNode.prototype.constructor.name
		);
	})

	describe('on HTMLElement', function () {
		it('should have an accessibleNode property', function () {
			assert.ok(div.accessibleNode);
		});
		it('should be of correct type', function() {
			assert.equal(div.accessibleNode.constructor.name, window.AccessibleNode.name);
		})
	});

	describe('instance', function () {
		it('should have all aria-* attributes', function () {
			var missingAttrs = Object.keys(attributes).filter(attribute => {
				return typeof div.accessibleNode[attribute] == "undefined";
			})
			assert.deepEqual(missingAttrs, []);
		});
	});

	describe('each attribute', function () {
		it('should have as default value of null', function () {
			for (let attr in attributes) {
				assert.equal(div.accessibleNode[attr], null);
			}
		});
		it('should have the correct type', function () {
			for (let attr in attributes) {
				// set some (fake) data
				switch (attributes[attr].type) {
					case String:
						div.accessibleNode[attr] = "30px";
						break;
					case Boolean:
					case Number:
						div.accessibleNode[attr] = "30";
						break;
					case AccessibleNodeList:
						div.accessibleNode[attr] = new window.AccessibleNodeList();
						break;
					default:
						div.accessibleNode[attr] = new attributes[attr].type();
				}

				if (div.accessibleNode[attr] === null) console.log(attr, div.accessibleNode[attr]);
				let actual = div.accessibleNode[attr].constructor.name;
				let expected = attributes[attr].type.name;
				
				assert.equal(actual, expected,
					`The property '${attr}' is not correctly defined, it was ${actual}, but expected ${expected}`
				);
			}
		});
		describe('of type AccessibleNode', function () {
			let anAttributes = Object.entries(attributes).filter(attr => attr[1].type == window.AccessibleNode);
			
			it('should only allow an instance of AccessibleNode as value', function () {
				anAttributes.forEach(obj => {
					let attr = obj[0];
					
					assert.throws(() => div.accessibleNode[attr] = new String());
					assert.throws(() => div.accessibleNode[attr] = "");
					assert.doesNotThrow(() => div.accessibleNode[attr] = new window.AccessibleNode());
				});
			});
		});
		describe('of type AccessibleNodeList', function () {
			let anlAttributes = Object.entries(attributes).filter(attr => attr[1].type == AccessibleNodeList);
			
			it('should only allow an instance of AccessibleNodeList as value', function () {
				anlAttributes.forEach(obj => {
					let attr = obj[0];
					assert.throws(() => div.accessibleNode[attr] = new String());
					assert.throws(() => div.accessibleNode[attr] = "");
					assert.doesNotThrow(() => div.accessibleNode[attr] = new window.AccessibleNodeList());
				});
			});
		});
	});
	describe('EventTarget', function () {
		it('should have addEventListener', function () {
			assert.ok(div.accessibleNode.addEventListener);
		});
		it('should have removeEventListener, dispatchEvent', function () {
			assert.ok(div.accessibleNode.removeEventListener);
		});
		it('should have dispatchEvent', function () {
			assert.ok(div.accessibleNode.dispatchEvent);
		});		
		it('should be able to add and trigger events', function (done) {
			div.accessibleNode.addEventListener("click", () => done());
			div.accessibleNode.dispatchEvent(new MouseEvent("click"));
		});
	});
	describe('Polyfill', function () {
		it('AccessibleNode properties should reflect ARIA', function () {
			div.accessibleNode.role = "button";
			assert.equal(div.accessibleNode.role, div.getAttribute("role"));
		});
		it('ARIA should not overwrite AccessibleNode', function (done) {
			div.setAttribute("role", "group");

			// attributes are reset by an mutation observer,
			// as result the changes must be checked in the next check
			setTimeout(() => {
				try {
					assert.equal(div.accessibleNode.role, div.getAttribute("role"));
					assert.equal("button", div.getAttribute("role"));
					done();
				} catch(e) {
					done(e);
				}
			}, 0);
		});
		it('ARIA should be overwritable when no value is set within AccessibleNode', function () {
			div.setAttribute("aria-label", "Foo");
			assert.equal(div.getAttribute("aria-label"), "Foo");
		});
		it('.attributes should return the correct value', () => {});
		it('.getAttribute should return the correct value', () => {});
	});
});

describe('AccessibleNodeList', function () {
	
	it('constructor exist in window object', function () {
		assert.ok(window.AccessibleNodeList.prototype && window.AccessibleNodeList.prototype.constructor.name);
	});

	describe('[Number]', function() {
		let list = new window.AccessibleNodeList();
		let div1 = document.createElement("div");
		let div0 = document.createElement("div");
		
		it('should be able to add accesibleNode by specific index', function () {
			list[0] = div1.accessibleNode;
			list["1"] = div1.accessibleNode;

			assert.equal(list[0], div1.accessibleNode);
			assert.equal(list["1"], div1.accessibleNode);
		});
		it('should be able to overwrite accesibleNode by specific index', function () {
			list[0] = div0.accessibleNode;

			assert.equal(list[0], div0.accessibleNode);
		});
		it('should return null if index does not exist', function () {
			assert.equal(list[2], null);
			assert.equal(list["2"], null);
		});
	});
	
	describe('.length', function () {
		let list = new window.AccessibleNodeList();
		
		it('has a default value of 0', function () {
			assert.equal(list.length, 0);
		});	
		it('can be set at an different size', function () {
			list.length = 3;
			assert.equal(Array.from(list).length, 3);
		});
		it('first value is empty slot', function () {
			assert.equal(list[0], null);
		});
	});

	describe('.add()', function () {
		
		it('can only add instances of AccessibleNode', function () {
			let list = new window.AccessibleNodeList();
			let div = document.createElement("div");

			assert.throws(() => list.add(true));
			assert.doesNotThrow(() => list.add(div.accessibleNode));
		});

		it('can add AccessibleNode before an specific AccessibleNode', function () {
			let list = new window.AccessibleNodeList();
			let div = document.createElement("div");
			let div2 = document.createElement("div");

			list.add(div.accessibleNode);

			assert.doesNotThrow(() => list.add(div2.accessibleNode, div.accessibleNode));
			assert.equal(list.length, 2);
			assert.equal(list[0], div2.accessibleNode);
		});
	});

	describe('.item()', function () {
		let list = new window.AccessibleNodeList();
		let div1 = document.createElement("div");
		let div0 = document.createElement("div");
		list.add(div1.accessibleNode);
		list.add(div0.accessibleNode, div1.accessibleNode);

		it('should return the correct accessibleNode', function () {
			assert.equal(list.item(0), div0.accessibleNode);
			assert.equal(list.item("1"), div1.accessibleNode);
		});
		it('should return null if index does not exist', function () {
			assert.equal(list.item(2), null);
			assert.equal(list.item("2"), null);
		});
		it('should only return values of index numbers', function () {
			assert.notEqual(list.item("length"), list.length);
		});
	});

	describe('.remove()', function () {
		let list = new window.AccessibleNodeList();
		let div = document.createElement("div");
		list.add(div.accessibleNode);
		
		it('should remove the reference', function () {
			list.remove(0);
			assert.equal(list[0], undefined);
			assert.equal(list.length, 0);
		});
	});

	describe('Polyfill', function () {
		let attr = "owns";
		let div = document.createElement("div");
		div.accessibleNode[attr] = new window.AccessibleNodeList();

		var divWithID = document.createElement("div");
		divWithID.id = "aom-id";

		var divWithoutID = document.createElement("div");

		it('each ID of added elements should be reflected in the ARIA', function () {
			div.accessibleNode[attr].add(divWithID.accessibleNode);
			console.log(div, div.accessibleNode[attr], div.getAttribute("aria-owns"));
			assert.ok(div.getAttribute("aria-owns").indexOf(divWithID.id) > -1);
		});
		it('each ID of removed elements should be reflected in the ARIA', function () {
			div.accessibleNode[attr].remove(0);
			assert.ok(div.getAttribute("aria-owns").indexOf(divWithID.id) == -1);
		});
		it('an added element without ID should be generated and reflect in the ARIA attribute', function () {
			div.accessibleNode[attr].add(divWithoutID.accessibleNode);
			assert.ok(div.getAttribute("aria-owns").indexOf(divWithoutID.id) > -1);
		});
		it('an generated ID should be removed after no connection exist anymore', function () {
			div.accessibleNode[attr].remove(0);
			assert.ok(div.getAttribute("aria-owns").indexOf(divWithID.id) == -1);
			assert.equal(divWithoutID.id, "");
		});
	});
});