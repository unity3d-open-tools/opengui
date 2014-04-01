#pragma strict

public class OGTextField extends OGWidget {
	enum RegExPreset {
		None,
		OnlyNumbers,
		OnlyNumbersAndPeriod,
		OnlyASCII,
		NoSpaces
	}
	
	public var locked : boolean = false;
	public var stealReturnKey : boolean = true;
	public var text : String = "";
	public var maxLength : int = 30;
	public var regex : String;
	public var regexPreset : RegExPreset;

	@HideInInspector public var listening : boolean = false;
	
	private var currentPreset : RegExPreset = RegExPreset.None;


	//////////////////
	// Interaction
	//////////////////
	override function OnMouseDown () {
		listening = true;
	}

	override function OnMouseCancel () {
		listening = false;
	}


	/////////////////
	// OnGUI draw
	/////////////////
	// Steal TextEditor functionality from OnGUI
	public function OnGUI () {
		if ( isDrawn && listening ) {
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
			text = GUI.TextArea ( invertedRct, text, style );

			var controlID : int = GUIUtility.GetControlID(drawRct.GetHashCode(), FocusType.Keyboard);
			var editor : TextEditor = GUIUtility.GetStateObject(typeof(TextEditor), controlID -1 ) as TextEditor;
	
			if ( !String.IsNullOrEmpty ( regex ) && regex != "\\" && regexPreset != RegExPreset.None ) {
				text = Regex.Replace ( text, "[" + regex + "]", "" );
			}

			GUI.FocusControl ( "ActiveTextField" );
		}	
	}

	
	////////////////////
	// Update
	////////////////////
	override function UpdateWidget () {
		// Persistent vars
		isSelectable = true;

		// Update data
		mouseRct = drawRct;
		isAlwaysOnTop = listening;

		// Styles
		if ( isDisabled ) {
			currentStyle = styles.disabled;
		} else if ( listening ) {
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
	}


	/////////////////
	// Draw
	/////////////////
	override function DrawSkin () {
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );
	}

	override function DrawText () {
		if ( !listening ) {
			OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth, tint, this );
		}
	}
}
