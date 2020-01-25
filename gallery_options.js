$.extend(gp_editor,{

	sortable_area_sel:	'.carousel-indicators',
	img_name:			'',
	img_rel:			'',
	edit_links_target:	'.carousel-inner .item, .carousel-inner .carousel-item',

	make_sortable:		false,
	auto_start:			true,


	/**
	 * Add control elements to CKE
	 *
	 */
	editorLoaded : function(section_object){
		$('<div class="half_width">Vertical: <input class="ck_input" type="checkbox" name="show_vertical" value="true" /></div>')
		  .appendTo('#gp_gallery_options')
		  .find('input')
		  .prop('checked',section_object.show_vertical);

		$('<div class="half_width">Controls: <input class="ck_input" type="checkbox" name="show_controls" value="true" /></div>')
		  .appendTo('#gp_gallery_options')
		  .find('input')
		  .prop('checked',section_object.show_controls);

		$('<div class="half_width">Indicators: <input class="ck_input" type="checkbox" name="show_indicators" value="true" /></div>')
		  .appendTo('#gp_gallery_options')
		  .find('input')
		  .prop('checked',section_object.show_indicators);
		  
		if ( !section_object.show_controls ){ 
			edit_links_target = false;
		}  
	},



	/**
	 * Stop carousel cycling when editor is active
	 *
	 */
	wake: function(){
		$(gp_editor.edit_div).find('.gp_twitter_carousel').carousel('pause');
	},

	/**
	 * Restart carousel cycling if auto_start field is checked
	 *
	 */
	sleep: function(){
		if( $('#ckeditor_wrap input[name=auto_start]:checked').length > 0 ){
			$(gp_editor.edit_div).find('.gp_twitter_carousel').carousel('cycle');
		}
	},


	/**
	 * Listen for an image being added
	 *
	 */
	addedImage: function($li){
		var src			= $li.find('a:first').attr('href');
		var carousel	= $li.closest('.gp_twitter_carousel');
		var $inner		= carousel.find('.carousel-inner');
		var blank		= $('.gp_blank_img').data('src') || '';
		var $item		= $('<div class="carousel-item"><img src="'+blank+'" style="background-image:url('+src+')"><div class="caption carousel-caption no_caption"></div></div>').appendTo($inner);

		$li.attr('data-target','#'+carousel.attr('id')).attr('data-slide-to',$li.siblings().length);

		if( !$item.siblings().length ){
			$item.addClass('active');
			$li.addClass('active');
		}

	},


	/**
	 * Update the caption if the current image is the active image
	 *
	 */
	updateCaption : function(current_image,text){
		var caption_div = $(current_image).find('.caption');
		test = text.replace(/^\s+/,'');
		if( text == '' ){
			caption_div.addClass('no_caption');
		}else{
			caption_div.removeClass('no_caption');
		}
	},



	/**
	 * Remove an image
	 * Reset data-slide-to
	 */
	removeImage : function(current_image){

		var index				= $(current_image).index();
		var $indicator_area		= $('.gp_editing .carousel-indicators');

		//remove indicator
		$indicator_area.children().eq(index).remove();

		$('.gp_editing').carousel('next');

		//reorder indicatorss
		$indicator_area.children().each(function(i){
			$(this).attr('data-slide-to',i).data('slide-to',i);
		});
	},


	/**
	 * Size Changes
	 *
	 */
	heightChanged : function(){
		$('.gp_editing .gp_twitter_carousel').stop(true,true).delay(800).animate({'padding-bottom':this.value});
	},


	/**
	 * Interval Speed
	 *
	 */
	intervalSpeed : function(){
	},


	/**
	 * Reorder full size images
	 *
	 */
	sortStop: function(){

		var full_wrap	= gp_editor.edit_div.find('.carousel-inner');
		var full_images = full_wrap.find('.item, .carousel-item');


		gp_editor.edit_div.find( gp_editor.sortable_area_sel ).children().each(function(i){
			var $this		= $(this);
			var slide_to	= $this.data('slide-to');

			full_images.eq(slide_to).attr('data-new-position',i)

			$this.data('slide-to',i).attr('data-slide-to',i);

			var $img = $this;
		});


		//order the full images
		full_images.sort(function(a,b){
			return $(a).attr('data-new-position') < $(b).attr('data-new-position');
		}).each(function(){
			full_wrap.prepend(this);
		});

	},


});
