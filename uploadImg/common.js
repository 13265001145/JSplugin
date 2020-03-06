if(!Overtop){
    var Overtop = {
        _element:function(tips,style){
            var c = '';
            if(style == 1){
                c = 'rgba(0, 0, 0, 0.5)';
            }else if(style == 2){
                c = 'rgba(255, 255, 255, .3)';
            }
            var ele='<div id="Overtop" style="background:'+c+';z-index:10000;position:fixed;width:100%;height:100%;display:block;top:0;left:0;">\
                        <div style="color:'+(style==1?'#fff':'#555')+';-webkit-font-smoothing:antialiased;position:absolute;top:30%;width:100%;font-size:20px;fontWeight:bold;">\
                            <center><i class="fa fa-spinner fa-pulse"></i> <font id="Overtop-tips">'+tips+'</font></center>\
                        </div>\
                    </div>'; 
            return ele;
        },
        show:function(tips,style,container){
            this.hide(1);
            container = container || 'body';
            style = style || 1;
            $(container).attr('style','position:relative;top:0;left:0;').append(this._element(tips,style));
        },
        hide:function(f){
            if(f){
                return $('#Overtop').remove();
            }
            $('#Overtop').fadeOut('fast',function(){
                $(this).remove();
            });
        },
    };
}



/*鉴定每个浏览器上传图片url 目前没有合并到Ie* */
function getObjectURL(file) {
    var url = null;
    if(window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if(window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if(window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    
    return url;
}