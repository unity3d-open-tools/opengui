using UnityEngine;
using System.Collections;

[AddComponentMenu ("OpenGUI/TickBox")]
public class OGTickBox : OGWidget {

	public string label;
	public bool isChecked;
	
	public override void Draw (  float x ,   float y   ){
		if ( guiStyle== null ) { guiStyle = GUI.skin.toggle; }
		
		GUIStyle textStyle = new GUIStyle();
		textStyle.font = GUI.skin.label.font;
		textStyle.normal.textColor = guiStyle.normal.textColor;
		textStyle.fontSize = guiStyle.fontSize;
		textStyle.alignment = guiStyle.alignment;
		
		GUI.Label ( new Rect( x, y, transform.localScale.x, transform.localScale.y ), label, textStyle );
		
		isChecked = GUI.Toggle ( new Rect( x + transform.localScale.x + 12, y - 2, transform.localScale.y, transform.localScale.y ), isChecked, "", guiStyle );
	}
}
