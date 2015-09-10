/**
 * Scroller Component Demo for tingle
 * @author gbk
 *
 * Copyright 2014-2015, Tingle Team, Alinw.
 * All rights reserved.
 */
let classnames = require('classnames');
let Layer = require('tingle-layer');
let Scroller = require('tingle-scroller');

// 滑动效果的动画函数
const LINEAR_EASE = {
    style: 'linear',
    fn: (k) => k
};

let isArray = (arr) => Object.prototype.toString.call(arr) === '[object Array]';
let equals = (obj1, obj2)=>JSON.stringify(obj1) === JSON.stringify(obj2);

class Slot extends React.Component {

    constructor(props) {
        super(props);

        let t = this;

        // 初始状态
        t.state = {
            show: false,
            title: t.props.title,
            data: t.props.data,
            selectedIndex: t.findSelectedIndex(t.props)
        };
    }

    componentDidMount() {
        let t = this;

        // 获取所有 scroller 的容器
        let slotBody = React.findDOMNode(t.refs.root).querySelector('.tSlotBody');

        // 获取选项高度
        let li = slotBody.querySelector('li');
        t._itemHeight = parseFloat(getComputedStyle(li, null).height);
        console.log(t._itemHeight);

        // tap 事件触发选中状态变更
        slotBody.addEventListener('iscroll:tap', function(e) {
            let className = e.target.className;
            let match = /tSlotItem(\d+)_(\d+)/.exec(className);
            if (match && className.indexOf('tSlotItemActive') === -1) {
                let column = parseInt(match[1]);
                let index = parseInt(match[2]);
                t.props.onChange(t.getData(column, index), column, index);
            }
        }, false);

        // 初始化滚动的标记
        t._willRefresh = true;
    }

    componentDidUpdate() {
        let t = this;

        // 可见的时候滚动到选中的选项
        if (t.state.show && t._willRefresh) {
            t._willRefresh = false;
            t.scrollAll(200);
        }
    }

    // 减少渲染次数
    componentWillReceiveProps(nextProps) {
        let t = this;

        let data = nextProps.data;
        let selectedIndex = t.findSelectedIndex(nextProps);

        // 数据变化需要重新初始化 scroller
        let state = {};
        let willRefresh = false;
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
        let t = this;
        t.state.selectedIndex.forEach(function(index, column) {
            let scroller = t.refs['scroller' + column].scroller;
            scroller.scrollTo(0, -index * t._itemHeight, time, LINEAR_EASE);
        });
    }

    findSelectedIndex(props) {
        let data = props.data;
        let value = props.value;
        let selectedIndex = [];

        // 遍历数据模型
        data.forEach(function(columnData, column) {

            selectedIndex[column] = 0;

            // 遍历每一列
            for (let i = 0; i < columnData.length; i++) {

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
        let t = this;
        let scroller = t.refs['scroller' + column].scroller;
        let height = t._itemHeight;
        let remainder = Math.abs(scroller.y % height);
        let index = scroller.y / height;

        // 没有滚动到选项，需要继续滚动一段距离
        if (remainder) {

            let func;
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
        let t = this;
        try {
            t.props.onCancel();
        } finally {
            t.hide();
        }
    }

    handleConfirm() {
        let t = this;
        try {
            t.props.onConfirm(t.getData());
        } finally {
            t.hide();
        }
    }

    // 获取值的时候指定变更的列，为什么要这么做，是因为有变更后我不直接改 state！
    getData(sColumn, sIndex) {
        let t = this;
        let ret = [];
        let { data, selectedIndex } = t.state;

        selectedIndex.forEach(function(index, column) {
            ret[column] = data[column][column === sColumn ? sIndex : index];
        });

        return ret;
    }

    render() {
        let t = this;
        let {className, show, bottom, data, width, closeable, ...other} = t.props;

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
                        {t.state.data.map(function(m, i) {
                            return (
                                <Scroller ref={'scroller' + i} key={'scroller' + i} className="tFB1" autoRefresh={t.state.show} tap="iscroll:tap" onScrollEnd={t.handleScrollEnd.bind(t, i)}>
                                    <ul>
                                        <li></li>
                                        <li></li>
                                        {m.map(function(n, j) {
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
        )
    }
}

Slot.defaultProps = {
    title: '',
    value: [],
    data:[],
    className:'',
    onConfirm() {},
    onCancel() {},
    onChange() {}
};

// http://facebook.github.io/react/docs/reusable-components.html
Slot.propTypes = {
    className: React.PropTypes.string,
    title: React.PropTypes.string,
    data: React.PropTypes.array.isRequired,
    value: React.PropTypes.array,
    onConfirm: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onChange: React.PropTypes.func
};

// 格式化单列数据
Slot.formatColumnValue = function(columnData, value) {

    // 兼容简单选中值
    let columnValue;
    if (typeof value !== 'undefined') {
        if (value.hasOwnProperty('value')) {
            columnValue = value.value;
        } else {
            columnValue = value;
        }
    }
    value = undefined;

    // 遍历每一项
    for (let i = 0; i < columnData.length; i++) {
        let cell = columnData[i];

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
Slot.formatDataValue = function (data = [], value = []) {

    // 兼容单列数据的缩略写法
    if (!isArray(data[0])) {
        data = [ data ];
    }
    if (!isArray(value)) {
        value = [ value ];
    }

    // 遍历数据模型
    data.forEach(function(columnData, column) {

        // 格式化列数据
        let ret = Slot.formatColumnValue(columnData, value[column]);
        value[column] = ret.columnValue;
    });

    return {
        data: data,
        value: value
    };
};

module.exports = Slot;
