#pragma strict

@script AddComponentMenu ("OpenGUI/Rect")

class OGRect extends OGWidget {
	override function Draw ( x : float, y : float ) {	
		if ( !guiStyle ) { guiStyle = GUI.skin.box; }
			
		GUI.Box ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), "", guiStyle );
	}
}