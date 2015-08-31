/**
 * Scroller Component Demo for tingle
 * @auther gbk
 *
 * Copyright 2014-2015, Tingle Team, Alinw.
 * All rights reserved.
 */
var classnames = require('classnames');
var Layer = require('tingle-layer');
var Scroller = require('tingle-scroller');

// 滑动效果的动画函数
const LINEAR_EASE = {
    style: 'linear',
    fn: (k) => k
};

class Slot extends React.Component {

    constructor(props) {
        super(props);

        var t = this;

        // 初始状态
        t.state = {
            show: false,
            title: t.props.title,
            data: t.props.data,
            selectedIndex: t.findSelectedIndex(t.props)
        };
    }

    componentDidMount() {
        var t = this;

        // 获取所有 scroller 的容器
        var slotBody = React.findDOMNode(t.refs.root).querySelector('.tSlotBody');

        // 获取选项高度
        var li = slotBody.querySelector('li');
        t._itemHeight = parseFloat(getComputedStyle(li, null).height);
        console.log(t._itemHeight)

        // tap 事件触发选中状态变更
        slotBody.addEventListener('iscroll:tap', (e) => {
            var className = e.target.className;
            var match = /tSlotItem(\d+)_(\d+)/.exec(className);
            if (match && className.indexOf('tSlotItemActive') === -1) {
                var column = parseInt(match[1]);
                var index = parseInt(match[2]);
                t.props.onChange(t.getData(column, index), column, index);
            }
        }, false);

        // 初始化滚动的标记
        t._willRefresh = true;
    }

    componentDidUpdate() {
        var t = this;

        // 可见的时候滚动到选中的选项
        if (t.state.show && t._willRefresh) {
            t._willRefresh = false;
            t.scrollAll(200);
        }
    }

    // 减少渲染次数
    componentWillReceiveProps(nextProps) {
        var t = this;

        var data = nextProps.data;
        var selectedIndex = t.findSelectedIndex(nextProps);

        // 数据变化需要重新初始化 scroller
        var state = {};
        var willRefresh = false;
        if (!equals(t.state.data, data)) {
            state.data = data;
            willRefresh = true;
        }
        if (!equals(t.state.selectedIndex, selectedIndex)) {
            state.selectedIndex = selectedIndex;
            willRefresh = true;
        }
        if (willRefresh) {
            t._willRefresh = true;
            t.setState(state);
        }
    }

    scrollAll(time) {
        var t = this;
        t.state.selectedIndex.forEach((index, column) => {
            var scroller = t.refs['scroller' + column].scroller;
            scroller.scrollTo(0, -index * t._itemHeight, time, LINEAR_EASE);
        });
    }

    findSelectedIndex(props) {
        var data = props.data;
        var value = props.value;
        var selectedIndex = [];

        // 遍历数据模型
        data.forEach((columnData, column) => {

            selectedIndex[column] = 0;

            // 遍历每一列
            for (var i = 0; i < columnData.length; i++) {

                // 定位选中值
                if (value[column] && columnData[i].value === value[column].value) {
                    selectedIndex[column] = i;
                    break;
                }
            }
        });

        return selectedIndex;
    }

    handleScrollEnd(column) {
        var t = this;
        var scroller = t.refs['scroller' + column].scroller;
        var height = t._itemHeight;
        var remainder = Math.abs(scroller.y % height);
        var index = scroller.y / height;

        // 没有滚动到选项，需要继续滚动一段距离
        if (remainder) {

            var func;
            if (scroller.distY > 0) { // 向下滚动
                if (remainder < height * 0.7) {
                    func = 'ceil';
                } else {
                    func = 'floor';
                }
            } else { // 向上滚动
                if (remainder > height * 0.3) {
                    func = 'floor';
                } else {
                    func = 'ceil';
                }
            }

            index = Math[func](scroller.y / height);
        }

        // 在 onChange 中设置状态
        index = Math.abs(index);
        t.props.onChange(t.getData(column, index), column, index);
    }

    show() {
        this.setState({
            show: true
        });
    }

    hide() {
        this.setState({
            show: false
        });
    }

    handleCancel() {
        var t = this;
        try {
            t.props.onCancel();
        } finally {
            t.hide();
        }
    }

