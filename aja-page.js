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
            } else {
                _data.data= '暂无数据';
            }

            for (var a in data) {
                res += _tpl.replace(reg, function(word) {
                    var key = word.substr(1, word.length - 2);
                    return data[a][key];
                });
            }
            _target.append(res);
            return (function() { //模板渲染完成后，来通过时间来判断是否过期或者生效
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
            var totalPage =  total
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
                    break;
                case ((num - 1) >= 4 && (totalPage - num) >= 4):
                    htmlStr += self.getLiTpl(1);
                    htmlStr += middle; //先拼装省略号部分的页码模板
                    for (var i = num - 1, len = num + 3; i < len; i++) {
                        htmlStr += self.getLiTpl(i);
                    }
                    htmlStr += middle; //先拼装省略号部分的页码模板getLiTpl
                    break;
                case ((totalPage - num) < 4):
                    htmlStr += self.getLiTpl(1);
                    htmlStr += middle; //先拼装省略号部分的页码模板
                    for (var i = 18, len = totalPage; i < len; i++) {
                        htmlStr += self.getLiTpl(i);
                    }
                    break;
                default:
                    break;
            }
            htmlStr += self.getLiTpl(totalPage);
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
                self.getUserList(Number($(this).text()),self.obj.ajaxLink,self.obj.method);
            })
            self.getUserList(1,self.obj.ajaxLink,self.obj.method);
        },
        getUserList: function(_curPage,_ajaxLink,_method) {
            var self = this;
            $.ajax({
                url: _ajaxLink
                data: { page: _curPage },
                type: _method,
                dataType: 'JSON',
                success: function(json) {
                    if (json.state == 1) {
                        self.obj.target.html('');
                        getTpl.init(json, self.tpl ,self.obj.target, self.obj.fun, _curPage); //渲染模板
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    }
}());
