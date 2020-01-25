<?php
defined('is_running') or die('Not an entry point...');


class TwitterCarousel{

	const old_content_keys = array('Carousel232','BS4Carousel');
	const content_key = 'BSCarousel';


	/**
	 * Bootstrap carousel style: 
	 * 'def' - default for old plugin version
	 * 'bs4' - default for Bootstrap4  (section must be edited to update to a new style)
	 */
	const style = 'bs4';


	/**
	 * Determine if the $type matches this content key
	 */
	static function ContentKeyMatch($type){
		global $addonFolderName;
		if ( $type === self::content_key  || in_array($type, self::old_content_keys) ){
			return true;
		}
	}


	/**
	* Just get the current layout's Bootstrap main version quickly
	* this function can be used stand-alone and does not require the other class functions
	* @return boolean|integer false(not Bootstrap) | true(Bootstrap but no version number) | 2 | 3 | 4 ...
	*/
	static function IsBootstrap(){
		global $page, $config, $gpLayouts;

		// admin pages don't have a theme/layout
		if( $page->pagetype === 'admin_display' ){
		  return false;
		}

		$layout_id = isset($page->TitleInfo['gpLayout']) ?
		  $page->TitleInfo['gpLayout'] :  // page uses a custom layout
		  $config['gpLayout'];            // page uses the default layout

		// get more info from global $gpLayouts
		$layout_arr = $gpLayouts[$layout_id];

		// FrontEndFramework section in Addon.ini is not defined
		// or the name(key) value is not 'Bootstrap'
		if( !isset($layout_arr['framework']['name']) ||
			strtolower($layout_arr['framework']['name']) != 'bootstrap' ){
		  return false;
		}

		// FrontEndFramework section in Addon.ini is defined and 
		// the name(key) value is 'Bootstrap'
		// but there is no version(key)
		if( empty($layout_arr['framework']['version']) ){
		  return true;
		}

		// extract the main version from the version value
		// e.g. 4.3.1-b2 => 4
		$pieces   = explode('.', $layout_arr['framework']['version']);
		$main_ver = preg_replace('/[^0-9]/', '', $pieces[0]);

		return (int)$main_ver;
	}
	
	
	/**
	* Set up carousel class names according to Bootstrap version
	*/
	static function InintBSSettigs(){
		$BSVer = self::IsBootstrap();
		if ( $BSVer < 4 ){
			$carousel_item_class = 'item';
			$carousel_control_prev_class = 'carousel-control left';
			$carousel_control_next_class = 'carousel-control right';
			$lctrl='&lsaquo;';
			$rctrl='&rsaquo;';
		} else {
			$carousel_item_class = 'carousel-item';
			$carousel_control_prev_class = 'carousel-control-prev';
			$carousel_control_next_class = 'carousel-control-next';
			if (self::style == 'def') {
				$lctrl='&lsaquo;';
				$rctrl='&rsaquo;';
			}else{
				$lctrl='<span class="carousel-control-prev-icon" aria-hidden="true"></span>';
				$rctrl='<span class="carousel-control-next-icon" aria-hidden="true"></span>';
			}
		}
		return array($carousel_item_class,$carousel_control_prev_class,$carousel_control_next_class,$lctrl,$rctrl);
	}
	


	/**
	 * @static
	 */
	static function GetHead() {
		global $page, $addonRelativeCode;
		$page->head_js[]  = $addonRelativeCode . '/carousel.js';
	}


	static function SectionTypes($section_types, $generated_key = false ){
		$section_types[self::content_key] = array();
		$section_types[self::content_key]['label'] = 'Bootstrap4 Carousel Gallery';
		return $section_types;
	}


	static function NewSections($links){
		global $addonRelativeCode;
		foreach($links as $key => $section_type_arr){
			if( $section_type_arr[0] == self::content_key ){
				$links[$key] = array(self::content_key, $addonRelativeCode . '/icon/section.png');
			}
		}
		return $links;
	}


