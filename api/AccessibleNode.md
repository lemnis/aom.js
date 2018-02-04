## Classes

<dl>
<dt><a href="#AccessibleNode">AccessibleNode</a></dt>
<dd><p>Based on the AOM spec</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#mutationObserverCallback">mutationObserverCallback(mutations)</a></dt>
<dd></dd>
</dl>

<a name="AccessibleNode"></a>

## AccessibleNode
Based on the AOM spec

**Kind**: global class  

* [AccessibleNode](#AccessibleNode)
    * [.role](#AccessibleNode+role) : <code>String</code>
    * [.roleDescription](#AccessibleNode+roleDescription) : <code>String</code>
    * [.label](#AccessibleNode+label) : <code>String</code>
    * [.current](#AccessibleNode+current) : <code>String</code>
    * [.autocomplete](#AccessibleNode+autocomplete) : <code>String</code>
    * [.hidden](#AccessibleNode+hidden) : <code>Boolean</code>
    * [.keyShortcuts](#AccessibleNode+keyShortcuts) : <code>String</code>
    * [.modal](#AccessibleNode+modal) : <code>Boolean</code>
    * [.multiline](#AccessibleNode+multiline) : <code>Boolean</code>
    * [.multiselectable](#AccessibleNode+multiselectable) : <code>Boolean</code>
    * [.orientation](#AccessibleNode+orientation) : <code>String</code>
    * [.readOnly](#AccessibleNode+readOnly) : <code>Boolean</code>
    * [.required](#AccessibleNode+required) : <code>Boolean</code>
    * [.selected](#AccessibleNode+selected) : <code>Boolean</code>
    * [.sort](#AccessibleNode+sort) : <code>Boolean</code>
    * [.checked](#AccessibleNode+checked) : <code>String</code>
    * [.expanded](#AccessibleNode+expanded) : <code>Boolean</code>
    * [.disabled](#AccessibleNode+disabled) : <code>Boolean</code>
    * [.invalid](#AccessibleNode+invalid) : <code>String</code>
    * [.hasPopUp](#AccessibleNode+hasPopUp) : <code>String</code>
    * [.pressed](#AccessibleNode+pressed) : <code>String</code>
    * [.valueText](#AccessibleNode+valueText) : <code>String</code>
    * [.placeholder](#AccessibleNode+placeholder) : <code>String</code>
    * [.valueNow](#AccessibleNode+valueNow) : <code>Number</code>
    * [.valueMin](#AccessibleNode+valueMin) : <code>Number</code>
    * [.valueMax](#AccessibleNode+valueMax) : <code>Number</code>
    * [.activeDescendant](#AccessibleNode+activeDescendant) : <code>AcccessibleNode</code>
    * [.details](#AccessibleNode+details) : <code>AcccessibleNode</code>
    * [.errorMessage](#AccessibleNode+errorMessage) : <code>AcccessibleNode</code>
    * [.colCount](#AccessibleNode+colCount) : <code>Integer</code>
    * [.colIndex](#AccessibleNode+colIndex) : <code>Integer</code>
    * [.colSpan](#AccessibleNode+colSpan) : <code>Integer</code>
    * [.posInSet](#AccessibleNode+posInSet) : <code>Integer</code>
    * [.rowCount](#AccessibleNode+rowCount) : <code>Integer</code>
    * [.rowIndex](#AccessibleNode+rowIndex) : <code>Integer</code>
    * [.rowSpan](#AccessibleNode+rowSpan) : <code>Integer</code>
    * [.setSize](#AccessibleNode+setSize) : <code>Integer</code>
    * [.level](#AccessibleNode+level) : <code>Integer</code>
    * [.labeledBy](#AccessibleNode+labeledBy) : <code>AccessibleNodeList</code>
    * [.describedBy](#AccessibleNode+describedBy) : <code>AccessibleNodeList</code>
    * [.controls](#AccessibleNode+controls) : <code>AccessibleNodeList</code>
    * [.flowTo](#AccessibleNode+flowTo) : <code>AccessibleNodeList</code>
    * [.owns](#AccessibleNode+owns) : <code>AccessibleNodeList</code>

<a name="AccessibleNode+role"></a>

### accessibleNode.role : <code>String</code>
Defines a type it represents, e.g. `tab`

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#roles  
<a name="AccessibleNode+roleDescription"></a>

### accessibleNode.roleDescription : <code>String</code>
Defines a human-readable, author-localized description for the role

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-roledescription  
<a name="AccessibleNode+label"></a>

### accessibleNode.label : <code>String</code>
Defines a string value that labels the current element.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-label  
<a name="AccessibleNode+current"></a>

### accessibleNode.current : <code>String</code>
Indicates the element that represents the current item within a container or set of related elements.| Value | Description || --- | --- || page | used to indicate a link within a set of pagination links, where the link is visually styled to represent the currently-displayed page.| step | used to indicate a link within a step indicator for a step-based process, where the link is visually styled to represent the current step.| location | used to indicate the image that is visually highlighted as the current component of a flow chart.| date | used to indicate the current date within a calendar.| time | used to indicate the current time within a timetable.| true | Represents the current item within a set.| false | Does not represent the current item within a set.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-current  
<a name="AccessibleNode+autocomplete"></a>

### accessibleNode.autocomplete : <code>String</code>
Indicates whether inputting text could trigger display of one or more predictions of the user'sintended value for an input and specifies how predictions would be presented if they are made.The behavior during input is depends on the provided value, it follows beneath table.| Value  | 	Description || ------ | --- || inline | Text suggesting may be dynamically inserted after the caret.| list   | A collection of values that could complete the provided input is displayed.| both   | Implements `inline` and `list`| none   | No prediction is shown

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-autocomplete  
<a name="AccessibleNode+hidden"></a>

### accessibleNode.hidden : <code>Boolean</code>
Returns/sets the visibility of the element who is exposed to an accessibility API.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [disabled](#AccessibleNode+disabled)
- https://www.w3.org/TR/wai-aria-1.1/#aria-hidden

<a name="AccessibleNode+keyShortcuts"></a>

### accessibleNode.keyShortcuts : <code>String</code>
Indicates keyboard shortcuts that an author has implemented to activate orgive focus to an element.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-keyshortcuts  
<a name="AccessibleNode+modal"></a>

### accessibleNode.modal : <code>Boolean</code>
Indicates whether an element is modal when displayed.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-modal  
<a name="AccessibleNode+multiline"></a>

### accessibleNode.multiline : <code>Boolean</code>
Indicates whether a text box accepts multiple lines of input or only a single line.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-multiline  
<a name="AccessibleNode+multiselectable"></a>

### accessibleNode.multiselectable : <code>Boolean</code>
Indicates that the user may select more than one item from the current selectable descendants.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable  
<a name="AccessibleNode+orientation"></a>

### accessibleNode.orientation : <code>String</code>
Indicates whether the element's orientation is `horizontal`, `vertical`, or `null`.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-orientation  
<a name="AccessibleNode+readOnly"></a>

### accessibleNode.readOnly : <code>Boolean</code>
Indicates that the user may select more than one item from the current selectable descendants.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-readonly  
<a name="AccessibleNode+required"></a>

### accessibleNode.required : <code>Boolean</code>
Indicates that user input is required on the element before a form may be submitted.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-required  
<a name="AccessibleNode+selected"></a>

### accessibleNode.selected : <code>Boolean</code>
Indicates that user input is required on the element before a form may be submitted.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-selected  
<a name="AccessibleNode+sort"></a>

### accessibleNode.sort : <code>Boolean</code>
Indicates if items in a table or grid are sorted in ascending or descending order.  Possible values are `acending`, `descending`, `none`, `other` or `null`.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-sort  
<a name="AccessibleNode+checked"></a>

### accessibleNode.checked : <code>String</code>
Indicates the current "checked" state of a [Widget](Widget), among [Radio](Radio) and [Checkbox](Checkbox)

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [pressed](#AccessibleNode+pressed)
- [selected](#AccessibleNode+selected)
- https://www.w3.org/TR/wai-aria-1.1/#aria-pressed

<a name="AccessibleNode+expanded"></a>

### accessibleNode.expanded : <code>Boolean</code>
Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-expanded  
<a name="AccessibleNode+disabled"></a>

### accessibleNode.disabled : <code>Boolean</code>
Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [hidden](#AccessibleNode+hidden)
- [AccessibleNode#readonly](AccessibleNode#readonly)
- https://www.w3.org/TR/wai-aria-1.1/#aria-disabled

<a name="AccessibleNode+invalid"></a>

### accessibleNode.invalid : <code>String</code>
Indicates the entered value does not conform to the format expected by the application.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [errorMessage](#AccessibleNode+errorMessage)
- https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage

<a name="AccessibleNode+hasPopUp"></a>

### accessibleNode.hasPopUp : <code>String</code>
Indicates the availability and type of interactive popup element, such as menu or dialog,that can be triggered by an element.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup  
<a name="AccessibleNode+pressed"></a>

### accessibleNode.pressed : <code>String</code>
Indicates the current "checked" state of a [Widget](Widget), among [Radio](Radio) and [Checkbox](Checkbox)

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [pressed](#AccessibleNode+pressed)
- [selected](#AccessibleNode+selected)
- https://www.w3.org/TR/wai-aria-1.1/#aria-pressed

<a name="AccessibleNode+valueText"></a>

### accessibleNode.valueText : <code>String</code>
Returns / sets the human readable text alternative of [#aria-valuenow](#aria-valuenow) for a [Range](Range) widget.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: [https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext](https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext)  
<a name="AccessibleNode+placeholder"></a>

### accessibleNode.placeholder : <code>String</code>
Returns / sets a short hint intended to aid the user with data entry when the control has no value.A hint could be a sample value or a brief description of the expected format.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: [https://www.w3.org/TR/wai-aria-1.1/#aria-placeholder](https://www.w3.org/TR/wai-aria-1.1/#aria-placeholder)  
<a name="AccessibleNode+valueNow"></a>

### accessibleNode.valueNow : <code>Number</code>
Returns / sets the current value for a [Range](Range) widget.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: [https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow](https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow)  
<a name="AccessibleNode+valueMin"></a>

### accessibleNode.valueMin : <code>Number</code>
Returns / sets the minimum allowed value for a [Range](Range) widget.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: [https://www.w3.org/TR/wai-aria-1.1/#aria-valuemin](https://www.w3.org/TR/wai-aria-1.1/#aria-valuemin)  
<a name="AccessibleNode+valueMax"></a>

### accessibleNode.valueMax : <code>Number</code>
Returns / sets the maximum allowed value for a [Range](Range) widget.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: [https://www.w3.org/TR/wai-aria-1.1/#aria-valuemax](https://www.w3.org/TR/wai-aria-1.1/#aria-valuemax)  
<a name="AccessibleNode+activeDescendant"></a>

### accessibleNode.activeDescendant : <code>AcccessibleNode</code>
Returns / sets the AccessibleNode of the currently active element when focus is on current element.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-activedescendant  
<a name="AccessibleNode+details"></a>

### accessibleNode.details : <code>AcccessibleNode</code>
Returns / sets an AccessibleNode that provides a detailed, extended description for the current element.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [describedBy](#AccessibleNode+describedBy)
- https://www.w3.org/TR/wai-aria-1.1/#aria-details

<a name="AccessibleNode+errorMessage"></a>

### accessibleNode.errorMessage : <code>AcccessibleNode</code>
Returns / sets an AccessibleNode that provides an error message for the current element.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [invalid](#AccessibleNode+invalid)
- [describedBy](#AccessibleNode+describedBy)
- https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage

<a name="AccessibleNode+colCount"></a>

### accessibleNode.colCount : <code>Integer</code>
Returns / sets the total number of columns in a [Table](Table), [Grid](Grid), or [Treegrid](Treegrid).

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [colIndex](#AccessibleNode+colIndex)
- https://www.w3.org/TR/wai-aria-1.1/#aria-setsize

<a name="AccessibleNode+colIndex"></a>

### accessibleNode.colIndex : <code>Integer</code>
Defines an element's column index or position with respect to the total number of columns within a [Table](Table), [Grid](Grid), or [Treegrid](Treegrid).

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [colCount](#AccessibleNode+colCount)
- [colSpan](#AccessibleNode+colSpan)
- https://www.w3.org/TR/wai-aria-1.1/#aria-colindex

<a name="AccessibleNode+colSpan"></a>

### accessibleNode.colSpan : <code>Integer</code>
Defines the number of columns spanned by a cell or gridcellwithin a [Table](Table), [Grid](Grid), or [Treegrid](Treegrid).

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [colIndex](#AccessibleNode+colIndex)
- [rowSpan](#AccessibleNode+rowSpan)
- https://www.w3.org/TR/wai-aria-1.1/#aria-colspan

<a name="AccessibleNode+posInSet"></a>

### accessibleNode.posInSet : <code>Integer</code>
Defines an element's number or position in the current set of [listitem](listitem)s or [treeitem](treeitem)s.Not required if all elements in the set are present in the DOM.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [setSize](#AccessibleNode+setSize)
- https://www.w3.org/TR/wai-aria-1.1/#aria-posinset

<a name="AccessibleNode+rowCount"></a>

### accessibleNode.rowCount : <code>Integer</code>
Defines the total number of rows in a [Table](Table), [Grid](Grid), or [Treegrid](Treegrid).

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [rowIndex](#AccessibleNode+rowIndex)
- https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount

<a name="AccessibleNode+rowIndex"></a>

### accessibleNode.rowIndex : <code>Integer</code>
Defines an element's row index or position with respect to the total number of rows within a  [Table](Table), [Grid](Grid), or [Treegrid](Treegrid).

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [rowCount](#AccessibleNode+rowCount)
- [rowSpan](#AccessibleNode+rowSpan)
- https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex

<a name="AccessibleNode+rowSpan"></a>

### accessibleNode.rowSpan : <code>Integer</code>
Defines the number of rows spanned by a cell or gridcellwithin a [Table](Table), [Grid](Grid), or [Treegrid](Treegrid).

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [rowIndex](#AccessibleNode+rowIndex)
- [colSpan](#AccessibleNode+colSpan)
- https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan

<a name="AccessibleNode+setSize"></a>

### accessibleNode.setSize : <code>Integer</code>
Defines the number of items in the current set of listitems or treeitems.Not required if **all** elements in the set are present in the DOM.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [posInSet](#AccessibleNode+posInSet)
- https://www.w3.org/TR/wai-aria-1.1/#aria-setsize

<a name="AccessibleNode+level"></a>

### accessibleNode.level : <code>Integer</code>
Defines the hierarchical level of an element within a structure.E.g. `&lt;h1&gt;&lt;h1/&gt;` equals `&lt;div role="heading" aria-level="1"&gt;&lt;/div>`

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-level  
<a name="AccessibleNode+labeledBy"></a>

### accessibleNode.labeledBy : <code>AccessibleNodeList</code>
Returns an list with AccessibleNode instances that labels the current element

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [describedBy](#AccessibleNode+describedBy)
- https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby

<a name="AccessibleNode+describedBy"></a>

### accessibleNode.describedBy : <code>AccessibleNodeList</code>
Returns an list with AccessibleNode instances that describes the current element

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [labeledBy](#AccessibleNode+labeledBy)
- https://www.w3.org/TR/wai-aria-1.1/#aria-describedby

<a name="AccessibleNode+controls"></a>

### accessibleNode.controls : <code>AccessibleNodeList</code>
Returns an list with AccessibleNode instances whose contents or presence are controlled bythe current element.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**

- [owns](#AccessibleNode+owns)
- https://www.w3.org/TR/wai-aria-1.1/#aria-controls

<a name="AccessibleNode+flowTo"></a>

### accessibleNode.flowTo : <code>AccessibleNodeList</code>
Contains the next element(s) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading indocument source order.

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-flowto  
<a name="AccessibleNode+owns"></a>

### accessibleNode.owns : <code>AccessibleNodeList</code>
Contains children who's ID are referenced inside the `aria-owns` attribute

**Kind**: instance property of <code>[AccessibleNode](#AccessibleNode)</code>  
**See**: https://www.w3.org/TR/wai-aria-1.1/#aria-owns  
<a name="mutationObserverCallback"></a>

## mutationObserverCallback(mutations)
**Kind**: global function  

| Param | Type |
| --- | --- |
| mutations | <code>Mutation</code> | 

