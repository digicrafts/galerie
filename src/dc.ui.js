
var dc;
(function (dc) {
    (function (core) {
        

        /**
        *
        */
        var TransformHelper = (function () {
            function TransformHelper() {
            }
            /**
            *
            */
            TransformHelper.setup = function () {
                TransformHelper.mDiv = document.createElement('div');

                //
                var eventNames = {
                    'transition': 'transitionEnd',
                    'MozTransition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'WebkitTransition': 'webkitTransitionEnd',
                    'msTransition': 'MSTransitionEnd'
                };

                // Check for the browser's transitions support.
                TransformHelper.transition = TransformHelper._getVendorPropertyName('transition');
                TransformHelper.transitionDelay = TransformHelper._getVendorPropertyName('transitionDelay');
                TransformHelper.transform = TransformHelper._getVendorPropertyName('transform');
                TransformHelper.transformOrigin = TransformHelper._getVendorPropertyName('transformOrigin');
                TransformHelper.transform3d = TransformHelper._checkTransform3dSupport();

                // Detect the 'transitionend' event needed.
                if (dc.browser.webkit)
                    TransformHelper.transitionEnd = "webkitTransitionEnd";
                else if (dc.browser.firefox)
                    TransformHelper.transitionEnd = "transitionend";
                else if (dc.browser.opera)
                    TransformHelper.transitionEnd = "oTransitionEnd";
                else
                    TransformHelper.transitionEnd = eventNames[TransformHelper.transition] || null;

                TransformHelper.mDiv = null;
            };

            //  Private Methods
            //  --------------------------------------------------------------------------------------------
            /**
            *
            * @param prop
            * @returns {*}
            * @private
            */
            TransformHelper._getVendorPropertyName = function (prop) {
                // Handle unprefixed versions (FF16+, for example)
                if (prop in TransformHelper.mDiv.style)
                    return prop;

                var prefixes = ['moz', 'webkit', 'o', 'ms'];
                var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

                if (prop in TransformHelper.mDiv.style) {
                    return prop;
                }

                for (var i = 0; i < prefixes.length; ++i) {
                    var vendorProp = prefixes[i] + prop_;
                    if (vendorProp in TransformHelper.mDiv.style) {
                        return vendorProp;
                    }
                }

                return null;
            };

            /**
            * Helper function to check if transform3D is supported.
            * Should return true for Webkits and Firefox 10+.
            * @returns {boolean}
            * @private
            */
            TransformHelper._checkTransform3dSupport = function () {
                TransformHelper.mDiv.style[TransformHelper.transform] = '';
                TransformHelper.mDiv.style[TransformHelper.transform] = 'rotateY(90deg)';
                return TransformHelper.mDiv.style[TransformHelper.transform] !== '';
            };
            return TransformHelper;
        })();
        core.TransformHelper = TransformHelper;

        /**
        *
        */
        var Transform = (function () {
            //  Constructor
            //  --------------------------------------------------------------------------------------------
            function Transform() {
                this.mX = 0;
                this.mY = 0;
                this.mTX = 0;
                this.mTY = 0;
                this.mPivotX = 0;
                this.mPivotY = 0;
                this.mScale = 1;
                this.mSkewX = 0;
                this.mSkewY = 0;
                this.mRotation = 0;
                this.mNeedValidate = true;
                //  Public Methods
                //  --------------------------------------------------------------------------------------------
                /**
                * Set to using css transform
                */
                this.useTransform = false;
                this.mProperties = {};
            }
            Object.defineProperty(Transform.prototype, "x", {
                //  Getter/Setter
                //  --------------------------------------------------------------------------------------------
                get: function () {
                    return this.mX;
                },
                set: function (value) {
                    this.mX = value;
                    this.mTX = this.mX - this.mPivotX;
                    this.mNeedValidate = true;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Transform.prototype, "y", {
                get: function () {
                    return this.mY;
                },
                set: function (value) {
                    this.mY = value;
                    this.mTY = this.mY - this.mPivotY;
                    this.mNeedValidate = true;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Transform.prototype, "pivotX", {
                get: function () {
                    return this.mPivotX;
                },
                set: function (value) {
                    this.mPivotX = value;
                    this.mTX = this.mX - this.mPivotX;
                    this.mNeedValidate = true;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Transform.prototype, "pivotY", {
                get: function () {
                    return this.mPivotY;
                },
                set: function (value) {
                    this.mPivotY = value;
                    this.mTY = this.mY - this.mPivotY;
                    this.mNeedValidate = true;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Transform.prototype, "rotation", {
                get: function () {
                    return this.mRotation;
                },
                set: function (value) {
                    this.mRotation = value;
                    this.mNeedValidate = true;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Transform.prototype, "scale", {
                get: function () {
                    return this.mScale;
                },
                set: function (value) {
                    this.mScale = value;
                    this.mNeedValidate = true;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Transform.prototype, "skewX", {
                get: function () {
                    return this.mSkewX;
                },
                set: function (value) {
                    this.mSkewX = value;
                    this.mNeedValidate = true;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Transform.prototype, "skewY", {
                get: function () {
                    return this.mSkewY;
                },
                set: function (value) {
                    this.mSkewY = value;
                    this.mNeedValidate = true;
                },
                enumerable: true,
                configurable: true
            });

            //  Public Methods
            //  --------------------------------------------------------------------------------------------
            /**
            *
            * @param transform
            */
            Transform.prototype.copy = function (transform) {
                if (transform) {
                    this.mX = transform.x;
                    this.mY = transform.y;
                    this.mScale = transform.scale;
                    this.mSkewX = transform.skewX;
                    this.mSkewY = transform.skewY;
                    this.mRotation = transform.rotation;
                    this.pivotX = transform.pivotX;
                    this.pivotY = transform.pivotY;
                }
            };

            /**
            *
            * @param element
            */
            Transform.prototype.apply = function (element) {
                // Fix bug the css transtion not validated
                element.offsetHeight;

                this._updateTransform();

                for (var p in this.mProperties)
                    element.style[p] = this.mProperties[p];
            };

            /**
            *
            * @param element
            */
            Transform.prototype.remove = function (element) {
                this.mProperties[TransformHelper.transform] = "";
            };

            //  Private Methods
            //  --------------------------------------------------------------------------------------------
            /**
            *
            * @param user3d
            * @private
            */
            Transform.prototype._updateTransform = function (user3d) {
                if (typeof user3d === "undefined") { user3d = null; }
                if (this.useTransform) {
                    // Set transformOrigin style
                    this.mProperties[TransformHelper.transformOrigin] = this.pivotX + 'px ' + this.pivotY + 'px';

                    // Build the Transform CSS
                    var transformString;
                    if (TransformHelper.transform3d)
                        transformString = 'translate3d(' + this.mTX + 'px,' + this.mTY + 'px,0) scale3d(' + this.mScale + ',' + this.mScale + ',1) rotateZ(' + this.rotation + 'deg)';
                    else
                        transformString = 'translate(' + this.mTX + 'px,' + this.mTY + 'px) scale(' + this.mScale + ') rotate(' + this.rotation + 'deg)';

                    // Set Skew style
                    if (this.mSkewX | this.mSkewY)
                        transformString = transformString + 'skew(' + this.mSkewX + 'deg,' + this.mSkewY + 'deg)';

                    // Set the transform style
                    this.mProperties[TransformHelper.transform] = transformString;
                } else {
                    // Create a new properties if use transform before
                    if (this.mProperties[TransformHelper.transformOrigin])
                        this.mProperties = {};

                    // Set position css
                    this.mProperties['left'] = this.mTX + 'px';
                    this.mProperties['top'] = this.mTY + 'px';
                }
            };
            return Transform;
        })();
        core.Transform = Transform;
    })(dc.core || (dc.core = {}));
    var core = dc.core;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (core) {
        var display = dc.display;

        

        /**
        *
        */
        var Transition = (function () {
            //  Constructor
            //  --------------------------------------------------------------------------------------------
            function Transition(target, duration, data, listener) {
                this.target = target;
                this.duration = duration;
                this.data = data;
                this.listener = listener;
            }
            Transition.prototype.destory = function () {
                this.target = null;
                this.data = null;
                this.listener = null;
            };

            //  Public Methods
            //  --------------------------------------------------------------------------------------------
            /**
            *
            * @param target
            * @param duration
            * @param data
            * @param styles
            * @returns {*}
            */
            Transition.to = function (target, duration, data, styles) {
                if (typeof styles === "undefined") { styles = 'all'; }
                if (target) {
                    // Get delay
                    var delay = data.delay ? data.delay : 0;

                    // Get ease
                    var ease = data.ease ? data.ease : Ease.default;

                    // Event Listener
                    var listener = function (e) {
                        //                    console.log('end',target.id);
                        // Remove the transitionEnd event
                        target.node.removeEventListener(dc.core.TransformHelper.transitionEnd, listener);

                        // Delete transition style
                        target.node['style'][dc.core.TransformHelper.transition] = "";

                        // Call oncomplete if exeist
                        if (data.oncomplete)
                            data.oncomplete.call(data.scope, transitionInstance);

                        // clean up
                        transitionInstance.destory();
                        transitionInstance = null;
                        Transition.instances[target.id] = null;
                        delete Transition.instances[target.id];
                    };

                    // Create transition instance
                    var transitionInstance = new Transition(target, duration, data, listener);

                    // Save in index
                    Transition.instances[target.id] = transitionInstance;

                    // Fix bug the css transtion not validated
                    target.node.offsetHeight;

                    // Start transition
                    target.node.style[dc.core.TransformHelper.transition] = styles + " " + duration + "ms " + ease + " " + delay + "ms";

                    for (var key in data)
                        if (target[key] != undefined)
                            target[key] = data[key];

                    //                console.log('start',target.id);
                    // Add transtion end event
                    target.node.addEventListener(dc.core.TransformHelper.transitionEnd, listener, false);

                    // Apply the transform
                    target.validate();

                    return transitionInstance;
                } else {
                    // Error
                    return null;
                }
            };

            /**
            *
            * @param target
            * @param duration
            * @param fromData
            * @param toData
            * @param styles
            * @returns {*}
            */
            Transition.fromTo = function (target, duration, fromData, toData, styles) {
                if (typeof styles === "undefined") { styles = 'all'; }
                if (target) {
                    for (var key in fromData)
                        if (target[key] != undefined)
                            target[key] = fromData[key];

                    // Apply the transform
                    target.validate();

                    // Do animation
                    return Transition.to(target, duration, toData, styles);
                } else {
                    // Error
                    return null;
                }
            };

            /**
            *
            * @param target
            */
            Transition.kill = function (target) {
                if (target) {
                    //                console.log(target.id);
                    var transition = Transition.instances[target.id];
                    if (transition) {
                        transition.listener(null);
                    }
                }
                //            // Remove the transitionEnd event
                //            target.node.removeEventListener(TransformHelper.transitionEnd,listener);
                //
                //            // Delete transition style
                //            target.node.style[TransformHelper.transition]="";
            };
            Transition.instances = {};
            return Transition;
        })();
        core.Transition = Transition;

        //    /**
        //     *
        //     */
        //    export class EaseType {
        //
        //        public static default:string       = 'default';
        //        public static in:string            = 'in';
        //        public static out:string           = 'out';
        //        public static inout:string         = 'inout';
        //        public static snap:string          = 'snap';
        //        // Penner equations
        //        public static easeOutCubic:string      = 'easeOutCubic';
        //        public static easeInOutCubic:string    = 'easeInOutCubic';
        //        public static easeInCirc:string        = 'easeInCirc';
        //        public static easeOutCirc:string       = 'easeOutCirc';
        //        public static easeInOutCirc:string     = 'easeInOutCirc';
        //        public static easeInExpo:string        = 'easeInExpo';
        //        public static easeOutExpo:string       = 'easeOutExpo';
        //        public static easeInOutExpo:string     = 'easeInOutExpo';
        //        public static easeInQuad:string        = 'easeInQuad';
        //        public static easeOutQuad:string       = 'easeOutQuad';
        //        public static easeInOutQuad:string     = 'easeInOutQuad';
        //        public static easeInQuart:string       = 'easeInQuart';
        //        public static easeOutQuart:string      = 'easeOutQuart';
        //        public static easeInOutQuart:string    = 'easeInOutQuart';
        //        public static easeInQuint:string       = 'easeInQuint';
        //        public static easeOutQuint:string      = 'easeOutQuint';
        //        public static easeInOutQuint:string    = 'easeInOutQuint';
        //        public static easeInSine:string        = 'easeInSine';
        //        public static easeOutSine:string       = 'easeOutSine';
        //        public static easeInOutSine:string     = 'easeInOutSine';
        //        public static easeInBack:string        = 'easeInBack';
        //        public static easeOutBack:string       = 'easeOutBack';
        //        public static easeInOutBack:string     = 'easeInOutBack';
        //    }
        /**
        *
        */
        var Ease = (function () {
            function Ease() {
            }
            Ease.default = 'ease';
            Ease.in = 'ease-in';
            Ease.out = 'ease-out';
            Ease.inout = 'ease-in-out';
            Ease.snap = 'cubic-bezier(0,1,.5,1)';

            Ease.easeOutCubic = 'cubic-bezier(.215,.61,.355,1)';
            Ease.easeInOutCubic = 'cubic-bezier(.645,.045,.355,1)';
            Ease.easeInCirc = 'cubic-bezier(.6,.04,.98,.335)';
            Ease.easeOutCirc = 'cubic-bezier(.075,.82,.165,1)';
            Ease.easeInOutCirc = 'cubic-bezier(.785,.135,.15,.86)';
            Ease.easeInExpo = 'cubic-bezier(.95,.05,.795,.035)';
            Ease.easeOutExpo = 'cubic-bezier(.19,1,.22,1)';
            Ease.easeInOutExpo = 'cubic-bezier(1,0,0,1)';
            Ease.easeInQuad = 'cubic-bezier(.55,.085,.68,.53)';
            Ease.easeOutQuad = 'cubic-bezier(.25,.46,.45,.94)';
            Ease.easeInOutQuad = 'cubic-bezier(.455,.03,.515,.955)';
            Ease.easeInQuart = 'cubic-bezier(.895,.03,.685,.22)';
            Ease.easeOutQuart = 'cubic-bezier(.165,.84,.44,1)';
            Ease.easeInOutQuart = 'cubic-bezier(.77,0,.175,1)';
            Ease.easeInQuint = 'cubic-bezier(.755,.05,.855,.06)';
            Ease.easeOutQuint = 'cubic-bezier(.23,1,.32,1)';
            Ease.easeInOutQuint = 'cubic-bezier(.86,0,.07,1)';
            Ease.easeInSine = 'cubic-bezier(.47,0,.745,.715)';
            Ease.easeOutSine = 'cubic-bezier(.39,.575,.565,1)';
            Ease.easeInOutSine = 'cubic-bezier(.445,.05,.55,.95)';
            Ease.easeInBack = 'cubic-bezier(.6,-.28,.735,.045)';
            Ease.easeOutBack = 'cubic-bezier(.175, .885,.32,1.275)';
            Ease.easeInOutBack = 'cubic-bezier(.68,-.55,.265,1.55)';
            return Ease;
        })();
        core.Ease = Ease;
    })(dc.core || (dc.core = {}));
    var core = dc.core;
})(dc || (dc = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dc;
(function (dc) {
    (function (layout) {
        var display = dc.display;

        

        /**
        *
        */
        var LayoutItem = (function () {
            function LayoutItem() {
                this.width = 0;
                this.height = 0;
                this.x = 0;
                this.y = 0;
                this.visible = true;
                this.dirty = true;
                this.row = 0;
                this.extraWidth = 0;
            }
            return LayoutItem;
        })();
        layout.LayoutItem = LayoutItem;

        /**
        *
        */
        var Layout = (function () {
            function Layout(w, h) {
                this.horizontal = false;
                // Set the Layout dimension
                this.width = w;
                this.height = h;
                this.gap = 0;

                // Create the collection to store the size
                this.mChildren = new dc.data.Collection();
                this.mChildrenIndex = {};
            }
            /**
            *
            * @param inedx
            * @param values
            * @returns {LayoutItem}
            */
            Layout.prototype.addItem = function (inedx, values) {
                if (typeof values === "undefined") { values = null; }
                var item = new LayoutItem();

                // set index
                item.index = inedx;

                if (values) {
                    for (var key in values)
                        item[key] = values[key];
                } else if (this.mDefaultValues) {
                    for (var key in this.mDefaultValues)
                        item[key] = this.mDefaultValues[key];
                }

                // Add to index
                this.mChildrenIndex[item.index] = item;

                // Add to collection
                this.mChildren.addItem(item);

                // return layout item
                return item;
            };

            /**
            *
            * @param index
            */
            Layout.prototype.removeItem = function (index) {
                var item = this.getItem(index);

                if (item) {
                    //                // Remove from collection
                    //                this.mChildren.removeItem(item);
                    //
                    //                // Remove from index
                    //                this.mChildrenIndex[index]=null;
                    //                delete this.mChildrenIndex[index];
                }
            };

            /**
            *
            * @param index
            * @returns {*}
            */
            Layout.prototype.getItem = function (index) {
                return this.mChildrenIndex[index];
            };

            /**
            *
            * @param index
            * @param value
            */
            Layout.prototype.updateItem = function (index, value) {
                var item = this.getItem(index);
                if (item) {
                    item.dirty = true;

                    for (var key in value)
                        item[key] = value[key];
                }
            };

            /**
            *
            */
            Layout.prototype.resetLayout = function () {
                var self = this;
                var item;

                // Loop each children
                this.mChildren.forEach(function (index, data) {
                    item = data.data;
                    self.updateItem(item.index, { width: item.width, height: item.height });
                });
            };

            /**
            *
            */
            Layout.prototype.getLayoutLimit = function () {
                return 10;
            };

            /**
            *
            */
            Layout.prototype.postLayout = function () {
            };

            /**
            *
            * @param w
            * @param h
            * @returns {{w: number, h: number}}
            */
            Layout.prototype.getItemSize = function (w, h) {
                return { w: 0, h: 0 };
            };

            /**
            *
            */
            Layout.prototype.layout = function () {
            };

            /**
            *
            * @param value
            */
            Layout.prototype.setAllVisible = function (value) {
                // Loop each children
                this.mChildren.forEach(function (index, data) {
                    var item = data.data;
                    item.dirty = true;
                    item.visible = value;
                });
            };

            /**
            *
            * @param value
            */
            Layout.prototype.updateAllItems = function (key, value) {
                // Loop each children
                this.mChildren.forEach(function (index, data) {
                    data.data[key] = value;
                });
            };
            return Layout;
        })();
        layout.Layout = Layout;

        /**
        *
        */
        var ColumnLayout = (function (_super) {
            __extends(ColumnLayout, _super);
            function ColumnLayout() {
                _super.apply(this, arguments);
                // Properties
                this.mColumnCount = -1;
                this.mRealColumnCount = 5;
                this.mColumnSize = 100;
                this.mRowCount = 5;
                this.mRowSize = 100;
                // Others
                this.mOffset = 0;
                //  Setter/Getter
                //  --------------------------------------------------------------------------------------------
                this.buffer = 10;
                this.fitWidth = false;
            }
            Object.defineProperty(ColumnLayout.prototype, "columnCount", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mColumnCount;
                },
                set: function (value) {
                    this.mColumnCount = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ColumnLayout.prototype, "columnSize", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mColumnSize;
                },
                set: function (value) {
                    this.mColumnSize = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ColumnLayout.prototype, "rowCount", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mRowCount;
                },
                set: function (value) {
                    this.mRowCount = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ColumnLayout.prototype, "rowSize", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mRowSize;
                },
                set: function (value) {
                    this.mRowSize = value;
                },
                enumerable: true,
                configurable: true
            });

            //  Override Method
            //  --------------------------------------------------------------------------------------------
            /** @override */
            ColumnLayout.prototype.getLayoutLimit = function () {
                if (this.mChildren.length == 0)
                    return Math.ceil(this.height / this.mColumnSize) * this.mRealColumnCount + this.buffer;
                else {
                    var child = this.mChildren.getItemAt(this.mChildren.length - 1).data;
                    return Math.ceil(this.height / this.mColumnSize) * this.mRealColumnCount + this.buffer;
                }
            };

            /** @override */
            ColumnLayout.prototype.resetLayout = function () {
                // If Horizontal
                if (this.horizontal) {
                } else {
                    // If vertical
                    if (this.mColumnCount > 0) {
                        // Assign real column count
                        this.mRealColumnCount = this.mColumnCount;

                        // Calculate column width
                        this.mColumnSize = (this.width - this.gap * (this.mRealColumnCount - 1)) / this.mRealColumnCount;
                    } else {
                        // Calculate no. of column
                        this.mRealColumnCount = Math.floor((this.width + this.gap) / (this.mColumnSize + this.gap));
                    }

                    // Calculate offset
                    this.mOffset = (this.width - (this.mColumnSize + this.gap) * this.mRealColumnCount + this.gap) / 2;

                    // Set default value
                    this.mDefaultValues = {
                        x: 0, y: 0, width: this.mColumnSize, height: this.mColumnSize
                    };
                }
            };

            /** @override */
            ColumnLayout.prototype.layout = function () {
                if (this.horizontal) {
                    if (this.fitWidth)
                        this._layoutFitHorizontal();
                    else
                        this._layoutHorizontal();
                } else
                    this._layoutVertical();
            };

            //        /** @override */
            //        public updateItem(index:string,value:ILayoutItem):void
            //        {
            //            if(value&&value.width&&value.height){
            //                var ratio:number=value.width/value.height;
            //                value.width=this.mColumnSize;
            //                value.height=this.mColumnSize/ratio;
            //            }
            //
            //            super.updateItem(index,value);
            //        }
            /** @override */
            ColumnLayout.prototype.getItemSize = function (w, h) {
                var r = w / h;
                if (this.horizontal)
                    return { w: this.mColumnSize * r, h: this.mColumnSize };
                else
                    return { w: this.mColumnSize, h: this.mColumnSize / r };
            };

            //  Override Method
            //  --------------------------------------------------------------------------------------------
            /**
            *
            * @private
            */
            ColumnLayout.prototype._layoutVertical = function () {
                var self = this;
                var row = 0, col = 0;

                // Create array to hold the column data
                var columnIndex = [];

                for (var i = 0; i < this.mRealColumnCount; i++)
                    columnIndex[i] = 0;

                // Loop each children
                this.mChildren.forEach(function (index, data) {
                    var item = data.data;

                    if (item.visible) {
                        var old_x = item.x;
                        var old_y = item.y;

                        // Get the smaller y in which column
                        col = 0;
                        for (var k = 0; k < self.mRealColumnCount; k++)
                            if (columnIndex[k] < row) {
                                col = k;
                                row = columnIndex[k];
                            }

                        // Get the value
                        row = columnIndex[col];

                        // Set position
                        item.x = col * (self.mColumnSize + self.gap) + self.mOffset;
                        item.y = row;

                        // Check the dirty value
                        item.dirty = (old_x != item.x || old_y != item.y);

                        //                    console.log(index,old_x,item.x,old_y,item.y,item.dirty);
                        // Save the value
                        row = columnIndex[col] = row + item.height + self.gap;
                    }
                });

                this.height = row;
            };

            /**
            *
            * @private
            */
            ColumnLayout.prototype._layoutHorizontal = function () {
                var self = this;
                var row = 0, posX = -1;

                // Reset the column index
                var columnIndex = [0];

                // Loop each children
                this.mChildren.forEach(function (index, data) {
                    // Get the data
                    var item = data.data;

                    // Reset row
                    row = -1;

                    // Reset position x
                    posX = self.width; //self.mColumnIndex[0];

                    for (var k = 0, l = columnIndex.length; k < l; k++)
                        if (columnIndex[k] + item.width + self.gap <= self.width) {
                            if (columnIndex[k] < posX) {
                                posX = columnIndex[k];
                                row = k;
                            }
                        }

                    // Check if it is new row
                    if (row == -1) {
                        // Set the pos x
                        posX = 0;

                        // get the row
                        row = columnIndex.length;

                        // Add a new row
                        columnIndex.push(0);
                    }

                    // Set position
                    item.x = posX;
                    item.y = row * (self.mColumnSize + self.gap);
                    item.dirty = true;
                    item.extraWidth = 0;

                    //                console.log(index,'row:',row,'x:',item.x,'y:',item.y,'w',item.width,'h',item.height)
                    // Save value to the index
                    columnIndex[row] = item.x + item.width + self.gap;
                });

                this.height = columnIndex.length * (self.mColumnSize + self.gap) - self.gap;

                columnIndex = null;
            };

            /**
            *
            * @private
            */
            ColumnLayout.prototype._layoutFitHorizontal = function () {
                var self = this;
                var row = 0, posX = -1;

                // Reset the column index
                var rowWidthIndex = [0];
                var itemPerRowIndex = [0];
                var extraWidthOrgIndex = [0];

                // Loop each children
                this.mChildren.forEach(function (index, data) {
                    // Get the data
                    var item = data.data;

                    // Reset row
                    row = -1;

                    // Reset position x
                    posX = self.width; //self.mColumnIndex[0];

                    for (var k = 0, l = rowWidthIndex.length; k < l; k++)
                        if (rowWidthIndex[k] + item.width + self.gap <= self.width) {
                            if (rowWidthIndex[k] < posX) {
                                posX = rowWidthIndex[k];
                                row = k;
                            }
                        }

                    // Check if it is new row
                    if (row == -1) {
                        // Set the pos x
                        posX = 0;

                        // get the row
                        row = rowWidthIndex.length;

                        // Add a new row
                        rowWidthIndex.push(0);
                        itemPerRowIndex.push(0);
                        extraWidthOrgIndex.push(0);
                    }

                    // Set position
                    item.x = posX;
                    item.y = row * (self.mColumnSize + self.gap);
                    item.dirty = true;

                    //                item.extraWidth=0;
                    item.row = row;

                    //                console.log('item.extraWidth',item.extraWidth)
                    extraWidthOrgIndex[row] += item.extraWidth;

                    //                console.log(index,'row:',row,'x:',item.x,'y:',item.y,'w',item.width,'h',item.height)
                    // Save value to the index
                    rowWidthIndex[row] = item.x + item.width + self.gap;
                    itemPerRowIndex[row] += 1;
                });

                // Calculate extra add
                var extraWidthIndex = [];
                for (var i = 0; i < itemPerRowIndex.length; i++) {
                    //                console.log(i,itemPerRowIndex[i],rowWidthIndex[i],Math.floor((this.width-rowWidthIndex[i])/itemPerRowIndex[i]),this.width);
                    if (isFinite(rowWidthIndex[i]))
                        extraWidthIndex[i] = ((this.width - rowWidthIndex[i] + this.gap) / itemPerRowIndex[i]);
                    else
                        extraWidthIndex[i] = 0;
                }

                var posXIndex = [];
                for (var i = 0; i < itemPerRowIndex.length; i++)
                    posXIndex[i] = 0;

                // Loop each children
                this.mChildren.forEach(function (index, data) {
                    // Get the data
                    var item = data.data;
                    var row = item.row;
                    var extraWidth = isFinite(extraWidthIndex[row]) ? extraWidthIndex[row] : 0;

                    // If x==0, don't add extra
                    if (item.x == 0) {
                    } else {
                        item.x = item.x + extraWidthIndex[row] * posXIndex[row];
                    }
                    posXIndex[row]++;

                    //                console.log('index',item.index,row,'extraWidth', item.extraWidth,extraWidth,item.x);
                    item.extraWidth = extraWidth;
                });

                // Set the height
                this.height = rowWidthIndex.length * (self.mColumnSize + this.gap) - self.gap;
                rowWidthIndex = null;
            };
            return ColumnLayout;
        })(Layout);
        layout.ColumnLayout = ColumnLayout;
    })(dc.layout || (dc.layout = {}));
    var layout = dc.layout;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (display) {
        var events = dc.events;
        var core = dc.core;

        // --------------------------------------------------------------------------------------------
        // Helper Classes
        // --------------------------------------------------------------------------------------------
        /**
        *
        */
        var Size = (function () {
            function Size() {
                this.width = 0;
                this.height = 0;
                this.innerWidth = 0;
                this.innerHeight = 0;
                this.outerWidth = 0;
                this.outerHeight = 0;
            }
            return Size;
        })();
        display.Size = Size;

        /**
        *
        */
        var Measurements = (function () {
            function Measurements() {
                this.paddingTop = 0;
                this.paddingBottom = 0;
                this.paddingLeft = 0;
                this.paddingRight = 0;
                this.marginTop = 0;
                this.marginBottom = 0;
                this.marginLeft = 0;
                this.marginRight = 0;
                this.borderLeftWidth = 0;
                this.borderRightWidth = 0;
                this.borderTopWidth = 0;
                this.borderBottomWidth = 0;
                this.border = "";
                this.borderWidth = 0;
                this.borderHeight = 0;
                this.paddingWidth = 0;
                this.paddingHeight = 0;
                this.marginWidth = 0;
                this.marginHeight = 0;
                this.isBorderBox = true;
                this.isBoxSizeOuter = false;
                this.isBorderBoxSizeOuter = false;
            }
            return Measurements;
        })();
        display.Measurements = Measurements;

        /**
        *
        */
        var MeasurementsHelper = (function () {
            function MeasurementsHelper() {
            }
            // Static Methods
            // --------------------------------------------------------------------------------------------
            /**
            *
            */
            MeasurementsHelper.setup = function () {
                // init getStyle
                var getComputedStyle = window.getComputedStyle;
                MeasurementsHelper.getStyle = getComputedStyle ? function (elem) {
                    return getComputedStyle(elem, null);
                } : function (elem) {
                    return elem.currentStyle;
                };
                // Check if border
            };

            /**
            * Get the size from style
            * Return false if not valid
            * @param value
            * @returns {boolean|number}
            */
            MeasurementsHelper.getStyleSize = function (value) {
                var num = parseFloat(value);

                // not a percent like '100%', and a number
                var isValid = value.indexOf('%') === -1 && !isNaN(num);
                return isValid && num;
            };

            /**
            *
            * @param node
            * @param style
            * @param measurements
            * @returns {Measurements}
            */
            MeasurementsHelper.getMeasurements = function (node, style, measurements) {
                if (typeof measurements === "undefined") { measurements = undefined; }
                // Create a new Measurements if not supplied
                if (measurements == undefined)
                    measurements = new Measurements();

                for (var i = 0, l = MeasurementsHelper.styles.length; i < l; i++) {
                    var measurement = MeasurementsHelper.styles[i];
                    var value = MeasurementsHelper.mungeNonPixel(node, style[measurement]);
                    var num = parseFloat(value);

                    // any 'auto', 'medium' value will be 0
                    measurements[measurement] = !isNaN(num) ? num : 0;
                }

                measurements.borderWidth = measurements.borderLeftWidth + measurements.borderRightWidth;
                measurements.borderHeight = measurements.borderTopWidth + measurements.borderBottomWidth;
                measurements.paddingWidth = measurements.paddingLeft + measurements.paddingRight;
                measurements.paddingHeight = measurements.paddingTop + measurements.paddingBottom;
                measurements.marginWidth = measurements.marginLeft + measurements.marginRight;
                measurements.marginHeight = measurements.marginTop + measurements.marginBottom;

                //            measurements.isBorderBoxSizeOuter=dc.browser.webkit&&measurements.isBorderBox;
                measurements.isBorderBoxSizeOuter = measurements.isBorderBox;

                return measurements;
            };

            // Static Methods
            // --------------------------------------------------------------------------------------------
            /**
            * IE8 returns percent values, not pixels
            * taken from jQuery's curCSS
            * @param elem
            * @param value
            * @returns {string}
            */
            MeasurementsHelper.mungeNonPixel = function (elem, value) {
                // IE8 and has percent value
                if (getComputedStyle || value.indexOf('%') === -1) {
                    return value;
                }
                var style = elem.style;

                // Remember the original values
                var left = style.left;
                var rs = elem.runtimeStyle;
                var rsLeft = rs && rs.left;

                // Put in the new values to get a computed value out
                if (rsLeft) {
                    rs.left = elem.currentStyle.left;
                }
                style.left = value;
                value = style.pixelLeft.toString();

                // Revert the changed values
                style.left = left;
                if (rsLeft) {
                    rs.left = rsLeft;
                }

                return value;
            };
            MeasurementsHelper.styles = [
                'paddingTop',
                'paddingBottom',
                'paddingLeft',
                'paddingRight',
                'marginTop',
                'marginBottom',
                'marginLeft',
                'marginRight',
                'borderLeftWidth',
                'borderRightWidth',
                'borderTopWidth',
                'borderBottomWidth'
            ];
            return MeasurementsHelper;
        })();
        display.MeasurementsHelper = MeasurementsHelper;

        

        /**
        *
        */
        var View = (function (_super) {
            __extends(View, _super);
            // Constructor
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @param name
            * @param node
            */
            function View(name, node) {
                if (typeof name === "undefined") { name = ''; }
                if (typeof node === "undefined") { node = null; }
                _super.call(this);
                this.mAlpha = 1;
                this.mVisible = true;
                // protected
                this.mNeedValidateSize = true;

                this.name = name;
                this.node = node;

                this._init();
            }
            // Static Methods
            // --------------------------------------------------------------------------------------------
            /**
            *
            */
            View.postSetup = function () {
                // General Default CSS
                View.DEFAULT_CSS.push('.dc-ui.clipping{overflow:hidden !important} .dc-ui.hide{ display:none !important} .dc-ui.root{}'); //position:inherit
                View.DEFAULT_CSS.push('.dc-ui.interactive{cursor: pointer; cursor: hand}');
                View.DEFAULT_CSS.push('.dc-ui.floating{position: absolute}');
                View.DEFAULT_CSS.push('.dc-ui.fill{left:0;right:0;top:0;bottom:0}');
                View.DEFAULT_CSS.push('.noscroll{overflow:hidden!important}');

                // Set the box sizing property
                if (dc.browser.firefox)
                    View.DEFAULT_CSS.push('.dc-ui {-moz-box-sizing:border-box}');
                else
                    View.DEFAULT_CSS.push('.dc-ui {box-sizing:border-box}');

                // Attach the style to head
                var style = document.createElement('style');
                style.id = "dc_styles";
                style.type = 'text/css';
                style.innerHTML = View.DEFAULT_CSS.join(" ");
                document.getElementsByTagName('head')[0].appendChild(style);
                //            console.log('view settings',View.DEFAULT_CSS);
            };

            Object.defineProperty(View.prototype, "parent", {
                // Getter/Setter
                // --------------------------------------------------------------------------------------------
                /**
                *
                * @returns {ViewContainer}
                */
                get: function () {
                    return this.mParent;
                },
                set: function (value) {
                    this.mParent = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "x", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mTransform.x;
                },
                set: function (value) {
                    this.node.setAttribute('data-x', value.toString());
                    if (this.mTransform)
                        this.mTransform.x = value;
                    else
                        this.node.style.left = value + 'px';
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "y", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mTransform.y;
                },
                set: function (value) {
                    this.node.setAttribute('data-y', value.toString());
                    if (this.mTransform)
                        this.mTransform.y = value;
                    else
                        this.node.style.top = value + 'px';
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "pivotX", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mTransform.pivotX;
                },
                set: function (value) {
                    this.mTransform.pivotX = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "pivotY", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mTransform.pivotY;
                },
                set: function (value) {
                    this.mTransform.pivotY = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "rotation", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mTransform.rotation;
                },
                set: function (value) {
                    this.mTransform.rotation = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "width", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.size.width;
                },
                set: function (value) {
                    if (this.size.width != value)
                        this.setSize(value, this.size.height);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "height", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.size.height;
                },
                set: function (value) {
                    if (this.size.height != value)
                        this.setSize(this.size.width, value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "scale", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mTransform.scale;
                },
                set: function (value) {
                    this.mTransform.scale = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "skewX", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mTransform.skewX;
                },
                set: function (value) {
                    this.mTransform.skewX = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "skewY", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mTransform.skewY;
                },
                set: function (value) {
                    this.mTransform.skewY = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "alpha", {
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mAlpha;
                },
                set: function (value) {
                    this.mAlpha = value;
                    if (value == 1)
                        this.node.style.opacity = '';
                    else
                        this.node.style.opacity = this.mAlpha + '';
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "transform", {
                /**
                *
                * @returns {core.Transform}
                */
                get: function () {
                    return this.mTransform;
                },
                set: function (value) {
                    this.mTransform = value;
                    //            if(value){
                    //                this.floating=true;
                    //            } else {
                    //                this.floating=false;
                    //            }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "visible", {
                /**
                *
                * @returns {boolean}
                */
                get: function () {
                    return this.mVisible;
                },
                set: function (value) {
                    if (this.mVisible != value) {
                        this.mVisible = value;

                        if (value)
                            this.removeClass("hide");
                        else
                            this.addClass("hide");
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "floating", {
                /**
                *
                * @returns {boolean}
                */
                get: function () {
                    return this.mFloating;
                },
                set: function (value) {
                    if (this.mFloating != value) {
                        this.mFloating = value;

                        if (value)
                            this.addClass("floating");
                        else
                            this.removeClass("floating");
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "clipping", {
                /**
                *
                * @returns {boolean}
                */
                get: function () {
                    return this.mClipping;
                },
                set: function (value) {
                    if (this.mClipping != value) {
                        this.mClipping = value;

                        if (value)
                            this.addClass("clipping");
                        else
                            this.removeClass("clipping");
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(View.prototype, "interactive", {
                /**
                *
                * @returns {boolean}
                */
                get: function () {
                    return this.mInteractive;
                },
                set: function (value) {
                    if (this.mInteractive != value) {
                        this.mInteractive = value;

                        if (value) {
                            this.addClass('interactive');
                            this._addEvents();
                        } else {
                            this.removeClass('interactive');
                            this._removeEvents();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });

            // Private Methods
            // --------------------------------------------------------------------------------------------
            /**
            * Basic setup
            * @private
            */
            View.prototype._init = function () {
                // Set ID
                this.id = 'ui_' + View.ID_COUNT;
                View.ID_COUNT++;

                // Create a Measurements
                this.measurements = new Measurements();

                // Create a Size object
                this.size = new Size();

                // Transform object
                //            this.transform=new core.Transform();
                // Create Children
                this._createChildren();

                // Assign the dc-ui class name
                this.addClass("dc-ui");

                this.node.setAttribute('data-id', this.id);
                //            // Set default clipping
                //            this.clipping=false;
            };

            // Protected Methods
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @private
            */
            View.prototype._createNode = function () {
                // Create a html element
                this.node = document.createElement('div');
            };

            /**
            *
            * @private
            */
            View.prototype._createChildren = function () {
                this._createNode();
            };

            /**
            *
            * @private
            */
            View.prototype._addEvents = function () {
                var self = this;
                var eventType = dc.os.mobile ? 'touchend' : 'click';

                // For mobile, indicate if it is a valid Triggered Event.
                // When in mobile, touchmove will set this to false to prevent touchend after scroll.
                var valid = true;

                // Event
                this.mTriggeredEvent = function () {
                    if (valid)
                        self._handleTriggeredEvent();
                    valid = true; // reset valid
                };

                // bind the event
                dc.bind(this.node, eventType, this.mTriggeredEvent);

                // For mobile
                if (dc.os.mobile) {
                    // Prevent trigger event if touch move
                    this.mMobileTriggeredEvent = function () {
                        valid = false;
                    };
                    dc.bind(this.node, 'touchmove', this.mMobileTriggeredEvent);
                }
            };

            /**
            *
            * @private
            */
            View.prototype._removeEvents = function () {
                var eventType = dc.os.mobile ? 'touchend' : 'click';

                // unbind the event
                dc.unbind(this.node, eventType, this.mTriggeredEvent);

                // clean
                this.mTriggeredEvent = null;

                // For mobile
                if (dc.os.mobile && this.mMobileTriggeredEvent) {
                    dc.unbind(this.node, 'touchmove', this.mMobileTriggeredEvent);
                    this.mMobileTriggeredEvent = null;
                }
            };

            /**
            *
            * @private
            */
            View.prototype._handleTriggeredEvent = function () {
                this.dispatchEventWith(events.Event.TRIGGERED, true);
            };

            // Public Methods
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @param node
            * @param root
            */
            View.prototype.attachTo = function (node, root) {
                if (typeof root === "undefined") { root = true; }
                if (node) {
                    // Attach to htmlnode
                    node.appendChild(this.node);

                    // Indicate this is root
                    if (root)
                        this.addClass('root');

                    // Validate
                    this.validate();
                }
            };

            /**
            * removeFromParent
            */
            View.prototype.removeFromParent = function () {
                this.node.parentNode.removeChild(this.node);
            };

            /**
            *
            * @param name
            */
            View.prototype.addClass = function (name) {
                dc.addClass(this.node, name);
            };

            /**
            *
            * @param name
            */
            View.prototype.removeClass = function (name) {
                dc.removeClass(this.node, name);
            };

            /**
            *
            * @param root
            */
            View.prototype.setRoot = function (root) {
                this.root = root;
            };

            /**
            *
            */
            View.prototype.measure = function () {
                // Get the style
                this.mStyle = MeasurementsHelper.getStyle(this.node);

                // Get the measurements
                MeasurementsHelper.getMeasurements(this.node, this.mStyle, this.measurements);
            };

            /**
            *
            * @param w
            * @param h
            */
            View.prototype.setSize = function (w, h, update) {
                if (typeof update === "undefined") { update = false; }
                // Set the size
                this.size.width = w;
                this.size.height = h;

                if (update) {
                    // Set the style
                    this.node.style.width = this.size.width + "px";
                    this.node.style.height = this.size.height + "px";

                    // Measure the node
                    this.measure();

                    // Calculate inner/outer width/height
                    this.size.innerHeight = this.size.height - this.measurements.paddingHeight - this.measurements.borderHeight;
                    this.size.innerWidth = this.size.width - this.measurements.paddingWidth - this.measurements.borderWidth;
                    this.size.outerHeight = this.size.height + this.measurements.marginHeight;
                    this.size.outerWidth = this.size.width + this.measurements.marginWidth;
                } else {
                    this.mNeedValidateSize = true;
                }
            };

            /**
            *
            * @param cleanWidth
            * @param cleanHeight
            */
            View.prototype.validateSize = function (cleanWidth, cleanHeight) {
                if (typeof cleanWidth === "undefined") { cleanWidth = false; }
                if (typeof cleanHeight === "undefined") { cleanHeight = false; }
                // Measure
                this.measure();

                // Calculate from browser layout
                if (cleanWidth) {
                    this.node.style.width = null;
                    this.size.width = this.node.offsetWidth;
                } else if (this.size.width <= 0) {
                    // Check if width valid
                    // Override width/height if we can get it from style
                    var styleWidth = MeasurementsHelper.getStyleSize(this.mStyle.width);
                    if (styleWidth !== false) {
                        this.size.width = styleWidth + (this.measurements.isBorderBoxSizeOuter ? 0 : this.measurements.paddingWidth + this.measurements.borderWidth);
                    } else {
                        this.size.width = this.node.offsetWidth;
                    }
                } else {
                    this.node.style.width = this.size.width + "px";
                }

                // Force clean the style
                if (cleanHeight) {
                    this.node.style.height = null;
                    this.size.height = this.node.offsetHeight;
                } else if (this.size.height <= 0) {
                    // Check if height valid
                    var styleHeight = MeasurementsHelper.getStyleSize(this.mStyle.height);
                    if (styleHeight !== false) {
                        this.size.height = styleHeight + (this.measurements.isBorderBoxSizeOuter ? 0 : this.measurements.paddingHeight + this.measurements.borderHeight);
                    } else {
                        this.size.height = this.node.offsetHeight;
                    }
                } else {
                    this.node.style.height = this.size.height + "px";
                }

                // Calculate inner/outer width/height
                this.size.innerHeight = this.size.height - this.measurements.paddingHeight - this.measurements.borderHeight;
                this.size.innerWidth = this.size.width - this.measurements.paddingWidth - this.measurements.borderWidth;
                this.size.outerHeight = this.size.height + this.measurements.marginHeight;
                this.size.outerWidth = this.size.width + this.measurements.marginWidth;
                //                console.log('measure',this.size.width,this.size.height,
                //                    this.size.innerWidth,this.size.innerHeight,
                //                    this.measurements.paddingWidth,this.measurements.borderWidth);
            };

            /**
            *
            */
            View.prototype.validatePosition = function () {
                // Apply transform
                if (this.mTransform)
                    this.mTransform.apply(this.node);
            };

            /**
            *  TODO: Optimise the validate process
            */
            View.prototype.validate = function (force, cleanWidth, cleanHeight) {
                if (typeof force === "undefined") { force = false; }
                if (typeof cleanWidth === "undefined") { cleanWidth = false; }
                if (typeof cleanHeight === "undefined") { cleanHeight = false; }
                // Update size if needed
                if (this.mNeedValidateSize || force) {
                    // validateSize
                    this.validateSize(cleanWidth, cleanHeight);

                    // Prevent validate again
                    this.mNeedValidateSize = false;
                }

                // Validate positiion
                this.validatePosition();
            };

            // Animation Public Methods
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @param duration
            */
            View.prototype.fadeIn = function (duration) {
                if (typeof duration === "undefined") { duration = 1000; }
                // Set alpha 0
                this.alpha = 0;
                this.visible = true;

                // Fade in item
                if (this.alpha != 1) {
                    core.Transition.to(this, duration, {
                        alpha: 1
                    }, 'opacity');
                }
            };
            View.ID_COUNT = 0;

            View.DEFAULT_CSS = [];
            return View;
        })(events.EventDispatcher);
        display.View = View;

        // --------------------------------------------------------------------------------------------
        //  ViewContainer Class
        // --------------------------------------------------------------------------------------------
        /**
        *
        */
        var ViewContainer = (function (_super) {
            __extends(ViewContainer, _super);
            function ViewContainer() {
                _super.apply(this, arguments);
                /**
                * Number of children in the container
                * @property numChildren
                * @type Number
                */
                this.numChildren = 0;
            }
            // Constructor
            // --------------------------------------------------------------------------------------------
            //        constructor(name:string='',node:HTMLElement=null){
            //            super(name,node);
            //        }
            // Override Protected Methods
            // --------------------------------------------------------------------------------------------
            /** @override */
            ViewContainer.prototype._createChildren = function () {
                _super.prototype._createChildren.call(this);

                // Assign container
                this.mContainer = this.node;

                // Create Array to hold the children object
                this.children = [];
                this.mChildrenIndex = {};
            };

            // Override Public Methods
            // --------------------------------------------------------------------------------------------
            /** @override */
            ViewContainer.prototype.setRoot = function (root) {
                _super.prototype.setRoot.call(this, root);

                // Set root for children
                var l = this.children.length;
                for (var i = 0; i < l; i++)
                    this.children[i].setRoot(root);
            };

            //        /** @override */
            //        public validate(force:boolean=false,cleanWidth:boolean=false,cleanHeight:boolean=false):void
            //        {
            //            super.validate(force);
            //
            //            var l:number=this.children.length-1;
            //            for(var i:number=l;i>=0;i--)
            //                this.children[i].validate();
            //        }
            // Private Methods
            // --------------------------------------------------------------------------------------------
            /*
            * TODO: may change to a better methods to update the index
            * Now it loop all children and update the index
            */
            ViewContainer.prototype._updateIndex = function () {
                // Loop and update index
                var l = this.children.length;
                for (var i = 0; i < l; i++)
                    this.children[i].index = i;

                // Set the last children
                this.mLastChild = this.children[this.children.length - 1];

                // Reset the numChildren properties
                this.numChildren = this.children.length;
            };

            // Public Methods
            // --------------------------------------------------------------------------------------------
            /**
            * Add children to container
            * @method addChild
            * @param {dc.display.View} child the UI object to be added.
            * @param {Boolean} update indicates if the container need update
            */
            ViewContainer.prototype.addChild = function (child, update) {
                if (typeof update === "undefined") { update = true; }
                this.addChildAt(child, this.children.length, update);
            };

            /**
            * Add list of childrens to container
            * @method addChilds
            * @param {dc.display.View[]} children the UI object to be added.
            * @param {Boolean} update indicates if the container need update
            */
            ViewContainer.prototype.addChildren = function (children, update) {
                if (typeof update === "undefined") { update = true; }
                for (var i = 0, l = children.length; i < l; i++) {
                    var child = children[i];

                    // Check if valid
                    if (child && child.node) {
                        // If not already a child
                        if (this.mChildrenIndex[child.id]) {
                        } else {
                            this.mChildrenIndex[child.id] = true;

                            // Set the root
                            child.setRoot(this.root);

                            // Set the parent
                            child.parent = this;

                            // Add to children array
                            this.children.push(child);

                            // Append to container
                            this.mContainer.appendChild(child.node);

                            // Validate
                            if (update)
                                child.validate();

                            this.dispatchEventWith(events.Event.ADDED);
                        }
                    }
                }

                // Update index for each children
                this._updateIndex();
            };

            /**
            * Remove children to container
            * @method removeChild
            * @param {dc.display.View} child the UI object to be removed.
            * @param {Boolean} update indicates if the container need update
            */
            ViewContainer.prototype.removeChild = function (child, update) {
                if (typeof update === "undefined") { update = true; }
                var i = this.children.length - 1;
                while (i >= 0) {
                    if (this.children[i] == child) {
                        this.removeChildAt(i, update);
                        break;
                    }
                    i--;
                }
            };

            /**
            * Add children to container at index
            * @method addChildAt
            * @param {dc.display.View} child the UI object to be added.
            * @param {Number} index the index where the UI added
            * @param {Boolean} update indicates if the container need update after add children
            */
            ViewContainer.prototype.addChildAt = function (child, index, update) {
                if (typeof update === "undefined") { update = true; }
                if (child && child.node) {
                    if (this.mChildrenIndex[child.id]) {
                    } else {
                        this.mChildrenIndex[child.id] = true;

                        // Set the root
                        child.setRoot(this.root);

                        // Set the parent
                        child.parent = this;

                        // Add to children array
                        if (index >= this.children.length) {
                            this.children.push(child);

                            // Add to container
                            this.mContainer.appendChild(child.node);
                        } else {
                            this.children.splice(index, 0, child);

                            // Insert to container
                            this.mContainer.childNodes[index].insertBefore(child.node);
                        }

                        // Update index for each children
                        this._updateIndex();

                        // Validate
                        if (update)
                            child.validate();

                        // Event
                        this.dispatchEventWith(events.Event.ADDED);
                    }
                }
            };

            /**
            * Remove children to container at index
            * @method removeChildAt
            * @param {number} index the index of the children to be removed
            * @param {boolean} update indicate if need to update
            * @return {dc.display.View} The removed UI
            */
            ViewContainer.prototype.removeChildAt = function (index, update) {
                if (typeof update === "undefined") { update = true; }
                if (index >= 0 && index < this.children.length) {
                    var child = this.children[index];

                    if (this.mChildrenIndex[child.id]) {
                        child.setRoot(null);
                        child.parent = null;

                        // Remove children from array
                        if (index >= this.children.length)
                            this.children.pop();
                        else
                            this.children.splice(index, 1);

                        //remove child
                        //child.ui.remove(child.ui);
                        this.mContainer.removeChild(child.node);

                        // Update index
                        this._updateIndex();

                        // del index
                        delete this.mChildrenIndex[child.id];

                        // Validate
                        if (update)
                            child.validate();

                        // Event
                        this.dispatchEventWith(events.Event.REMOVED);

                        return child;
                    }
                }

                return null;
            };

            /**
            * Remove all children
            * @method removeAllChildren
            *
            */
            ViewContainer.prototype.removeAllChildren = function () {
                for (var i = this.children.length - 1; i >= 0; i--) {
                    this.mContainer.removeChild(this.children[i].node);
                }

                // Create new array to hold the children object
                this.children = [];
                this.mChildrenIndex = {};
            };

            /**
            *
            * @param index
            * @returns {View}
            */
            ViewContainer.prototype.getChildAt = function (index) {
                return (index >= 0 && index < this.children.length) ? this.children[index] : null;
            };

            /**
            *
            */
            ViewContainer.prototype.lastChild = function () {
                return this.mLastChild;
            };

            /**
            * Check if container conatins children
            * @method contains
            * @param {Function} fn
            */
            ViewContainer.prototype.forEach = function (fn) {
                for (var i = 0, l = this.numChildren; i < l; i++)
                    fn(i, this.children[i]);
            };

            /**
            * Check if container conatins children
            * @method contains
            * @param {dc.display.View} view the view to be check
            */
            ViewContainer.prototype.contains = function (view) {
                if (view)
                    return this.mChildrenIndex[view.id] || false;
                return false;
            };

            /**
            *
            * @param view
            * @param index
            */
            ViewContainer.prototype.setChildIndex = function (view, index) {
                // Check if contains the view
                if (this.contains(view)) {
                    // Get the target index view
                    var child = this.getChildAt(index);

                    if (child) {
                        // move the node
                        this.mContainer.insertBefore(view.node, child.node.nextSibling);

                        // remove view from array
                        this.children.splice(view.index, 1);

                        // add back the view to array
                        this.children.splice(index, 0, view);

                        // Update index
                        this._updateIndex();
                    }
                } else {
                    // Error
                }
            };

            /**
            * Bring the view to front
            * @param {dc.display.View} view
            */
            ViewContainer.prototype.bringToFront = function (view) {
                //            // Set the zIndex to top most
                //            this.node.style.zIndex=''+this.mMaxZIndex;
                //            // Increase the max zIndex
                //            this.mMaxZIndex++;
                this.children.splice(view.index, 0);
                this.children.push(view);
                this.mContainer.appendChild(view.node);

                this._updateIndex();
            };
            return ViewContainer;
        })(View);
        display.ViewContainer = ViewContainer;

        // Add the init settings
        dc.asyncInit(View.postSetup);
    })(dc.display || (dc.display = {}));
    var display = dc.display;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (text) {
        var display = dc.display;

        /**
        *
        */
        var TextField = (function (_super) {
            __extends(TextField, _super);
            //  Constructor
            //  --------------------------------------------------------------------------------------------
            function TextField(text) {
                if (typeof text === "undefined") { text = ""; }
                if (text != "") {
                    this.mText = text;
                    this.mNeedValidateSize = true;
                }

                _super.call(this, null);
            }
            Object.defineProperty(TextField.prototype, "text", {
                //  Setter/Getter
                //  --------------------------------------------------------------------------------------------
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this.mText;
                },
                set: function (value) {
                    if (this.mText != value) {
                        this.mText = value;

                        // Set the text
                        this.node.innerHTML = this.mText.toString();

                        //
                        this.validate(true);
                    }
                },
                enumerable: true,
                configurable: true
            });

            //  Protected Methods
            //  --------------------------------------------------------------------------------------------
            /** @override */
            TextField.prototype._createChildren = function () {
                _super.prototype._createChildren.call(this);

                this.addClass('dc-text');
            };

            /** @override */
            TextField.prototype.validate = function (force, cleanWidth, cleanHeight) {
                if (typeof force === "undefined") { force = false; }
                if (typeof cleanWidth === "undefined") { cleanWidth = false; }
                if (typeof cleanHeight === "undefined") { cleanHeight = false; }
                // If text not set
                if (this.node.innerHTML == "" && this.mText) {
                    // Set the text
                    this.node.innerHTML = this.mText.toString();
                }

                _super.prototype.validate.call(this, force, true, true);
            };
            return TextField;
        })(display.View);
        text.TextField = TextField;
    })(dc.text || (dc.text = {}));
    var text = dc.text;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (display) {
        var text = dc.text;

        /**
        *
        */
        var Progress = (function (_super) {
            __extends(Progress, _super);
            function Progress() {
                _super.apply(this, arguments);
            }
            // Override Protected Methods
            // --------------------------------------------------------------------------------------------
            Progress.prototype._createChildren = function () {
                _super.prototype._createChildren.call(this);

                this.addClass('dc-progress');
            };

            // Public Methods
            // --------------------------------------------------------------------------------------------
            Progress.prototype.setProgress = function (value) {
            };
            return Progress;
        })(dc.display.ViewContainer);
        display.Progress = Progress;

        /**
        *
        */
        var TextProgress = (function (_super) {
            __extends(TextProgress, _super);
            function TextProgress() {
                _super.apply(this, arguments);
            }
            // Override Protected Methods
            // --------------------------------------------------------------------------------------------
            TextProgress.prototype._createChildren = function () {
                _super.prototype._createChildren.call(this);

                this.mText = new text.TextField();
                this.addChild(this.mText);
            };

            TextProgress.prototype.setProgress = function (value) {
                this.mText.text = value.toString();
            };
            return TextProgress;
        })(Progress);
        display.TextProgress = TextProgress;
    })(dc.display || (dc.display = {}));
    var display = dc.display;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (display) {
        var Event = dc.events.Event;

        /**
        *
        */
        var Alignment = (function () {
            function Alignment() {
            }
            Alignment.TOP = 1;
            Alignment.RIGHT = 2;
            Alignment.BOTTOM = 4;
            Alignment.LEFT = 8;
            Alignment.VERTICAL_CENTER = 0;
            Alignment.HORIZONTAL_CENTER = 0;
            Alignment.AUTO = 99;
            return Alignment;
        })();
        display.Alignment = Alignment;

        /**
        *
        */
        var ScaleMode = (function () {
            function ScaleMode() {
            }
            /**
            *
            * @param width
            * @param height
            * @param constraintW
            * @param constraintH
            * @param scaleMode
            * @param alignment
            * @return
            *
            */
            ScaleMode.getSize = function (width, height, constraintW, constraintH, scaleMode, alignment) {
                if (typeof scaleMode === "undefined") { scaleMode = "auto"; }
                if (typeof alignment === "undefined") { alignment = 0; }
                //trace("getSize",width,height,constraintW,constraintH);
                var w = constraintW;
                var h = constraintH;

                // Set the item width
                if (scaleMode == ScaleMode.STRETCH) {
                    w = constraintW;
                    h = constraintH;
                } else if (scaleMode == ScaleMode.AUTO_WIDTH) {
                    w = constraintW;
                    h = height * constraintW / width;
                } else if (scaleMode == ScaleMode.AUTO_HEIGHT) {
                    h = constraintH;
                    w = width * constraintH / height;
                } else if (scaleMode == ScaleMode.AUTO) {
                    //trace("index",index);
                    if (constraintH > constraintW) {
                        /*
                        ooo
                        o o
                        ooo
                        */
                        if (width < height) {
                            h = constraintH;
                            w = width * constraintH / height;
                            if (w > constraintW) {
                                w = constraintW;
                                h = height * constraintW / width;
                            }
                        } else {
                            w = constraintW;
                            h = height * constraintW / width;
                            if (h > constraintH) {
                                h = constraintH;
                                w = width * constraintH / height;
                            }
                        }
                    } else {
                        /*
                        ooooo
                        o   o
                        ooooo
                        */
                        if (width > height) {
                            w = constraintW;
                            h = height * constraintW / width;
                            if (h > constraintH) {
                                h = constraintH;
                                w = width * constraintH / height;
                            }
                        } else {
                            h = constraintH;
                            w = width * constraintH / height;
                            if (w > constraintW) {
                                w = constraintW;
                                h = height * constraintW / width;
                            }
                        }
                    }
                } else if (scaleMode == ScaleMode.AUTO_FILL) {
                    //trace("index",index);
                    if (constraintH > constraintW) {
                        /*
                        ooo
                        o o
                        ooo
                        */
                        h = constraintH;
                        w = width * constraintH / height;
                        if (w < constraintW) {
                            w = constraintW;
                            h = height * constraintW / width;
                        }
                    } else {
                        /*
                        ooooo
                        o   o
                        ooooo
                        */
                        w = constraintW;
                        h = height * constraintW / width;

                        //trace(w,h,constraintW,constraintH);
                        if (h < constraintH) {
                            h = constraintH;
                            w = width * constraintH / height;
                        }
                    }
                }

                var tx = (constraintW - w) / 2;
                var ty = (constraintH - h) / 2;

                //            console.log('scalemode:'+scaleMode+'w:'+w+'h:'+h);
                // Horizontal Alignments
                if (alignment & Alignment.LEFT) {
                    tx = 0;
                }
                if (alignment & Alignment.RIGHT) {
                    tx = constraintW - w;
                }

                // Vertical Alignments
                if (alignment & Alignment.TOP) {
                    ty = 0;
                }
                if (alignment & Alignment.BOTTOM) {
                    ty = (constraintH - h);
                }

                //            console.log('tx:'+tx+'ty:'+ty+'w:'+w+'h:'+h+'constraintW:'+constraintW+'constraintH'+constraintH);
                return {
                    x: tx,
                    y: ty,
                    width: w,
                    height: h
                };
            };
            ScaleMode.AUTO = "auto";
            ScaleMode.AUTO_WIDTH = "auto_width";
            ScaleMode.AUTO_HEIGHT = "auto_height";
            ScaleMode.STRETCH = "stretch";
            ScaleMode.CLIP = "clip";
            ScaleMode.AUTO_FILL = "auto_fill";
            return ScaleMode;
        })();
        display.ScaleMode = ScaleMode;

        /**
        *
        */
        var ImageView = (function (_super) {
            __extends(ImageView, _super);
            //  Constructor
            //  --------------------------------------------------------------------------------------------
            function ImageView(url, scaleMode) {
                if (typeof url === "undefined") { url = null; }
                if (typeof scaleMode === "undefined") { scaleMode = "auto"; }
                this.mURL = url;
                this.mScaleMode = scaleMode;

                _super.call(this, null);
            }
            ImageView.setup = function () {
                // For mobile
                //            if(dc.os.phone||dc.os.tablet||dc.os.android||dc.os.kindle){
                // Prevent image context menu in ios
                dc.display.View.DEFAULT_CSS.push('.dc-image {display:block;-webkit-user-select: none;-webkit-touch-callout: none;-khtml-user-select: none;-moz-user-select: none;-o-user-select: none;user-select: none}');
                //            } else {
                //                View.DEFAULT_CSS.push('.dc_image {display:block;}');
                //            }
            };

            Object.defineProperty(ImageView.prototype, "url", {
                //  Setter/Getter
                //  --------------------------------------------------------------------------------------------
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this.mURL;
                },
                set: function (value) {
                    if (this.url == value) {
                        // If same source, clean the src and load again
                        this.mImage.src = "";
                        this._load();
                    } else {
                        this.mURL = value;
                        this._load();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ImageView.prototype, "scaleMode", {
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this.mScaleMode;
                },
                set: function (value) {
                    if (this.scaleMode != value) {
                        this.scaleMode = value;
                        this._updateScale();
                    }
                },
                enumerable: true,
                configurable: true
            });

            //  Protected Methods
            //  --------------------------------------------------------------------------------------------
            /** @override */
            ImageView.prototype._createChildren = function () {
                /**
                *  The ImageView use a Image node instead
                *  of using backgroundImage style to avoid
                *  compatibility issue.
                */
                // Create a Image instance
                this.node = this.mImage = new Image();

                //            // Set Position style
                //            this.mImage.style.position='absolute';
                // Disable events
                this.mImage.ondragstart = this.mImage.oncontextmenu = dc.noevent;

                // Attach to the node
                //            this.node.appendChild(this.mImage);
                this.addClass('dc-image');

                this._load();
            };

            /** @override */
            ImageView.prototype.validate = function (force, cleanWidth, cleanHeight) {
                if (typeof force === "undefined") { force = false; }
                if (typeof cleanWidth === "undefined") { cleanWidth = false; }
                if (typeof cleanHeight === "undefined") { cleanHeight = false; }
                if (this.mNeedValidateSize)
                    this._updateScale();

                _super.prototype.validate.call(this, force, cleanWidth, cleanHeight);
            };

            //  Private Methods
            //  --------------------------------------------------------------------------------------------
            ImageView.prototype._load = function () {
                var self = this;

                // Set the image url
                if (this.mURL) {
                    this.mNeedUpdateSize = true;
                    this.mImage.onload = function () {
                        self.mImage.onload = null;

                        //                    self.node.style.backgroundImage="url("+self.url+")";
                        self._updateScale();
                        self.dispatchEventWith(Event.COMPLETE);
                        self.dispatchEventWith(Event.UPDATE);
                    };
                    this.mImage.src = this.mURL;
                }
            };

            /**
            *
            * @private
            */
            ImageView.prototype._updateScale = function () {
                // Check if zero width/height
                if (this.mImage.width | this.mImage.height) {
                    if (this.mNeedUpdateSize) {
                        // Check the original width/height
                        if (dc.browser.ie && parseFloat(dc.browser.version) < 9) {
                            var img = new Image();
                            img.src = this.mImage.src;
                            this.orgWidth = img.width;
                            this.orgHeight = img.height;
                        } else {
                            this.orgWidth = this.mImage.naturalWidth;
                            this.orgHeight = this.mImage.naturalHeight;
                        }
                    } else {
                        // Apply the size
                        this.mImage.style.width = this.size.innerWidth + 'px';
                        this.mImage.style.height = this.size.innerHeight + 'px';
                    }
                }
            };
            return ImageView;
        })(dc.display.View);
        display.ImageView = ImageView;
    })(dc.display || (dc.display = {}));
    var display = dc.display;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (display) {
        var Event = dc.events.Event;
        var text = dc.text;

        /**
        * Button
        */
        var Button = (function (_super) {
            __extends(Button, _super);
            //  Constructor
            //  --------------------------------------------------------------------------------------------
            function Button(text) {
                if (typeof text === "undefined") { text = "button"; }
                _super.call(this, text);
            }
            // Settings
            // --------------------------------------------------------------------------------------------
            Button.setup = function () {
                dc.display.View.DEFAULT_CSS.push(".dc-button{background-color:#EEE;color:#000;padding:5px 10px;display:inline;-webkit-user-select: none;-webkit-touch-callout: none;-khtml-user-select: none;-moz-user-select: none;-o-user-select: none;user-select: none}");
            };

            // Override Protected Methods
            // --------------------------------------------------------------------------------------------
            /** @override */
            Button.prototype._createChildren = function () {
                this.name = 'button';
                _super.prototype._createChildren.call(this);

                this.addClass('dc-button');
                this.interactive = true;
            };

            /** @override */
            Button.prototype._addEvents = function () {
                _super.prototype._addEvents.call(this);

                if (dc.os.phone || dc.os.tablet) {
                } else {
                    var self = this;
                    dc.bind(this.node, 'mousedown', function (e) {
                        self.addClass('down');
                    });
                    dc.bind(this.node, 'mouseover', function (e) {
                        self.addClass('over');
                    });
                    dc.bind(this.node, 'mouseout', function (e) {
                        self.removeClass('over');
                    });
                    dc.bind(window, 'mouseup', function (e) {
                        self.removeClass('down');
                    });
                }
            };

            /** @override */
            Button.prototype._removeEvents = function () {
                _super.prototype._removeEvents.call(this);
                // TODO: check if problem for removing the events
            };
            return Button;
        })(text.TextField);
        display.Button = Button;
    })(dc.display || (dc.display = {}));
    var display = dc.display;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (display) {
        /**
        * ModalContainer Class
        *
        */
        var Modal = (function (_super) {
            __extends(Modal, _super);
            function Modal() {
                _super.apply(this, arguments);
                // Public Var
                // --------------------------------------------------------------------------------------------
                /**
                *
                */
                this.opened = false;
            }
            // Settings
            // --------------------------------------------------------------------------------------------
            Modal.setup = function () {
                dc.display.View.DEFAULT_CSS.push(".dc-ui.dc-modal.fixed{z-index:90000;position:fixed;background-color:rgba(0, 0, 0, 0.7);bottom:0;left:0;right:0;top:0}" + ".dc-ui.dc-modal.absolute{z-index:90000;position:absolute;background-color:rgba(0, 0, 0, 0.7);bottom:0;left:0;right:0;top:0}" + ".dc-modal-container{}");
            };

            Object.defineProperty(Modal.prototype, "data", {
                // Getter/Setter
                // --------------------------------------------------------------------------------------------
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this.mData;
                },
                set: function (value) {
                    //            if(this.mData!=value){
                    this.mData = value;
                    this._validateData(value);
                    //            }
                },
                enumerable: true,
                configurable: true
            });

            // Override Protected Methods
            // --------------------------------------------------------------------------------------------
            /** @override */
            Modal.prototype._createNode = function () {
                // Reuse background node
                if (Modal.backgroundNode) {
                    this.node = Modal.backgroundNode;
                } else {
                    _super.prototype._createNode.call(this);
                    Modal.backgroundNode = this.node;
                }
            };

            /** @override */
            Modal.prototype._createChildren = function () {
                _super.prototype._createChildren.call(this);

                // check if already create the container
                if (this.modalContainer == undefined) {
                    // Create the container
                    this.modalContainer = new dc.display.View();
                    this.modalContainer.transform = new dc.core.Transform();
                }

                // Change the container node
                this.mContainer = this.modalContainer.node;

                // Add style
                this.modalContainer.addClass('dc-modal-container');
                this.addClass('dc-modal root');

                // Add Children
                this.node.appendChild(this.modalContainer.node);
            };

            // Protected Methods
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @param data
            * @private
            */
            Modal.prototype._validateData = function (data) {
            };

            /**
            *
            * @private
            */
            Modal.prototype._prepare = function () {
                // Check if the background already attached
                if (Modal.backgroundNode.parentElement == undefined) {
                    this.attachTo(this.mTarget);
                } else {
                    // if the target is different
                    if (Modal.backgroundNode.parentElement != this.mTarget) {
                        this.attachTo(this.mTarget);
                    }
                }

                // Show the background
                this.visible = true;

                // Hide the modal content
                this.modalContainer.visible = false;
            };

            /**
            *
            * @private
            */
            Modal.prototype._present = function () {
                // Set visible
                this.modalContainer.visible = true;

                //            this.mProgress.visible=false;
                //            this.progress(false,100);
                // Set the modal container size
                this.modalContainer.setSize(this.modalWidth, this.modalHeight);
                this.modalContainer.validateSize();

                this._open();
            };

            /**
            *
            * @private
            */
            Modal.prototype._position = function (w, h) {
                // Resize and position
                var targetX = (this.size.innerWidth - w) / 2;
                var targetY = (this.size.innerHeight - h) / 2;

                this.modalContainer.x = targetX;
                this.modalContainer.y = targetY;
                this.modalContainer.validatePosition();
            };

            /**
            *
            * @private
            */
            Modal.prototype._open = function () {
                // Resize and position
                this._position(this.modalContainer.width, this.modalContainer.height);

                // indicate it is opened
                this.opened = true;
            };

            /**
            *
            * @private
            */
            Modal.prototype._close = function () {
                // Hide modal
                if (Modal.backgroundNode.parentElement != undefined) {
                    this.modalContainer.visible = false;
                    this.visible = false;
                    this.opened = false;
                }
            };

            // Public Methods
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @param target
            */
            Modal.prototype.show = function (target) {
                if (typeof target === "undefined") { target = null; }
                // Set target
                this.mTarget = target ? target : document.body;

                // Add no scroll to body
                dc.addClass(this.mTarget, "noscroll");

                // Fixed/absolute
                if (this.mTarget == document.body) {
                    this.node.style.top = '';
                    this.addClass('fixed');
                } else {
                    this.addClass('absolute');
                }

                var self = this;

                //            if(this.mTarget==document.body){
                // Add event for window resize if it is document body
                this.mResizeCallback = function () {
                    // Calculate the modal current size
                    self.validate(true, true, true);

                    // Set position
                    self._position(self.modalContainer.width, self.modalContainer.height);
                };
                dc.bind(window, 'resize', this.mResizeCallback);

                //            }
                // Add event for click the background and close
                this.mCloseCallback = function (e) {
                    if (e.target == self.node)
                        self.close();
                };
                if (dc.os.mobile)
                    dc.bind(this.node, 'touchend', this.mCloseCallback);
                else
                    dc.bind(this.node, 'click', this.mCloseCallback);

                // Prepare
                this._prepare();

                // Calculate the modal current size
                if (this.mTarget == document.body)
                    self.validateSize(true, true);
                else
                    self.setSize(this.mTarget.clientWidth, this.mTarget.clientHeight, true);

                // Present the modal
                this._present();
            };

            /**
            *
            */
            Modal.prototype.close = function () {
                // Unbind resize events
                dc.unbind(window, 'resize', this.mResizeCallback);

                // Remove class
                dc.removeClass(this.mTarget, "noscroll");
                this.removeClass('absolute');
                this.removeClass('fixed');

                //Unbind click event
                if (dc.os.mobile)
                    dc.unbind(this.node, 'touchend', this.mCloseCallback);
                else
                    dc.unbind(this.node, 'click', this.mCloseCallback);

                this._close();
            };
            return Modal;
        })(dc.display.ViewContainer);
        display.Modal = Modal;
    })(dc.display || (dc.display = {}));
    var display = dc.display;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (display) {
        var data = dc.data;
        var core = dc.core;
        var layout = dc.layout;

        

        /**
        *
        */
        var DefaultViewRenderer = (function (_super) {
            __extends(DefaultViewRenderer, _super);
            function DefaultViewRenderer() {
                _super.apply(this, arguments);
                this.status = 0;
                this.mSelected = false;
            }
            Object.defineProperty(DefaultViewRenderer.prototype, "data", {
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this.mData;
                },
                set: function (value) {
                    this.mData = value;
                    this._validateData(value.data);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DefaultViewRenderer.prototype, "selected", {
                /**
                *
                * @returns {boolean}
                */
                get: function () {
                    return this.mSelected;
                },
                set: function (value) {
                    if (this.mSelected != value) {
                        this.mSelected = value;
                        this._validateSelection(value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            /**
            *
            * @param data
            * @private
            */
            DefaultViewRenderer.prototype._validateData = function (data) {
            };

            /**
            *
            * @param selected
            * @private
            */
            DefaultViewRenderer.prototype._validateSelection = function (selected) {
            };
            return DefaultViewRenderer;
        })(dc.display.View);
        display.DefaultViewRenderer = DefaultViewRenderer;

        /**
        *
        */
        var DefaultViewContainerRenderer = (function (_super) {
            __extends(DefaultViewContainerRenderer, _super);
            function DefaultViewContainerRenderer() {
                _super.apply(this, arguments);
                this.status = 0;
                this.mSelected = false;
            }
            Object.defineProperty(DefaultViewContainerRenderer.prototype, "data", {
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this.mData;
                },
                set: function (value) {
                    this.mData = value;
                    this._validateData(value.data);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DefaultViewContainerRenderer.prototype, "selected", {
                /**
                *
                * @returns {boolean}
                */
                get: function () {
                    return this.mSelected;
                },
                set: function (value) {
                    if (this.mSelected != value) {
                        this.mSelected = value;
                        this._validateSelection(value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            /**
            *
            * @param data
            * @private
            */
            DefaultViewContainerRenderer.prototype._validateData = function (data) {
            };

            /**
            *
            * @param selected
            * @private
            */
            DefaultViewContainerRenderer.prototype._validateSelection = function (selected) {
            };
            return DefaultViewContainerRenderer;
        })(dc.display.ViewContainer);
        display.DefaultViewContainerRenderer = DefaultViewContainerRenderer;

        /**
        *
        */
        var DefaultImageRenderer = (function (_super) {
            __extends(DefaultImageRenderer, _super);
            function DefaultImageRenderer(name) {
                _super.call(this, name);
                this.name = name;
                //            this.padding.left=this.padding.right=this.padding.top=this.padding.bottom=2;
            }
            Object.defineProperty(DefaultImageRenderer.prototype, "data", {
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this.mData;
                },
                set: function (value) {
                    if (this.mData != value) {
                        this.mData = value;
                        this._validateData(value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            /**
            *
            * @param data
            * @private
            */
            DefaultImageRenderer.prototype._validateData = function (data) {
                //            console.log(data,data.source);
                if (data && data.thumbnail) {
                    this.url = data.thumbnail;
                }
            };
            return DefaultImageRenderer;
        })(dc.display.ImageView);
        display.DefaultImageRenderer = DefaultImageRenderer;

        /************************************************************************************************
        *
        * List
        *
        ************************************************************************************************/
        /**
        *
        */
        var List = (function (_super) {
            __extends(List, _super);
            function List() {
                _super.apply(this, arguments);
                /**
                *
                */
                this.defaultSelectedItemIndex = -1;
                /**
                *
                */
                this.animationDuration = 300;
                this.mLayoutLock = false;
                this.mSelectable = true;
                this.mWaitingUpdateItem = 0;
            }
            Object.defineProperty(List.prototype, "dataProvider", {
                //  Setter/Getter
                //  --------------------------------------------------------------------------------------------
                /**
                * dataProvider
                * @returns {string}
                */
                get: function () {
                    return this.mDataProvider;
                },
                set: function (value) {
                    if (this.mDataProvider != value) {
                        this.mDataProvider = value;
                        this._validateData();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(List.prototype, "waitingUpdateItem", {
                get: function () {
                    return this.mWaitingUpdateItem;
                },
                set: function (value) {
                    this.mWaitingUpdateItem = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(List.prototype, "selectedItem", {
                /**
                * selectedItem
                * @returns {*}
                */
                get: function () {
                    return this.mSelectedItem;
                },
                set: function (value) {
                    if (this.selectedItem != value) {
                        if (value && value.index != undefined)
                            this._updateSelection(value.index);
                        else
                            this._updateSelection(-1);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(List.prototype, "selectedIndex", {
                /**
                * selectedIndex
                * @returns {number}
                */
                get: function () {
                    return this.mSelectedIndex;
                },
                set: function (value) {
                    if (this.mSelectedIndex != value) {
                        this._updateSelection(value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(List.prototype, "selectable", {
                /**
                * selectable
                * @returns {number}
                */
                get: function () {
                    return this.mSelectable;
                },
                set: function (value) {
                    if (this.mSelectable != value) {
                        this.mSelectable = value;
                        this._updateSelection();
                    }
                },
                enumerable: true,
                configurable: true
            });

            //  Protected Method
            //  --------------------------------------------------------------------------------------------
            /**
            *
            * @returns {IItemRenderer}
            * @private
            */
            List.prototype._createItemRenderer = function () {
                // Create the view
                var view = new this.itemRenderer();

                // Listener
                view.addEventListener(dc.events.Event.TRIGGERED, this._handleItemTriggeredEvent, this);

                // Apply properties
                view.properties = this.defaultItemProperties;

                return view;
            };

            /**
            *
            * @private
            */
            List.prototype._updateSelection = function (index) {
                if (typeof index === "undefined") { index = -1; }
                //
                if (this.mSelectable && index >= 0 && index < this.mDataProvider.length) {
                    var self = this;

                    // Set value
                    this.mSelectedIndex = index;
                    this.mSelectedItem = this.mDataProvider.getItemAt(this.mSelectedIndex);

                    // Loop
                    this.forEach(function (k, v) {
                        // Check if the data is selected data
                        if (v.data == self.mSelectedItem) {
                            // if not already selected
                            if (v.selected == undefined || v.selected == false) {
                                v.selected = true;
                                self.dispatchEventWith(dc.events.Event.SELECT, false, v.data);
                            }
                        } else {
                            // deselect
                            v.selected = false;
                        }
                    });
                } else {
                    this.forEach(function (k, v) {
                        v.selected = false;
                    });

                    this.mSelectedItem = null;
                    this.mSelectedIndex = -1;
                }
            };

            /**
            *
            * @private
            */
            List.prototype._validateData = function () {
                // Set the default selected item
                if (this.mDataProvider) {
                    // Limit default selected index
                    if (this.defaultSelectedItemIndex >= 0) {
                        if (this.defaultSelectedItemIndex >= this.mDataProvider.length)
                            this.defaultSelectedItemIndex = this.mDataProvider.length - 1;
                        this.selectedIndex = this.defaultSelectedItemIndex;
                    }
                }
            };

            /**
            *
            * @param animated
            * @param start
            * @param end
            * @private
            */
            List.prototype._validateLayout = function (animated, start, end) {
                if (typeof animated === "undefined") { animated = 0; }
                if (typeof start === "undefined") { start = 0; }
                if (typeof end === "undefined") { end = -1; }
                if (this.layout) {
                    if (this.mLayoutLock == true)
                        return;

                    // lock to prevent
                    this.mLayoutLock = true;

                    var self = this;

                    // Calculate the start/end position
                    if (end == -1)
                        end = this.numChildren - 1;

                    for (var i = start; i <= end; i++) {
                        var view = this.getChildAt(i);
                        var item = this.layout.getItem(view.id);
                        var v = view.visible;

                        view['extraWidth'] = 0;

                        // Check if dirty
                        if (view.status < 2) {
                            // Set the w/h
                            view.width = item.width;
                            view.height = item.height;

                            // Set to visible in order to calculate size
                            view.visible = true;

                            // Try to validate the size
                            view.validateSize();

                            // Set back the visibility
                            view.visible = v;

                            // Record the new size
                            item.width = view.width;
                            item.height = view.height;
                        }
                    }

                    // Do layout
                    this.layout.layout();

                    for (var i = start; i <= end; i++) {
                        var view = this.getChildAt(i);
                        var item = self.layout.getItem(view.id);

                        // Check if item position dirty
                        if (item.dirty) {
                            if (isFinite(item.extraWidth)) {
                                // Set the extra width
                                view['extraWidth'] = item.width + item.extraWidth;

                                // Try to validate the size
                                view.validateSize();
                            }

                            // Check if need animated
                            if (animated > 0) {
                                var properties = {
                                    x: item.x,
                                    y: item.y
                                };

                                // Check visiblity change
                                if (item.visible != view.visible) {
                                    if (item.visible) {
                                        view.visible = true;
                                        view.data = self.dataProvider.getItemAt(i);
                                        view.alpha = 1; //set alpha=1 to remove any alpha
                                    } else {
                                        view.visible = false;
                                    }
                                }

                                // Do animation or set position directly
                                if (view.visible == true)
                                    core.Transition.to(view, animated, properties);
                                else {
                                    // Set the size
                                    view.x = item.x;
                                    view.y = item.y;
                                    view.validatePosition();
                                }
                            } else {
                                // kill animation
                                core.Transition.kill(view);

                                // Set the size
                                view.x = item.x;
                                view.y = item.y;
                                view.validatePosition();

                                // fade in
                                if (view.status == 2) {
                                    view.alpha = 1; //set alpha=1 to remove any alpha
                                    view.visible = true;
                                }
                            }

                            item.dirty = false;
                        }
                    }

                    // Force resize
                    this.setSize(this.layout.width, this.layout.height, true);

                    //
                    this.dispatchEventWith(dc.events.Event.RESIZE);

                    //
                    this.mLayoutLock = false;
                }
            };

            //  Override Method
            //  --------------------------------------------------------------------------------------------
            /** @override */
            List.prototype.validate = function (force, cleanWidth, cleanHeight) {
                if (typeof force === "undefined") { force = false; }
                if (typeof cleanWidth === "undefined") { cleanWidth = false; }
                if (typeof cleanHeight === "undefined") { cleanHeight = false; }
                if (this.layout) {
                    this.layout.width = this.width;
                    this.layout.height = this.height;
                    this.layout.resetLayout();
                    this._validateLayout(this.animationDuration);
                    _super.prototype.validateSize.call(this);
                } else {
                    _super.prototype.validate.call(this, force, cleanWidth, cleanHeight);
                }
            };

            //  Protected Method
            //  --------------------------------------------------------------------------------------------
            /**
            *
            * @param e
            * @private
            */
            List.prototype._handleItemTriggeredEvent = function (e) {
                this.mSelectedItem = e.target.data;
                this.mSelectedIndex = e.target.data.index; //this.mDataProvider.getItemIndex(e.target.data);
                this.dispatchEventWith(dc.events.Event.SELECT, false, this.mSelectedItem);
            };

            /**
            *
            * @param e
            * @private
            */
            List.prototype._handleItemRendererUpdate = function (e) {
                if (this.layout) {
                    var view = e.target;

                    if (view) {
                        this.mWaitingUpdateItem--;

                        // Remove update event
                        view.removeEventListener(dc.events.Event.UPDATE, this._handleItemRendererUpdate);

                        // Update the position of the view
                        this.layout.updateItem(view.id, {
                            width: view.width, height: view.height
                        });

                        // Reset layout parameter
                        this.layout.resetLayout();

                        // validate layout
                        this._validateLayout(0); //,0,view.data.index);//view.data.index

                        // Fire ready events if all loaded
                        if (this.mWaitingUpdateItem == 0)
                            this.dispatchEventWith(dc.events.Event.READY);
                    }
                }
            };

            //  Public Method
            //  --------------------------------------------------------------------------------------------
            /**
            *
            * @param filters
            */
            List.prototype.filter = function (filters) {
                if (typeof filters === "undefined") { filters = null; }
                if (filters) {
                    var self = this;

                    // Loop the collection
                    this.forEach(function (index, view) {
                        if (view.data) {
                            // Get layout item
                            var item = self.layout.getItem(view.id);
                            var visible = false;

                            for (var key in filters)
                                if (view.data.data[key] == filters[key])
                                    visible = true;

                            item.visible = visible;
                            item.dirty = true;
                        }
                    });
                } else {
                    this.layout.setAllVisible(true);
                }

                // TODO: rewrite validate layout to 2 steps
                // Step 1: Hiding the objects which visile = false
                // Step 2: Show the object which visible = ture
                // Step 3: Move the object
                this._validateLayout(this.animationDuration);
            };

            /**
            *
            */
            List.prototype.validateItemRenderer = function () {
                this.forEach(function (index, view) {
                    view.status = 1;

                    // Reassign to apply the property
                    view.data = view.data;
                });
            };

            List.prototype.setItemProperty = function (property, value, validate) {
                if (typeof validate === "undefined") { validate = false; }
                this.forEach(function (index, view) {
                    // Reassign to apply the property
                    view[property] = value;
                });
            };

            /**
            *
            */
            List.prototype.refresh = function () {
                this.validate();
            };

            /**
            *
            */
            List.prototype.unload = function () {
                this.removeAllChildren();
                this.mDataProvider = null;
                this.mWaitingUpdateItem = 0;
                this.mSelectedIndex = -1;
                this.mSelectedItem = null;
                this.setSize(this.width, 10, true);
            };
            return List;
        })(dc.display.ViewContainer);
        display.List = List;

        /************************************************************************************************
        *
        * ScrollList
        *
        ************************************************************************************************/
        /**
        *
        */
        var ScrollList = (function (_super) {
            __extends(ScrollList, _super);
            function ScrollList() {
                _super.apply(this, arguments);
                /**
                *
                */
                this.buffer = 20;
            }
            //  Public Method
            //  --------------------------------------------------------------------------------------------
            ScrollList.prototype.checkVisibility = function () {
                // TODO: Rewrite check visibility
                var self = this;
                var upperLimit = this.parent.node.scrollTop;
                var lowerLimit = upperLimit + this.parent.size.innerHeight;

                // Loop each children
                this.forEach(function (index, view) {
                    // get layout data
                    var item = self.layout.getItem(view.id);

                    if (view.status == 1)
                        return;

                    // Check if it is visible
                    if (view.visible == false) {
                        // Check if it is within range
                        if (item.y <= lowerLimit && item.y + item.height >= upperLimit) {
                            if (item.visible == true) {
                                //
                                if (view.status == 2) {
                                    view.visible = true;
                                } else {
                                    view.visible = true;

                                    // Assign the data
                                    view.data = self.dataProvider.getItemAt(index);
                                }
                            } else {
                                view.visible = false;
                            }
                        }
                    } else {
                        if (item.y > lowerLimit || item.y + item.height <= upperLimit || item.visible == false) {
                            if (view.status < 2)
                                core.Transition.kill(view);
                            view.visible = false;
                        }
                    }
                });
            };

            //  Protected Method
            //  --------------------------------------------------------------------------------------------
            /**
            *
            * @private
            */
            ScrollList.prototype._validateData = function () {
                if (this.dataProvider) {
                    var self = this;
                    var children = [];

                    // Layout children
                    if (this.layout) {
                        // Reset layout parameter
                        this.layout.resetLayout();

                        // Set end of data
                        var start = this.numChildren;
                        var end = start + this.buffer;

                        end = ((end == 0 || end > this.dataProvider.length) ? this.dataProvider.length : end) - 1;

                        //                    console.log('_validateData',this.dataProvider.length,this.children.length,end,this.buffer)
                        // If all loaded, stop!
                        if (this.children.length >= end)
                            return;

                        for (var i = start; i <= end; i++) {
                            // Get the data
                            var data = this.dataProvider.getItemAt(i);

                            // Set pre-defined size
                            var d = {};
                            var s;
                            if (data.data.width && data.data.height)
                                s = this.layout.getItemSize(data.data.width, data.data.height);
                            else
                                s = this.layout.getItemSize(30, 30);
                            d['width'] = s.w;
                            d['height'] = s.h;

                            // Create the itemRenderer
                            var view = self._createItemRenderer();
                            view.transform = new core.Transform();
                            view.transform.useTransform = true;
                            view.floating = true;

                            // Add to the layout
                            self.layout.addItem(view.id, d);

                            //
                            children.push(view);
                        }

                        // Batch add children
                        this.addChildren(children);

                        for (var i = start; i <= end; i++) {
                            // get view
                            var view = this.children[i];

                            // get layout data
                            var item = this.layout.getItem(view.id);

                            // Add Events
                            view.addEventListener(dc.events.Event.UPDATE, this._handleItemRendererUpdate, this);
                            this.waitingUpdateItem++;

                            // Check visible
                            if (item.y > this.height)
                                view.visible = false;

                            // Assign the data
                            view.data = this.dataProvider.getItemAt(i);
                        }

                        // validate the layout
                        this._validateLayout(0, start, end);
                    } else {
                        // Loop the collection
                        this.dataProvider.forEach(function (index, data, length) {
                            // Create the itemRenderer
                            var view = self._createItemRenderer();

                            //
                            children.push(view);

                            // assign data
                            view.data = data;
                        });

                        // Batch add children
                        this.addChildren(children);
                    }

                    // Cleanup
                    children = null;
                }
            };

            /**
            *
            */
            ScrollList.prototype.refresh = function () {
                this._validateData();
            };
            return ScrollList;
        })(List);
        display.ScrollList = ScrollList;

        /************************************************************************************************
        *
        * NavigatorList
        *
        ************************************************************************************************/
        var NavigatorList = (function (_super) {
            __extends(NavigatorList, _super);
            function NavigatorList() {
                _super.apply(this, arguments);
                //  Public var
                //  --------------------------------------------------------------------------------------------
                this.defaultPosition = 0;
                //  Private var
                //  --------------------------------------------------------------------------------------------
                this.mPosition = 0;
                this.mVisibleItemCount = 1;
            }
            Object.defineProperty(NavigatorList.prototype, "position", {
                //  Setter/Getter
                //  --------------------------------------------------------------------------------------------
                /**
                *
                * @returns {number}
                */
                get: function () {
                    return this.mPosition;
                },
                set: function (value) {
                    if (this.mPosition != value) {
                        this.mPosition = value;
                        this.goto(value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            //  Override
            //  --------------------------------------------------------------------------------------------
            /** @override */
            NavigatorList.prototype._validateData = function () {
                _super.prototype._validateData.call(this);

                if (this.dataProvider) {
                    // Limit default position
                    if (this.defaultPosition < 0)
                        this.defaultPosition = 0;
                    else if (this.defaultPosition >= this.dataProvider.length)
                        this.defaultPosition = this.dataProvider.length - 1;

                    // Set default position
                    this.mPosition = this.defaultPosition;

                    // Create temp array for batch addChild
                    var childs = [];

                    for (var i = 0; i < this.mVisibleItemCount; i++) {
                        // Create item
                        var view = this._createItemRenderer();

                        // Set pre-defined size
                        var d = { width: 50, height: 50 };

                        //                    if(item.data.width&&item.data.height){
                        //                        var s:{w:number;h:number}=this.layout.getItemSize(item.data.width,item.data.height);
                        //                        d['width']=s.w;
                        //                        d['height']=s.h;
                        //                    }
                        if (this.layout) {
                            view.transform = new core.Transform();
                            view.transform.useTransform = true;
                            view.alpha = 0;

                            // Add to the layout
                            this.layout.addItem(view.id, d);
                        }

                        childs.push(view);
                    }

                    // Add the item to screen
                    this.addChildren(childs);

                    // Update item renderer
                    this._updatePosition();
                }
            };

            //  Private methods
            //  --------------------------------------------------------------------------------------------
            /**
            *
            * @private
            */
            NavigatorList.prototype._updatePosition = function () {
                var self = this;
                var itemIndex = this.mPosition;

                this.forEach(function (index, view) {
                    var data = self.dataProvider.getItemAt(itemIndex);

                    if (data) {
                        // Add Events
                        view.addEventListener(dc.events.Event.UPDATE, self._handleItemRendererUpdate, this);

                        this.mWaitingUpdateItem++;

                        // Assign data
                        view.data = data;

                        // visible
                        view.visible = true;
                    } else {
                        view.visible = false;
                    }

                    itemIndex++;
                });

                // Do layout if layout exist
                if (this.layout) {
                    // Reset layout parameter
                    this.layout.resetLayout();

                    // validate layout
                    this._validateLayout(this.animationDuration);
                }
            };

            //  Public Methods
            //  --------------------------------------------------------------------------------------------
            /**
            * Goto next position
            */
            NavigatorList.prototype.next = function () {
                var index = this.mPosition + this.mVisibleItemCount;
                this.goto(index);
            };

            /**
            * Goto prev position
            */
            NavigatorList.prototype.prev = function () {
                var index = this.mPosition - this.mVisibleItemCount;
                this.goto(index);
            };

            /**
            * Goto position
            * @param index
            */
            NavigatorList.prototype.goto = function (index) {
                if (this.dataProvider && index >= 0 && index < this.dataProvider.length) {
                    this.mPosition = index;
                    this._updatePosition();
                }
            };
            return NavigatorList;
        })(List);
        display.NavigatorList = NavigatorList;
    })(dc.display || (dc.display = {}));
    var display = dc.display;
})(dc || (dc = {}));
