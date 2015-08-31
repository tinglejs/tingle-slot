var classnames = require('classnames');

class Mask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            opacity: props.opacity,
            zIndex: props.zIndex,
            onHide: props.onHide,
            closeable: props.closeable,
            visible: props.visible
        }
    }

    /*
        options.onHide
        options.onClick
        options.opacity
    */
    show(options) {
        var t = this;

        options = options || {};

        t.setState({
            opacity: 'opacity' in options ? options.opacity : t.props.opacity,
            zIndex: options.zIndex || t.props.zIndex,
            onHide:  options.onHide  || t.props.onHide,
            closeable: 'closeable' in options ? options.closeable : t.props.closeable,
            visible: true
        });
        
    }

    hide(force) {
        var t = this;
        if (force || t.state.closeable) {
            t.state.visible = false;
            t.setState(t.state);
            t.state.onHide.call(t);
        }
        
    }

    render() {
        var t = this;
        var cls = classnames({
            tMask: true,
            visible: t.state.visible,
            [t.props.className]: !!t.props.className
        });

        return (
            <div ref="root" className={cls} style={{
                backgroundColor: 'rgba(0, 0, 0, '+ t.state.opacity +')',
                opacity: t.state.visible ? 1 : 0,
                zIndex:  t.state.zIndex
            }} onClick={t.hide.bind(this, false)}>
            </div>
        );
    }
}

Mask.defaultProps = {
    className: '',
    zIndex: 1000,
    opacity: 0.5,
    visible: false,
    onHide: function () {},
    closeable: true
}

var WRAPPER_ID = '__TingleGlobalMask__';
var doc = document;
var wrapper = doc.getElementById(WRAPPER_ID);
if (!wrapper) {
    wrapper = doc.createElement('div');
    wrapper.id = WRAPPER_ID;
    doc.body.appendChild(wrapper);
}


Mask.global = null;


Mask.show = function (options) {
    // 只有首次全局调用时，才会创建全局实例
    if (!Mask.global) {
        var wrapper = doc.getElementById(WRAPPER_ID);
        if (!wrapper) {
            wrapper = doc.createElement('div');
            wrapper.id = WRAPPER_ID;
            doc.body.appendChild(wrapper);
        }
        Mask.global = React.render(<Mask closeable={false} />, wrapper);
    }
    Mask.global.show(options);
}

Mask.hide = function () {
   Mask.global &&  Mask.global.hide(true);
}


module.exports = Mask;