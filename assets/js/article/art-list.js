$(function() {
    let form = layui.form
    let laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        let dt = new Date()

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth())
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + ' - ' + m + ' - ' + d + ' \ n ' + hh + ': ' + mm + ': ' + ss
    }


    function padZero(n) {
        return n >= 10 ? n : '0' + n
    }



    // 定义查询的参数对象
    let q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，
    }

    initTable()
    initCate()


    // 定义获取文章列表的函数
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取数据失败')
                }
                // layer.msg('获取数据成功')

                // 使用模板引擎渲染页面
                let htmlStr = template('tpl-table', res)

                // 渲染页面
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }




    // 初始化文章分类的方法
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



    //为筛选绑定提交事件
    $('#form-search').on('submit', function(e) {
        // 阻止默认行为
        e.preventDefault()

        // 获得表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        // 赋值到q对象身上
        q.cate_id = cate_id
        q.state = state

        // 重新渲染
        initTable()

    })



    // 分页函数
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示条数
            curr: q.pagenum, //默认显示页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                // 页码数赋值到q中
                q.pagenum = obj.curr

                // 每页显示条数赋值到q中
                q.pagesize = obj.limit

                // 调用  laypage.render 方法触发，first=true
                // 点击分页触发 first=underfind
                if (!first) {
                    // 重新渲染
                    initTable()

                }
            }
        });
    }


    // 删除功能
    $('tbody').on('click', '.btn-del', function() {
        // 得到页面中删除按钮的个数
        let len = $('.btn-del').length

        // 得到当前点击按钮的id
        let id = $(this).attr('data-id')
        layer.confirm('此操作将永久删除该文章，是否继续？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/delete/' + id,
                method: 'GET',
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg('删除失败>' + res.message)
                    }
                    layer.msg('删除成功')

                    // 当当前页面没有数据时，页码减1
                    if (len === 1) {
                        // 页码值必去大于等于1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    // 重新渲染
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})