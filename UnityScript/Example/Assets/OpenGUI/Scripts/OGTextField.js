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
	public var text : String = "";
	public var maxLength : int = 30;
	public var regex : String;
	public var regexPreset : RegExPreset;

	@HideInInspector public var cursorStyle : OGStyle;
	
	private var background : OGSlicedSprite;
	private var label : OGLabel;
	private var cursor : OGSprite;
	private var currentPreset : RegExPreset = RegExPreset.None;
	private var listening : boolean = false;
	private var cursorPosition : Vector2;
	private var selectCursorPosition : Vector2;

	//////////////////
	// Interaction
	//////////////////
	override function OnMouseDown () {
		listening = true;
	
		SetDirty ();
	}

	override function OnMouseCancel () {
		listening = false;

		SetDirty ();
	}


	/////////////////
	// OnGUI draw
	/////////////////
	// Steal TextEditor functionality from OnGUI
	public function OnGUI () {
		if ( listening && isDrawn ) {
			//GUI.color = new Color ( 0, 0, 0, 0 );

			var invertedRct : Rect = drawRct;
			invertedRct.y = Screen.height - invertedRct.y - invertedRct.height;
			text = GUI.TextArea ( invertedRct, text );

			var controlID : int = GUIUtility.GetControlID(drawRct.GetHashCode(), FocusType.Keyboard);
			var editor : TextEditor = GUIUtility.GetStateObject(typeof(TextEditor), controlID -1 ) as TextEditor;
		
			cursorPosition = new Vector2 ( editor.graphicalCursorPos.x / this.transform.localScale.x, ( editor.graphicalCursorPos.y - 2 ) / this.transform.localScale.y );
		
			if ( !String.IsNullOrEmpty ( regex ) && regex != "\\" && regexPreset != RegExPreset.None ) {
				text = Regex.Replace ( text, "[" + regex + "]", "" );
			}

			//GUI.color = new Color ( 1, 1, 1, 1 );
		}
	}

	
	////////////////////
	// Update
	////////////////////
	override function UpdateWidget () {
		// Update data
		mouseRct = drawRct;

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
		OGDrawHelper.DrawSlicedSprite ( drawRct, styles.basic.coordinates, styles.basic.border, drawDepth );
	}

	override function DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, styles.basic.text, drawDepth );
	}
}
