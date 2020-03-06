<?php

del_image();

function del_image(){  

    $src = !empty($_POST['src'])?__DIR__."/..".$_POST['src']:send_json(1,'缺少参数');

    is_file($src) || send_json(1,'文件不存在',$src);
    
    unlink($src) || send_json(1,'文件删除失败');
    
    send_json(0);
    
}
  

function send_json($err_code = 0,$msg='',$data = array()){
    die(json_encode(array(
        'err_code'=>$err_code,
        'msg'=>$msg,
        'data'=>$data
    )));
}



?>