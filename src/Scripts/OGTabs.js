#pragma strict

@script AddComponentMenu ("OpenGUI/Tabs")

class OGTabs extends OGWidget {
	private class Tab {
		var label : String;
		var object : GameObject;
	
		function Tab ( l : String, o : GameObject) {
			label = l;
			object = o;
		}
	}
	
	enum TabDirection {
		Horizontal,
		Vertical
	}
	
	var messageTarget : GameObject;
	var tabs : List.<Tab> = new List.<Tab>();
	var direction : TabDirection = TabDirection.Horizontal;
	var activeTab = 0;
		
	@HideInInspector var boxPos : Vector2 = Vector2.zero; 
	
	function AddTab ( label : String, object : GameObject ) {
		AddTab ( label, object, false );
	}
	
	function AddTab ( label : String, object : GameObject, switchTo : boolean ) {
		var newTab : Tab = new Tab ( label, object );
		tabs.Add ( newTab );
		
		if ( switchTo ) {
			ActivateTab ( newTab );	
		
		} else if ( tabs.Count == 1 ) {
			Start ();
		
		}
	}
	
	override function UpdateWidget () {

	}
	
	function ActivateTab ( i : int ) {
		ActivateTab ( tabs[i] );
	}
	
	function ActivateTab ( tab : Tab ) {
		for ( var t : Tab in tabs ) {
			if ( t.object ) { t.object.SetActive ( t == tab ); }
		}
		
		if ( direction == TabDirection.Vertical ) {
			boxPos.y = tabs.IndexOf ( tab ) * ( transform.localScale.y / tabs.Count );
		} else {
			boxPos.x = tabs.IndexOf ( tab ) * ( transform.localScale.x / tabs.Count );
		}
	}
	
	function Start () {
		if ( tabs.Count > 0 ) {
			ActivateTab ( tabs[0] );
		}
	}
	
	override function Draw ( x : float, y : float ) {
		if ( !guiStyle ) { guiStyle = GUI.skin.box; }
		
		var textStyle : GUIStyle = new GUIStyle();
		textStyle.font = GUI.skin.label.font;
		textStyle.normal.textColor = guiStyle.normal.textColor;
		textStyle.fontSize = guiStyle.fontSize;
		textStyle.alignment = guiStyle.alignment;
				
		if ( direction == TabDirection.Horizontal && tabs.Count > 0 ) {
			GUI.Box ( Rect ( x + boxPos.x, y, ( transform.localScale.x / tabs.Count ), transform.localScale.y ), "", guiStyle );
			
			for ( var i = 0; i < tabs.Count; i++ ) {				
				if ( GUI.Button ( Rect ( x + ( i * ( transform.localScale.x / tabs.Count ) ), y, ( transform.localScale.x / tabs.Count ), transform.localScale.y ), tabs[i].label, textStyle ) ) {
					if ( tabs[i].label != "" ) {	
						ActivateTab ( tabs[i] );
						activeTab = i;
					}
				}
			}
		} else if ( tabs.Count > 0 ) {
			GUI.Box ( Rect ( x, y + boxPos.y, transform.localScale.x, transform.localScale.y ), "", guiStyle );
			for ( i = 0; i < tabs.Count; i++ ) {				
				if ( GUI.Button ( Rect ( x, y + ( i * transform.localScale.y ), transform.localScale.x, transform.localScale.y ), tabs[i].label, textStyle ) ) {
					if ( tabs[i].label != "" ) {
						ActivateTab ( tabs[i] );
						activeTab = i;
					}
				}
			}
		}
	}
}