#pragma strict

@script AddComponentMenu ("OpenGUI/PopUp")

class OGPopUp extends OGWidget {	
	var title : String;
	var isUp = false;
	var options : String[];
	var messageTarget : GameObject;
	var message : String;
	var passSelectedOption : boolean = false;
	var padding : Vector2 = new Vector2 ( 8.0, 8.0 );
	var indicator : String = "";
	
	var selectedOption : String;
	@HideInInspector var originalZ : float = 99;
	
	// Set options
	public function SetOptions ( strings : String[] ) {
		yield WaitForEndOfFrame();
		
		options = strings;
	}
				
	// Draw
	override function Draw ( x : float, y : float ) {	
		if ( !guiStyle ) { guiStyle = GUI.skin.box; }
		
		var textStyle : GUIStyle = new GUIStyle();
		textStyle.font = GUI.skin.label.font;
		textStyle.normal.textColor = guiStyle.normal.textColor;
		textStyle.fontSize = guiStyle.fontSize;
		textStyle.alignment = guiStyle.alignment;
		
		var activeStyle : GUIStyle = new GUIStyle ();
		activeStyle.normal.background = guiStyle.active.background;
		activeStyle.border = guiStyle.border;
		activeStyle.margin = guiStyle.margin;
		activeStyle.padding = guiStyle.padding;
																				
		if ( !isUp ) {			
			var label : String;
			
			if ( selectedOption ) {
				label = selectedOption;
			} else {
				label = title;
			}
			
			GUI.Box ( Rect ( x, y, transform.localScale.x + (guiStyle.padding.left * 2), transform.localScale.y ), "", guiStyle );
			
			GUI.Label ( Rect ( x + transform.localScale.x - 20, y + transform.localScale.y - 18, 20, 20 ), indicator, textStyle );
			
			if ( GUI.Button ( Rect ( x, y, transform.localScale.x + (guiStyle.padding.left * 2), transform.localScale.y ), label, textStyle ) ) {
				isUp = true;
			}
		} else {			
			GUI.Box ( Rect ( x, y, transform.localScale.x + (guiStyle.padding.left * 2), ( options.Length * (guiStyle.fontSize + guiStyle.padding.top) ) + ( guiStyle.padding.top * 2 ) ), "", activeStyle );
			
			for ( var i = 0; i < options.Length; i++ ) {			
				if ( GUI.Button ( Rect ( x + guiStyle.padding.left, y + guiStyle.padding.top + ( ( guiStyle.fontSize + guiStyle.padding.top ) * i ), transform.localScale.x + ( guiStyle.padding.left * 2 ), guiStyle.fontSize + guiStyle.padding.top ), options[i], textStyle ) ) {
					selectedOption = options[i];
					isUp = false;
					
					if ( messageTarget && message ) {
						if ( passSelectedOption ) {
							messageTarget.SendMessage ( message, selectedOption );
						} else {
							messageTarget.SendMessage ( message );
						}
					}
				}
			}
		}
	}
	
	// Update
	override function UpdateWidget () {		
		if ( originalZ == 99 ) {
			originalZ = transform.localPosition.z;
		}
		
		/*if ( isUp ) {
			transform.localPosition.z = -10;
		} else {
			transform.localPosition.z = originalZ;
		}*/
		
		if ( Input.GetKeyDown ( KeyCode.Escape ) ) {
			isUp = false;
		}
	}
}