	static function SectionToContent($section_data){
		if( !self::ContentKeyMatch($section_data['type']) ){
			return $section_data;
		}

		//update content
		if( !isset($section_data['content_version']) ){
			$section_data['content'] = self::GenerateContent($section_data);
		}
		self::AddComponents();
		return $section_data;
	}


	static function GenerateContent($section_data){
		global $dataDir;
	
		list($carousel_item_class,$carousel_control_prev_class,$carousel_control_next_class,$lctrl,$rctrl) = self::InintBSSettigs();
		
		$section_data += array('images'=>array(),'height'=>'400');

		$id = 'carousel_'.time();

		$images = '';
		$indicators = '';
		$thumbs = '';
		$j = 0;
		foreach($section_data['images'] as $i => $img){
			if( empty($img) ){
				continue;
			}
			$caption = trim($section_data['captions'][$i]);

			$class = '';
			$style = '';
			if( $j == 0 ){
				$class = 'active';
			}
			if( !isset($section_data['content_version']) ){
				$class .= ' gp_to_remove';
			}

			//images
			$caption_class = '';
			if( empty($caption) ){
				$caption_class = 'no_caption';
			}
			$images .= '<div class="'.$carousel_item_class.' '.$class.'">'
						.'<img src="'.common::GetDir('/include/imgs/blank.gif').'" style="background-image:url('.$img.')" alt="'.$caption.'">'
						.'<div class="caption carousel-caption '.$caption_class.'">'.$caption.'</div>'
						.'</div>';

			//indicators
			$thumb_path = common::ThumbnailPath($img);

			if( !$section_data['show_indicators'] ){
				$style = 'display: none;';
			}
			$indicators .= '<li data-target="#'.$id.'" data-slide-to="'.$j.'" class="'.$class.'" style="'.$style.'">';
			$indicators .= '<a href="'.$img.'" aria-hidden="true"><img src="'.$thumb_path.'" alt="" class="d-none" aria-hidden="true"></a>';
			$indicators .= '</li>';
			$j++;
		}


		ob_start();

		$class = 'gp_twitter_carousel carousel slide';
		if( !$section_data['auto_start'] ){
			$class .= ' start_paused';
		}
		if( $section_data['show_vertical'] ){
			$class .= ' vertical';
		}
		$attr = ' data-speed="5000"';
		if( isset($section_data['interval_speed']) && is_numeric($section_data['interval_speed']) ){
			$attr = ' data-speed="'.$section_data['interval_speed'].'"';
		}
		$attr .= ' data-pause="hover"';

		if (strpos($section_data['height'], '%') == false){
			if( !empty($section_data['images']) ){
				$style = 'height: auto;';
			}else{
				$style= 'height: 100%;';
			}
		}else{
			$style = 'height: '.$section_data['height'].';';
		}
		
		echo '<div id="'.$id.'" class="'.$class.'"'.$attr.'" style="'.$style.'">';

		if ($section_data['height'] == '' || $section_data['height'] == 'auto'){
			if( !empty($section_data['images']) ){
				echo '<div>';
				echo '<img src="'.$section_data['images'][0].'" style="visibility: hidden; height: auto; width: 100%" aria-hidden="true">';
			}else{
				echo '<div style="padding-bottom:100%">';
			}
		}else{
			echo '<div style="padding-bottom:'.$section_data['height'].'">';
		}
		
		
		// Indicators
		echo '<ol class="carousel-indicators">';
		echo $indicators;
		echo '</ol>';


		// Carousel items
		echo '<div class="carousel-inner">';
		echo $images;
		echo '</div>';

		// Carousel control
		if( $section_data['show_controls'] ){
			echo '<a class="'.$carousel_control_prev_class.'" data-target="#'.$id.'" href="#'.$id.'" role="button" data-slide="prev" aria-label="prev">'.$lctrl.'</a>';
			echo '<a class="'.$carousel_control_next_class.'" data-target="#'.$id.'" href="#'.$id.'" role="button" data-slide="next" aria-label="next">'.$rctrl.'</a>';
		}	


		echo '</div></div>';

		return ob_get_clean();
	}


