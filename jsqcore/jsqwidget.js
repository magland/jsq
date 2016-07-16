function JSQWidget(O) {
	O=O||this;
	JSQObject(O);
	
	O.div=function() {return m_div;};
	O.setDiv=function(div) {setDiv(div);};
	O.size=function() {return JSQ.clone(m_size);};
	O.width=function() {return m_size[0];};
	O.height=function() {return m_size[1];};
	O.setSize=function(W,H) {setSize(W,H);};
	O.position=function() {return m_position;};
	O.setPosition=function(x,y) {setPosition(x,y);};
	O.showFullBrowser=function() {showFullBrowser();};
	var JSQObject_setParent=O.setParent;
	O.setParent=function(parent) {setParent(parent);};
	O.parentWidget=function() {return parentWidget();};
	O.setVisible=function(visible) {setVisible(visible);};

	O.onMousePressEvent=function(handler) {onMousePressEvent(handler);};
	O.onMouseReleaseEvent=function(handler) {onMouseReleaseEvent(handler);};
	O.onMouseMoveEvent=function(handler) {onMouseMoveEvent(handler);};
	O.onWheelEvent=function(handler) {onWheelEvent(handler);};

	function setDiv(div_or_str) {
		m_div=$(div_or_str);
		m_div.mousedown(function(e) {mouse_actions.emit('press',jq_mouse_event($(this),e));});
		m_div.mouseup(function(e) {mouse_actions.emit('release',jq_mouse_event($(this),e));});
		m_div.mousemove(function(e) {mouse_actions.emit('move',jq_mouse_event($(this),e));});
		m_div.on('dragstart',function() {return false;});
		m_div.bind('mousewheel', function(e){
			console.log('wheel 1');
			wheel_actions.emit('wheel',jq_wheel_event($(this),e));
    	});
    	m_div.css({overflow:"hidden"});
    	if (O.parentWidget()) {
    		O.parentWidget().div().append(m_div);
    	}
		set_div_geom();
	}
	function setSize(W,H) {
		var size=[W,H];
		if (H===undefined) size=W;
		if ((size[0]==m_size[0])&&(size[1]==m_size[1])) {
			return;
		}
		m_size[0]=size[0];
		m_size[1]=size[1];
		set_div_geom();
		O.emit('sizeChanged');
	}
	function setPosition(x,y) {
		var pos=[x,y];
		if (y===undefined) pos=x;
		if ((m_position[0]==pos[0])&&(m_position[1]==pos[1])) {
			return;
		}
		m_position[0]=pos[0];
		m_position[1]=pos[1];
		set_div_geom();
		O.emit('positionChanged');
	}
	function showFullBrowser(opts) {
		if (!opts) opts={};
		opts.margin_left=opts.margin_left||10;
		opts.margin_right=opts.margin_right||10;
		opts.margin_top=opts.margin_top||10;
		opts.margin_bottom=opts.margin_bottom||10;
		if ('margin' in opts) {
			opts.margin_left=opts.margin_right=opts.margin_top=opts.margin_bottom=opts.margin;
		}

		var X=new BrowserWindow();
		JSQ.connect(X,'sizeChanged',O,set_size);
		function set_size() {
			var ss=X.size();
			O.setSize([ss[0]-opts.margin_left-opts.margin_right,ss[1]-opts.margin_top-opts.margin_bottom]);
			O.setPosition([opts.margin_left,opts.margin_top]);
		}
		$('body').append(O.div());
		set_size();
	}
	function setParent(parent) {
		JSQObject_setParent(parent);
		if ((parent)&&(parent.isWidget())) {
			parent.div().append(O.div());
		}
	}
	function parentWidget() {
		if (!O.parent()) return null;
		if (!O.parent().isWidget()) return null;
		return O.parent();
	}
	var mouse_actions=new JSQObject;
	var wheel_actions=new JSQObject;
	function onMousePressEvent(handler) {
		JSQ.connect(mouse_actions,'press',O,function(sender,args) {
			handler(args);
		});
	}
	function onMouseReleaseEvent(handler) {
		JSQ.connect(mouse_actions,'release',O,function(sender,args) {
			handler(args);
		});
	}
	function onMouseMoveEvent(handler) {
		JSQ.connect(mouse_actions,'move',O,function(sender,args) {
			handler(args);
		});
	}
	function onWheelEvent(handler) {
		JSQ.connect(wheel_actions,'wheel',O,function(sender,args) {
			handler(args);
		});
	}
	function jq_mouse_event(elmt,e) {
		//var parentOffset = $(this).parent().offset(); 
		var offset=elmt.offset(); //if you really just want the current element's offset
		var posx = e.pageX - offset.left;
		var posy = e.pageY - offset.top;
		return {
			pos:[posx,posy]
		}
	}
	function jq_wheel_event(elmt,e) {
		return {
			delta:e.originalEvent.wheelDelta
		};
	}
	function setVisible(visible) {
		if (visible) m_div.css({visibility:'visible'});
		else m_div.css({visibility:'hidden'});
	}

	O._set_is_widget(true);
	var m_div=null;
	var m_position=[0,0];
	var m_size=[0,0];

	O.setDiv($('<div></div>'));

	function set_div_geom() {
		m_div.css({
			position:'absolute',
			left:m_position[0],
			top:m_position[1],
			width:m_size[0],
			height:m_size[1]
		})
	}
}

function BrowserWindow(O) {
	if (!O) O=this;
	JSQObject(O);

	O.size=function() {return [$(window).width(),$(window).height()];}

	$(window).on('resize', function() {
		O.emit('sizeChanged');
	});
}
