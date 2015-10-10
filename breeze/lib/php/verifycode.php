<?php

function verifyImg()  {
	session_start(); 
    $length = (empty($_REQUEST['length']) ? 5 : intval($_REQUEST['length']));
    $width = (empty($_REQUEST['width']) ? 68 : intval($_REQUEST['width']));
    $height = (empty($_REQUEST['height']) ? 28 : intval($_REQUEST['height']));
    $chs = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    $code = '';
    for($i = 0; $i < $length; $i++) {
        $sn = rand(0, 34);
        $code .= substr($chs, $sn, 1);
    }
    $_SESSION["verifycode"] = $code;
    $w = ($length*10+10);
    if($w > $width) {
        $width = $w;
    }
    if(function_exists('imagecreatetruecolor')) {
        $im = @imagecreatetruecolor($width, $height);
    }else {
        $im = @imagecreate($width,$height);
    }
    $r = Array(225,255,255,223);
    $g = Array(225,236,237,255);
    $b = Array(225,236,166,125);
    $key = mt_rand(0, 3);

    $backColor = imagecolorallocate($im, $r[$key],$g[$key],$b[$key]);    //背景色（随机）
    $borderColor = imagecolorallocate($im, 100, 100, 100);               //边框色
    $pointColor = imagecolorallocate($im,mt_rand(0,255),mt_rand(0,255),mt_rand(0,255));                 //点颜色

    @imagefilledrectangle($im, 0, 0, $width - 1, $height - 1, $backColor);
    @imagerectangle($im, 0, 0, $width-1, $height-1, $borderColor);
    $stringColor = imagecolorallocate($im,mt_rand(0,200),mt_rand(0,120),mt_rand(0,120));
    // 干扰
    for($i=0;$i<10;$i++){
        $fontcolor=imagecolorallocate($im,mt_rand(0,255),mt_rand(0,255),mt_rand(0,255));
        imagearc($im,mt_rand(-10,$width),mt_rand(-10,$height),mt_rand(30,300),mt_rand(20,200),55,44,$fontcolor);
    }
    for($i=0;$i<25;$i++){
        $fontcolor=imagecolorallocate($im,mt_rand(0,255),mt_rand(0,255),mt_rand(0,255));
        imagesetpixel($im,mt_rand(0,$width),mt_rand(0,$height),$pointColor);
    }
    for($i=0;$i<$length;$i++) {
        imagestring($im,5,$i*10+5,mt_rand(1,8),$code{$i}, $stringColor);
    }
    ob_clean();
    header('Content-type: image/png');
    imagepng($im);
    imagedestroy($im);
}

exit(verifyImg());

?>