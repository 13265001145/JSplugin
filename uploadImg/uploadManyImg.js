//初始化处为改
if(!getMySrc){
    function getMySrc(){
        var scriptSrc = document.getElementsByTagName('script')[document.getElementsByTagName('script').length -1].src;
        return scriptSrc;
    }
}

if(!getMyPath){
    function getMyPath(){
        var scriptSrc = document.getElementsByTagName('script')[document.getElementsByTagName('script').length -1].src;
        var jsName = scriptSrc.split('/')[scriptSrc.split('/').length-1];
        return scriptSrc.replace(jsName,'');
    }
}

var uploadImg_path = getMyPath();

document.write('<script src="'+uploadImg_path+'common.js" type="text/javascript"><\/script>');


var uploadImg = function(parent_id,config){

    var obj = new Object();


    obj.parent_id = parent_id || false;
    if(obj.parent_id==false){
        console.log('Missing parameters "prefix"');
        return false;
    }

    config = config || {};


    obj.prefix = obj.parent_id+'_';
    

    obj.top = config.top || 0;
    obj.left = config.left || 0;

    obj.width = config.width || 80;
    obj.height = config.height || 80;

    obj.upload_num_max = config.upload_num_max || 9;//上传张数


    obj.src = uploadImg_path+'/add-img.jpg';


    obj.html = '<div style="width: 100%">'+
                    '<h5>可上传多张图片&nbsp;&nbsp;<em class="already_upload_num">0/'+obj.upload_num_max+'</em></h5>'+

                    '<!--<img src=""/>-->'+

                    '<div style="float:left; width: '+obj.width+'px;position:relative">'+
                        '<div class="'+obj.prefix+'thumbnail" style="width: '+obj.width+'px; height: '+obj.height+'px; ">'+
                            '<img src="'+obj.src+'" width="'+obj.width+'" height="'+obj.height+'" />'+
                        '</div>'+
                                        
                        '<input type="file" title="上传图片" name="'+obj.prefix+'img" class="myFile_many '+obj.prefix+'pic_1" data-mul="0" style="position: absolute; left: 0px; top: 0px;  font-size: 118px; margin: 0px; padding: 0px; cursor: pointer; opacity: 0; height: '+obj.height+'px; width: '+obj.width+'px; overflow: hidden;" />'+

                        //隐藏域传参至上传函数
                        '<input type="hidden" class="upload_num_max" value="'+obj.upload_num_max+'" />'+

                    '</div>'+
                '</div>'+
                '<input type="hidden" name="'+obj.prefix+'img_arr" value="" />';//隐藏域传参至表单

    

    obj.init = function(src){
        

        $('#'+obj.parent_id).append(obj.html);

        //编辑时的图片，未改
        src = src || false;
        if(src!=false)obj.src = src;
        $('#'+obj.prefix+'img').attr('src',obj.src);
   
    }



    obj.getSrc = function(span){

        span = span || false;//分隔符

        let ret = [];

        $.each($('#'+obj.parent_id).children().children('.img_arr'),function(i,v){
            //console.log(i+v);
            //console.log($(this).attr('data-src'));
            ret.push($(this).attr('data-src'));
        });

        if(span==false){
            return ret;//返回数组
        }
        return ret.join(span);//返回字符串

    }

    return obj;  



}






//myFile_many 使用该class的统一用该方法上传
$(document).on('change','.myFile_many',function() {

    //隐藏域传参
    let upload_num_max = $(this).siblings('.upload_num_max').val();

    Overtop.show('图片上传中...');

    if( $(this).parent().siblings('.img_arr').length >= upload_num_max ){
        Overtop.hide();
        alert('仅能上传'+upload_num_max+'张图片');
        return false;
    }


    var filepath = $(this).get(0).files[0].name;
    //console.log(this.files);
    //格式验证
    var extStart = filepath.lastIndexOf(".");
    var ext = filepath.substring(extStart, filepath.length).toUpperCase()
    if(ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG" && ext != ".PJPEG" && ext != ".X-PNG") {
        Overtop.hide();
        alert("系统仅支持jpg/jpeg/png/pjpeg/gif/bmp/x-png格式的图片！");
        
        //$(".img_div").html("");
        return false;
    }
    //end格式验证
    
    //文件大小
    var filesize = $(this).get(0).files[0].size;
    if(filesize > 1024*1024*1){
        Overtop.hide();
        alert("图片大小不能超过1M！");

        //$(".img_div").html("");
        return false;
    }


    //提交数据
        var formdata = new FormData();
        formdata.append('img_url',$(this).get(0).files[0]);
        //console.log($(this).get(0).files[0]);

        var _this=$(this);
        objUrl = getObjectURL(this.files[0]);

        $.ajax({
            url: uploadImg_path + 'uploadImg.php',
            type:'POST',
            data:formdata,
            datatype:"json",
            //async: false,  
            cache: false, 
            contentType: false, //不设置发送数据的类型
            processData: false, //自动序列化
            success:function(res){
                res=JSON.parse(res);
                if(res.err_code==0){
                    console.log(res);


                    //更新图片
                    width = _this.prev().children().attr('width');
                    height = _this.prev().children().attr('height');
                    _this.parent().before('<img class="img_arr" src="'+objUrl+'" data-src="'+res.data.img_url+'" width="'+width+'" height="'+height+'" style="float:left;  box-sizing:border-box; margin:0 10px 10px 0;"/>');


                    //更新目前张数
                    _this.parent().siblings('h5').children('.already_upload_num').text( _this.parent().siblings('.img_arr').length+'/9' );


                    //更新隐藏域
                    let ret = [];
                    $.each(_this.parent().siblings('.img_arr'),function(i,v){
                        ret.push($(this).attr('data-src'));
                    });
                    _this.parent().parent().next().val(ret.join('|||'));
                    //console.log(_this.parent().parent().next().val());


                }
                else{
                    alert(res.msg);
                }
        },
        error:function(){
            console.log('error');
        },
        complete:function(){
            Overtop.hide();
        }
    });   
});



/*点击事件*/
$(document).on('click','.img_arr',function(){
    var _this=$(this);
    
    var r = confirm('确定删除该张图片？');
    if(r==true){

        $.post(uploadImg_path + 'delimg.php',
            {src:_this.attr('data-src')},
            function(res){
                console.log(res);
                if(res.err_code==0){

                    //更新目前张数
                    _this.siblings('h5').children('.already_upload_num').text(_this.siblings('.img_arr').length+'/9');

                    //更新隐藏域
                    let ret = [];
                    $.each(_this.siblings('.img_arr'),function(i,v){
                        ret.push($(this).attr('data-src'));
                    });
                    _this.parent().next().val(ret.join('|||'));
                    //console.log(_this.parent().next().val());
                   
                    //删除图片
                    _this.remove();

                }
                else{
                    alert(res.msg);
                }
            }
        ,'json');
    }
    else{
        return false;
    }
});
















