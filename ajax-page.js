var getTpl = (function() {
    return {
        /*
         * @_data 请求得到的json数据
         * @_tpl 模板文件的html
         * @_target 渲染目标的jq对象
         * @_fun 回调函数，在模板渲染完成后，处理数据
         * @_page 传入当前页码
         */
        init: function(_data, _tpl, _target, _fun, _page) {
            var reg = /{\w+?}/g,
                res = '',
                data;
            if (_data.data.length !== 0) {
                data = _data.data;
                for (var a in data) {
                    res += _tpl.replace(reg, function(word) {
                        var key = word.substr(1, word.length - 2);
                        return data[a][key];
                    });
                }
            } else {
                _data.data = '暂无数据';
            }

            _target.append(res);
            return (function() { //模板渲染完成后，调用回到函数
                _fun(data);
                listPage.init(_page, _data.totalPage);
            }());
        }
    }
}());

/*
 * @total 总页码数
 * @num 当前点击页码
 * */
var listPage = (function() {
    var middle = '<li class="active"><a href="###" rel="nofollow">……</a></li>';
    return {
        init: function(num, total) {
            $('#ajaxPage').find('ul').html('');
            var self = this;
            var totalPage = total
            var htmlStr = '';
            switch (true) {
                case (totalPage <= 5):
                    for (var i = 0, len = totalPage; i < len; i++) {
                        htmlStr += self.getLiTpl((i + 1));
                    }
                    break;
                case ((totalPage > 5 && num == 1) || (num - 1) < 4): //只显示前面5个按钮
                    for (var i = 1, len = 6; i < len; i++) {
                        htmlStr += self.getLiTpl(i);
                    }
                    htmlStr += middle; //先拼装省略号部分的页码模板

                    htmlStr += self.getLiTpl(totalPage);
                    break;
                case ((num - 1) >= 4 && (totalPage - num) >= 4):
                    htmlStr += self.getLiTpl(1);
                    htmlStr += middle; //先拼装省略号部分的页码模板
                    for (var i = num - 1, len = num + 3; i < len; i++) {
                        htmlStr += self.getLiTpl(i);
                    }
                    htmlStr += middle; //先拼装省略号部分的页码模板getLiTpl
                    htmlStr += self.getLiTpl(totalPage);
                    break;
                case ((totalPage - num) < 4):
                    htmlStr += self.getLiTpl(1);
                    htmlStr += middle; //先拼装省略号部分的页码模板
                    for (var i = 18, len = totalPage; i < len; i++) {
                        htmlStr += self.getLiTpl(i);
                    }
                    htmlStr += self.getLiTpl(totalPage);
                    break;
                default:
                    break;
            }
            $('#ajaxPage').find('ul').append(htmlStr);

            $('#ajaxPage').find('ul li').each(function() {
                $(this).removeClass('active');
                if ($(this).find('a').text() == num) {
                    $(this).addClass('active');
                }
            });
        },
        getLiTpl: function(page) {
            var li = '<li><a href="#' + page + '" rel="nofollow">' + page + '</a></li>';
            return li;
        }
    }
}());

var ajaxPage = (function() {
    return {
        /*
         * @obj 传入必要参数
         * @obj.ajaxLink
         * $obj.target
         * $obj.tpl
         * $obj.method
         * @obj.data
         * @obj.fun
         */
        init: function(_obj) {
            var self = this;
            self.obj = _obj;
            $(document).on('click', '#ajaxPage ul li a', function() {
                var curPage = $(this).attr('href').replace(/#/g, '');
                if ($(this).hasClass('active')) { //如果点击对象含有样式active则什么也不发生
                    return false;
                } else {
                    self.getUserList(Number(curPage), self.obj.ajaxLink, self.obj.method);
                }
            })
            self.getUserList(1, self.obj.ajaxLink, self.obj.method);
        },
        getUserList: function(_curPage, _ajaxLink, _method) {
            var self = this;
            $.ajax({
                url: _ajaxLink
                data: {
                    page: _curPage
                },
                type: _method,
                dataType: 'JSON',
                success: function(json) {
                    if (json.state == 1) {
                        self.obj.target.html('');
                        getTpl.init(json, self.obj.tpl, self.obj.target, self.obj.fun, _curPage); //渲染模板
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    }
}());
