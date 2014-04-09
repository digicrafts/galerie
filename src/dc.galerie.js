
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dc;
(function (dc) {
    (function (components) {
        var display = dc.display;
        var text = dc.text;
        var core = dc.core;

        /**
        *
        */
        var ImageDetailModal = (function (_super) {
            __extends(ImageDetailModal, _super);
            function ImageDetailModal() {
                _super.apply(this, arguments);
                this.imageDataName = "source";
                this.titleDataName = "title";
                this.descDataName = "description";
                this.tagsDataName = "category";
            }
            // Override Protected Methods
            // --------------------------------------------------------------------------------------------
            /** @override */
            ImageDetailModal.prototype._createChildren = function () {
                _super.prototype._createChildren.call(this);

                // Create
                this.mImage = new display.ImageView();
                this.mContent = new display.ViewContainer();
                this.mTitle = new text.TextField();
                this.mDescription = new text.TextField();

                // Add to screen
                this.addChild(this.mImage);
                this.mContent.addChild(this.mTitle);
                this.mContent.addChild(this.mDescription);
                this.addChild(this.mContent);

                // Set styles
                this.mContent.addClass('content');
                this.mTitle.addClass('title');
                this.mDescription.addClass('description');
            };

            ImageDetailModal.prototype._present = function () {
                // Avoid default present action
            };

            // Handler
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @param e
            * @private
            */
            ImageDetailModal.prototype._handleImageTrigger = function (e) {
                this.close();
            };

            /**
            *
            * @param e
            * @private
            */
            ImageDetailModal.prototype._handleImageUpdate = function (e) {
                // Remove event
                this.mImage.removeEventListener(dc.events.Event.UPDATE, this._handleImageUpdate);

                // Calculate aspect ratio
                var r = this.mImage.orgWidth / this.mImage.orgHeight;
                var w = 0, h = 0;

                // Get height of content
                if (this.mImage.orgWidth > this.mImage.orgHeight) {
                    if (this.mImage.orgWidth > this.modalWidth) {
                        w = this.modalWidth;
                    } else {
                        w = this.mImage.orgWidth;
                    }

                    h = w / r;

                    this.modalWidth = w;
                    this.modalHeight = 0;
                } else {
                    if (this.mImage.orgHeight > this.modalHeight) {
                        h = this.modalHeight;
                    } else {
                        h = this.mImage.orgHeight;
                    }

                    w = h * r;

                    if (w > this.modalWidth) {
                        w = this.modalWidth;
                        h = w / r;
                    }

                    this.modalWidth = w;
                    this.modalHeight = 0;
                }

                this.mImage.setSize(w, h);
                this.mImage.validate();
                this.modalContainer.alpha = 0;

                _super.prototype._present.call(this);

                var targetY = this.modalContainer.y;

                core.Transition.fromTo(this.modalContainer, 500, { y: this.height + 10 }, {
                    y: targetY, alpha: 1, ease: core.Ease.easeOutBack
                });
                //            this.mModalContainer.fadeIn();
            };

            // Public
            // --------------------------------------------------------------------------------------------
            ImageDetailModal.prototype._validateData = function (data) {
                if (data[this.titleDataName]) {
                    this.mTitle.visible = true;
                    this.mTitle.text = data[this.titleDataName];
                } else {
                    this.mTitle.visible = false;
                }
                if (data[this.descDataName]) {
                    this.mDescription.visible = true;
                    this.mDescription.text = data[this.descDataName];
                } else {
                    this.mDescription.visible = false;
                }

                this.mContent.visible = (this.mTitle.visible || this.mDescription.visible);

                if (data[this.imageDataName]) {
                    this.mImage.addEventListener(dc.events.Event.UPDATE, this._handleImageUpdate, this);
                    this.mImage.url = data[this.imageDataName];
                }
            };
            return ImageDetailModal;
        })(display.Modal);
        components.ImageDetailModal = ImageDetailModal;
    })(dc.components || (dc.components = {}));
    var components = dc.components;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (components) {
        var display = dc.display;
        var text = dc.text;
        var core = dc.core;

        /**
        *
        */
        var ImageNavigatorModal = (function (_super) {
            __extends(ImageNavigatorModal, _super);
            function ImageNavigatorModal() {
                _super.apply(this, arguments);
                this.animationDuration = 200;
            }
            // Override Protected Methods
            // --------------------------------------------------------------------------------------------
            /** @override */
            ImageNavigatorModal.prototype._createChildren = function () {
                _super.prototype._createChildren.call(this);

                // Create navigator list
                this.mList = new display.NavigatorList();
                this.mList.floating = true;
                this.mList.itemRenderer = dc.components.renderers.ImageDetailRenderer;

                // Create buttons
                this.mPrevButton = new display.Button('');
                this.mNextButton = new display.Button('');
                this.mCloseButton = new display.Button('');

                // Add to screen
                this.addChild(this.mList);
                this.addChild(this.mPrevButton);
                this.addChild(this.mNextButton);
                this.addChild(this.mCloseButton);

                // Add transform to controls container
                this.modalContainer.transform = new core.Transform();
                this.modalContainer.transform.useTransform = true;

                // Set styles
                this.modalContainer.clipping = true;
                this.modalContainer.floating = true;
                this.mCloseButton.floating = this.mPrevButton.floating = this.mNextButton.floating = true;
                this.mPrevButton.addClass('prev');
                this.mNextButton.addClass('next');
                this.mCloseButton.addClass('close');
                this.modalContainer.addClass('image_detail');

                // Events
                this.mPrevButton.addEventListener(dc.events.Event.TRIGGERED, this.handleButtonTriggered, this);
                this.mNextButton.addEventListener(dc.events.Event.TRIGGERED, this.handleButtonTriggered, this);
                this.mCloseButton.addEventListener(dc.events.Event.TRIGGERED, this.handleButtonTriggered, this);

                //            this.modalContainer.addEventListener(events.Event.TRIGGERED,this.handleButtonTriggered,this);
                this.mList.addEventListener(dc.events.Event.UPDATE, this.handleUpdate, this);
            };

            /** @override */
            ImageNavigatorModal.prototype._prepare = function () {
                // Set the size of list
                this.mList.width = this.size.innerWidth;
                this.mList.height = this.size.innerHeight;

                _super.prototype._prepare.call(this);
            };

            /** @override */
            ImageNavigatorModal.prototype._present = function () {
                // Prevent the default present
            };

            /** @override */
            ImageNavigatorModal.prototype._validateData = function (data) {
                // Prevent the default validate data
            };

            /** @override */
            ImageNavigatorModal.prototype._open = function () {
                // Remove progress
                this.removeClass('dc-progress');

                var self = this;

                // Calculate target position
                var targetX = (this.size.innerWidth - this.modalContainer.width) / 2;
                var targetY = (this.size.innerHeight - this.modalContainer.height) / 2;
                var initX = this.modalContainer.x > 0 ? -this.size.innerWidth : this.size.innerWidth;

                // Event handler
                function oncomplete() {
                    if (self.mList.position <= 0) {
                        self.mPrevButton.visible = false;
                    } else if (self.mList.position >= self.mList.dataProvider.length - 1) {
                        self.mNextButton.visible = false;
                    } else {
                        self.mPrevButton.visible = true;
                        self.mNextButton.visible = true;
                    }
                }

                core.Transition.fromTo(this.modalContainer, this.animationDuration, {
                    x: initX, y: targetY
                }, {
                    x: targetX, y: targetY, oncomplete: oncomplete
                });

                this.opened = true;
            };

            // Private Methods
            // --------------------------------------------------------------------------------------------
            ImageNavigatorModal.prototype._next = function (next) {
                if (typeof next === "undefined") { next = true; }
                var self = this;
                var targetX = next ? -this.width : this.width;

                // Add progress
                this.addClass('dc-progress');

                // Reset the size of the list
                this.mList.width = this.size.innerWidth;
                this.mList.height = this.size.innerHeight;

                // Do animation if position is valid
                if (next && this.mList.position < this.mList.dataProvider.length - 1 || !next && this.mList.position > 0) {
                    // Do animation
                    core.Transition.to(this.modalContainer, this.animationDuration, {
                        x: targetX,
                        oncomplete: function () {
                            if (next)
                                self.mList.next();
                            else
                                self.mList.prev();
                        }
                    });
                }
            };

            // Handler
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @param e
            */
            ImageNavigatorModal.prototype.handleButtonTriggered = function (e) {
                if (e.target == this.mPrevButton) {
                    this._next(false);
                } else if (e.target == this.mNextButton) {
                    this._next();
                } else if (e.target == this.mCloseButton) {
                    this.close();
                }
            };

            /**
            *
            * @param e
            */
            ImageNavigatorModal.prototype.handleUpdate = function (e) {
                // Measure the size of list
                this.modalContainer.visible = true;
                this.mList.validateSize(true, true);

                // Set the modal width/height for present
                this.modalWidth = this.mList.width;
                this.modalHeight = this.mList.height;

                // Present the modal
                _super.prototype._present.call(this);
            };

            // Public
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @param index
            * @param target
            */
            ImageNavigatorModal.prototype.goto = function (index, target) {
                if (typeof target === "undefined") { target = null; }
                // Show the modal if not visible
                if (this.opened == false)
                    this.show(target);

                // Set the init width/height of the list
                this.mList.width = this.size.innerWidth;
                this.mList.height = this.size.innerHeight;

                // Add progress
                this.addClass('dc-progress');

                // if already assign data
                if (this.mList.dataProvider == undefined) {
                    this.mList.defaultPosition = index;
                    this.mList.dataProvider = this.data;
                } else {
                    this.mList.goto(index);
                }
            };
            return ImageNavigatorModal;
        })(display.Modal);
        components.ImageNavigatorModal = ImageNavigatorModal;
    })(dc.components || (dc.components = {}));
    var components = dc.components;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (components) {
        (function (renderers) {
            var display = dc.display;
            var text = dc.text;

            

            /**
            *
            */
            var ThumbnailRenderer = (function (_super) {
                __extends(ThumbnailRenderer, _super);
                function ThumbnailRenderer() {
                    _super.apply(this, arguments);
                    //  Public var
                    //  --------------------------------------------------------------------------------------------
                    this.status = 0;
                    this.extraWidth = 0;
                    this.mSelected = false;
                }
                Object.defineProperty(ThumbnailRenderer.prototype, "data", {
                    //  Constructor
                    //  --------------------------------------------------------------------------------------------
                    //        constructor(public name:string)
                    //        {
                    //            super(name);
                    //        }
                    //  Setter/Getter
                    //  --------------------------------------------------------------------------------------------
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
                        this._validateData(value.data);
                        //            }
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ThumbnailRenderer.prototype, "selected", {
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
                            if (value)
                                this.addClass('selected');
                            else
                                this.removeClass('selected');
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                //  Override Protected Methods
                //  --------------------------------------------------------------------------------------------
                /** @override */
                ThumbnailRenderer.prototype._createChildren = function () {
                    _super.prototype._createChildren.call(this);

                    // Create ui
                    this.mImageContainer = new display.ViewContainer();
                    this.mImage = new display.ImageView();
                    this.mLabel = new text.TextField();
                    this.mDesc = new text.TextField();

                    // Add styles
                    this.addClass('dc-renderer dc-thumbnail');
                    this.mLabel.addClass('title');
                    this.mDesc.addClass('description');
                    this.mImageContainer.clipping = true;

                    // Add interactive
                    this.mImage.addEventListener(dc.events.Event.TRIGGERED, this._handleImageTriggered, this);
                    this.mImage.interactive = true;
                    this.mImage.visible = false;

                    // Add Child
                    this.mImageContainer.addChild(this.mImage);
                    this.addChild(this.mImageContainer);
                    this.addChild(this.mLabel);
                    this.addChild(this.mDesc);
                };

                /** @override */
                ThumbnailRenderer.prototype._validateData = function (data) {
                    if (data) {
                        // thumbnail
                        if (this.visible && data[this.properties.thumbnailDataName] && this.mImage.url != data[this.properties.thumbnailDataName]) {
                            this.mImage.addEventListener(dc.events.Event.UPDATE, this._handleImageUpdate, this);
                            this.addClass('dc-progress');
                            this.status = 1;
                            this.mImage.url = data[this.properties.thumbnailDataName];
                        }

                        // title
                        if (this.properties.titleDataName && data[this.properties.titleDataName]) {
                            if (this.properties.horizontal) {
                                this.mLabel.addClass('horizontal');
                            } else {
                                this.mLabel.removeClass('horizontal');
                            }
                            this.mLabel.visible = true;
                            this.mLabel.text = data[this.properties.titleDataName];
                        } else {
                            this.mLabel.visible = false;
                        }

                        // description
                        if (this.properties.descriptionDataName && data[this.properties.descriptionDataName]) {
                            this.mDesc.visible = true;
                            this.mDesc.text = data[this.properties.descriptionDataName];
                            this.mLabel.removeClass('last');
                        } else {
                            this.mLabel.addClass('last');
                            this.mDesc.visible = false;
                        }
                    }
                };

                /** @override */
                ThumbnailRenderer.prototype.validateSize = function (cleanWidth, cleanHeight) {
                    if (typeof cleanWidth === "undefined") { cleanWidth = false; }
                    if (typeof cleanHeight === "undefined") { cleanHeight = false; }
                    // Set visible to true for calculate size
                    this.visible = true;

                    if (this.mImage.orgWidth > 0 && this.mImage.orgHeight > 0) {
                        // Check if it is horizontal
                        if (this.properties.horizontal) {
                            // Get the explicitWidth
                            this.height = this.properties.explicitHeight;

                            // Calculate innerHeight
                            this.size.innerHeight = this.size.height - this.measurements.paddingHeight - this.measurements.borderHeight;
                            this.size.outerHeight = this.size.height + this.measurements.marginHeight;

                            // Set the image size
                            if (this.properties.squareImage) {
                                // Square
                                var r = display.ScaleMode.getSize(this.mImage.orgWidth, this.mImage.orgHeight, this.height, this.height, display.ScaleMode.AUTO_FILL);
                                this.mImage.setSize(r.width, r.height, true);
                                this.mImage.node.style.marginLeft = r.x + "px";
                                this.mImage.node.style.marginTop = r.y + "px";
                                this.mImage.validatePosition();
                                this.mImageContainer.setSize(this.height, this.height, true);

                                // Validate with free width
                                _super.prototype.validateSize.call(this, true, cleanHeight);
                            } else if (this.extraWidth > 0 && this.width > 5) {
                                // Square
                                var r = display.ScaleMode.getSize(this.mImage.orgWidth, this.mImage.orgHeight, this.extraWidth, this.height, display.ScaleMode.AUTO_FILL);
                                this.mImage.setSize(r.width, r.height, true);
                                this.mImage.node.style.marginLeft = r.x + "px";
                                this.mImage.node.style.marginTop = r.y + "px";
                                this.mImage.validatePosition();
                                this.mImageContainer.setSize(this.extraWidth, this.height, true);

                                this.width = this.extraWidth;

                                _super.prototype.validateSize.call(this, cleanWidth, cleanHeight);
                            } else {
                                // Reset the styles
                                this.mImageContainer.node.style.width = this.mImageContainer.node.style.height = this.mImage.node.style.marginLeft = this.mImage.node.style.marginTop = '';

                                // Set the image size
                                var h = this.size.innerHeight;
                                var w = h * this.mImage.orgWidth / this.mImage.orgHeight;
                                this.mImage.setSize(w, h, true);

                                // Validate with free width
                                _super.prototype.validateSize.call(this, true, cleanHeight);
                            }
                        } else {
                            // Get the explicitWidth
                            this.width = this.properties.explicitWidth;

                            // Calculate innerWidth
                            this.size.innerWidth = this.size.width - this.measurements.paddingWidth - this.measurements.borderWidth;
                            this.size.outerWidth = this.size.width + this.measurements.marginWidth;

                            // Set the image size
                            if (this.properties.squareImage) {
                                var r = display.ScaleMode.getSize(this.mImage.orgWidth, this.mImage.orgHeight, this.width, this.width, display.ScaleMode.AUTO_FILL);
                                this.mImage.setSize(r.width, r.height, true);
                                this.mImage.node.style.marginLeft = r.x + "px";
                                this.mImage.node.style.marginTop = r.y + "px";
                                this.mImage.validatePosition();
                                this.mImageContainer.setSize(this.width, this.width, true);
                            } else {
                                // Reset the styles
                                this.mImageContainer.node.style.width = this.mImageContainer.node.style.height = this.mImage.node.style.marginLeft = this.mImage.node.style.marginTop = '';

                                // Set the image size
                                var w = this.size.innerWidth;
                                var h = w / this.mImage.orgWidth * this.mImage.orgHeight;
                                this.mImage.setSize(w, h, true);
                            }

                            //                    console.log('w/h',this.index,w,h,this.size.innerWidth);
                            _super.prototype.validateSize.call(this, cleanWidth, true);
                        }

                        this.status = 2;
                    } else {
                        //                console.log('validateSize',this.index);
                        _super.prototype.validateSize.call(this, cleanWidth, cleanHeight);
                    }
                };

                //  Handler Methods
                //  --------------------------------------------------------------------------------------------
                /**
                *
                * @param e
                * @private
                */
                ThumbnailRenderer.prototype._handleImageTriggered = function (e) {
                    e.stopsPropagation = true;
                    this.dispatchEventWith(dc.events.Event.TRIGGERED, false, this.data);
                };

                /**
                *
                * @param e
                * @private
                */
                ThumbnailRenderer.prototype._handlImageOver = function (e) {
                    //            console.log('over');
                    dc.core.Transition.fromTo(this.mLabel, 500, { y: this.mImage.height }, { y: this.mImage.height - this.height - this.mLabel.height });
                };

                /**
                *
                * @param e
                * @private
                */
                ThumbnailRenderer.prototype._handlImageOut = function (e) {
                };

                /**
                *
                * @param e
                * @private
                */
                ThumbnailRenderer.prototype._handleImageUpdate = function (e) {
                    //
                    this.mImage.removeEventListener(dc.events.Event.UPDATE, this._handleImageUpdate);
                    this.removeClass('dc-progress');

                    //
                    if (this.mImage.orgWidth > 0 && this.mImage.orgHeight > 0) {
                        // Set image alpha to 0
                        this.mImage.alpha = 0;

                        this.mImage.visible = true;

                        // Validate size
                        this.validateSize();

                        // Fade In
                        this.mImage.fadeIn();

                        // Dispatch update event
                        this.dispatchEventWith(dc.events.Event.UPDATE);
                    }
                };
                return ThumbnailRenderer;
            })(display.ViewContainer);
            renderers.ThumbnailRenderer = ThumbnailRenderer;

            /**
            *
            */
            var ThumbnailDebugRenderer = (function (_super) {
                __extends(ThumbnailDebugRenderer, _super);
                function ThumbnailDebugRenderer() {
                    _super.apply(this, arguments);
                }
                //  Override Protected Methods
                //  --------------------------------------------------------------------------------------------
                /** @override */
                ThumbnailDebugRenderer.prototype._createChildren = function () {
                    _super.prototype._createChildren.call(this);

                    this.mIndex = new text.TextField();
                    this.mTags = new text.TextField();
                    this.mIndex.addClass('index');
                    this.mTags.addClass('tags');
                    this.mIndex.floating = true;
                    this.mTags.floating = true;

                    this.addChild(this.mIndex);
                    this.addChild(this.mTags);
                };

                /** @override */
                ThumbnailDebugRenderer.prototype._validateData = function (data) {
                    _super.prototype._validateData.call(this, data);

                    if (data) {
                        this.mIndex.text = data.index.toString();

                        if (data[this.properties.tagsDataName]) {
                            this.mTags.visible = true;
                            this.mTags.text = data[this.properties.tagsDataName];
                        } else {
                            this.mTags.visible = false;
                        }
                    }
                };
                return ThumbnailDebugRenderer;
            })(ThumbnailRenderer);
            renderers.ThumbnailDebugRenderer = ThumbnailDebugRenderer;
        })(components.renderers || (components.renderers = {}));
        var renderers = components.renderers;
    })(dc.components || (dc.components = {}));
    var components = dc.components;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (components) {
        (function (renderers) {
            var display = dc.display;
            var text = dc.text;

            /**
            *
            */
            var ImageDetailRenderer = (function (_super) {
                __extends(ImageDetailRenderer, _super);
                function ImageDetailRenderer() {
                    _super.apply(this, arguments);
                    //  Public var
                    //  --------------------------------------------------------------------------------------------
                    this.imageDataName = "src";
                    this.titleDataName = "title";
                    this.descriptionDataName = "description";
                    this.tagsDataName = "category";
                }
                //  Setter/Getter
                //  --------------------------------------------------------------------------------------------
                // Override Protected Methods
                // --------------------------------------------------------------------------------------------
                /** @override */
                ImageDetailRenderer.prototype._createChildren = function () {
                    _super.prototype._createChildren.call(this);

                    // Create Image
                    this.mImage = new display.ImageView();
                    this.addChild(this.mImage);

                    // Create content container
                    this.mContent = new display.ViewContainer();

                    // Create title
                    this.mTitle = new text.TextField();
                    this.mDescription = new text.TextField();

                    // Add to screen
                    this.mContent.addChild(this.mTitle);
                    this.mContent.addChild(this.mDescription);
                    this.addChild(this.mContent);

                    // Add Styles
                    this.clipping = true;
                    this.mContent.addClass('content');
                    this.mTitle.addClass('title');
                    this.mDescription.addClass('description');
                    //            this.addClass('floating');
                };

                /** @override */
                ImageDetailRenderer.prototype._validateData = function (data) {
                    // Fill title and description
                    if (data[this.titleDataName]) {
                        this.mTitle.visible = true;
                        this.mTitle.text = data[this.titleDataName];
                    } else {
                        this.mTitle.visible = false;
                    }
                    if (data[this.descriptionDataName]) {
                        this.mDescription.visible = true;
                        this.mDescription.text = data[this.descriptionDataName];
                    } else {
                        this.mDescription.visible = false;
                    }

                    // Set visible for title and description
                    this.mContent.visible = (this.mTitle.visible || this.mDescription.visible);

                    // Load image
                    if (data[this.imageDataName]) {
                        this.mImage.addEventListener(dc.events.Event.UPDATE, this._handleImageUpdate, this);
                        this.mImage.url = data[this.imageDataName];
                    }
                };

                //  Handler Methods
                //  --------------------------------------------------------------------------------------------
                /**
                *
                * @param e
                * @private
                */
                ImageDetailRenderer.prototype._handleImageUpdate = function (e) {
                    // Remove event
                    this.mImage.removeEventListener(dc.events.Event.UPDATE, this._handleImageUpdate);

                    // Calculate aspect ratio
                    var r = this.mImage.orgWidth / this.mImage.orgHeight;
                    var w = 0, h = 0;

                    // Get height of content
                    if (this.mImage.orgWidth > this.mImage.orgHeight) {
                        if (this.mImage.orgWidth > this.parent.size.width) {
                            w = this.parent.size.width;
                        } else {
                            w = this.mImage.orgWidth;
                        }

                        h = w / r;

                        if (h > this.parent.size.height - 100) {
                            h = this.parent.size.height - 100;
                            w = h * r;
                        }
                    } else {
                        if (this.mImage.orgHeight > this.parent.size.height - 100) {
                            h = this.parent.size.height - 100;
                        } else {
                            h = this.mImage.orgHeight;
                        }

                        w = h * r;

                        if (w > this.parent.size.width) {
                            w = this.parent.size.width;
                            h = w / r;
                        }
                    }

                    this.mImage.setSize(w, h);
                    this.mImage.validate();
                    this.setSize(w, h);
                    this.validateSize(false, true);
                    this.x = (this.parent.size.width - w) / 2;

                    this.dispatchEventWith(dc.events.Event.UPDATE, true);
                };
                return ImageDetailRenderer;
            })(display.DefaultViewContainerRenderer);
            renderers.ImageDetailRenderer = ImageDetailRenderer;
        })(components.renderers || (components.renderers = {}));
        var renderers = components.renderers;
    })(dc.components || (dc.components = {}));
    var components = dc.components;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (gallery) {
        var events = dc.events;
        var data = dc.data;
        var parsers = dc.parsers;

        /**
        * Store the instance of gallery
        */
        gallery._galleryInstance;

        /**
        *
        * @param classType
        * @param selector
        * @param options
        * @param properties
        * @param events
        * @returns {*}
        */
        function init(classType, selector, options, properties, events) {
            var instance;
            var node;

            // Check if selector is string
            if (typeof selector === "string") {
                // Set the container
                if (selector.indexOf('#') == 0)
                    node = dc.id(selector.replace(/^#/, ''));
                else
                    node = dc.tag(selector)[0];
            } else {
                node = selector;
            }

            // inline function
            function applySettings(o, e) {
                for (var k in o) {
                    if (e[k.toLowerCase()])
                        instance.addEventListener(e[k.toLowerCase()], o[k]);
                    else if (k == 'src')
                        instance.load(o[k]);
                    else
                        instance[k] = o[k];
                }
            }

            // Check if it is already initial
            if (node) {
                // Create new instances dictionary
                if (gallery._galleryInstance == undefined)
                    gallery._galleryInstance = {};

                // check if saved instance
                if (gallery._galleryInstance[node.id] != undefined) {
                    // Assign the instance
                    instance = gallery._galleryInstance[node.id];

                    // Apply settings
                    applySettings(options, events);

                    // Return instance
                    return instance;
                } else {
                    // Create an new instance of the gallery
                    gallery._galleryInstance[node.id] = instance = new classType(node);
                }
            } else {
                //Error here
                return null;
            }

            for (var k = 0; k < node.attributes.length; k++) {
                var attrib = node.attributes[k];
                var name = attrib.name.toString();
                if (name.indexOf('data-setting') == 0) {
                    var value = parseFloat(attrib.value);
                    var prop = properties[name];

                    // Check type, 0:string, 1:number, 2:boolean, 3:others
                    if (prop.t == 0)
                        instance[prop.p] = attrib.value;
                    else if (prop.t == 1)
                        instance[prop.p] = value;
                    else if (prop.t == 2)
                        instance[prop.p] = (attrib.value === 'true');
                }
            }

            // Loop the options object
            if (options)
                applySettings(options, events);

            return instance;
        }
        gallery.init = init;

        /**
        *
        */
        var GalleryController = (function (_super) {
            __extends(GalleryController, _super);
            // Constructor
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @param node
            * @param options
            */
            function GalleryController(node, options) {
                if (typeof options === "undefined") { options = null; }
                _super.call(this);
                /**
                * Set the root for loading image.
                *
                * When set to blank and using xml/json as source, the image path will related to the path of external source.
                *
                * When set to blank and html source, the image path will related to the path of the html.
                *
                * @property {string} rootPath
                * @default ""
                */
                this.rootPath = "";
                this.mTimeintervalScroll = 0;
                this.mTimeintervalScrollCount = 0;

                // Assign the container
                this.container = node;

                // check if container valid
                if (this.container == undefined) {
                    // TODO: Add error here
                    return;
                }

                // Assign the container class
                if (this.container != document.body)
                    dc.addClass(this.container, "dc-gallery-container");

                // Set the scroller target
                if (this.container == document.body)
                    this.scrollTarget = window;
                else
                    this.scrollTarget = this.container;

                for (var property in options)
                    if (this.hasOwnProperty(property))
                        this[property] = options[property];

                this._init();
            }
            Object.defineProperty(GalleryController.prototype, "src", {
                /**
                *
                * @returns {string}
                */
                get: function () {
                    return this.mSrc;
                },
                set: function (value) {
                    if (this.mSrc != value)
                        this.load(value);
                },
                enumerable: true,
                configurable: true
            });

            // Protected Methods
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @private
            */
            GalleryController.prototype._init = function () {
                // Init Data
                this.mData = [];

                // Create a Collection from data
                this.dataProvider = new data.Collection(this.mData);

                // Create children
                this._createChildren();
            };

            /**
            *
            * @private
            */
            GalleryController.prototype._createChildren = function () {
            };

            /**
            *
            * @private
            */
            GalleryController.prototype._addEvents = function () {
                var self = this;

                // Add Event for resize windows
                var resize_timeout_id;
                this.mResizeEventHandler = function () {
                    if (resize_timeout_id)
                        clearTimeout(resize_timeout_id);
                    resize_timeout_id = setTimeout(function () {
                        self._resize(self.container.clientWidth, self.container.clientHeight);
                    }, 300);
                };
                dc.bind(window, 'resize', this.mResizeEventHandler);

                // Add Event for scroll
                var moved = false;
                this.mScrollEventHandler = function () {
                    //                console.log('scroll end');
                    self._scroll();
                    if (dc.os.ios) {
                        if (self.mTimeintervalScroll)
                            clearInterval(self.mTimeintervalScroll);
                    }
                };

                if (dc.os.ios) {
                    dc.bind(this.scrollTarget, 'touchmove', function () {
                        if (self.mTimeintervalScroll)
                            clearInterval(self.mTimeintervalScroll);
                        self._scroll();
                        moved = true;
                    });
                    dc.bind(this.scrollTarget, 'touchend', function () {
                        if (moved) {
                            self._scroll();
                            self.mTimeintervalScrollCount = 0;
                            self.mTimeintervalScroll = setInterval(function () {
                                self._scroll();
                                if (self.mTimeintervalScrollCount > 100) {
                                    if (self.mTimeintervalScroll)
                                        clearInterval(self.mTimeintervalScroll);
                                    self.mTimeintervalScrollCount = 0;
                                } else {
                                    self.mTimeintervalScrollCount++;
                                }
                            }, 200);
                        }
                        moved = false;
                    });
                    dc.bind(this.scrollTarget, 'scroll', this.mScrollEventHandler);
                } else
                    dc.bind(this.scrollTarget, 'scroll', this.mScrollEventHandler);
            };

            /**
            *
            * @private
            */
            GalleryController.prototype._removeEvents = function () {
                dc.unbind(this.container, 'resize', this.mResizeEventHandler);
                dc.unbind(this.container, 'scroll', this.mScrollEventHandler);
            };

            /**
            *
            * @param data
            * @private
            */
            GalleryController.prototype._start = function (data) {
            };

            /**
            *
            * @param w
            * @param h
            * @private
            */
            GalleryController.prototype._resize = function (w, h) {
                this.dispatchEventWith(events.Event.RESIZE);
            };

            /**
            *
            * @private
            */
            GalleryController.prototype._scroll = function () {
            };

            /**
            *
            * @private
            */
            GalleryController.prototype._procressData = function () {
            };

            /**
            *
            * @param array_data
            * @private
            */
            GalleryController.prototype._load = function (array_data) {
                // Check if container valid
                if (array_data && this.container) {
                    // Add Events
                    this._addEvents();

                    // Create dataProvider
                    this.dataProvider = new data.Collection(array_data);

                    // Start the gallery
                    this._start(this.dataProvider);
                }
            };

            // Public Methods
            // --------------------------------------------------------------------------------------------
            /**
            * Load the source to create the gallery.
            * It can be path to a external source file.
            * Or, it can be array of data.
            *
            * @method load
            * @param {*} src String path of external source. Or array of data
            */
            GalleryController.prototype.load = function (src) {
                if (src) {
                    // Check src type
                    if (typeof src == "string") {
                        this.mSrc = src;

                        // Create loader
                        var loader = new dc.io.DataLoader(this.mSrc);
                        loader.addEventListener(events.Event.COMPLETE, this._handleLoaderEvent, this);
                        loader.load(true);
                    } else {
                        this._load(src);
                    }
                }
            };

            /**
            * Unload the gallery.
            *
            * @method unload
            */
            GalleryController.prototype.unload = function () {
                this._removeEvents();
            };

            /**
            * Open the modal for the data which have the specify index.
            *
            * @method goto
            * @param {number} index The index of data.
            */
            GalleryController.prototype.goto = function (index) {
            };

            // Handler Methods
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @param e
            * @private
            */
            GalleryController.prototype._handleLoaderEvent = function (e) {
                var loader = e.target;
                var content;

                // Get the root path of the xml
                var p = this.mSrc.split('/');
                p.pop();
                var path = p.join('/') + '/';

                // Check if it is json
                if (loader.type === "json") {
                    // parse the json
                    // Set the root path
                    if (this.rootPath && this.rootPath != "")
                        content = parsers.parseJSONData(loader.content, this.rootPath);
                    else
                        content = parsers.parseJSONData(loader.content, path);
                } else if (loader.type === "xml") {
                    // Get the XML
                    var contentXML = loader.content;
                    var parser;

                    // Check xml type
                    if (parsers.LRXMLParser.isXMLValid(contentXML)) {
                        parser = new parsers.LRXMLParser();
                    } else if (parsers.PSXMLParser.isXMLValid(contentXML)) {
                        parser = new parsers.PSXMLParser();
                    } else {
                        parser = new parsers.DCXMLParser();
                    }

                    // Set the root path
                    if (this.rootPath && this.rootPath != "")
                        parser.rootPath = this.rootPath;
                    else
                        parser.rootPath = path;

                    // parse the XML
                    content = parser.parse(contentXML);
                }

                // Load the data
                this._load(content);

                // Dispatch complete event
                this.dispatchEventWith(events.Event.COMPLETE, false, content);
            };
            return GalleryController;
        })(events.EventDispatcher);
        gallery.GalleryController = GalleryController;
    })(dc.gallery || (dc.gallery = {}));
    var gallery = dc.gallery;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (gallery) {
        var display = dc.display;
        var layout = dc.layout;
        var core = dc.core;
        var comp = dc.components;
        var renderers = dc.components.renderers;

        /**
        *
        */
        var ThumbnailAlignment = (function () {
            function ThumbnailAlignment() {
            }
            ThumbnailAlignment.VERTICAL = "vertical";
            ThumbnailAlignment.HORIZONTAL = "horizontal";
            ThumbnailAlignment.HORIZONTAL_FIT = "horizontal_fit";
            return ThumbnailAlignment;
        })();
        gallery.ThumbnailAlignment = ThumbnailAlignment;

        /**
        * @class Galerie
        * @extends GalleryController
        * @constructor
        */
        var Galerie = (function (_super) {
            __extends(Galerie, _super);
            function Galerie() {
                _super.apply(this, arguments);
                // Properties
                this.mAnimationDuration = 300;
                this.mGap = 10;
                this.mColumnCount = -1;
                this.mThumbnailSize = 150;
                this.mHorizontal = false;
                this.mThumbnailAlignment = ThumbnailAlignment.VERTICAL;
                this.mThumbnailAction = "modal";
                // Others
                this.mRefreshTimeout = 0;
                this.mResizeTimeout = 0;
            }
            Object.defineProperty(Galerie.prototype, "animationDuration", {
                /**
                * The duration of the animation. Value in milliseconds.
                *
                * @property {number} animationDuration
                * @returns {number}
                * @default 300
                */
                get: function () {
                    return this.mAnimationDuration;
                },
                set: function (value) {
                    if (this.mList) {
                        this.mAnimationDuration = value;
                        this.mList.animationDuration = value;
                        this.mModal.animationDuration = value;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Galerie.prototype, "buffer", {
                /**
                * The buffer size of lazy load. This set the number of thumbnails buffered when scroll to bottom.
                * If set to zero, the component will load all the thumbnails as once.
                *
                * @property {number} buffer
                * @returns {number}
                * @default 20
                */
                get: function () {
                    return this.mList.buffer;
                },
                set: function (value) {
                    if (this.mList.buffer != value) {
                        this.mList.buffer = value;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Galerie.prototype, "gap", {
                /**
                * The margin between each thumbnail. Value in px.
                *
                * @property {number} gap
                * @returns {number}
                * @default 10
                */
                get: function () {
                    return this.mGap;
                },
                set: function (value) {
                    if (this.mGap != value) {
                        this.mGap = value;
                        this._validateProperties();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Galerie.prototype, "columnCount", {
                /**
                * The column count in vertical layout. It will override thumbnail size.
                * Ignored when value is less than or equal zero.
                *
                * @property {number} columnCount
                * @returns {number}
                * @default 0
                */
                get: function () {
                    return this.mColumnCount;
                },
                set: function (value) {
                    if (this.mColumnCount != value) {
                        this.mColumnCount = value;
                        this._validateProperties();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Galerie.prototype, "thumbnailSize", {
                /**
                * The explicit size of the thumbnail. Width in vertical layout and height in horizontal layout.
                *
                * @property {number} thumbnailSize
                * @returns {number}
                * @default 150
                */
                get: function () {
                    return this.mThumbnailSize;
                },
                set: function (value) {
                    if (this.mThumbnailSize != Number(value)) {
                        this.mThumbnailSize = Number(value);
                        this._validateProperties();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Galerie.prototype, "thumbnailAlignment", {
                /**
                * Set the alignment method of the thumbnails.
                *
                * vertical - aligns the thumbnails from top to bottom with fixed width<br/>
                * horizontal - aligns the thumbnails from top to bottom with fixed height<br/>
                * horizontal_fit - aligns the thumbnails from top to bottom with fixed height and fill weight<br/>
                *
                * @property {string} thumbnailAlignment
                * @returns {string}
                * @default "vertical"
                */
                get: function () {
                    return this.mThumbnailAlignment;
                },
                set: function (value) {
                    if (this.mThumbnailAlignment != value) {
                        this.mThumbnailAlignment = value;
                        this._setAlignment();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Galerie.prototype, "thumbnailTitleEnabled", {
                /**
                * Set if display the thumbnail title.
                *
                * @property {boolean} thumbnailTitleEnabled
                * @returns {boolean}
                * @default false
                */
                get: function () {
                    return this.mDefaultItemProperties['titleDataName'] != null;
                },
                set: function (value) {
                    if (value)
                        this._validateItemRendererProperties('titleDataName', 'title');
                    else
                        this._validateItemRendererProperties('titleDataName', null);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Galerie.prototype, "thumbnailDescriptionEnabled", {
                /**
                * Set if display the thumbnail description.
                *
                * @property {boolean} thumbnailDescriptionEnabled
                * @returns {boolean}
                * @default false
                */
                get: function () {
                    return this.mDefaultItemProperties['descriptionDataName'] != null;
                },
                set: function (value) {
                    if (value)
                        this._validateItemRendererProperties('descriptionDataName', 'description');
                    else
                        this._validateItemRendererProperties('descriptionDataName', null);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Galerie.prototype, "thumbnailSquareImage", {
                /**
                * Display the thumbnail image in square size.
                *
                * @property {boolean} thumbnailSquareImage
                * @returns {boolean}
                * @default false
                */
                get: function () {
                    return this.mDefaultItemProperties['squareImage'];
                },
                set: function (value) {
                    if (this.mDefaultItemProperties['squareImage'] != value) {
                        this._validateItemRendererProperties('squareImage', value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Galerie.prototype, "thumbnailAction", {
                /**
                * The action when click on the thumbnail.
                *
                * none - No action.<br/>
                * modal - Open a full screen modal which contains large image and details.
                * inline_modal - Open a modal within container which contains large image and details.
                * link - Link to the url defined in data.
                *
                * @property {string} thumbnailAction
                * @returns {string}
                * @default "modal"
                */
                get: function () {
                    return this.mThumbnailAction;
                },
                set: function (value) {
                    this.mThumbnailAction = value;
                },
                enumerable: true,
                configurable: true
            });

            // Override Protected Methods
            // --------------------------------------------------------------------------------------------
            /** @override */
            Galerie.prototype._createChildren = function () {
                _super.prototype._createChildren.call(this);

                this.mContainerStyles = display.MeasurementsHelper.getStyle(this.container);
                this.mContainerMeasurement = display.MeasurementsHelper.getMeasurements(this.container, this.mContainerStyles);

                this.mContainer = new display.ViewContainer();
                this.mContainer.addClass('dc-scroll-container fill');
                this.mContainer.attachTo(this.container);

                // Create List view
                this.mList = new display.ScrollList();
                this.mList.addClass('dc-thumbnail-list');

                //            this.mList.itemRenderer=renderers.ThumbnailDebugRenderer;
                this.mList.itemRenderer = renderers.ThumbnailRenderer;
                this.mList.defaultItemProperties = this.mDefaultItemProperties = {
                    thumbnailDataName: "thumbnail",
                    titleDataName: null,
                    descriptionDataName: null,
                    tagsDataName: null,
                    squareImage: false,
                    fitWidth: false,
                    horizontal: false,
                    explicitWidth: 150,
                    explicitHeight: 150
                };

                //            this.mList.setSize(this.container.clientWidth-this.mContainerMeasurement.paddingWidth-this.mContainerMeasurement.borderWidth,this.container.clientHeight-this.mContainerMeasurement.paddingHeight-this.mContainerMeasurement.borderHeight);
                //            this.mList.setSize(this.mContainer.node.clientWidth,this.mContainer.node.clientHeight);
                //            this.mList.validate();
                this.mList.addEventListener(dc.events.Event.SELECT, this.handleListEvent, this);
                this.mList.addEventListener(dc.events.Event.READY, this.handleReadyEvent, this);
                this.mContainer.addChild(this.mList);

                // Set scroll target
                //            if(this.container!=document.body)
                this.scrollTarget = this.mContainer.node;

                // Create layout
                this.mLayout = new layout.ColumnLayout(this.mList.width, this.mList.height);
                this.mList.layout = this.mLayout;

                // Create modal
                this.mModal = new comp.ImageNavigatorModal();

                this.mContainer.floating = true;

                // Measure Container
                this.mContainer.measure();
            };

            /** @override */
            Galerie.prototype._start = function (data) {
                //            return;
                var self = this;

                // Validate properties
                this._validateProperties();

                // Add resize event
                this.mList.addEventListener(dc.events.Event.RESIZE, this.handleListResize, this);

                // Set the data of UIs
                this.mList.dataProvider = data;

                // Delay load the modal
                setTimeout(function () {
                    self.mContainer.removeClass("dc-progress");
                    self.mModal.data = data;
                });
            };

            /** @override */
            Galerie.prototype._resize = function (w, h) {
                // Validate container size
                this.mContainer.validateSize(true, true);

                // Calculate the list size
                this.mList.validateSize(true, true);
                this.mLayout.width = this.mList.size.innerWidth;
                this.mLayout.height = this.mList.size.innerHeight;

                //            console.log(this.mContainer.size.innerWidth,this.mContainer.size.innerHeight,
                //                this.mList.size.width,this.mList.size.height,
                //                this.mList.size.innerWidth,this.mList.size.innerHeight);
                var self = this;
                if (this.mResizeTimeout)
                    clearTimeout(this.mResizeTimeout);
                this.mResizeTimeout = setTimeout(function () {
                    self._validateProperties();
                }, 100);
                // Fix issue which scrollbar not display correctly after resize
            };

            /** @override */
            Galerie.prototype._scroll = function () {
                // Check if scroll to bottom
                if (this.mList.height <= this.mContainer.node.scrollTop + this.container.clientHeight) {
                    var self = this;

                    // Set timer
                    if (this.mRefreshTimeout)
                        clearTimeout(this.mRefreshTimeout);
                    this.mRefreshTimeout = setTimeout(function () {
                        self.mList.refresh();
                    }, 500);
                } else {
                    // Check visiblility
                    this.mList.checkVisibility();
                }
            };

            //  Override Public Methods
            //  --------------------------------------------------------------------------------------------
            /**
            *
            * @private
            */
            Galerie.prototype._setAlignment = function () {
                // Set horizontal
                if (this.mThumbnailAlignment == ThumbnailAlignment.HORIZONTAL) {
                    this.mHorizontal = true;
                    this.mDefaultItemProperties.fitWidth = false;
                    this.mLayout.fitWidth = false;
                } else if (this.mThumbnailAlignment == ThumbnailAlignment.HORIZONTAL_FIT) {
                    this.mHorizontal = true;
                    this.mDefaultItemProperties.fitWidth = true;
                    this.mLayout.fitWidth = true;
                } else {
                    this.mHorizontal = false;
                    this.mDefaultItemProperties.fitWidth = false;
                    this.mLayout.fitWidth = false;
                }

                this.mLayout.horizontal = this.mHorizontal;
                this._validateItemRendererProperties('horizontal', this.mHorizontal);

                // Resize the layout again
                this._resize(0, 0);
            };

            /**
            *
            * @private
            */
            Galerie.prototype._validateProperties = function () {
                // Set properties
                this.mLayout.columnSize = this.mThumbnailSize;
                this.mLayout.columnCount = this.mColumnCount;
                this.mLayout.gap = this.mGap;
                this.mLayout.horizontal = this.mHorizontal;

                this.mLayout.resetLayout();

                // Update default item properties
                this.mDefaultItemProperties.explicitWidth = this.mLayout.columnSize;
                this.mDefaultItemProperties.explicitHeight = this.mLayout.columnSize;
                this.mDefaultItemProperties.horizontal = this.mHorizontal;

                // Validate the List
                if (this.mList && this.mList.dataProvider) {
                    // Validate the item renderer
                    this.mList.validateItemRenderer();
                    this.mList.layout.updateAllItems('dirty', true);
                    this.mList.validate();

                    // check if all data loaded
                    if (this.buffer > 0 && this.mList.numChildren != this.dataProvider.length) {
                        // Get last children
                        var last_child = this.mList.getChildAt(this.mList.numChildren - 1);

                        //                    console.log('refresh',last_child.y,this.mContainer.size.height)
                        // Refresh
                        if (last_child && last_child.y < this.mContainer.size.height)
                            this.mList.refresh();
                    } else {
                        var h = this.mContainer.node.scrollHeight + this.mContainer.measurements.paddingHeight + this.mContainer.measurements.borderHeight;
                        //                    console.log(this.mList.size.height,this.mContainer.size.height,h);
                        //                    if(this.mList.size.height<h){
                        //                        this.mContainer.node.scrollTop=this.mList.size.height-this.container.clientHeight;
                        //                    }
                    }
                }
            };

            /**
            *
            * @param property
            * @param value
            * @private
            */
            Galerie.prototype._validateItemRendererProperties = function (property, value) {
                // Change the properties
                this.mDefaultItemProperties[property] = value;

                // Validate the List
                if (this.mList && this.mList.dataProvider) {
                    this.mList.validateItemRenderer();
                    this.mList.layout.updateAllItems('dirty', true);

                    this.mList.validate();
                }
            };

            //  Override Public Methods
            //  --------------------------------------------------------------------------------------------
            /** @override */
            Galerie.prototype.goto = function (index) {
                this.mModal.goto(index, this.mThumbnailAction == "inline_modal" ? this.container : null);
            };

            /** @override */
            Galerie.prototype.load = function (src) {
                if (src)
                    this.mContainer.addClass('dc-progress');
                _super.prototype.load.call(this, src);
            };

            /** @override */
            Galerie.prototype.unload = function () {
                _super.prototype.unload.call(this);

                // Unload the list
                if (this.mList)
                    this.mList.unload();

                // close the modal if open
                if (this.mModal)
                    this.mModal.close();
            };

            //        /**
            //         *
            //         * @param name
            //         */
            //        public filter(name:string=null):void
            //        {
            //            if(name)
            //                this.mList.filter({category: name});
            //            else
            //                this.mList.filter();
            //        }
            //  Handler Methods
            //  --------------------------------------------------------------------------------------------
            /**
            * After data loaded, the size of the list may change,
            * this handler ensure it is in correct size.
            * @param e
            */
            Galerie.prototype.handleListResize = function (e) {
                this.mList.removeEventListener(dc.events.Event.RESIZE, this.handleListResize);
                this._resize(0, 0);
            };

            /**
            *
            * @param e
            */
            Galerie.prototype.handleReadyEvent = function (e) {
                this._resize(0, 0);

                // check if all data loaded
                if (this.buffer > 0 && this.mList.numChildren != this.dataProvider.length) {
                    // Get last children
                    var last_child = this.mList.getChildAt(this.mList.numChildren - 1);

                    // Check if need to refresh
                    if (last_child && last_child.y < this.mContainer.size.height)
                        this.mList.refresh();
                    else
                        this.dispatchEventWith(dc.events.Event.READY);
                } else {
                    // Dispatch event
                    this.dispatchEventWith(dc.events.Event.READY);
                }
            };

            /**
            *
            * @param e
            */
            Galerie.prototype.handleListEvent = function (e) {
                // Dispatch event
                this.dispatchEventWith(dc.events.Event.SELECT, false, e.data.data);

                // Select actions
                if (this.mThumbnailAction == 'modal' || this.mThumbnailAction == 'inline_modal') {
                    this.goto(e.data.index);
                } else if (this.mThumbnailAction == 'link' && e.data.data.link) {
                    console.log('target', e.data.data.linktarget);
                    if (e.data.data.linktarget) {
                        window.open(e.data.data.link, e.data.data.linktarget);
                    } else {
                        window.location = e.data.data.link;
                    }
                } else {
                    // Do nothing
                }
            };
            return Galerie;
        })(dc.gallery.GalleryController);
        gallery.Galerie = Galerie;
    })(dc.gallery || (dc.gallery = {}));
    var gallery = dc.gallery;
})(dc || (dc = {}));


var dc;
(function (dc) {
    var gallery = dc.gallery;
    var events = dc.events;

    dc.instances;

    /**
    *
    * @param selector
    * @param options
    * @returns {gallery.Galerie}
    * @constructor
    */
    function galerie(selector, options) {
        // Define Supported Events Type
        var evts = {
            oncomplete: events.Event.COMPLETE,
            onselect: events.Event.SELECT,
            onresize: events.Event.RESIZE,
            onready: events.Event.READY
        };

        // Define Supported Properties
        var properties = {
            'data-setting-src': { p: 'src', t: 0 },
            'data-setting-animationduration': { p: 'animationDuration', t: 1 },
            'data-setting-buffer': { p: 'buffer', t: 1 },
            'data-setting-gap': { p: 'gap', t: 1 },
            'data-setting-columncount': { p: 'columnCount', t: 1 },
            'data-setting-thumbnailsize': { p: 'thumbnailSize', t: 1 },
            'data-setting-thumbnailalignment': { p: 'thumbnailAlignment', t: 0 },
            'data-setting-thumbnailtitleenabled': { p: 'thumbnailTitleEnabled', t: 2 },
            'data-setting-thumbnaildescriptionenabled': { p: 'thumbnailDescriptionEnabled', t: 2 },
            'data-setting-thumbnailsuareimage': { p: 'thumbnailSquareImage', t: 2 },
            'data-setting-thumbnailaction': { p: 'thumbnailAction', t: 0 }
        };

        // Init
        var instance = gallery.init(gallery.Galerie, selector, options, properties, evts);

        // Check if instance
        if (instance) {
            // Check if it is already loaded with src
            if (instance.src) {
            } else {
                // Check if data inside the selector
                if (instance.container.childNodes)
                    var data = dc.parsers.parseDomData(instance.container.childNodes);
                if (data)
                    instance.load(data);
            }
        }

        // Return the instance
        return instance;
    }
    dc.galerie = galerie;

    /**
    * Components Init here
    */
    dc.asyncInit(function () {
        // Check if any class of dc_pinterest
        var nodes = dc.name('dc-galerie');
        for (var i = 0; i < nodes.length; i++) {
            // Create an instance of each valid node
            dc.galerie(nodes[i]);
        }
    });

    /**
    * Build jQuery bridge
    */
    if (window['jQuery']) {
        jQuery.fn.galerie = function (options) {
            if (typeof options === "undefined") { options = null; }
            if (!dc.ready)
                dc.init();
            return this ? dc.galerie(this[0], options) : this;
        };
    }
})(dc || (dc = {}));