	static function DefaultContent($default_content,$type){
		if( !self::ContentKeyMatch($type) ){
			return $default_content;
		}
		$section = array();
		$section['gp_label'] = 'Bootstrap Carousel Gallery';
		$section['gp_color'] = '#8d3ee8';
		$section['images'] = array(0 => '/include/imgs/default_image.jpg');
		$section['height'] = '30%';
		$section['interval_speed'] = 5000;
		$section['auto_start'] = false;
		$section['show_vertical'] = false;
		$section['show_controls'] = true;
		$section['show_indicators'] = true;
		$section['content'] = self::GenerateContent($section);
		self::AddComponents();
		return $section;
	}


	static function SaveSection($return, $section, $type){
		if( !self::ContentKeyMatch($type) ){
			return $return;
		}
		global $page;

		$_POST += array(
			'auto_start'=>'',
			'show_vertical'=>'',
			'show_controls'=>'',
			'show_indicators'=>'',
			'images'=>array()
			);

		$page->file_sections[$section]['images']			= $_POST['images'];
		$page->file_sections[$section]['captions']			= $_POST['captions'];
		$page->file_sections[$section]['height']			= $_POST['height'];
		$page->file_sections[$section]['auto_start']		= ($_POST['auto_start'] == 'true');
		$page->file_sections[$section]['show_vertical']		= ($_POST['show_vertical'] == 'true');
		$page->file_sections[$section]['show_controls']		= ($_POST['show_controls'] == 'true');
		$page->file_sections[$section]['show_indicators']	= ($_POST['show_indicators'] == 'true');
		$page->file_sections[$section]['content_version']	= 2;
		if( isset($_POST['interval_speed']) && is_numeric($_POST['interval_speed']) ){
			$page->file_sections[$section]['interval_speed'] = $_POST['interval_speed'];
		}

		$page->file_sections[$section]['content'] = self::GenerateContent($page->file_sections[$section]);
		
		return true;
	}


	/**
	 * Make sure the .js and .css is available to admins
	 */
	static function GenerateContent_Admin(){
		global $addonFolderName, $page, $addonRelativeCode;
		self::AddComponents();
	}


	static function AddComponents(){
		global $addonFolderName, $page, $addonRelativeCode;
		static $done = false;
		if ( $done ) return;

		$BSVer = self::IsBootstrap();
		if ( $BSVer == 2 ) {
			common::LoadComponents( 'bootstrap-carousel' );
			$page->css_user[] = $addonRelativeCode . '/carousel-def.css';
		} elseif ( !$BSVer || ($BSVer == 3) ) {
			common::LoadComponents( 'bootstrap3-carousel' );
			$page->css_user[] = $addonRelativeCode . '/carousel-def.css';
			$page->css_user[] = $addonRelativeCode . '/carousel.css';
		} else {
			common::LoadComponents( 'bootstrap4-carousel' );
			if (self::style == 'def') {
				$page->css_user[] = $addonRelativeCode . '/carousel-def.css';
			}else{
				$page->css_user[] = $addonRelativeCode . '/carousel-bs4.css';
			}
		}
		$page->css_user[] = $addonRelativeCode . '/carousel-vert.css';
		
		$done = true;
	}


	static function InlineEdit_Scripts($scripts,$type){
		if( !self::ContentKeyMatch($type) ){
			return $scripts;
		}
		global $addonRelativeCode;
		$scripts[] = '/include/js/inline_edit/image_common.js';
		$scripts[] = '/include/js/inline_edit/gallery_edit_202.js';
		$scripts[] = $addonRelativeCode.'/gallery_options.js';
		$scripts[] = '/include/js/jquery.auto_upload.js';

		return $scripts;
	}
}