## Current goals

* Implementing phase 1 &rarr; basic implementation of the AccessibleNode constructor

## Future work

* Finish implementation of phase 2
* Implement 3 & 4
* Update the idrefs when an id is changed

## General behavior and recommendations

* ARIA does not reflect to AOM

```html
<div id="clickBtn" role="button">Click here</div>
```

```js
console.log(clickBtn.accessibleNode.role);   // null, not "button"
```

* Don't target aria-* attributes with css, this will not work on browsers with native support

**Don't do:**
```css
[aria-hidden="true"] { display: none; }
```

## Differences between native AOM implementation

* AOM.js does reflect to ARIA

```html
clickBtn.accessibleNode.role = "link";
```

```js
console.log(clickBtn.getAttribute("role"));  // Returns "link"
```

* Relationships between nodes must be in the same tree scope

## Uses

* Proxy
* Import / export
* Classes (with extends)
