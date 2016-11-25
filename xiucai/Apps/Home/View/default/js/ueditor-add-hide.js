/**
 * Created by maojy on 2015/9/11.
 */
UE.registerUI('hide', function(editor, uiName) {
    editor.registerCommand(uiName, {
        execCommand: function() {

        }
    });
    var host=window.location.host;
    var start=/^(test.*)|(local.*)/;
    if(!start.test(host)){
        if(host.indexOf("yz")==0){
            host="yz.assets.xiucai.com";
        }
        if(host.indexOf("www")==0||host.indexOf("club")==0){
            host="assets.xiucai.com";
        }
    }
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name: uiName,
        //提示
        title: "隐藏选中内容",
        cssRules: 'background:url("//'+host+'/assets/ueditor/themes/default/images/hide.png") no-repeat !important',
        onclick: function() {
            var range = UE.getEditor('thread_content_pop').selection.getRange();
            var node = range.cloneContents();
            range.select();
            var selectText = UE.getEditor('thread_content_pop').selection.getText();
            var box=document.getElementById("edit-temp-box");
            var txt;
            node=node==null?"":node;
            if(box==null&&node!=""){
                box=document.createElement("div");
                box.setAttribute("id","edit-temp-box");
                box.setAttribute("style","display:none");
                box.appendChild(node);
                document.body.appendChild(box);
            }else if(node!=""){
                box.innerHTML="";
                box.appendChild(node)
            }
            if($.trim(selectText).length<1&&$("#edit-temp-box").find("img").length<1){
                alert("请选择要隐藏的内容");
                return;
            }
            txt=box.innerHTML;
            var regx=/\[hide\].*?\[\/hide\]/g;
            var _hide=txt.match(regx);
            try{
                if(_hide!=null&&_hide!=undefined){
                    for(var i= 0,len=_hide.length;i<len;i++){
                        var newStr=_hide[i].substring(6,_hide[i].length-7);
                        txt=txt.replace(_hide[i],newStr);
                    }
                    UE.getEditor('thread_content_pop').execCommand('insertHtml',txt);
                }else{
                    UE.getEditor('thread_content_pop').execCommand('insertHtml', "[hide]"+txt+"[/hide]");
                }
            }catch(err){
                UE.getEditor('thread_content_pop').execCommand('insertHtml', "[hide]"+txt+"[/hide]");
            }finally{
               range.collapse();
            }
        }
    });
    //因为你是添加button,所以需要返回这个button
    return btn;
});