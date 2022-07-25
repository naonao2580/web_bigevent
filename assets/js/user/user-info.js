$(function() {
    let form = layui.form
    let layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符!'
            }
        }
    })

    // 渲染页面
    initUserInfo()


    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'get',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取用户信息失败')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置按钮
    $('#reset-btn').on('click', function(e) {
        // 阻止默认行为
        e.preventDefault()

        // 重新渲染页面
        initUserInfo()
    })


    // 提交表单信息
    $('.layui-form').on('submit', function(e) {
        // 阻止默认行为
        e.preventDefault()

        // 提交数据
        $.ajax({
            url: '/my/userinfo',
            method: 'post',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('修改失败');
                }
                console.log(res);
                layer.msg('修改成功');

                // 调用父页面的方法，重新渲染
                window.parent.getUserInfo()

            }

        })

    })

})