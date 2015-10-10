<?php 
function dosql($q)
{	
	$link=mysql_connect("localhost","root","123456"); 
	

	if (!$link)
	{
	  die('Could not connect: ' . mysql_error());
	}
	
	mysql_select_db("projectCtr", $link);
	$rs = mysql_query($q, $link); //获取数据集 
	return $rs;
}