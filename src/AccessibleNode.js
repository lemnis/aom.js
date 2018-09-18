import DOMString from "./DOMString";
import boolean from "./boolean";
import double from "./double";
import long from "./long";
import EventTarget from './EventTarget';
import { AccessibleNodeListConstructor } from './../src/AccessibleNodeList.js';

// all attributes used within AOM
var attributes = [
	"role", "aria-activedescendant", "aria-atomic", "aria-autocomplete", "aria-busy", "aria-checked",
	"aria-colcount", "aria-colindex", "aria-colspan", "aria-controls", "aria-current", "aria-describedby",
	"aria-details", "aria-disabled", "aria-dropeffect", "aria-errormessage", "aria-expanded",
	"aria-flowto", "aria-grabbed", "aria-haspopup", "aria-hidden", "aria-invalid", "aria-keyshortcuts",
	"aria-label", "aria-labelledby", "aria-level", "aria-live", "aria-modal", "aria-multiline",
	"aria-multiselectable", "aria-orientation", "aria-owns", "aria-placeholder", "aria-posinset",
	"aria-pressed", "aria-readonly", "aria-relevant", "aria-required", "aria-roledescription",
	"aria-rowcount", "aria-rowindex", "aria-rowspan", "aria-selected", "aria-setsize", "aria-sort",
	"aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"
];

/**
 * 
 * @param {Mutation} mutations 
 */
function mutationObserverCallback(mutations) {
	var aom = this;

    mutations.forEach(function (mutation) {
		let attrName = mutation.attributeName;
		let newValue = aom._node.attributes[attrName] ? aom._node.attributes[attrName].value : undefined;
		let oldValue = aom._values[attrName];

		aom._defaultValues[attrName] = newValue;
		// store the default values set by an aria-* attribute
		if (newValue != oldValue) {
			aom._defaultValues[attrName] = newValue;
		}

		// overwrite the attribute if AOM has an different defined value
		if (oldValue && newValue != oldValue) {
			aom[attrName] = oldValue;
		}
    });
}

/**
 * Based on the AOM spec
 * @class
 */
class AccessibleNode extends EventTarget {
    constructor(node) {
        super(node);

        // store the node where the AccessibleNode is connected with
		Object.defineProperty(this, "_node", { value: node });

		// set an hidden object to store all values in
        Object.defineProperty(this, "_values", { value: {}});
		
		// store values of aria-* attributes
        Object.defineProperty(this, "_defaultValues", { value: {}});

		// start the mutation observer if the AccessibleNode is connected to an node
		if(node) {
			var observer = new MutationObserver(mutationObserverCallback.bind(this));
			observer.observe(this._node, { attributes: true, attributeOldValue: true });
		}
    }
}

