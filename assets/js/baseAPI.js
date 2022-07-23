// 每次调用$.post(), $.get(),$.ajax()时先调用$.ajaxPrefilter()
// 可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(option) {
    option.url = 'http://www.liulongbin.top:3007' + option.url

    // 为有权限的接口设置headers
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 挂载complete
    option.complete = function(res) {
        console.log(res);
        if (res.responseJSON.status === 1 & res.responseJSON.message === '身份认证失败！') {
            // 强制清空本地存储
            localStorage.removeItem('token')

            // 强制返回首页
            location.href = './login.html'
        }
    }
})