/* eslint-env mocha */

var assert = require('assert');

describe('AccessibleNodeList', function () {

    it('constructor exist in window object', function () {
        assert.ok(window.AccessibleNodeList.prototype && window.AccessibleNodeList.prototype.constructor.name);
    });

    describe('[Number]', function () {
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