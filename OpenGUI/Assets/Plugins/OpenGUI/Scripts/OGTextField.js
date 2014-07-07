#pragma strict

public class OGTextField extends OGWidget {
	enum RegExPreset {
		None,
		OnlyNumbers,
		OnlyNumbersAndPeriod,
		OnlyASCII,
		NoSpaces
	}
	
	public var text : String = "";
	public var maxLength : int = 200;
	public var regex : String;
	public var regexPreset : RegExPreset;
	public var locked : boolean = false;
	public var singleLine : boolean = false;
	public var fitToText : boolean = false;
	public var editor : OGTextEditor;

	@HideInInspector public var listening : boolean = false;

	private var currentPreset : RegExPreset = RegExPreset.None;


	//////////////////
	// Interaction
	//////////////////
	override function OnMouseDown () {
		listening = true;

		editor.cursorPos = Input.mousePosition;
	}

	override function OnMouseCancel () {
		listening = false;
	}

	public function OnGUI () {
		if ( editor.enabled ) {
			editor.Events ();
		}	
	}

	////////////////////
	// Update
	////////////////////
	override function UpdateWidget () {
		// Persistent vars
		isSelectable = true;

		if ( fitToText ) {
			singleLine = true;
		}

		// Update data
		mouseRct = drawRct;
		isAlwaysOnTop = listening;
		
		if ( fitToText ) {
			this.transform.localScale.x = OGDrawHelper.GetLabelWidth ( text, currentStyle.text );
		}
		
		if ( String.IsNullOrEmpty ( text ) ) {
			text = "";
		}

		if ( singleLine ) {
			text = text.Replace("\n", "").Replace("\r", "");
		}

		if ( !String.IsNullOrEmpty ( regex ) && regex != "\\" && regexPreset != RegExPreset.None ) {
			text = Regex.Replace ( text, "[" + regex + "]", "" );
		}

		// Styles
		if ( listening ) {
			currentStyle = styles.active;
		} else {
			currentStyle = styles.basic;
		}

		// ^ Regex presets
		if ( regexPreset != currentPreset ) {
			currentPreset = regexPreset;
			
			if ( currentPreset == RegExPreset.None ) {
				regex = "";
		
			} else if ( currentPreset == RegExPreset.OnlyNumbers ) {
				regex = "^0-9";
				
			} else if ( currentPreset == RegExPreset.OnlyASCII ) {
				regex = "^a-zA-Z0-9";
				
			} else if ( currentPreset == RegExPreset.NoSpaces ) {
				regex = " ";
				
			} else if ( currentPreset == RegExPreset.OnlyNumbersAndPeriod) {
				regex = "^0-9.";
				
			}
		}

		if ( editor.enabled ) {
			text = editor.Update ( text, drawRct );
		}
	}


	/////////////////
	// Draw
	/////////////////
	override function DrawSkin () {
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );
	
		if ( listening && editor.enabled ) {
			var color : Color = tint;
			
			if ( editor.cursorIndex != editor.cursorSelectIndex ) {
				color = new Color ( 1 - color.r, 1 - color.g, 1 - color.b, color.a );
				
				for ( var i : int = 0; i < editor.selectionRects.Length; i++ ) {
					OGDrawHelper.DrawSprite ( editor.selectionRects[i], styles.thumb, drawDepth, color, this );
				}
			
			} else {
				OGDrawHelper.DrawSprite ( editor.cursorRect, styles.thumb, drawDepth, color, this );
			
			}
		}
	}

	override function DrawText () {
		if ( !listening || editor.enabled ) {
			OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth, tint, this, editor );
		}
	}
}
