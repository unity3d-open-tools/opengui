#pragma strict

@script AddComponentMenu ("OpenGUI/Label")

class OGLabel extends OGWidget {
	var autoHeight : boolean = false;
	var text : String;
	var color : Color = Color.white;
	var size : int = 12;
	
	public function CalcHeight () {
		var height : float = guiStyle.CalcHeight ( GUIContent ( text ), transform.localScale.x );
		transform.localScale = new Vector3 ( transform.localScale.x, height, 1 );
	}
	
	override function Draw ( x : float, y : float ) {		
		if ( !guiStyle ) { guiStyle = GUI.skin.label; }
		
		if ( autoHeight ) {
			CalcHeight ();
		}
		
		if ( size < 10 ) {
			size = 10;
		}
		
		if ( color.a == 0 && color.r == 0 && color.g == 0 && color.b == 0 ) {
			color = Color.white;
		}
		
		var alteredStyle : GUIStyle = guiStyle;
		alteredStyle.fontSize = size;
		alteredStyle.normal.textColor = color;
		
		GUI.Label ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), text, alteredStyle );
	
	}
}