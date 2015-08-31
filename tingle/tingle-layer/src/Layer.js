/**
 * Layer Component for tinglejs
 */

var Mask = require('tingle-mask');

class Layer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    
    componentWillMount() {
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        this.handleMask(this.props);
    }

    componentWillUpdate(props, state) {
        this.handleMask(props);
    }

    handleMask(props) {
        var last = this.state.showMask;
        this.state.showMask = false;
        
        if (props.mask) {
            if (props.show) {
                this.state.zIndex = Layer._getIndex();
                this.state.showMask = true;
            } else {
                last && Layer._setIndex();
            }
        }
    }

    getStyle() {
        var prop = this.props,
            show = prop.show,
            width = 'width' in prop,
            height = 'height' in prop,
            full = prop.mode == 'full',
            top = 'top' in prop,
            bottom = 'bottom' in prop,
            left = 'left' in prop,
            right = 'right' in prop,
            style = {
                width: full || !width ? '100%' :  prop.width,
                height: full ? '100%' : height ? prop.height : 'auto'
            };

        if (full) {
            style.top = 0;
            style.left = 0;
        } else {
            if (top) {
               style.top = prop.top;
            } else if (bottom) {
               style.bottom = prop.bottom;
            } else {
               style.top = '50%';
               style['WebkitTransform'] = (style['WebkitTransform'] || '' ) + ' translateY(-50%)';
               style['transform'] = (style['transform'] || '') + ' translateY(-50%)';
            }

            if (left) {
               style.left = prop.left;
            } else if (right) {
               style.right = prop.right;
            } else {
               style.left = '50%';
               style['WebkitTransform'] = (style['WebkitTransform'] || '') + ' translateX(-50%)';
               style['transform'] = (style['transform'] || '') +  ' translateX(-50%)';
            } 
        }

        style.zIndex = this.state.zIndex || prop.zIndex;
        style.display = show ? 'block' : 'none';

        return style;
    }

    handleClick(e) {
        this.props.onClick(e);
    }

    hanldeHide() {
        this.props.onHide();
    }

    render() {
        var mask = this.state.showMask ? <Mask onHide={this.hanldeHide.bind(this)} zIndex={this.state.zIndex - 1} closeable={!!this.props.closeable} visible={true} opacity={0.2}/> : '';
        return (
            <div onClick={this.handleClick.bind(this)}>
                {mask}
                <div className="tLayer" style={this.getStyle()}>{this.props.children}</div>
            </div>
            
        );
    }
}

Layer.defaultProps = {
    onClick() {},
    onHide() {},
    zIndex: 1001,
    mask: true,
    show: false 
}

// http://facebook.github.io/react/docs/reusable-components.html
Layer.propTypes = {
}

Layer._zIndex = 1000;
Layer._getIndex = function () {
    Layer._zIndex += 2;
    return Layer._zIndex;
}
Layer._setIndex = function () {
    Layer._zIndex -= 2;
}




module.exports = Layer;