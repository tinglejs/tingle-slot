/**
 * Button Component for tinglejs
 */

var classnames = require('classnames');

class Button extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick() {
        !this.props.disabled && this.props.onClick();
    }

    render() {
        var size = this.props.size,
            type = this.props.type,
            small = size === 's',
            medium = size === 'm',
            large = size === 'l',
            primary = type === 'primary',
            secondary = type === 'secondary',
            text = type === 'text',
            disabled = !!this.props.disabled,
            classSet = {
                [this.props.className]: !!this.props.className,
                'tButton tFAC': true,
                'tFS12 tPL16 tPR16': small,
                'tFS14': medium,
                'tFS18 tH44 tR5 tLH44': large,
                'tH30 tR4 tLH30': small || medium,
                'tBCc tFC9': disabled,
                'tButtonText': text,
                'tButtonPrimary tFCf': primary && !disabled,
                'tButtonSecondary tFC3': secondary && !disabled
            };
        
        return (
            <div className={classnames(classSet)} disabled={disabled} onClick={this.handleClick.bind(this)}>{this.props.children}</div>
        );
    }
}

Button.defaultProps = {
    size: 'l',
    type: 'primary',
    disabled: false,
    onClick() {}
}

// http://facebook.github.io/react/docs/reusable-components.html
Button.propTypes = {
    disabled: React.PropTypes.bool
}

module.exports = Button;