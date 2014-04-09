
var dc;
(function (dc) {
    (function (events) {
        var Event = (function () {
            // Constructor
            // --------------------------------------------------------------------------------------------
            function Event(type, target, bubbles) {
                this.type = type;
                this.target = target;
                this.bubbles = bubbles;
                this.stopsPropagation = false;
                this.inPropagation = false;
            }
            // Public Methods
            // --------------------------------------------------------------------------------------------
            /**
            * Clones the current event.
            * @return An exact duplicate of the current event.
            */
            Event.prototype.clone = function () {
                return new dc.events.Event(this.type, this.target, this.bubbles);
            };
            Event.COMPLETE = "complete";
            Event.OPEN = "open";
            Event.CLOSE = "close";
            Event.REMOVED = "removed";
            Event.ADDED = "added";
            Event.ENTER_FRAME = "enterframe";
            Event.EXIT_FRAME = "exitframe";
            Event.RESIZE = "resize";
            Event.READY = "ready";
            Event.ERROR = "error";
            Event.CHANGE = "change";
            Event.UPDATE = "update";
            Event.SELECT = "select";
            Event.TRIGGERED = "triggered";
            return Event;
        })();
        events.Event = Event;
    })(dc.events || (dc.events = {}));
    var events = dc.events;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (events) {
        

        /**
        * Base class for dispatching events
        *
        * @class dc.events.EventDispatcher
        *
        */
        var EventDispatcher = (function () {
            function EventDispatcher() {
            }
            // Constructor
            // --------------------------------------------------------------------------------------------
            //        constructor(){}
            EventDispatcher.prototype._propagateEvent = function (event) {
                if (!event.stopsPropagation && event.bubbles && this.mParent) {
                    //                console.log('event.inPropagation',event.inPropagation)
                    // If in propagation
                    if (!event.inPropagation)
                        event.target = this;
                    event.inPropagation = true;
                    this.mParent.dispatchEvent(event);
                }
            };

            // Public Methods
            // --------------------------------------------------------------------------------------------
            /**
            * Add an event listener
            * @method addEventListener
            * @param {String} type Name of event to add a listener for
            * @param {Function} listener Callback function
            * @param {*} scope Scope of the listener Callback function
            */
            EventDispatcher.prototype.addEventListener = function (type, listener, scope) {
                if (typeof scope === "undefined") { scope = null; }
                // Create a new listeners list if new
                if (this.mListeners == undefined)
                    this.mListeners = {};

                if (this.mListeners[type] === undefined) {
                    this.mListeners[type] = [];
                }

                if (this.getEventListenerIndex(type, listener) === -1) {
                    var d = new EventData();
                    d.listener = listener;
                    d.type = type;
                    d.scope = scope;

                    this.mListeners[type].push(d);
                }
            };

            /**
            * Remove an event listener
            * @method removeEventListener
            * @param {String} type Name of event to remove a listener for
            * @param {Function} listener Callback function
            */
            EventDispatcher.prototype.removeEventListener = function (type, listener) {
                var index = this.getEventListenerIndex(type, listener);

                if (index != -1) {
                    this.mListeners[type].splice(index, 1);
                }
            };

            /**
            * Dispatch an event
            * @method dispatchEvent
            * @param {dc.events.Event} event Event to dispatch
            */
            EventDispatcher.prototype.dispatchEvent = function (event) {
                if (this.mListeners == undefined) {
                    // bubbles event
                    this._propagateEvent(event);
                    return;
                }

                // Get the listener for specify type
                var listenerArray = this.mListeners[event.type];

                //
                if (listenerArray !== undefined) {
                    this.mFncLength = listenerArray.length;

                    // Set target
                    event.target = event.target ? event.target : this;

                    // Call each listener function
                    var eventData;
                    var l = this.mFncLength;
                    for (var i = 0; i < l; i++) {
                        eventData = listenerArray[i];
                        eventData.listener.call(eventData.scope, event);
                    }
                }

                // bubbles event
                this._propagateEvent(event);
            };

            /**
            *
            * @param {string} type
            * @param {boolean} bubbles
            */
            EventDispatcher.prototype.dispatchEventWith = function (type, bubbles, data) {
                if (typeof bubbles === "undefined") { bubbles = false; }
                if (typeof data === "undefined") { data = null; }
                if (this.mReuseEvent == undefined) {
                    this.mReuseEvent = new dc.events.Event(type);
                }

                // Set bubbles
                this.mReuseEvent.bubbles = bubbles;

                // Assign type
                this.mReuseEvent.type = type;

                // Assign data
                this.mReuseEvent.data = data;

                // Reset target
                this.mReuseEvent.target = null;
                this.mReuseEvent.inPropagation = false;

                // Dispatch Event
                this.dispatchEvent(this.mReuseEvent);
            };

            /**
            * get Event Listener Index in array. Returns -1 if no listener is added
            * @method getEventListenerIndex
            * @param {String} type  Name of event to remove a listener for
            * @param {Function} listener Callback function
            */
            EventDispatcher.prototype.getEventListenerIndex = function (type, listener) {
                if (this.mListeners && this.mListeners[type] !== undefined) {
                    var a = this.mListeners[type];
                    var l = a.length;
                    var d;

                    for (var c = 0; c < l; c++) {
                        d = a[c];

                        if (listener == d.listener) {
                            return c;
                        }
                    }
                }

                return -1;
            };

            /**
            * check if an object has an event listener assigned to it
            * @method hasListener
            * @param {String} type Name of event to remove a listener for
            * @param {Function} listener Callback function
            */
            EventDispatcher.prototype.hasEventListener = function (type, listener) {
                if (this.mListeners != null) {
                    return (this.getEventListenerIndex(type, listener) !== -1);
                } else {
                    if (this.mListeners && this.mListeners[type] !== undefined) {
                        var a = this.mListeners[type];
                        return (a.length > 0);
                    }

                    return false;
                }

                return false;
            };
            return EventDispatcher;
        })();
        events.EventDispatcher = EventDispatcher;

        /**
        * @private
        */
        var EventData = (function () {
            function EventData() {
            }
            return EventData;
        })();
        events.EventData = EventData;
    })(dc.events || (dc.events = {}));
    var events = dc.events;
})(dc || (dc = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dc;
(function (dc) {
    (function (events) {
        var LoaderEvent = (function (_super) {
            __extends(LoaderEvent, _super);
            function LoaderEvent(type, target) {
                _super.call(this, type, target);
            }
            LoaderEvent.CHILD_OPEN = "childOpen";

            LoaderEvent.CHILD_PROGRESS = "childProgress";

            LoaderEvent.CHILD_CANCEL = "childCancel";

            LoaderEvent.CHILD_COMPLETE = "childComplete";

            LoaderEvent.CHILD_FAIL = "childFail";

            LoaderEvent.PROGRESS = "progress";

            LoaderEvent.CANCEL = "cancel";

            LoaderEvent.FAIL = "fail";

            LoaderEvent.INIT = "init";

            LoaderEvent.HTTP_STATUS = "httpStatus";

            LoaderEvent.HTTP_RESPONSE_STATUS = "httpResponseStatus";

            LoaderEvent.SCRIPT_ACCESS_DENIED = "scriptAccessDenied";

            LoaderEvent.IO_ERROR = "ioError";

            LoaderEvent.SECURITY_ERROR = "securityError";

            LoaderEvent.UNCAUGHT_ERROR = "uncaughtError";
            return LoaderEvent;
        })(dc.events.Event);
        events.LoaderEvent = LoaderEvent;
    })(dc.events || (dc.events = {}));
    var events = dc.events;
})(dc || (dc = {}));


var dc;
(function (dc) {
    (function (data) {
        /**
        *
        */
        var CollectionItem = (function () {
            //        public index:number;
            //        public data:any;
            function CollectionItem(index, data) {
                this.index = index;
                this.data = data;
            }
            return CollectionItem;
        })();
        data.CollectionItem = CollectionItem;

        /**
        *
        */
        var Collection = (function () {
            // Constructor
            // --------------------------------------------------------------------------------------------
            function Collection(data) {
                if (typeof data === "undefined") { data = null; }
                // Create
                this.mData = [];

                if (data) {
                    // Set raw data
                    this.rawData = data;

                    // Add
                    this._add(data);
                }
            }
            // Private Methods
            // --------------------------------------------------------------------------------------------
            /**
            *
            * @param data
            * @private
            */
            Collection.prototype._add = function (data) {
                // if it is a array
                // TODO: check if push() exist to identify it is array, revise to non-hack version later
                if (data.push) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        var item = new CollectionItem();

                        // Set data
                        item.index = i;
                        item.data = data[i];

                        // push to array
                        this.mData.push(item);
                    }
                }
            };

            /**
            *
            * @private
            */
            Collection.prototype._updateDataIndex = function () {
                if (this.mData)
                    for (var i = 0, l = this.mData.length; i < l; i++)
                        this.mData[i].index = i;
            };

            Object.defineProperty(Collection.prototype, "length", {
                // Public Methods
                // --------------------------------------------------------------------------------------------
                /**
                * Return the length of the datasource.
                * @method length
                * @return {number} length of the datasource
                */
                get: function () {
                    if (this.mData)
                        return this.mData.length;
                    return 0;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Get the item in the datasource at index
            * @method getDataAt
            * @param {number} index
            */
            Collection.prototype.getItemAt = function (index) {
                //            console.log('index',index,this.mData,this.mData[index]);
                return this.mData ? this.mData[index] : null;
            };

            /**
            *
            * @param data
            * @returns {boolean}
            */
            Collection.prototype.addItem = function (data) {
                if (this.mData) {
                    var item = new CollectionItem(this.mData.length, data);

                    //                // Set data
                    //                item.index=this.mData.length;
                    //                item.data=data;
                    this.mData.push(item);
                }
            };

            /**
            * Add data in the datasource at index
            * @method addItemAt
            * @param {*} data
            * @param {number} index
            */
            Collection.prototype.addItemAt = function (data, index) {
                if (this.mData) {
                    var item = new CollectionItem();
                    item.data = data;

                    if (index >= this.mData.length) {
                        item.index = this.mData.length;
                        this.mData.push(item);
                    } else {
                        this.mData.splice(index, 0, item);
                        this._updateDataIndex();
                    }
                }
            };

            Collection.prototype.append = function (data) {
            };

            /**
            *
            * @param data
            * @returns {*}
            */
            Collection.prototype.removeItem = function (data) {
                var l = this.mData.length;
                for (var i = 0; i < l; i++)
                    if (this.mData[i] == data)
                        return this.removeItemAt(i);
                return null;
            };

            /**
            * Remove the item in the datasource at index
            * @method removeItemAt
            * @param {number} index
            */
            Collection.prototype.removeItemAt = function (index) {
                var d;
                if (this.mData && index >= 0) {
                    if (index >= this.mData.length)
                        d = this.mData.pop();
                    else
                        d = this.mData.splice(index, 1)[0];

                    this._updateDataIndex();
                }
                return d;
            };

            /**
            *
            * @param fn
            * @param length
            */
            Collection.prototype.forEach = function (fn) {
                if (this.mData)
                    for (var i = 0, l = this.mData.length; i < l; i++)
                        fn(i, this.mData[i], l);
            };
            return Collection;
        })();
        data.Collection = Collection;
    })(dc.data || (dc.data = {}));
    var data = dc.data;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (io) {
        var events = dc.events;

        /**
        * LoaderStatus
        */
        (function (LoaderStatus) {
            /** The loader is ready to load and has not completed yet. **/
            LoaderStatus[LoaderStatus["READY"] = 0] = "READY";

            /** The loader is actively in the process of loading. **/
            LoaderStatus[LoaderStatus["LOADING"] = 1] = "LOADING";

            /** The loader has completed. **/
            LoaderStatus[LoaderStatus["COMPLETED"] = 2] = "COMPLETED";

            /** The loader is paused. **/
            LoaderStatus[LoaderStatus["PAUSED"] = 3] = "PAUSED";

            /** The loader failed and did not load properly. **/
            LoaderStatus[LoaderStatus["FAILED"] = 4] = "FAILED";

            /** The loader has been disposed. **/
            LoaderStatus[LoaderStatus["DISPOSED"] = 5] = "DISPOSED";
        })(io.LoaderStatus || (io.LoaderStatus = {}));
        var LoaderStatus = io.LoaderStatus;

        /**
        * Loader Class
        * @class Loader
        * @namespace dc.data
        */
        var Loader = (function (_super) {
            __extends(Loader, _super);
            // Constructor
            // --------------------------------------------------------------------------------------------
            function Loader(url, autoDispose) {
                if (typeof url === "undefined") { url = ""; }
                if (typeof autoDispose === "undefined") { autoDispose = true; }
                _super.call(this);

                this.url = url;
                this.autoDispose = autoDispose;
                this.status = 0 /* READY */;
            }
            Object.defineProperty(Loader.prototype, "content", {
                // Getter/Setter
                // --------------------------------------------------------------------------------------------
                get: function () {
                    return this.mContent;
                },
                enumerable: true,
                configurable: true
            });

            // Public Methods
            // --------------------------------------------------------------------------------------------
            Loader.prototype.load = function (autoDispose) {
                if (typeof autoDispose === "undefined") { autoDispose = true; }
                // Check arguments
                if (arguments.length > 0)
                    this.autoDispose = autoDispose;

                // Set status
                this.status = 1 /* LOADING */;

                // Check if url valid
                if (this.url) {
                    this._load();
                } else {
                    this._handleError('URL not valid. url=' + this.url);
                }
            };

            Loader.prototype.dispose = function () {
            };

            // Protected Methods
            // --------------------------------------------------------------------------------------------
            /** @private **/
            Loader.prototype._load = function () {
            };

            // Event Handler
            // --------------------------------------------------------------------------------------------
            /** @private **/
            Loader.prototype._handleLoaderComplete = function (content, type) {
                // set status
                this.status = 2 /* COMPLETED */;

                // Assign content
                this.mContent = content;

                // Assign type
                this.type = type;

                // Dispatch complete event
                this.dispatchEvent(new events.LoaderEvent(events.Event.COMPLETE, this));

                // Dispose the loader if auto dispose
                if (this.autoDispose) {
                    this.dispose();
                }
            };

            /** @private **/
            Loader.prototype._handleError = function (message, code) {
                if (typeof code === "undefined") { code = 0; }
                // set status
                this.status = 4 /* FAILED */;

                // Dispatch complete event
                this.dispatchEvent(new events.LoaderEvent(events.Event.ERROR, this));
            };
            return Loader;
        })(events.EventDispatcher);
        io.Loader = Loader;
    })(dc.io || (dc.io = {}));
    var io = dc.io;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (io) {
        /**
        *
        */
        var DataLoader = (function (_super) {
            __extends(DataLoader, _super);
            // Constructor
            // --------------------------------------------------------------------------------------------
            function DataLoader(url, autoDispose) {
                if (typeof url === "undefined") { url = ""; }
                if (typeof autoDispose === "undefined") { autoDispose = true; }
                _super.call(this, url, autoDispose);
            }
            // Override Methods
            // --------------------------------------------------------------------------------------------
            /** @override */
            DataLoader.prototype._load = function () {
                var self = this;
                var extension = this.url.split('.').pop();

                // AJAX call
                var r = new XMLHttpRequest();
                r.open("GET", this.url, true);
                r.onreadystatechange = function () {
                    if ((r.readyState == 4 && r.status == 200)) {
                        var type = r.getResponseHeader('content-type');

                        // XML
                        if ((type == "application/xml" || extension == "xml") && r.responseXML) {
                            var xml;

                            // Fix issue on IE
                            if (r.responseXML) {
                                xml = r.responseXML;
                            } else if (dc.browser.ie) {
                                xml = new ActiveXObject("Microsoft.XMLDOM");
                                xml.async = false;
                                xml.loadXML(r.response);
                            } else {
                                xml = r.responseXML;
                            }

                            self._handleLoaderComplete(xml, 'xml');
                            // JSON
                        } else if ((extension == "application/json" || extension == "json") && r.responseText) {
                            self._handleLoaderComplete(JSON.parse(r.responseText), 'json');
                            // String
                        } else {
                            self._handleLoaderComplete(r.response, 'string');
                        }
                    } else if (r.readyState == 0 || r.status != 200) {
                        throw Error("Can't load the file [" + self.url + "]. ReadyState:" + r.readyState + " Status: " + r.status);
                    }
                };
                r.send();
            };
            return DataLoader;
        })(dc.io.Loader);
        io.DataLoader = DataLoader;
    })(dc.io || (dc.io = {}));
    var io = dc.io;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (io) {
        /**
        * ImageLoader Class
        * @class ImageLoader
        * @namespace dc.io
        */
        var ImageLoader = (function (_super) {
            __extends(ImageLoader, _super);
            // Constructor
            // --------------------------------------------------------------------------------------------
            function ImageLoader(url, autoDispose) {
                if (typeof url === "undefined") { url = ""; }
                if (typeof autoDispose === "undefined") { autoDispose = true; }
                _super.call(this, url, autoDispose);
            }
            // Override Methods
            // --------------------------------------------------------------------------------------------
            /** @override */
            ImageLoader.prototype._load = function () {
                _super.prototype._load.call(this);

                var self = this;

                // Create a new Image
                var temp_img = new Image();

                // onload Event
                temp_img.onload = function () {
                    // unbind event
                    temp_img.onerror = temp_img.onabort = this.onload = null;

                    //
                    self._handleLoaderComplete(this, 'image');
                };

                // onabort Event
                temp_img.onabort = function (e) {
                };

                // onerror Event
                temp_img.onerror = function (e) {
                    temp_img.onerror = temp_img.onabort = this.onload = null;
                    self._handleError("Error loading image. src=" + self.url);
                };

                temp_img.src = this.url;
            };
            return ImageLoader;
        })(dc.io.Loader);
        io.ImageLoader = ImageLoader;
    })(dc.io || (dc.io = {}));
    var io = dc.io;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (_io) {
        var events = dc.events;
        var io = dc.io;

        /**
        * ImageLoader Class
        * @class ImageLoader
        * @namespace dc.io
        */
        var LoaderQueue = (function (_super) {
            __extends(LoaderQueue, _super);
            // Constructor
            // --------------------------------------------------------------------------------------------
            function LoaderQueue() {
                _super.call(this);

                this.mLoaderArray = [];
                this.mTotalLoader = 0;
                this.mTotalLoaderRemain = 0;

                this.mProgressEvent = new events.LoaderEvent(events.LoaderEvent.PROGRESS, this);
            }
            Object.defineProperty(LoaderQueue.prototype, "progress", {
                // Getter/Setter
                // --------------------------------------------------------------------------------------------
                get: function () {
                    return this.mTotalLoader == 0 ? 0 : (this.mTotalLoader - this.mTotalLoaderRemain) / this.mTotalLoader;
                },
                enumerable: true,
                configurable: true
            });

            // Public Methods
            // --------------------------------------------------------------------------------------------
            LoaderQueue.prototype.add = function (loader) {
                if (loader) {
                    this.mTotalLoader++;
                    this.mTotalLoaderRemain++;
                    this.mLoaderArray.push(loader);
                }
            };

            LoaderQueue.prototype.remove = function (loader) {
                //            this.
            };

            LoaderQueue.prototype.load = function () {
                for (var i = 0; i < this.mLoaderArray.length; i++) {
                    var loader = this.mLoaderArray[i];
                    loader.addEventListener(events.LoaderEvent.COMPLETE, this._handleLoaderComplete, this);
                    loader.load();
                }
            };

            //        public pause():void
            //        {
            //
            //        }
            //
            //        public resume():void
            //        {
            //
            //        }
            LoaderQueue.prototype._handleLoaderComplete = function (e) {
                var loader = e.target;

                // Remove listener
                loader.removeEventListener(events.LoaderEvent.COMPLETE, this._handleLoaderComplete);

                //
                this.mTotalLoaderRemain--;

                // Dispatch progress event
                this.dispatchEvent(this.mProgressEvent);
            };
            return LoaderQueue;
        })(events.EventDispatcher);
        _io.LoaderQueue = LoaderQueue;
    })(dc.io || (dc.io = {}));
    var io = dc.io;
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (parsers) {
        var ItemData = (function () {
            function ItemData() {
            }
            return ItemData;
        })();

        /**
        * @class XMLParser
        * @namespace DC
        * @constructor
        */
        var XMLParser = (function () {
            // Constructor
            // --------------------------------------------------------------------------------------------
            /**
            * Initialization method.
            * @method init
            * @param {string} path The root path
            * @protected
            */
            function XMLParser(path) {
                if (typeof path === "undefined") { path = ""; }
                this.rootPath = "";
                this.rootPath = path;
            }
            // Public Methods
            // --------------------------------------------------------------------------------------------
            /**
            * Parse the XML.
            * @method parse
            * @param {XML} xml
            * @param {Object} options
            */
            XMLParser.prototype.parse = function (xml, options) {
            };
            return XMLParser;
        })();
        parsers.XMLParser = XMLParser;

        /**
        * Parser to parse digicrafts custom album xml.
        * @class DCXMLParser
        * @namespace DC
        * @constructor
        */
        var DCXMLParser = (function (_super) {
            __extends(DCXMLParser, _super);
            function DCXMLParser() {
                _super.apply(this, arguments);
            }
            DCXMLParser.isXMLValid = function (xml) {
                return (dc.tag('items', xml).length > 0);
            };

            DCXMLParser.prototype.parse = function (xml, options) {
                var items = dc.tag('items', xml);

                // Custom items XML
                if (items.length > 0) {
                    // Create array to hold the item
                    var result = [];

                    // Check if disable relativepath
                    //                var basePath=((<Element>items.item(0)).getAttribute("relativepath")=="false")?this.rootPath:'';
                    var basePath = this.rootPath;

                    // Loop the <item>
                    var xml_items = dc.tag('item', xml);
                    for (var i = 0; i < xml_items.length; i++) {
                        // Get the node
                        var node = xml_items[i];
                        var temp_item = new ItemData();
                        var src = node.getAttribute('source').toString();
                        var thumbnail = node.getAttribute('thumbnail').toString();

                        //
                        temp_item.index = i;
                        temp_item.src = (src.indexOf("http") == 0) ? src : basePath + src;
                        temp_item.thumbnail = (thumbnail.indexOf("http") == 0) ? thumbnail : basePath + thumbnail;
                        temp_item.category = node.getAttribute('category').toString();

                        // Loop each child node
                        var child = node.childNodes;
                        for (var j = 0; j < child.length; j++) {
                            var child_node = child[j];

                            // Check node type
                            if (child_node.nodeType != 3)
                                temp_item[child_node.nodeName] = child_node.textContent.toString();
                        }

                        // push the item in result
                        result.push(temp_item);
                    }
                    return result;
                }
                return null;
            };
            return DCXMLParser;
        })(XMLParser);
        parsers.DCXMLParser = DCXMLParser;

        /**
        * Parser to parse LR generated album xml.
        * @class LRXMLParser
        * @namespace DC
        * @constructor
        */
        var LRXMLParser = (function (_super) {
            __extends(LRXMLParser, _super);
            function LRXMLParser() {
                _super.apply(this, arguments);
            }
            LRXMLParser.isXMLValid = function (xml) {
                return (dc.tag('mediaGroup', xml).length > 0);
            };

            LRXMLParser.prototype.parse = function (xml, options) {
                // Check relative Page
                //            var basePath=this.rootPath?this.rootPath:'';
                // Check if valid LR xml
                if (dc.tag('mediaGroup', xml).length > 0) {
                    var result = [];

                    // Loop the <item>
                    var xml_items = dc.tag('item', xml);
                    for (var i = 0; i < xml_items.length; i++) {
                        // Get the node
                        var node = xml_items[i];

                        // Temp Item Data
                        var temp_item = new ItemData();
                        temp_item.index = i;

                        // Fill the meta
                        if (dc.browser.ie) {
                            //                    if ($(this).find("description").get(0)) temp_item.description = $(this).find("description").get(0).text;
                            //                    if ($(this).find("title").get(0)) temp_item.title = $(this).find("title").get(0).text;
                            //                    if ($(this).find("category").get(0)) temp_item.category = $(this).find("category").get(0).text;
                        } else {
                            if (dc.tag('description', node))
                                temp_item.description = dc.tag('description', node)[0].textContent;
                            if (dc.tag('title', node))
                                temp_item.title = dc.tag('title', node)[0].textContent;
                            if (dc.tag('category', node))
                                temp_item.category = dc.tag('category', node)[0].textContent;
                        }

                        // Loop each rendition child node
                        var child = dc.tag('rendition', node);
                        for (var j = 0; j < child.length; j++) {
                            var child_node = child[j];
                            var size = child_node.getAttribute('size').toString();
                            var source = child_node.getAttribute('src').toString();
                            var w = Number(child_node.getAttribute('width'));
                            var h = Number(child_node.getAttribute('height'));

                            switch (size) {
                                case 'large':
                                    temp_item.largeSource = this.rootPath + source;
                                    temp_item.largeWidth = w;
                                    temp_item.largeHeight = h;
                                    break;
                                default:
                                    temp_item.thumbSource = this.rootPath + source;
                                    temp_item.thumbWidth = w;
                                    temp_item.thumbHeight = h;
                                    break;
                            }

                            temp_item.thumbnail = temp_item.thumbSource;
                            temp_item.src = temp_item.largeSource;
                            temp_item.width = w;
                            temp_item.height = h;
                        }

                        // push the item in result
                        result.push(temp_item);
                    }

                    return result;
                }

                return null;
            };
            return LRXMLParser;
        })(XMLParser);
        parsers.LRXMLParser = LRXMLParser;

        /**
        * Parser to parse PhotoShop generated album xml.
        * @class PSXMLParser
        * @namespace DC
        * @constructor
        */
        var PSXMLParser = (function (_super) {
            __extends(PSXMLParser, _super);
            function PSXMLParser() {
                _super.apply(this, arguments);
            }
            PSXMLParser.isXMLValid = function (xml) {
                return (dc.tag("gallery", xml).length > 0);
            };

            PSXMLParser.prototype.parse = function (xml, options) {
                if (dc.tag("gallery", xml).length > 0) {
                    var result = [];

                    // Get the path
                    var thumbpath = this.rootPath + dc.tag("thumbnail", xml)[0].getAttribute("base").toString();
                    var largepath = this.rootPath + dc.tag("large", xml)[0].getAttribute("base").toString();

                    // Loop the <image>
                    var xml_items = dc.tag("image", xml);
                    for (var i = 0; i < xml_items.length; i++) {
                        // Get the node
                        var node = xml_items[i];

                        // Temp Item Data
                        var temp_item = new ItemData();
                        var src = node.getAttribute('path').toString();
                        var thumbnail = node.getAttribute('thumbnpath').toString();

                        temp_item.index = i;

                        //                    temp_item.thumbnail = thumbpath + node.getAttribute('thumbnpath').toString();
                        //                    temp_item.src = largepath + node.getAttribute('path').toString();
                        temp_item.src = (src.indexOf("http") == 0) ? src : largepath + src;
                        temp_item.thumbnail = (thumbnail.indexOf("http") == 0) ? thumbnail : thumbpath + thumbnail;
                        temp_item.width = Number(node.getAttribute('width'));
                        temp_item.height = Number(node.getAttribute('height'));

                        // push the item in result
                        result.push(temp_item);
                    }

                    return result;
                }
                return null;
            };
            return PSXMLParser;
        })(XMLParser);
        parsers.PSXMLParser = PSXMLParser;

        /**
        *
        * @param data
        * @param rootPath
        * @returns {*[]}
        */
        function parseJSONData(data, path) {
            if (typeof path === "undefined") { path = ""; }
            for (var k = 0; k < data.length; k++) {
                var item = data[k];
                item.src = (item.src.indexOf("http") == 0) ? item.src : path + item.src;
                item.thumbnail = (item.thumbnail.indexOf("http") == 0) ? item.thumbnail : path + item.thumbnail;
            }

            return data;
        }
        parsers.parseJSONData = parseJSONData;

        /**
        *
        * @param nodes
        * @returns {*[]}
        */
        function parseDomData(nodes) {
            var data;
            if (nodes && nodes.length > 0) {
                data = [];
                var index = 0;
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    if (node.nodeType == 1 && node.className == "data") {
                        var item = {};
                        for (var k = 0; k < node.attributes.length; k++) {
                            var attrib = node.attributes[k];
                            var name = attrib.name.toString();
                            if (name.indexOf('data-') == 0) {
                                item[name.match(/^data-(.*)$/)[1]] = attrib.value;
                            }
                        }

                        // add index
                        item['index'] = index;
                        index++;

                        // set data invisible
                        node.style.display = "none";
                        data.push(item);
                    }
                }
            }
            return (data && data.length) > 0 ? data : null;
        }
        parsers.parseDomData = parseDomData;
    })(dc.parsers || (dc.parsers = {}));
    var parsers = dc.parsers; //dc.parsers
})(dc || (dc = {}));

