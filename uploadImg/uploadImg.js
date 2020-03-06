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

    obj.if_auto_upload = config.if_auto_upload || 2;//是否自动上传，1否2是
    input_class = obj.if_auto_upload==2?'cc_uploadImg':'cc_uploadImg_2';
    input_fileName = obj.if_auto_upload==2?'':'name="'+obj.prefix+'img"';
    input_hiddenName = obj.if_auto_upload==2?'name="'+obj.prefix+'img"':'';
    

    obj.top = config.top || 0;
    obj.left = config.left || 0;

    obj.width = config.width || 80;
    obj.height = config.height || 80;


    obj.src = uploadImg_path+'/add-img.jpg';
    obj.html = '<div>'+
                    '<div style="width: '+obj.width+'px;height: '+obj.height+'px; position: relative;top: '+obj.top+'px;left: '+obj.left+'px;">'+
                        '<img id="'+obj.prefix+'img" src="'+obj.src+'" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;"/>'+
                        '<input id="'+obj.prefix+'file" class="'+input_class+'" '+input_fileName+' type="file" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;opacity: 0;" accept="image/jpg,image/jpeg,image/png,image/PNG">'+
                        '<input '+input_hiddenName+' type="hidden" value=""/><i></i>'+
                    '</div>'+
                '</div>';
        

    

    obj.init = function(src){
        

        $('#'+obj.parent_id).append(obj.html);

        
        src = src || false;
        if(src!=false)obj.src = src;
        $('#'+obj.prefix+'img').attr('src',obj.src);

   
    }



    obj.getSrc = function(){
        return $('[name='+obj.prefix+'img]').val();
    }


    return obj;  



}

//cc_uploadImg 使用该class的统一用该方法上传
$(document).on('change','.cc_uploadImg',function() {
    

    Overtop.show('上传中...');

    var formdata = new FormData();
    formdata.append('img_url',$(this).get(0).files[0]);

    let _this =$(this);
    let _this2 =this;

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
            console.log(res);
            res=JSON.parse(res);
            if(res.err_code==0){

                console.log(res);


                _this.next().val(res.data.img_url);
                //console.log(_this.parent().prev().html());

                alert(res.msg);

                Overtop.hide();

                objUrl = getObjectURL(_this2.files[0]);
                _this.prev().attr('src',objUrl);
                console.log(objUrl);
                //$('[name=img_url]').val(res.data);
                //console.log($('[name=img_url]').val());
            }
            else{
                alert(res.msg);
                Overtop.hide();
            }
            
        },
        error:function(){
            alert('网络异常');
            Overtop.hide();
            console.log('error');
        }
    });    

});


$(document).on('change','.cc_uploadImg_2',function() {

    console.log($(this).val());
    console.log(666);

    objUrl = getObjectURL(this.files[0]);
    $(this).prev().attr('src',objUrl);
    console.log(objUrl);

});














