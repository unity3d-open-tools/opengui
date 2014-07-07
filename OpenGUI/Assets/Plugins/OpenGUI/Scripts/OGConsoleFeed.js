#pragma strict

public class OGConsoleFeed extends OGWidget {
	public var text : String = "";
	public var overrideFontSize : boolean = false;
	public var fontSize : int;
	public var overrideAlignment : boolean = false;
	public var alignment : TextAnchor;

	@HideInInspector public var lineWidth : float = 0;
	
	private var lineHeight : float;
	private var spacing : float;
	private var oldString : String = "";

	//////////////////
	// Add Lines
	//////////////////	
	function Add(newLine : String) {
		text += "\n"+newLine;
	}
	function AddFirst(newLine : String) {
		var newText : String = "";
		newText = newLine+"\n"+text;
		text = newText;
	}

	/////////////////
	// Update
	/////////////////
	override function UpdateWidget () {
		// Update data
		if ( !overrideFontSize ) {
			fontSize = styles.basic.text.fontSize;
		}

		if ( !overrideAlignment ) {
			alignment = styles.basic.text.alignment;
		}

		// Mouse
		mouseRct = drawRct;
	}


	//////////////////
	// Draw
	//////////////////	
	override function DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, styles.basic.text, fontSize, alignment, drawDepth, tint, clipTo, null );
	}
}
