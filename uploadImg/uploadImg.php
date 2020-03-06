<?php

deal_image();

function deal_image(){  
    
    if(is_uploaded_file($_FILES['img_url']['tmp_name'])){
        $ret = deal_upload_image_one('img_url');
        send_json(0,'上传成功',array('img_url'=>$ret));
    }
    send_json(0,'上传失败');
    
}

function deal_upload_image_one($input_name,$arr_type=array('jpg','jpeg','png','pjpeg','gif','bmp','x-png'),$size=1048576){
    
    if($_FILES[$input_name]['error']!=0)
    {
        send_json(1,'图片上传失败');
    }
    //图片格式检查
    $allow_type=$arr_type;
    $gettype=pathinfo($_FILES[$input_name]['name']);
    $type=$gettype['extension'];
    if(!in_array($type,$allow_type))
    {
        send_json(1,'图片格式不允许');
    }
    //图片大小检查
    if($_FILES[$input_name]['size']>$size)
    {
        send_json(1,'图片大小只允许在'.$size.'字节内');
    }


    $up_path = '/uploads/images';
    $date = date('Ymd',time());
    //$folder = __DIR__.$up_path.'/'.$date;
    $folder = $_SERVER['DOCUMENT_ROOT'].$up_path.'/'.$date;
    $url = '/'.$date.'/'.uniqid().'.'.$type;
   
    
    //$path = __DIR__.$up_path.$url;
    $path = $_SERVER['DOCUMENT_ROOT'].$up_path.$url;
    if(!is_dir($folder)){
        mkdir($folder, 0777,true);
    }

    if(move_uploaded_file($_FILES[$input_name]['tmp_name'], $path)==false){
        send_json(1,'图片移动失败');
    };
            
    //return '/uploadImg'.$up_path.$url;
    return $up_path.$url;
   
}

function send_json($err_code = 0,$msg='',$data = array()){
    die(json_encode(array(
        'err_code'=>$err_code,
        'msg'=>$msg,
        'data'=>$data
    )));
}



?>