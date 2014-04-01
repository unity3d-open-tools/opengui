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
	override function UpdateWidget () {
		// Styles
		currentStyle = isDisabled ? styles.disabled : styles.basic;
		
		// Update data
		if ( !overrideFontSize ) {
			fontSize = currentStyle.text.fontSize;
		}

		if ( !overrideAlignment ) {
			alignment = currentStyle.text.alignment;
		}

		// Mouse
		mouseRct = drawRct;
	}


	//////////////////
	// Draw
	//////////////////	
	override function DrawText () {
		if ( drawRct == null ) { return; }
		
		OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, fontSize, alignment, drawDepth, tint, clipTo );
	}
}
