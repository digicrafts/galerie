#galerie

See [html5components.com](http://www.html5components.com/products/galerie) for complete docs.

Galerie is a HTML5 component which allow you to build gallery in most easy way. You can use it to build your own gallery with many photos. Here are some highlighted features.

* Vertical and horizontal layout mode
* Display large image with popup modal
* Support lazy load
* Support mobile device (touch)
* Fully customizable with CSS
* Setup with javascript or HTML
* No external library is needed
* Compatible with other library/framework (Tested with bootstrap,angularjs,jquery,etc.)
* *Compatible Browsers:* IE9, IE10, IE11, Firefox, Safari, Mobile Safari, Opera, Chrome, Silk

#Licensing

##Commercial license

Galerie may be used in commercial projects and applications with the one-time purchase of a commercial license.

[Read more about commercial licensing.](http://www.html5components.com/license)

##Non-commercial license

Digicrafts is an avid supporter of open source software. Our open source license is the appropriate option if you are creating an open source application under a license compatible with the GNU GPL license v3 . Although the GPLv3 has many terms, the most important is that you must provide the source code of your application to your users so they can be free to modify your application for their own needs. For non-commercial, personal, or open source projects and applications, you may use Galerie for free under the terms of the GPL v3 License.

[GPL v3 License](http://choosealicense.com/licenses/gpl-v3/)

#Install

To get started, just download javascript file dc.galerie.pkg.min.js and css file dc.galerie.css. Place in your project directory. In the html, includes the javascript library and css in the header.

```js
<link rel="stylesheet" type="text/css" href="dc.galerie.css" />
<script src="dc.galerie.pkg.min.js"></script>
```

#Initialize with HTML

You can initialize a galerie instance in HTML without any javascript. Simply add *dc-galerie* to the class of the container element. The gallery will be start after the page is loaded.

```html
<div id="GALLERY_ID" class="dc-galerie"
        style="width:500px;height:400px"
        data-setting-thumbnailSize="140">
    <div class="data"
        data-src="path/to/your/image_1.jpg"
        data-thumbnail="path/to/your/thumbnail_1.jpg"
        data-title="title 1" data-description="description 1">
    </div>
    ...
    <div class="data"
        data-src="path/to/your/image_n.jpg"
        data-thumbnail="path/to/your/thumbnail_n.jpg"
        data-title="title n" data-description="description n">
    </div>
</div>
```

#Initialize with Javascript

If you rather want to initialize the gallery manually. You can use javascript to initialize a gallery. First, add an id attribute in the container element. Please specify the width/height of the container, since the gallery dimension will depends on it.

```html
<div id="PLACEMENT_ID" style="width:500px;height:400px" ></div>
```

The gallery is initiallize by the method dc.galerie(selector, options). The method come with 2 parameters. "selector" is a string of container id with format "#CONTAINER_ID". "options" is a key/value object which specify the initial options. Read more about the supported options in documents section. 

Add the following script in header to initialize the gallery. You can specify the array data for building the gallery with the "src" option.

```js
<script>
dc.asyncInit(function(){
    // Create a gallery
    var gallery=dc.galerie("#PLACEMENT_ID",{
            thumbnailSize:100,
            src:[
                    {
                        "src":"PATH/TO/IMAGE_1.jpg",
                        "thumbnail":"PATH/TO/THUMB_1.jpg",
                        "title":"Title 1",
                        "description":"Description 1"
                    },
                    ...
                    {
                        "src":"PATH/TO/IMAGE_n.jpg",
                        "thumbnail":"PATH/TO/THUMB_n.jpg",
                        "title":"Title n",
                        "description":"Description n"
                    }
            ]
        });
});
</script>
```

#Getting Support

Visit [html5components.com](http://www.html5components.com/products/galerie) for getting support.


by [Digicrafts.com.hk](http://www.digicrafts.com.hk/components)
