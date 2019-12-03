## Bootstrap-Carousel-4 plugin for [Typesetter CMS](https://github.com/Typesetter/Typesetter) 
## Fork of Bootstrap-Carousel plugin  ([Josh S.](https://github.com/oyejorge))
[Plugin Page](http://www.typesettercms.com/Plugins/232_Bootstrap_Carousel_Gallery)

* For Bootstrap 4 only
* Use same content key as orifinal plugin, so can be used as update for exiting galleries (section must be edited to update)
* Two styles for caption, indicators and control elemets (changes only via editing of sourse code in TwitterCarousel.php)

	TwitterCarousel.php
	/**
	 * Bootstrap carousel style: 
	 * 'def' - default for old plugin version
	 * 'bs4' - default for Bootstrap4  (section must be edited to update to a new style)
	 */
	const style = 'bs4';
       //                    ^^^ 

* Suport new style of responsive carousel height sizing.
   If heigt="" or "auto", size of carousel is defined basing on size of first image in series (width=100%; height= auto)
