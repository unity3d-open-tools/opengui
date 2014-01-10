#pragma strict

public class OGLabel extends OGWidget {
	public var text : String = "";
	public var overrideFontSize : boolean = false;
	public var fontSize : int;
	public var overrideAlignment : boolean = false;
	public var alignment : TextAnchor;

	@HideInInspector public var lineWidth : float = 0;
	
	private var lineHeight : float;
	private var spacing : float;
	private var oldString : String = "";


	/////////////////
	// Update
	/////////////////
	public function set content ( value : Object ) {
		var newStr : String = value as String;
		
		if ( newStr != null ) {
			text = newStr;
			SetDirty ();
		} else {
			Debug.LogWarning ( "OGLabel | Content cannot be of type '" + value.GetType() + "'" );
		}
	}
	
	override function UpdateWidget () {
		if ( styles.basic == null ) { return; }

		if ( !overrideFontSize ) {
			fontSize = styles.basic.text.fontSize;
		}

		if ( !overrideAlignment ) {
			alignment = styles.basic.text.alignment;
		}

		mouseRct = drawRct;
	}
	

	//////////////////
	// Draw
	//////////////////	
	override function DrawGL () {
		if ( drawRct == null ) { return; }
		
		GL.Color ( styles.basic.text.fontColor );
		
		OGDrawHelper.DrawLabel ( drawRct, drawDepth, text, root.skin.fonts [ styles.basic.text.fontIndex ], 1.25, 1.25, fontSize, alignment );

		GL.Color ( Color.white );
	}
}
