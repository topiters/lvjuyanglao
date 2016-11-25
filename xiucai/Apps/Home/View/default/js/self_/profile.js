$(function(){
    $("#personal-info-button").on('click',function(){
        var _this= $(this);
        $.post(ajax_edit_basic_info,'',
            function(result){
                _this.hide();
                $("#personal-info-div").hide();
                $('#personal-info-edit').html(result.html);
                $("#personal-info-cancle").on('click',function(){
                    $("#personal-info-div").show();
                    $("#personal-info-edit").hide();
                    _this.show();
                })

                $("#personal-info-update").on('click',function(){
                    var nickname = $('#nickname').val();
                    if(nickname == ''){
                        $.xcDialog.alert({'content':'请输入真实姓名'});
                        return false;
                    }
                    if(strlength(nickname)<2){
                        $.xcDialog.alert({'content':'真实姓名最少2个字。'});
                        return false;
                    }else{
                        if(strlength(nickname)>16){
                            $.xcDialog.alert({'content':'真实姓名最多8个汉字或者16个英文字母'});
                            return false;
                        }
                    }
                    if($("#company").val().length>20){
                        $.xcDialog.alert({'content':'公司/企业最多20个字。'});
                        return false;
                    }
                    if($('#bussiness_name').val()==''){
                        $.xcDialog.alert({'content':'请选择行业'});
                        return false;
                    }
                    if($('#position').val()==''){
                        $.xcDialog.alert({'content':'请输入职业'});
                        return false;
                    }
                    if($("#position").val().length>20){
                        $.xcDialog.alert({'content':'职业最多20个字。'});
                        return false;
                    }
                    if($('#work_year').val()==''){
                        $.xcDialog.alert({'content':'请选择工作经验'});
                        return false;
                    }
                    $.post(ajax_update_basic_info,{nickname:$('#nickname').val(), bussiness_name: $('#bussiness_name').val(), position: $('#position').val(), company:$('#company').val(), work_year:$("#work_year").val() },
                        function(result){
                            if(result.code == 200){
                                $("#personal-info-div").show();
                                $("#personal-info-edit").hide();

                                if($('.diy_select_txt').html() != ''){
                                    $("#bussiness_name-span").html($('.diy_select_txt').html());
                                }else{
                                    $("#bussiness_name-span").html('行业保密');
                                }
                                $("#nickname-span").html($('#nickname').val());
                                if($('#position').val() != ''){
                                    $("#position-span").text($('#position').val());
                                }else{
                                    $("#position-span").text('职位保密');
                                }

                                if($('#company').val() != ''){
                                    $("#company-span").text($('#company').val());
                                }else{
                                    $("#company-span").text('Ta未填写所在公司信息');
                                }
                                if($('#work_year').val() != ''){
                                    $("#work_year-span").html($('#work_year').val()+'年工作经验');
                                }
                            }
                            _this.show();
                        }
                    )
                })
            }
        );
        $("#personal-info-edit").show();
    })
})