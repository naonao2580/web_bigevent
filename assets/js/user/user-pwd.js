$(function() {
    let form = layui.form
    let layer = layui.layer

    form.verify({
        oldPwd: function(value) {

        },
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 新密码不能与原密码一致
        newpwd: function(value) {
            let oldPwd = $('#oldPwd').val()
            if (oldPwd == value) {
                return '不能与原密码一致'
            }
        },
        // 确认密码
        repwd: function(value) {
            // 获取密码框中的值，判断是否一致

            let newPwd = $('#newPwd').val()
            if (newPwd != value) {
                return '两次输入的密码不一致'
            }
        }
    })


    // 绑定提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止默认行为
        e.preventDefault()

        // 发起ajax请求
        $.ajax({
            url: '/my/updatepwd',
            method: 'post',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('修改失败');
                }
                layer.msg('修改成功');

                // 重置表单
                $('.layui-form')[0].reset()

            }
        })
    })
})