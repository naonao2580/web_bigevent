$(function() {
    let form = layui.form
    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                // 使用模板引擎渲染页面
                let htmlStr = template('tpl-cate', res)

                // 渲染页面
                $('[name=cate_id]').html(htmlStr)

                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击选择封面绑定事件
    $('#cover_img').on('click', function(e) {
        $('#file').click()

    })

    // 切换图片
    $('#file').on('change', function(e) {
        // 拿到用户选择的文件
        let file = e.target.files[0]

        // 判断用户选择了文件
        if (file.length === 0) {
            return
        }

        // 根据选择的文件，创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(file)

        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })


    // 定义文章发布状态
    let art_state = '已发布'

    // 为存为草稿注册点击事件
    $('#btn-save2').on('click', function() {
        art_state = '草稿'
    })


    // 表单提交事件
    $('#form-pub').on('submit', function(e) {
        // 阻止默认行为
        e.preventDefault()

        // 创建formdata对象
        let fd = new FormData($(this)[0])

        // 将发布状态存到fd中
        fd.append('state', art_state)

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将图片存到fd中
                fd.append('cover_img', blob)

                publishArticle(fd)
            })





        function publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败')
                    }
                    layer.msg('发布文章成功')

                    // 发布文章成功跳转
                    location.href = '/code/article/art-list.html'
                }

            })
        }

    })






    // // 发起ajax请求
    // $.ajax({
    //     url: '/my/update/avatar',
    //     method: 'post',
    //     data: {
    //         avatar: dataURL
    //     },
    //     success: function(res) {
    //         if (res.status != 0) {
    //             return layer.msg('上传失败')
    //         }

    //         layer.msg('上传成功')

    //         // 调用父页面的方法，重新渲染
    //         window.parent.getUserInfo()
    //     }
    // })





})