Object.defineProperties(AccessibleNode.prototype,
    /** @lends AccessibleNode.prototype */
    {
		/** 
		* Defines a type it represents, e.g. `tab`
		* 
		* @see https://www.w3.org/TR/wai-aria-1.1/#roles
		* @type  {?String}
		*/
        "role": {
            enumerable: true,
            // writable: false,
            configurable: true,
            set(str) { return DOMString.set(this, "role", str); },
            get() { return DOMString.get(this, "role"); }
        },

		/** 
		 * Defines a human-readable, author-localized description for the role
		 * 
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-roledescription
		 * @type {?String}
		 */
        "roleDescription": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-roleDescription", str); },
            get() { return DOMString.get(this, "aria-roleDescription"); }
        },

        /* ******************* ACCESSIBLE LABEL AND DESCRIPTION ******************* */

		/** 
		* Defines a string value that labels the current element.
		* 
		* @see https://www.w3.org/TR/wai-aria-1.1/#aria-label
		* @type {?String} 
		*/
        "label": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-label", str); },
            get() { return DOMString.get(this, "aria-label"); }
        },

        /* *************** END OF ACCESSIBLE LABEL AND DESCRIPTION *************** */

        /* ********************* GLOBAL STATES AND PROPERTIES ********************* */

		/** 
		 * Indicates the element that represents the current item within a container or set of related elements.
		 * 
		 * | Value | Description |
		 * | --- | --- |
		 * | page | used to indicate a link within a set of pagination links, where the link is visually styled to represent the currently-displayed page.
		 * | step | used to indicate a link within a step indicator for a step-based process, where the link is visually styled to represent the current step.
		 * | location | used to indicate the image that is visually highlighted as the current component of a flow chart.
		 * | date | used to indicate the current date within a calendar.
		 * | time | used to indicate the current time within a timetable.
		 * | true | Represents the current item within a set.
		 * | false | Does not represent the current item within a set.
		 * 
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-current
		 * @type {?String}
		 */
        "current": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-current", str); },
            get() { return DOMString.get(this, "aria-current"); }
        },

        /* ***************** END OF GLOBAL STATES AND PROPERTIES ***************** */

        /* ************************** WIDGET PROPERTIES ************************** */

		/**
		 * Indicates whether inputting text could trigger display of one or more predictions of the user's
		 * intended value for an input and specifies how predictions would be presented if they are made.
		 * 
		 * The behavior during input is depends on the provided value, it follows beneath table.
		 * 
		 * | Value  | 	Description |
		 * | ------ | --- |
		 * | inline | Text suggesting may be dynamically inserted after the caret.
		 * | list   | A collection of values that could complete the provided input is displayed.
		 * | both   | Implements `inline` and `list`
		 * | none   | No prediction is shown
		 * 
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-autocomplete
		 * @type {?String}
		 */
        "autocomplete": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-autocomplete", str); },
            get() { return DOMString.get(this, "aria-autocomplete"); }
        },

		/**
		 * Returns/sets the visibility of the element who is exposed to an accessibility API.
		 * @see {@link AccessibleNode#disabled}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-hidden
		 * @type {?Boolean}
		 */
        "hidden": {
            enumerable: true,
            set(str) { return boolean.set(this, "aria-hidden", str); },
            get() { return boolean.get(this, "aria-hidden"); }
        },

		/**
		 * Indicates keyboard shortcuts that an author has implemented to activate or
		 * give focus to an element.
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-keyshortcuts
		 * @type {?String}
		 */
        "keyShortcuts": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-keyShortcuts", str); },
            get() { return DOMString.get(this, "aria-keyShortcuts"); }
        },

		/** 
		 * Indicates whether an element is modal when displayed.
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-modal
		 * @type {?Boolean}
		 */
        "modal": {
            enumerable: true,
            set(str) { return boolean.set(this, "aria-modal", str); },
            get() { return boolean.get(this, "aria-modal"); }
        },

		/** 
		 * Indicates whether a text box accepts multiple lines of input or only a single line.
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-multiline
		 * @type {?Boolean}
		 */
        "multiline": {
            enumerable: true,
            set(str) { return boolean.set(this, "aria-multiline", str); },
            get() { return boolean.get(this, "aria-multiline"); }
        },

		/**
		 * Indicates that the user may select more than one item from the current selectable descendants.
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable
		 * @type {?Boolean}
		 */
        "multiselectable": {
            enumerable: true,
            set(str) { return boolean.set(this, "aria-multiselectable", str); },
            get() { return boolean.get(this, "aria-multiselectable"); }
        },

		/**
		 * Indicates whether the element's orientation is `horizontal`, `vertical`, or `null`.
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-orientation
		 * @type {?String}
		 */
        "orientation": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-orientation", str); },
            get() { return DOMString.get(this, "aria-orientation"); }
        },

		/**
		 * Indicates that the user may select more than one item from the current selectable descendants.
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-readonly
		 * @type {?Boolean}
		 */
        "readOnly": {
            enumerable: true,
            set(str) { return boolean.set(this, "aria-readOnly", str); },
            get() { return boolean.get(this, "aria-readOnly"); }
        },

		/**
		 * Indicates that user input is required on the element before a form may be submitted.
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-required
		 * @type {?Boolean}
		 */
        "required": {
            enumerable: true,
            set(str) { return boolean.set(this, "aria-required", str); },
            get() { return boolean.get(this, "aria-required"); }
        },

		/**
		 * Indicates that user input is required on the element before a form may be submitted.
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-selected
		 * @type {?Boolean}
		 */
        "selected": {
            enumerable: true,
            set(str) { return boolean.set(this, "aria-selected", str); },
            get() { return boolean.get(this, "aria-selected"); }
        },

		/**
		 * Indicates if items in a table or grid are sorted in ascending or descending order.  
		 * Possible values are `acending`, `descending`, `none`, `other` or `null`.
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-sort
		 * @type {?Boolean}
		 */
        "sort": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-sort", str); },
            get() { return DOMString.get(this, "aria-sort"); }
        },

        /* *********************** END OF WIDGET PROPERTIES *********************** */


        /* ***************************** WIDGET STATES **************************** */

		/**
		 * Indicates the current "checked" state of a {@link Widget}, among {@link Radio} and {@link Checkbox}
		 * @see {@link AccessibleNode#pressed}
		 * @see {@link AccessibleNode#selected}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-pressed
		 * @type {?String}
		 */
        "checked": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-checked", str); },
            get() { return DOMString.get(this, "aria-checked"); }
        },

		/**
		 * Indicates whether the element, or another grouping element it controls, 
		 * is currently expanded or collapsed.
		 * 
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-expanded
		 * @type {?Boolean}
		 */
        "expanded": {
            enumerable: true,
            set(str) { return boolean.set(this, "aria-expanded", str); },
            get() { return boolean.get(this, "aria-expanded"); }
        },

		/**
		 * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
		 * 
		 * @see {@link AccessibleNode#hidden}
		 * @see {@link AccessibleNode#readonly}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-disabled
		 * @type {?Boolean}
		 */
        "disabled": {
            enumerable: true,
            set(str) { return boolean.set(this, "aria-disabled", str); },
            get() { return boolean.get(this, "aria-disabled"); }
        },

		/**
		 * Indicates the entered value does not conform to the format expected by the application.
		 * 
		 * @see {@link AccessibleNode#errorMessage}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage
		 * @type {?String} 
		 */
        "invalid": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-invalid", str); },
            get() { return DOMString.get(this, "aria-invalid"); }
        },


		/**
		 * Indicates the availability and type of interactive popup element, such as menu or dialog,
		 * that can be triggered by an element.
		 * 
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
		 * @type {?String}
		 */
        "hasPopUp": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-haspopup", str); },
            get() { return DOMString.get(this, "aria-haspopup"); }
        },

		/**
		 * Indicates the current "checked" state of a {@link Widget}, among {@link Radio} and {@link Checkbox}
		 * 
		 * @see {@link AccessibleNode#pressed}
		 * @see {@link AccessibleNode#selected}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-pressed
		 * @type {?String}
		 */
        "pressed": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-pressed", str); },
            get() { return DOMString.get(this, "aria-pressed"); }
        },

        /* ************************* END OF WIDGET STATES ************************* */


        /* **************************** CONTROL VALUES **************************** */

		/** 
		 * Returns / sets the human readable text alternative of {@link #aria-valuenow} for a {@link Range} widget.
		 * 
		 * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext}
		 * @type {?String}
		 */
        "valueText": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-valueText", str); },
            get() { return DOMString.get(this, "aria-valueText"); }
        },

		/**
		 * Returns / sets a short hint intended to aid the user with data entry when the control has no value.
		 * A hint could be a sample value or a brief description of the expected format.
		 * 
		 * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-placeholder}
		 * @type {?String}
		 */
        "placeholder": {
            enumerable: true,
            set(str) { return DOMString.set(this, "aria-placeholder", str); },
            get() { return DOMString.get(this, "aria-placeholder"); }
        },

		/** 
		 * Returns / sets the current value for a {@link Range} widget.
		 * 
		 * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow}
		 * @type {?Number}
		 */
        "valueNow": {
            enumerable: true,
            set(val) { return double.set(this, "aria-valuenow", val); },
            get() { return double.get(this, "aria-valuenow"); }
        },

		/** 
		 * Returns / sets the minimum allowed value for a {@link Range} widget.
		 * 
		 * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-valuemin}
		 * @type {?Number}
		 */
        "valueMin": {
            enumerable: true,
            set(val) { return double.set(this, "aria-valuemin", val); },
            get() { return double.get(this, "aria-valuemin"); }
        },

		/** 
		 * Returns / sets the maximum allowed value for a {@link Range} widget.
		 * 
		 * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-valuemax}
		 * @type {?Number}
		 */
        "valueMax": {
            enumerable: true,
            set(val) { return double.set(this, "aria-valuemax", val); },
            get() { return double.get(this, "aria-valuemax"); }
        },

        /* ************************ END OF CONTROL VALUES ************************ */

        // Live regions.
        "atomic": {
            enumerable: true,
            set(val) { return boolean.set(this, "aria-atomic", val); },
            get() { return boolean.get(this, "aria-atomic"); }
        },
        "busy": {
            enumerable: true,
            set(val) { return boolean.set(this, "aria-busy", val); },
            get() { return boolean.get(this, "aria-busy"); }
        },
        "live": {
            enumerable: true,
            set(val) { return DOMString.set(this, "aria-live", val); },
            get() { return DOMString.get(this, "aria-live"); }
        },
        "relevant": {
            enumerable: true,
            set(val) { return DOMString.set(this, "aria-relevant", val); },
            get() { return DOMString.get(this, "aria-relevant"); }
        },

        /* ************************* OTHER RELATIONSHIPS ************************* */

		/**
		 * Returns / sets the AccessibleNode of the currently active element when focus is on current element.
		 * 
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-activedescendant
		 * @type {?AcccessibleNode}
		 */
        "activeDescendant": {
            enumerable: true,
            set(val) { return setAccessibleNode(this, "aria-activedescendant", val); },
            get() { return getAccessibleNode(this, "aria-activedescendant"); }
        },

		/**
		 * Returns / sets an AccessibleNode that provides a detailed, extended description 
		 * for the current element.
		 * 
		 * @see {@link AccessibleNode#describedBy}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-details
		 * @type {?AcccessibleNode}
		 */
        "details": {
            enumerable: true,
            set(val) { return setAccessibleNode(this, "aria-details", val); },
            get() { return getAccessibleNode(this, "aria-details"); }
        },

		/**
		 * Returns / sets an AccessibleNode that provides an error message for the current element.
		 * 
		 * @see {@link AccessibleNode#invalid}
		 * @see {@link AccessibleNode#describedBy}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage
		 * @type {?AcccessibleNode}
		 */
        "errorMessage": {
            enumerable: true,
            set(val) { return setAccessibleNode(this, "aria-errormessage", val); },
            get() { return getAccessibleNode(this, "aria-errormessage"); }
        },

        /* ********************** END OF OTHER RELATIONSHIPS ********************** */

        /* ***************************** COLLECTIONS ***************************** */

		/**
		 * Returns / sets the total number of columns in a {@link Table}, {@link Grid}, or {@link Treegrid}.
		 * 
		 * @see {@link AccessibleNode#colIndex}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-setsize
		 * @type {?Integer}
		 */
        "colCount": {
            enumerable: true,
            set(val) { return long.set(this, "aria-colcount", val); },
            get() { return long.get(this, "aria-colcount"); }
        },

		/**
		 * Defines an element's column index or position with respect to the total number of columns 
		 * within a {@link Table}, {@link Grid}, or {@link Treegrid}.
		 * 
		 * @see {@link AccessibleNode#colCount}
		 * @see {@link AccessibleNode#colSpan}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-colindex
		 * @type {?Integer}
		 */
        "colIndex": {
            enumerable: true,
            set(val) { return long.set(this, "aria-colindex", val); },
            get() { return long.get(this, "aria-colindex"); }
        },

		/**
		 * Defines the number of columns spanned by a cell or gridcell
		 * within a {@link Table}, {@link Grid}, or {@link Treegrid}.
		 * 
		 * @see {@link AccessibleNode#colIndex}
		 * @see {@link AccessibleNode#rowSpan}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-colspan
		 * @type {?Integer}
		 */
        "colSpan": {
            enumerable: true,
            set(val) { return long.set(this, "aria-colspan", val); },
            get() { return long.get(this, "aria-colspan"); }
        },

		/**
		 * Defines an element's number or position in the current set of {@link listitem}s or {@link treeitem}s.
		 * Not required if all elements in the set are present in the DOM.
		 * 
		 * @see {@link AccessibleNode#setSize}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-posinset
		 * @type {?Integer}
		 */
        "posInSet": {
            enumerable: true,
            set(val) { return long.set(this, "aria-posinset", val); },
            get() { return long.get(this, "aria-posinset"); }
        },

		/**
		 * Defines the total number of rows in a {@link Table}, {@link Grid}, or {@link Treegrid}.
		 * 
		 * @see {@link AccessibleNode#rowIndex}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount
		 * @type {?Integer}
		 */
        "rowCount": {
            enumerable: true,
            set(val) { return long.set(this, "aria-rowcount", val); },
            get() { return long.get(this, "aria-rowcount"); }
        },

		/**
		 * Defines an element's row index or position with respect to the total number of rows 
		 * within a  {@link Table}, {@link Grid}, or {@link Treegrid}.
		 * 
		 * @see {@link AccessibleNode#rowCount}
		 * @see {@link AccessibleNode#rowSpan}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex
		 * @type {?Integer}
		 */
        "rowIndex": {
            enumerable: true,
            set(val) { return long.set(this, "aria-rowindex", val); },
            get() { return long.get(this, "aria-rowindex"); }
        },

		/**
		 * Defines the number of rows spanned by a cell or gridcell
		 * within a {@link Table}, {@link Grid}, or {@link Treegrid}.
		 * 
		 * @see {@link AccessibleNode#rowIndex}
		 * @see {@link AccessibleNode#colSpan}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan
		 * @type {?Integer}
		 */
        "rowSpan": {
            enumerable: true,
            set(val) { return long.set(this, "aria-rowspan", val); },
            get() { return long.get(this, "aria-rowspan"); }
        },

		/**
		 * Defines the number of items in the current set of listitems or treeitems.
		 * Not required if **all** elements in the set are present in the DOM.
		 * @see {@link AccessibleNode#posInSet}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-setsize
		 * @type {?Integer}
		 */
        "setSize": {
            enumerable: true,
            set(val) { return long.set(this, "aria-setsize", val); },
            get() { return long.get(this, "aria-setsize"); }
        },

		/**
		 * Defines the hierarchical level of an element within a structure.
		 * E.g. `&lt;h1&gt;&lt;h1/&gt;` equals `&lt;div role="heading" aria-level="1"&gt;&lt;/div>`
		 * 
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-level
		 * @type {?Integer}
		 */
        "level": {
            enumerable: true,
            set(val) { return long.set(this, "aria-level", val); },
            get() { return long.get(this, "aria-level"); }
        },

		/* ************************** END OF COLLECTIONS ************************** */

		/* ****************** ACCESSIBLE LABEL AND DESCRIPTION ****************** */

		/**
		 * Returns an list with AccessibleNode instances that labels the current element
		 * 
		 * @see {@link AccessibleNode#describedBy}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby
		 * @type {AccessibleNodeList}
		 */
		"labeledBy": {
			enumerable: true,
			set(val) {
				if (!(val instanceof AccessibleNodeListConstructor)) {
					throw new Error("It must be an instance of AccessibleNodeList");
				}

				this._values.labeledBy = val;
				val.parentAOM = this;
				val.attribute = "aria-labelledby";
			},
			get() { return this._values.labeledBy || null; }
		},

		/**
		 * Returns an list with AccessibleNode instances that describes the current element
		 * 
		 * @see {@link AccessibleNode#labeledBy}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-describedby
		 * @type {AccessibleNodeList}
		 */
		"describedBy": {
			enumerable: true,
			set(val) {
				if (!(val instanceof AccessibleNodeListConstructor)) {
					throw new Error("It must be an instance of AccessibleNodeList");
				}

				this._values.describedBy = val;
				val.parentAOM = this;
				val.attribute = "aria-describedby";
			},
			get() { return this._values.describedBy || null; }
		},

		/* ************** END OF ACCESSIBLE LABEL AND DESCRIPTION ************** */
		
		/* ************************ OTHER RELATIONSHIPS ************************ */

		/**
		 * Returns an list with AccessibleNode instances whose contents or presence are controlled by
		 * the current element.
		 * 
		 * @see {@link AccessibleNode#owns}
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-controls
		 * @type {AccessibleNodeList}
		 */
		"controls": {
			enumerable: true,
			set(val) {
				if (!(val instanceof AccessibleNodeListConstructor)) {
					throw new Error("It must be an instance of AccessibleNodeList");
				}

				this._values.controls = val;
				val.parentAOM = this;
				val.attribute = "aria-controls";
			},
			get() { return this._values.controls || null; }
		},

		/**
		 * Contains the next element(s) in an alternate reading order of content which, at the user's 
		 * discretion, allows assistive technology to override the general default of reading in
		 * document source order.
		 * 
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-flowto
		 * @type {AccessibleNodeList}
		 */
		"flowTo": {
			enumerable: true,
			set(val) {
				if (!(val instanceof AccessibleNodeListConstructor)) {
					throw new Error("It must be an instance of AccessibleNodeList");
				}

				this._values.flowTo = val;
				val.parentAOM = this;
				val.attribute = "aria-flowto";
			},
			get() { return this._values.flowTo || null; }
		},

		/**
		 * Contains children who's ID are referenced inside the `aria-owns` attribute
		 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-owns
		 * @type {AccessibleNodeList}
		 */
		"owns": {
			enumerable: true,
			set(val) {
				if (!(val instanceof AccessibleNodeListConstructor)) {
					throw new Error("It must be an instance of AccessibleNodeList");
				}
				this._values.owns = val;
				val.parentAOM = this;
				val.attribute = "aria-owns";
			},
			get() { return this._values.owns || null; }
		},

        /* ********************* END OF OTHER RELATIONSHIPS ********************* */
    }
);

function setAccessibleNode(aom, attribute, value) {
	if (value == undefined) {
		// remove ID of connected element if generated
		if(aom._values[attribute] && aom._values[attribute].generated_id){
			aom._values[attribute]._node.removeAttribute("id");
			aom._values[attribute].generated_id = false;
		}

		aom._values[attribute] = value;
		return aom._node.removeAttribute(attribute);;
	} else if (!(value instanceof AccessibleNode)) {
		throw new TypeError(`Failed to set the '#{attribute}' property on 'AccessibleNode': The provided value is not of type 'AccessibleNode'`);
	}

    if (value._node) {
		if (!value._node.id) {
			/** @todo remove temp id */
			value._node.id = "id-" + parseInt(Math.random() * 1000000);
			value.generated_id = true;
			console.log(value, value.generated_id);
		}

		aom._node.setAttribute(attribute, value._node.id);
	}

	aom._values[attribute] = value;
	return value;
}
function getAccessibleNode(aom, attribute) {
	var value = aom._values[attribute];
	if (value == undefined) {
		var attr = aom._node.getAttribute(attribute);
		if(attr == undefined) return null;
		return elements.get(document.getElementById(attr));
	}
	return value;
}

export default AccessibleNode;