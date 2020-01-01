# Bootstrap-Carousel plugin for [Typesetter CMS](https://github.com/Typesetter/Typesetter) 
## Fork of Bootstrap-Carousel plugin  ([Josh S.](https://github.com/oyejorge)) [Plugin Page](http://www.typesettercms.com/Plugins/232_Bootstrap_Carousel_Gallery)

* For all versions of Bootstrap (Typesetter CMS 5.1 and higher)
* Uses the same content key as the original plugin, therefore it can be used as update for existing galleries (the section must be edited to update)
* Two styles for caption, indicators and control elements (can only be changed by editing the source code of TwitterCarousel.php)

	TwitterCarousel.php
```	
/**
* Bootstrap carousel style: 
* 'def' - default for old plugin version
* 'bs4' - default for Bootstrap4  (the section must be edited to update to a new style)
*/
const style = 'bs4';
//             ^^^ 
```

* Supports a new style of responsive carousel height sizing.
   If height="" or "auto", the size of the carousel is determined based on the responsive size of the first image in the series (width=100%; height= auto)


## Changelog
* remove jquery.mobile.custom.js and use swipe detection in carousel.js 
* support for all versions of Bootstrap with autodetection of theme's BS version 