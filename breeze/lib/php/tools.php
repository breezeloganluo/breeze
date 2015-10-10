<?php
if (!function_exists('getallheaders'))
{
    function getallheaders()
    {
       foreach ($_SERVER as $name => $value)
       {
           if (substr($name, 0, 5) == 'HTTP_')
           {
               $headers[str_replace(' ', '-', str_replace('_', ' ', substr($name, 5)))] = $value;
           }
       }
       return $headers;
    }
}

function GetIP()
{
	if(!empty($_SERVER["HTTP_CLIENT_IP"]))
	   $cip = $_SERVER["HTTP_CLIENT_IP"];
	else if(!empty($_SERVER["HTTP_X_FORWARDED_FOR"]))
	   $cip = $_SERVER["HTTP_X_FORWARDED_FOR"];
	else if(!empty($_SERVER["REMOTE_ADDR"]))
	   $cip = $_SERVER["REMOTE_ADDR"];
	else
	   $cip = "�޷���ȡ��";
	return $cip;
}
function uuid($prefix = "") { 
	$chars = md5(uniqid(rand())); 
	$uuid = substr($chars,0,8) . '-'; 
	$uuid .= substr($chars,8,4) . '-'; 
	$uuid .= substr($chars,12,4) . '-'; 
	$uuid .= substr($chars,16,4) . '-'; 
	$uuid .= substr($chars,20,12);  
	return $prefix . $uuid; 
}

function sql_quote( $value )
{
	$rs = str_replace("\\","\\\\",$value);
    $rs = str_replace("'","\\'",$rs);
    return $rs;
}

class Crypt3Des
{    
    public $key    = "Huawei_63386_Wuminghui\0\0";
    public $iv    = "12345678"; //like java: private static byte[] myIV = { 50, 51, 52, 53, 54, 55, 56, 57 };
    
    //����
    public function encrypt($input)
    {
        $input = $this->padding( $input );
        //$key = base64_decode($this->key);
		$key = $this->key;
        $td = mcrypt_module_open( MCRYPT_3DES, '', MCRYPT_MODE_CBC, '');
        //ʹ��MCRYPT_3DES�㷨,cbcģʽ
        mcrypt_generic_init($td, $key, $this->iv);
        //��ʼ����
        $data = mcrypt_generic($td, $input);
        //����
        mcrypt_generic_deinit($td);
        //����
        mcrypt_module_close($td);

		$data=bin2hex($this->iv.$data);
		//$data=bin2hex($data);
        $data = $this->removeBR(base64_encode($data));
        return $data;
    }
    
    //����
    public function decrypt($encrypted)
    {		
		$encrypted = base64_decode($encrypted);			
		$encrypted = $this->hex2bin($encrypted);			
		
		$iv = substr($encrypted,0,8);

		$encrypted = substr($encrypted,8);

		//$iv =  $this->iv;
		//$key = base64_decode($this->key);
		$key = $this->key;
		$td = mcrypt_module_open( MCRYPT_3DES,'',MCRYPT_MODE_CBC,'');
		//ʹ��MCRYPT_3DES�㷨,cbcģʽ
		mcrypt_generic_init($td, $key, $iv);
		//��ʼ����
		$decrypted = mdecrypt_generic($td, $encrypted);
		//����
		mcrypt_generic_deinit($td);
		//����
		mcrypt_module_close($td);
		$decrypted = $this->removePadding($decrypted);
		return $decrypted;	
    }
    
    //������룬�����8�ı���
    public function padding( $str )
    {
        $len = 8 - strlen( $str ) % 8;
        for ( $i = 0; $i < $len; $i++ )
        {
            $str .= chr( 0 );
        }
        return $str ;
    }
    
    //ɾ������
    public function removePadding( $str )
    {
        $len = strlen( $str );
        $newstr = "";
        $str = str_split($str);
        for ($i = 0; $i < $len; $i++ )
        {
            if ($str[$i] != chr( 0 ))
            {
                $newstr .= $str[$i];
            }
        }
        return $newstr;
    }
    
    //ɾ���س��ͻ���
    public function removeBR( $str ) 
    {
        $len = strlen( $str );
        $newstr = "";
        $str = str_split($str);
        for ($i = 0; $i < $len; $i++ )
        {
            if ($str[$i] != '\n' and $str[$i] != '\r')
            {
                $newstr .= $str[$i];
            }
        }
    
        return $newstr;
    }
	function hex2bin($data) {
		 $len = strlen($data);
		 return pack("H" . $len, $data); 
	} 
}
?>