#pragma strict

@script ExecuteInEditMode
@script AddComponentMenu ("OpenGUI/Ruler")

class OGRuler extends OGWidget {
	var color : Color = Color.white;

	@HideInInspector var bg : Texture2D;

	function Start () {
		bg = new Texture2D(2,2);
	}

	override function Draw ( x : float, y : float ) {
		GUI.DrawTexture ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), bg );
	}
	
	override function UpdateWidget () {
		bg.SetPixels([color,color,color,color]);
		bg.Apply();
	}
}