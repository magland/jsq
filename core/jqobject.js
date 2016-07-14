function JQObject(O) {
	if (!O) O=this;
	O.objectId=function() {return m_object_id;}
	O.setParent=function(parent_object) {setParent(parent_object);}
	O.parent=function() {return parent();}
	O.setProperty=function(name,value) {setProperty(name,value);}
	O.property=function(name) {return property(name);}
	O.emit=function(signal_name,args) {emit(signal_name,args);}
	O.declareSlot=function(slot_name,func) {declareSlot(slot_name,func);}
	O.destroy=function() {destroy();}
	O.isWidget=function() {return m_is_widget;}

	function setParent(parent_object) {
		if (O.parent()) {
			O.parent()._remove_child(O);
		}
		if (parent_object) {
			m_parent_id=parent_object.objectId();
			parent_object._add_child(O);
		}
		else {
			m_parent_id=null;
		}
	}
	function parent() {
		if (!m_parent_id) return null;
		return JQ._OM.object(m_parent_id);
	}
	function setProperty(name,val) {
		m_properties[name]=val;
	}
	function property(name) {
		if (name in m_properties)
			return m_properties[name];
		else
			return null;
	}
	function emit(signal_name,args) {
		if (signal_name in m_signals) {
			m_signals[signal_name]._emit(args);
		}
	}
	function declareSlot(slot_name,func) {
		m_slots[slot_name]=new JQSlot(O,func);
	}
	function destroy() {
		for (var id in m_child_ids) {
			var child_obj=JQ._OM.object(id);
			if (child_obj) {
				child_obj.destroy();
			}
		}
		O.setParent(null);
		O.emit('destroyed');
		JQ._OM.removeObject(m_object_id);
	}
	O._remove_child=function(child) {
		var id=child.objectId();
		if (id in m_child_ids) {
			delete m_child_ids[id];
		}
	}
	O._add_child=function(child) {
		var id=child.objectId();
		if (!id) return;
		m_child_ids[id]=1;
	}
	O._connect=function(signal_name,receiver,signal_or_slot_name) {
		if (!(signal_name in m_signals)) {
			m_signals[signal_name]=new JQSignal(O);
		}
		var SS=m_signals[signal_name];
		SS._add_signal_or_slot(receiver,signal_or_slot_name);
	}
	O._invoke_signal_or_slot=function(signal_or_slot_name,sender,args) {
		if (signal_or_slot_name in m_slots) {
			m_slots[signal_or_slot_name]._invoke(sender,args);
		}
		else if (signal_or_slot_name in m_signals) {
			m_signals[signal_or_slot_name]._emit(args);
		}
	}
	O._set_is_widget=function() {m_is_widget=true;}

	var m_object_id=make_random_id(10);
	var m_parent_id=null;;
	var m_child_ids={};
	var m_properties={};
	var m_signals={};
	var m_slots={};
	var m_is_widget=false;

	JQ._OM.addObject(m_object_id,O);
}

function JQSignal(object) {
	this._emit=function(args) {
		for (var i=0; i<m_signals_or_slots.length; i++) {
			var receiver_id=m_signals_or_slots[i].receiver_id;
			var signal_or_slot_name=m_signals_or_slots[i].signal_or_slot_name;
			var receiver=JQ._OM.object(receiver_id);
			if (!receiver) {
				//todo remove this item so we don't have to check in future
				return;
			}
			receiver._invoke_signal_or_slot(signal_or_slot_name,object,args); //object is the sender
		}
	}
	this._add_signal_or_slot=function(receiver,signal_or_slot_name) {
		m_signals_or_slots.push({
			receiver_id:receiver.objectId(),
			signal_or_slot_name:signal_or_slot_name
		});
	}
	var m_signals_or_slots=[];
}

function JQSlot(object,func) {
	this._invoke=function(sender,args) {
		func(sender,args);
	}
}


function make_random_id(num_chars)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < num_chars; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}