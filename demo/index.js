/**
 * Scroller Component Demo for tingle
 * @author gbk
 *
 * Copyright 2014-2015, Tingle Team, Alinw.
 * All rights reserved.
 */
let Context = require('tingle-context');
window.FastClick && FastClick.attach(document.body);

let Demo = require('./SlotDemo');
React.render(<Demo/>, document.getElementById('TingleDemo'));