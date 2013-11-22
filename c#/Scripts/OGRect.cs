using UnityEngine;
using System.Collections;

[AddComponentMenu ("OpenGUI/Rect")]
public class OGRect : OGWidget {

	public override void Draw (  float x ,   float y   ){	
		if ( guiStyle == null) { guiStyle = GUI.skin.box; }
			
		GUI.Box ( new Rect( x, y, transform.localScale.x, transform.localScale.y ), "", guiStyle );
	}
}
