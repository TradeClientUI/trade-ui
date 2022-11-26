<?php
/*
Plugin Name: Cats前端文件上传插件
Plugin URI: http://www.cmfbl.com
Description: Cats前端文件上传插件
Version: 1.0
Author: ken.wang
Author URI: http://ken.com
License: cats2
*/


//定义插件启动时候调用的方法
register_activation_hook( __FILE__, 'cats_start_upload_install');

function cats_start_upload_install() {
    $sllHttp = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';
    $p_data['type'] = 'H5';
    $p_data['folder'] = plugin_dir_path(__FILE__ ) . 'dist';
    HttpPost($sllHttp . $_SERVER['SERVER_NAME'] . '/wp-json/wp/v2/uploadPluginApi',$p_data);
}

/**
 * 发起POST请求
 * @param String $url 目标网填，带http://
 * @param Array|String $data 欲提交的数据
 * @return string
 */
function HttpPost(string $url, $data, $timeout = 60): string
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}

