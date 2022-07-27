$(function() {
    let layer = layui.layer
    let form = layui.form

    initArtCateList()

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('获取数据失败')
                }

                //模板引擎 
                let htmlStr = template('tpl-table', res)

                // 渲染页面
                $('tbody').html(htmlStr)
            }
        })
    }

    // 点击添加分类弹出层
    let indexAdd = null
    $('#btnAdd').on('click', function() {
        // 弹出层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 通过代理为form-add绑定事件
    $('body').on('submit', '#form-add', function(e) {
        // 阻止默认行为
        e.preventDefault()

        // 发起ajax请求
        $.ajax({
            url: '/my/article/addcates',
            method: 'post',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('添加失败' + res.message);
                }
                layer.msg('添加成功');

                // 重新渲染页面
                initArtCateList()

                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    let indexEdit = null

    // 通过代理为form-edit绑定事件
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-edit').html()
        });

        // 得到当前id
        let id = $(this).attr('data-id')

        // 得到数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })


    // 通过代理为form-edit绑定事件
    $('body').on('submit', '#form-edit', function(e) {
        // 阻止默认行为
        e.preventDefault()

        // 发起ajax请求
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    console.log(res);
                    return layer.msg('修改失败' + res.message);
                }
                layer.msg('修改成功');

                // 重新渲染页面
                initArtCateList()

                // 关闭弹出层
                layer.close(indexEdit)
            }
        })
    })


    // 通过代理为删除绑定事件
    $('tbody').on('click', '.btn-del', function() {
        // 得到当前id
        let id = $(this).attr('data-id')

        // 询问框
        layer.confirm('确认删除此分类吗？', { icon: 3, title: '提示' }, function(index) {
            // 得到数据
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg('删除失败>' + res.message)
                    }
                    layer.msg('删除成功')

                    layer.close(index);

                    // 重新渲染页面
                    initArtCateList()
                }
            })


        });


    })
})