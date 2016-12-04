用户ajax分页，分页中有省略号

- 使用方法：page模板以`$('#ajaxPage')`为目标dom
```javascript
ajaxPage.init({
    ajaxLink:'',//ajax request url
    target:$('#youTargetDom'),
    tpl:$('#yourTplDom').html(),
    method:'yourRequestMethod',
    data:{},//the request data,not required
    fun:function(data){
        //your code useing to handle the json data
    }
});
```
- 模版例子
```
<script type="text/template">
<p>{name}</p>
</script>
```
其中`name`为ajax请求返回的json数据，比如返回的数据为：
```
{
    name:'xxx'
}
```
- 存在的问题：现在还不能传入自定义的被点击的样式，统一样式名称为`active`;从项目中移出来的，还没有实验😹，存在未知bug
- 后续将会进一步完善

**************************