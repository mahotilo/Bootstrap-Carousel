<?php
defined('is_running') or die('Not an entry point...');

class TwitterCarousel_Admin{

	public static $config;
	public static $components;
	public static $debug = true;

	public static function Settings(){
		global $page, $addonRelativeCode, $langmessage;

		if( isset($_POST['save']) ){
		  msg(self::SaveConfig()); 
		}
		self::LoadConfig();
		self::GetComponents();

		$admin_url = \gp\tool::GetUrl('Admin_TwitterCarousel');

		echo  '<h2 class="hqmargin">Bootstrap Carousel Gallery &raquo; Settings</h2>';

		echo  '<form id="cketconfig_form" data-values-changed="0" action="' . $admin_url . '" method="post">';
		echo      '<table class="bordered" style="width:100%;">';

		echo        '<tr>';
		echo          '<th style="width:40%;">' . $langmessage['Settings'] . '</th>';
		echo          '<th style="width:60%;">' . $langmessage['Current_Value'] . '</th>';
		echo        '</tr>';

		$value = self::$config['theme'];
		echo        '<tr>';
		echo          '<td>Carousel theme*</td>';
		echo          '<td>';
		echo            '<select class="gpselect" name="cketconfig[theme]">';
		echo              '<option value="Bootstrap default">Bootstrap default</option>';
		foreach( self::$components['themes'] as $theme ){
		  $label =  $theme['name'];
		  $selected = $label == $value ? ' selected="selected" ' : '';
		  echo            '<option value="' . $label . '" ' . $selected . '>' . $label . '</option>';
		}
		echo            '</select>';
		echo          '</td>';
		echo        '</tr>';

		echo    '</table>';

		echo    '<br/>';
		echo    '<p>* - All Carousel sections should be re-saved in order to fully apply the new theme</p>';

		// SAVE / CANCEL
		echo    '<br/>';
		echo    '<input type="submit" id="cketconfig_submit" name="save" value="' . $langmessage['save'] . '" class="gpsubmit" /> ';
		echo    '<input type="button" onClick="location.href=\'' .$admin_url . '\'" value="' . $langmessage['cancel'] . '" class="gpcancel" />';
		echo  '</form>';
	}



	public static function GetComponents(){
		global $page, $addonPathCode;
		self::$components = array( 
		  'themes' => array(),
		);
		self::$components['themes'][] = array( 
		  'name' =>    'Bootstrap default',
		  'name' =>    'TS style',
		);
	}



	public static function LoadConfig(){
		global $addonPathCode, $addonPathData;
		$config_file = $addonPathData . '/config.php';
		if( file_exists($config_file) ){
		  include $config_file;
		}else{
			$config = array (
			  'theme' => 'Bootstrap default',
			);
		}
		self::$config = $config;
	}



	public static function SaveConfig(){
		global $addonPathData, $langmessage;
		$config = array (
		  'theme' => 'Bootstrap default',
		);
		foreach ($_POST['cketconfig'] as $key => $value) {
		  switch($key){
			case 'theme':
			  $config['theme'] = basename(trim($value)); 
			  break;
			default:
		  }
		}
		$config_file = $addonPathData . '/config.php';
		if( \gp\tool\Files::SaveData($config_file, 'config', $config) ){
		  msg($langmessage['SAVED']);
		}else{
		  msg($langmessage['OOPS']);
		}
	}

}