var dc;
(function (dc) {
    (function (utils) {
        var OS = (function () {
            function OS() {
            }
            return OS;
        })();
        utils.OS = OS;

        var Browser = (function () {
            function Browser() {
            }
            return Browser;
        })();
        utils.Browser = Browser;

        var Detect = (function () {
            function Detect() {
            }
            Detect.init = function (ua) {
                var os = Detect.os = new OS(), browser = Detect.browser = new Browser(), webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/), android = ua.match(/(Android);?[\s\/]+([\d.]+)?/), ipad = ua.match(/(iPad).*OS\s([\d_]+)/), ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/), iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/), webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), touchpad = webos && ua.match(/TouchPad/), kindle = ua.match(/Kindle\/([\d.]+)/), silk = ua.match(/Silk\/([\d._]+)/), blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/), bb10 = ua.match(/(BB10).*Version\/([\d.]+)/), rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/), playbook = ua.match(/PlayBook/), chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/), firefox = ua.match(/Firefox\/([\d.]+)/), ie = ua.match(/MSIE ([\d.]+)/), safari = webkit && ua.match(/Mobile\//) && !chrome, opera = ua.match(/Opera\/([\d._]+)/), webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome, ie = ua.match(/MSIE\s([\d.]+)/);

                // Todo: clean this up with a better OS/browser seperation:
                // - discern (more) between multiple browsers on android
                // - decide if kindle fire in silk mode is android or not
                // - Firefox on Android doesn't specify the Android version
                // - possibly devide in os, device and browser hashes
                if (browser.webkit = !!webkit)
                    browser.version = webkit[1];

                if (android)
                    os.android = true, os.version = android[2];
                if (iphone && !ipod)
                    os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
                if (ipad)
                    os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
                if (ipod)
                    os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
                if (webos)
                    os.webos = true, os.version = webos[2];
                if (touchpad)
                    os.touchpad = true;
                if (blackberry)
                    os.blackberry = true, os.version = blackberry[2];
                if (bb10)
                    os.bb10 = true, os.version = bb10[2];
                if (rimtabletos)
                    os.rimtabletos = true, os.version = rimtabletos[2];
                if (playbook)
                    browser.playbook = true;
                if (kindle)
                    os.kindle = true, os.version = kindle[1];
                if (silk)
                    browser.silk = true, browser.version = silk[1];
                if (!silk && os.android && ua.match(/Kindle Fire/))
                    browser.silk = true;
                if (chrome)
                    browser.chrome = true, browser.version = chrome[1];
                if (firefox)
                    browser.firefox = true, browser.version = firefox[1];
                if (ie)
                    browser.ie = true, browser.version = ie[1];
                if (safari && (ua.match(/Safari/) || !!os.ios))
                    browser.safari = true;
                if (opera)
                    browser.opera = true;
                if (webview)
                    browser.webview = true;
                if (ie)
                    browser.ie = true, browser.version = ie[1];

                os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
                os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 || (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));

                os.mobile = os.phone || os.tablet || browser.silk;
            };
            return Detect;
        })();
        utils.Detect = Detect;

        // Init Detect
        Detect.init(navigator.userAgent);

        // Assign the shortcut
        dc.browser = Detect.browser;
        dc.os = Detect.os;
    })(dc.utils || (dc.utils = {}));
    var utils = dc.utils;
})(dc || (dc = {}));

