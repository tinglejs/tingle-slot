var Context = require('tingle-context');
window.FaskClick && FastClick.attach(document.body);
var Demo = require('./SlotDemo');
React.render(<Demo/>, document.getElementById('TingleDemo'));