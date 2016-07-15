function MVTemplateView(O,mvcontext) {
	O=O||this;
	MVAbstractView(O,mvcontext);

	JSQ.connect(O,'sizeChanged',O,update_layout);

	var m_panel_widget=new JSQPanelWidget();
	m_panel_widget.setParent(O);

	function update_layout() {
		var ss=O.size();
		m_panel_widget.setPosition([5,5]);
		m_panel_widget.setSize([ss[0]-10,ss[1]-10]);
	}


	for (var r=0; r<6; r++)
	for (var c=0; c<3; c++) {
        var Y=new JSQWidget();
        Y.setDiv('<div id=test_panel>Hello from JSQ, this is panel '+r+','+c+'.</div>');
        m_panel_widget.addPanel(r,c,Y);
    }

	update_layout();
}