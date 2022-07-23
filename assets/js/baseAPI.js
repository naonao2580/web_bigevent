// 每次调用$.post(), $.get(),$.ajax()时先调用$.ajaxPrefilter()
// 可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(option) {
    option.url = 'http://www.liulongbin.top:3007' + option.url
})