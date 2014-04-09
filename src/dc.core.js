
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
