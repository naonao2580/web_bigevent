$(function() {

    // 调用获取用户基本信息函数
    getUserInfo()

    // 点击退出
    $('#btn-logout').on('click', function() {
        // 弹出提示框
        // layer.open({
        //     icon: 3,
        //     content: '此操作将退出登录, 是否继续?',
        //     btn: ['确定', '取消'],
        //     yes: function(index, layero) {
        //         //按钮【按钮一】的回调
        //     }
        // });
        layer.confirm('此操作将退出登录, 是否继续?', { icon: 3, title: '提示' }, function(index) {
            //清空本地存储中的token
            localStorage.removeItem('token')

            // 重新跳转到登录页面
            location.href = './login.html'

            layer.close(index);
        });
    })
})



// 获取用户基本信息函数
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'get',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status != 0) {
                return layui.layer.msg('获取用户信息失败！')
            }

            // 渲染头像
            renderAvatar(res.data)
        }

        // 无论成功还是失败，都会调用complete
        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 & res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空本地存储
        //         localStorage.removeItem('token')

        //         // 强制返回首页
        //         location.href = './login.html'
        //     }
        // }
    })
}



// 渲染头像函数
function renderAvatar(user) {
    // 欢迎文字
    let name = user.nickname || user.username
    $('#welcome').text('欢迎 : ' + name)

    // 头像
    if (user.user_pic == null) {
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').text(first).show()
    } else {
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show()
    }

}