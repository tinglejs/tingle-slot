# tingle-slot [![npm version](https://badge.fury.io/js/tingle-slot.svg)](http://badge.fury.io/js/tingle-slot)

The `Slot Component` for tinglejs

## TL;DR

Slot 是老虎机滚轮选择器。

![效果图](https://img.alicdn.com/tps/TB1NWReJpXXXXcsXVXXXXXXXXXX-322-481.png)

## Install

```
npm install tingle-slot --save
```

## Simple Usage

```
constructor(props) {
    super(props);
    this.state = {
        // 数据模型
        data: [
            [
                { text: 'Jan', value: 0 }, { text: 'Feb', value: 1 },
                { text: 'Mar', value: 2 }, { text: 'Apr', value: 3 },
                { text: 'May', value: 4 }, { text: 'Jun', value: 5 },
                { text: 'Jul', value: 6 }, { text: 'Aug', value: 7 },
                { text: 'Sep', value: 8 }, { text: 'Oct', value: 9 },
                { text: 'Nov', value: 10 }, { text: 'Dec', value: 11 }
            ]
        ],
        // 选中的值
        value: [ { text: 'Aug', value: 7 } ],
        // 上次选中的值（取消选择时恢复用）
        confirmedValue: [ { text: 'Aug', value: 7 } ]
    };
}
showSlot() {
    this.refs.slot.show();
}
handleConfirm(value) {
    // 确认选中项目
    this.setState({
        confirmedValue: value,
        value: value
    });
}
handleChange(value, column, index) {
    // 选中项目改变
    this.setState({
        value: value
    });
}
handleCancel() {
    // 取消之前的操作，恢复上次确认的值
    this.setState({
        value: this.state.confirmedValue
    });
}
render() {
    var t = this;
    return (
        <div>
            <Button size="l" onClick={t.showSlot.bind(t)}>show slot</Button>
            <Slot ref="slot" data={t.state.data} value={t.state.value} title="title" onConfirm={t.handleConfirm.bind(t)} onChange={t.handleChange.bind(t)} onCancel={t.handleCancel.bind(t)}/>
        </div>
    );
}
```

## Options 可用配置

Slot 对数据格式的要求比较苛刻，但这是必要的！为了方便用户的使用，提供了两个静态的 formatXxx 函数供用户使用，详见下面的 API。

| 配置项 | 必填 | 默认值 | 功能/备注 |
|---|----|---|----|
|className|optional|-|自定义样式类|
|data|required|-|数据（注1）|
|value|required|-|选中数据（注2）|
|title|optional|-|表单域名称|
|onChange|optional|-|列选中变化触发的事件（注3）|
|onConfirm|optional|-|确认所有选中触发的事件（注4）|
|onCancel|optional|-|取消当前选中触发的事件（注5）|

> 注1: data 是一个二维数组，第一维表示滚轮列，第二维表示各列中的选项。

每个选项必须包括 text（显示的文字） 和 value（选项的值） 属性。典型的格式如下：

```
[
    [
        {
            text: '江苏',
            value: 'jiangsu'
        },
        {
            text: '浙江',
            value: 'zhejiang'
        }
    ],
    [
        {
            text: '杭州',
            value: 'hangzhou'
        },
        {
            text: '宁波',
            value: 'ningbo'
        }
    ]
]
```

> 注2: value 是一个一维数组，分别表示每一列的选中值。

数组中的元素一般为 data 中对应选项的引用，也可以通过 value 属性来和选项建立绑定。典型的格式如下：

```
[
    {
        text: '浙江',
        value: 'zhejiang'
    },
    {
        text: '杭州',
        value: 'hangzhou'
    }
]
```

> 注3: onChange 参数为 value（当前选中值数组）, column（当前变更的列）, index（当前选中的项）
> 注4: onConfirm 参数为 value（当前选中值数组）
> 注5: onCancel 没有参数

## API 接口

### .show()

显示选择器。

### .hide()

隐藏选择器。

### Slot.formatDataValue(data[, value])

`data` 和 `value` 的非标准格式兼容，返回标准格式的 { data, value }

```
t.setState(Slot.formatDataValue(xxData, xxValue));
```

- data 格式兼容以下几种场景

  - data 选项中如果 text 或 value 缺少任意一项，都会用另一项替代。

    ```
    [
        [
            { text: '江苏' }, // => { text: '江苏', value: '江苏' }
            { value: '浙江' } // => { text: '浙江', value: '浙江' }
        ]
    ]
    ```

  - 如果数组元素不是对象，那么 text 和 value 都会被赋值为元素本身。

    ```
    [
        [
            '江苏', // => { text: '江苏', value: '江苏' }
            '浙江'  // => { text: '浙江', value: '浙江' }
        ]
    ]
    ```

  - 如果传入是一个一维数组，则自动包裹为二维数组。

    ```
    [ '江苏', '浙江' ] // => [ [ { text: '江苏', value: '江苏' }, { text: '浙江', value: '浙江' } ] ]
    ```

- value 格式兼容以下场景

  - 数组元素不是对象。会对应到 value 是数组元素本身的选项。
  - 如果数组元素不能对应到任何选项，则默认对应到第一个选项。

### Slot.formatColumnValue(columnData[, columnValue])

替换单列的 data 和 value 时使用，兼容规则同上。

`columnData` 列数据，一维数组。

`columnValue` 选中的选项。

返回标准格式的 { columnData, columnValue }

## Links 相关链接

- [Fire a bug/Issues 提Bug](https://github.com/tinglejs/tingle-slot/issues)
- [Tingle项目](https://github.com/tinglejs/generator-tingle)