    handleConfirm() {
        var t = this;
        try {
            t.props.onConfirm(t.getData());
        } finally {
            t.hide();
        }
    }

    // 获取值的时候指定变更的列，为什么要这么做，是因为有变更后我不直接改 state！
    getData(sColumn, sIndex) {
        var t = this;
        var ret = [];
        var { data, selectedIndex } = t.state;

        selectedIndex.forEach((index, column) => {
            ret[column] = data[column][column === sColumn ? sIndex : index];
        });

        return ret;
    }

    render() {
        var t = this;
        var {className, show, bottom, data, width, closeable, ...other} = t.props;

        return (
            <Layer onHide={t.handleCancel.bind(t)} show={t.state.show} closeable={!(closeable === false)} width="100%" bottom={0} {...other}>
                <div ref="root" className={classnames('tSlot', {
                    [className]: !!className
                })}>
                    <div className="tSlotHeader tFBH tFC3 tFBAC">
                        <div className="tSlotCancel" onClick={t.handleCancel.bind(t)}>取消</div>
                        <div className="tFB1 tFAC">{t.state.title}</div>
                        <div className="tSlotConfirm"  onClick={t.handleConfirm.bind(t)}>完成</div>
                    </div>
                    <div className="tSlotBody tFBH tFC9 tPR">
                        {t.state.data.map((m, i) => {
                            return (
                                <Scroller ref={'scroller' + i} key={'scroller' + i} className="tFB1" autoRefresh={t.state.show} tap="iscroll:tap" onScrollEnd={t.handleScrollEnd.bind(t, i)}>
                                    <ul>
                                        <li></li>
                                        <li></li>
                                        {m.map((n, j) => {
                                            return (
                                                <li key={n.value} className={classnames('tSlotItem' + i + '_' + j, {
                                                    tSlotItemActive: j === t.state.selectedIndex[i]
                                                })}>{n.text}</li>
                                            );
                                        })}
                                        <li></li>
                                        <li></li>
                                    </ul>
                                </Scroller>
                            );
                        })}
                    </div>
                </div>
            </Layer>
        );
    }
}

Slot.defaultProps = {
    title: '',
    value: [],
    onConfirm() {},
    onCancel() {},
    onChange() {}
}

// http://facebook.github.io/react/docs/reusable-components.html
Slot.propTypes = {
    className: React.PropTypes.string,
    title: React.PropTypes.string,
    data: React.PropTypes.array.isRequired,
    value: React.PropTypes.array,
    onConfirm: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onChange: React.PropTypes.func
}

// 格式化单列数据
Slot.formatColumnValue = (columnData, value) => {

    // 兼容简单选中值
    var columnValue;
    if (typeof value !== 'undefined') {
        if (value.hasOwnProperty('value')) {
            columnValue = value.value;
        } else {
            columnValue = value;
        }
    }
    value = undefined;

    // 遍历每一项
    for (var i = 0; i < columnData.length; i++) {
        var cell = columnData[i];

        // 兼容非对象的数据
        if (typeof cell !== 'object') {
            cell = columnData[i] = {
                text: cell,
                value: cell
            };
        }

        // 补全缺失数据
        if (!cell.hasOwnProperty('text')) {
            cell.text = cell.value;
        }
        if (!cell.hasOwnProperty('value')) {
            cell.value = cell.text;
        }

        // 定位选中值
        if (cell.value === columnValue) {
            value = cell;
        }
    }

    // 默认选中第一项
    if (typeof value !== 'object') {
        value = columnData[0];
    }

    return {
        columnData: columnData,
        columnValue: value
    }
};

// 格式化多列数据
Slot.formatDataValue = (data = [], value = []) => {

    // 兼容单列数据的缩略写法
    if (!isArray(data[0])) {
        data = [ data ];
    }
    if (!isArray(value)) {
        value = [ value ];
    }

    // 遍历数据模型
    data.forEach((columnData, column) => {

        // 格式化列数据
        var ret = Slot.formatColumnValue(columnData, value[column]);
        value[column] = ret.columnValue;
    });

    return {
        data: data,
        value: value
    };
};

module.exports = Slot;

function isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

function equals(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}
