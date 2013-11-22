#pragma strict

@script AddComponentMenu ("OpenGUI/TickBox")

class OGTickBox extends OGWidget {
	var label : String;
	var isChecked : boolean;
	
	override function Draw ( x : float, y : float ) {
		if ( !guiStyle ) { guiStyle = GUI.skin.toggle; }
		
		var textStyle : GUIStyle = new GUIStyle();
		textStyle.font = GUI.skin.label.font;
		textStyle.normal.textColor = guiStyle.normal.textColor;
		textStyle.fontSize = guiStyle.fontSize;
		textStyle.alignment = guiStyle.alignment;
		
		GUI.Label ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), label, textStyle );
		
		isChecked = GUI.Toggle ( Rect ( x + transform.localScale.x + 12, y - 2, transform.localScale.y, transform.localScale.y ), isChecked, "", guiStyle );
	}
}