var dc;
(function (dc) {
    dc.version = "1.0.0";
    dc.browser;
    dc.os;
    dc.ready = false;
    dc.noevent = function (ev) {
        var e = ev || window.event;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        return false;
    };

    // Logger
    // --------------------------------------------------------------------------------------------
    /**
    *
    */
    dc.logging = false;

    /**
    *
    */
    function t() {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        if (dc.logging && window.console)
            console.log.apply(console, arguments);
    }
    dc.t = t;

    // Dom Selector
    // --------------------------------------------------------------------------------------------
    /**
    *
    * @param a take a simple selector like "name", "#name", or ".name", and
    * @param scope an optional context, and
    * @returns {*}
    */
    function id(a, scope) {
        if (typeof scope === "undefined") { scope = document; }
        return (scope.getElementById(a));
    }
    dc.id = id;

    /**
    *
    * @param a take a simple selector like "name", "#name", or ".name", and
    * @param scope an optional context, and
    * @returns {*}
    */
    function name(a, scope) {
        if (typeof scope === "undefined") { scope = document; }
        return (scope.getElementsByClassName(a));
    }
    dc.name = name;

    /**
    *
    * @param a take a simple selector like "name", "#name", or ".name", and
    * @param scope an optional context, and
    * @returns {*}
    */
    function tag(a, scope) {
        if (typeof scope === "undefined") { scope = document; }
        return (scope.getElementsByTagName(a));
    }
    dc.tag = tag;

    /**
    *
    * @param name
    */
    function addClass(node, name) {
        if (node.className == "")
            node.className = name;
        else if (node.className.indexOf(name) == -1)
            node.className = node.className.toString() + " " + name;
    }
    dc.addClass = addClass;

    /**
    *
    * @param name
    */
    function removeClass(node, name) {
        node.className = node.className.replace(" " + name, "").replace(name + " ", "").replace(name, "");
    }
    dc.removeClass = removeClass;

    // Events
    // --------------------------------------------------------------------------------------------
    /**
    *
    * @param element
    * @param type
    * @param handler
    */
    function bind(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            element.attachEvent('on' + type, handler);
        }
    }
    dc.bind = bind;

    /**
    *
    * @param element
    * @param type
    * @param handler
    */
    function unbind(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler);
        } else {
            element.detachEvent('on' + type, handler);
        }
    }
    dc.unbind = unbind;

    // Ajax
    // --------------------------------------------------------------------------------------------
    // TODO: finish the ajax code
    function ajax() {
        var r = _XMLHttpRequest(0);
        //            r.responseType="xml";
        //            r.open("POST", this.url, true);
        //            r.onreadystatechange = null;
        //
        //            r.send();
    }
    dc.ajax = ajax;

    // cursor placeholder
    function _XMLHttpRequest(a) {
        for (a = 0; a < 4; a++)
            try  {
                return a ? new ActiveXObject([
                    ,
                    "Msxml2",
                    "Msxml3",
                    "Microsoft"
                ][a] + ".XMLHTTP") : new XMLHttpRequest;
            } catch (e) {
            }

        return null;
    }

    // Settings
    // --------------------------------------------------------------------------------------------
    /**
    * @private
    */
    dc._initQueue = [];

    /**
    *
    * @param fn
    * @param scope
    * @param priority
    */
    function asyncInit(fn, scope, priority) {
        if (typeof scope === "undefined") { scope = document; }
        if (typeof priority === "undefined") { priority = 0; }
        dc._initQueue.push({
            f: fn, scope: scope, priority: priority
        });
    }
    dc.asyncInit = asyncInit;

    /**
    *
    */
    function init() {
        if (dc.ready)
            return;
        dc.ready = true;
        dc.t('Digicrafts JS framework initialing...');

        for (var p in dc)
            for (var c in dc[p])
                if (dc[p][c] && dc[p][c].hasOwnProperty('setup'))
                    dc[p][c]['setup'].call(window);

        for (var i = 0, l = dc._initQueue.length; i < l; i++)
            dc._initQueue[i].f.apply(dc._initQueue[i].scope);

        dc.t('...Digicrafts JS Ready!');
    }
    dc.init = init;

    /**
    * Bind the load event to settings
    */
    bind(window, 'load', init);
})(dc || (dc = {}));
;
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
;
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
