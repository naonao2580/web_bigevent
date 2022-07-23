$(function() {
    // 点击去注册
    $('#link-reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击登录
    $('#link-login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 获取layui里的form对象
    let form = layui.form

    // 自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            // 获取密码框中的值，判断是否一致
            let pwd = $('#pwd').val()
            if (pwd != value) {
                return '两次输入的密码不一致'
            }
        }
    })


    // 监听注册表单事件
    $('#form-reg').on('submit', function(e) {
        // 阻止表单默认提交
        e.preventDefault()

        let data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        }

        // 发起post请求
        $.post('/api/reguser', data, function(res) {
            if (res.status != 0) {
                return layer.msg(res.message, { icon: 5 });
            }
            layer.msg(res.message, { icon: 6 });

            // 模拟人的点击行为
            $('#link-login').click()
        })
    })

    // 监听登录表单事件
    $('#form-login').on('submit', function(e) {
        // 阻止表单默认提交
        e.preventDefault()

        // 发起ajax请求
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg(res.message, { icon: 6 });
                // console.log(res.token);

                // 将登录成功得到的token字符串保存到location
                localStorage.setItem('token', res.token)

                // 跳转到后台主页
                location.href = './index.html'
            }
        })
    })
})