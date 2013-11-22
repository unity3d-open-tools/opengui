#pragma strict

@script AddComponentMenu ("OpenGUI/Button")

class OGButton extends OGWidget {
	var text : String = "";
	var image : Texture2D;
	var imageScale : Vector2 = Vector2.one;
	var imageOffset : Vector2 = Vector2.one;
	var target : GameObject;
	var message : String = "";
	var argument : String = "";
	var func : Function;

	@HideInInspector var hiddenString : String = "";

	override function Draw ( x : float, y : float ) {		
		if ( !guiStyle ) { guiStyle = GUI.skin.button; }
				
		if ( GUI.Button ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), text, guiStyle ) ) {
			if ( func ) {
				func ();			
			} else if ( argument && target ) {
				target.SendMessage ( message, argument );
			} else if ( target ) {
				target.SendMessage ( message, this );
			}
		}
		
		
		if ( image ) {
			GUI.DrawTexture ( Rect ( x + imageOffset.x, y + imageOffset.y, transform.localScale.x * imageScale.x, transform.localScale.y * imageScale.y ), image, ScaleMode.ScaleToFit, true, 0.0 );
		}
	}
}