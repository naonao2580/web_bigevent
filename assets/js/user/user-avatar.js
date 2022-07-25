$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 点击选择图片
    $('#btn-choose').on('click', function() {
        $('#file').click()
    })

    // 切换图片
    $('#file').on('change', function(e) {
        // 拿到用户选择的文件
        let file = e.target.files[0]

        // 根据选择的文件，创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(file)

        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 点击上传
    $('#btn-upload').on('click', function() {
        // 将裁剪后的图片，输出为 base64 格式的字符串
        let dataURL = $image.cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布 
                width: 100,
                height: 100
            }).toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 发起ajax请求
        $.ajax({
            url: '/my/update/avatar',
            method: 'post',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('上传失败')
                }

                layer.msg('上传成功')

                // 调用父页面的方法，重新渲染
                window.parent.getUserInfo()
            }
        })

    })



})