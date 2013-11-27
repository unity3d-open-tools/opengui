using UnityEngine;
using System.Collections;

[AddComponentMenu ("OpenGUI/Label")]
public class OGLabel : OGWidget {
	public string text;
	
	public override void Draw (  float x ,   float y   ){		
		if ( guiStyle == null) { guiStyle = GUI.skin.label; }
		
		GUI.Label ( new Rect( x, y, transform.localScale.x, transform.localScale.y ), text, guiStyle );
	}
}
