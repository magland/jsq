var jsqmake=require('../jsqmake/jsqmake').jsqmake;

var opts={PROJECTPATH:__dirname, SOURCEPATH:['.'], SCRIPTS:[], STYLESHEETS:[]};
opts.TARGET = 'mountainviewweb.html';

opts.SCRIPTS.push('mountainviewweb.js');
opts.STYLESHEETS.push('mountainviewweb.css');

opts.SOURCEPATH.push('../jsqcore')
opts.SCRIPTS.push(
	'jquery.min.js','jsq.js','jsqobject.js','jsqwidget.js','jsqcanvaswidget.js'
);
opts.STYLESHEETS.push(
	'jsq.css'
);

opts.SOURCEPATH.push('../jsqwidgets')
opts.SCRIPTS.push(
	'jsqcanvaswidget.js'
);

opts.SOURCEPATH.push('common/mda')
opts.SCRIPTS.push(
	'mda.js','remotereadmda.js'
);
opts.STYLESHEETS.push(
	'jsq.css'
);

opts.SOURCEPATH.push('core')
opts.SCRIPTS.push(
	'mountainprocessrunner.js','mvabstractview.js','mvcontext.js'
);

opts.SOURCEPATH.push('views')
opts.SCRIPTS.push(
	'mvtemplatesview.js','mvpanelwidget.js'
);

jsqmake(opts);
