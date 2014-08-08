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
	public var hideText : boolean = false;
	public var betaEditor : OGTextEditor = new OGTextEditor ();

	@HideInInspector public var listening : boolean = false;

	private var currentPreset : RegExPreset = RegExPreset.None;


	//////////////////
	// Interaction
	//////////////////
	override function OnMouseDown () {
		listening = true;

		betaEditor.cursorPos = Input.mousePosition;
	}

	override function OnMouseDrag () {
		listening = true;
		
		betaEditor.cursorSelectPos = Input.mousePosition;
	}

	override function OnMouseCancel () {
		listening = false;
	}

	public function OnGUI () {
		if ( listening ) {
			if ( !betaEditor.enabled ) {
				GUI.SetNextControlName ( "ActiveTextField" );
				
				var style : GUIStyle = new GUIStyle();
				style.normal.textColor = currentStyle.text.fontColor;
				style.font = currentStyle.text.font.dynamicFont;
				style.fontSize = currentStyle.text.fontSize;
				style.alignment = currentStyle.text.alignment;
				style.wordWrap = currentStyle.text.wordWrap;
				style.padding = currentStyle.text.padding;
				style.clipping = TextClipping.Clip;
				
				var c : Color = currentStyle.text.fontColor;
				GUI.skin.settings.selectionColor = new Color ( 1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a );
				
				var invertedRct : Rect = drawRct;
				
				invertedRct.y = Screen.height - invertedRct.y - invertedRct.height;
				
				if ( String.IsNullOrEmpty ( text ) ) {
					text = "";
				}
				
				text = GUI.TextArea ( invertedRct, text, style );
				
				if ( singleLine ) {
					text = text.Replace("\n", "").Replace("\r", "");
				}
				
				var controlID : int = GUIUtility.GetControlID(drawRct.GetHashCode(), FocusType.Keyboard);
				var editor : TextEditor = GUIUtility.GetStateObject(typeof(TextEditor), controlID -1 ) as TextEditor;
				
				GUI.FocusControl ( "ActiveTextField" );	
			}
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

		if ( betaEditor.enabled ) {
			text = betaEditor.Update ( text, drawRct );
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
	}


	/////////////////
	// Draw
	/////////////////
	override function DrawSkin () {
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );
	
		if ( listening && betaEditor.enabled ) {
			var color : Color = tint;
			
			if ( betaEditor.cursorIndex != betaEditor.cursorSelectIndex ) {
				color = new Color ( 1 - color.r, 1 - color.g, 1 - color.b, color.a );
				
				for ( var i : int = 0; i < betaEditor.selectionRects.Length; i++ ) {
					OGDrawHelper.DrawSprite ( betaEditor.selectionRects[i], styles.thumb, drawDepth, color, this );
				}
			
			} else {
				OGDrawHelper.DrawSprite ( betaEditor.cursorRect, styles.thumb, drawDepth, color, this );
			
			}
		}
	}

	override function DrawText () {
		if ( !listening || betaEditor.enabled ) {
			if ( hideText ) {
				var secure : String;

				for ( var i : int = 0; i < text.Length; i++ ) {
					secure += "*";
				}

				OGDrawHelper.DrawLabel ( drawRct, secure, currentStyle.text, drawDepth, tint, this, betaEditor );
			
			} else {
				OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth, tint, this, betaEditor );
			
			}
		}
	}
}
