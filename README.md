用户ajax分页，分页中有省略号

- 使用方法：渲染目标dom为`$('#ajaxPage')`
```javascript
ajaxPage.init({
    ajaxLink:'',//ajax request url
    target:$('#youTargetDom'),
    tpl: $('#yourTplDom').html(),
    method:'yourRequestMethod',
    data:{},//the request data, not required
    fun: function(data){
        //your code using to handle the json data
    }
});
```
- tpl示例：
```html
<script type="text/template">
    <p>{name}</p>
</script>
```
- JSON数据示例：
```javascript
{
    data:[{
        name:'myNameIsAlice'
    },{
        ...
    }]
}
```
- 存在的问题：现在还不能传入自定义的被点击的样式，统一样式名称为`active`;
- 修复了一下数据的处理方式;
- 修复了一下ReamMe
- 修复在多次初始化时，防止重复绑定的问题
- 修复分页函数请求时只请求页面curPage这个参数
