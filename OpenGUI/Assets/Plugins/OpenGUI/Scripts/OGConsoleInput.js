#pragma strict

public class OGConsoleInput extends OGWidget {
	enum RegExPreset {
		None,
		OnlyNumbers,
		OnlyNumbersAndPeriod,
		OnlyASCII,
		NoSpaces
	}
	
	@HideInInspector public var close : boolean = false;
	@HideInInspector public var submit : boolean = false;
	@HideInInspector public var text : String = "";
	public var maxLength : int = 30;
	@HideInInspector public var regex : String;
	@HideInInspector public var regexPreset : RegExPreset;
	@HideInInspector public var locked : boolean = false;
	@HideInInspector public var singleLine : boolean = false;
	@HideInInspector public var fitToText : boolean = false;
	@HideInInspector public var fitPadding : RectOffset = new RectOffset ();
	
	@HideInInspector public var listening : boolean = false;
	@HideInInspector private var oldText : String = "";
	
	public var changed : boolean = false;
	private var olText : String = "";
	public var overrideFontSize : boolean = false;
	public var fontSize : int;
	public var overrideAlignment : boolean = false;
	public var alignment : TextAnchor;
	
	
	
	private var currentPreset : RegExPreset = RegExPreset.None;

	//////////////////
	// Update
	//////////////////
	public function Update()
	{
		changed = false;
		if(text != oldText) {
		changed = true;
		}
		oldText = text;
	}
	
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
			var e : Event = Event.current;
			
			
			if (e.type == EventType.KeyDown && e.keyCode == KeyCode.Escape && GUI.GetNameOfFocusedControl() == "ActiveTextField") {
					close = true;
				}
				
			if (e.type == EventType.KeyDown && e.keyCode == KeyCode.Return && GUI.GetNameOfFocusedControl() == "ActiveTextField") {
					submit = true;
				}
			
			var style : GUIStyle = new GUIStyle();
			style.normal.textColor = currentStyle.text.fontColor;
			style.font = currentStyle.text.font.dynamicFont;
			style.fontSize = currentStyle.text.fontSize;
			style.alignment = currentStyle.text.alignment;
			style.wordWrap = currentStyle.text.wordWrap;
			style.padding = currentStyle.text.padding;
			style.padding.left += fitPadding.left;
			style.padding.right += fitPadding.right;
			style.padding.top += fitPadding.top;
			style.padding.bottom += fitPadding.bottom;
			style.clipping = TextClipping.Clip;

			var c : Color = currentStyle.text.fontColor;
			GUI.skin.settings.selectionColor = new Color ( 1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a );

			var invertedRct : Rect = drawRct;
			invertedRct.y = Screen.height - invertedRct.y - invertedRct.height;
			
			if ( String.IsNullOrEmpty ( text ) ) {
				text = String.Empty;
			}

			text = GUI.TextArea ( invertedRct, text, style );

			if ( singleLine ) {
				text = text.Replace("\n", "").Replace("\r", "");
			}

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

		if ( fitToText ) {
			singleLine = true;
		}

		// Update data
		mouseRct = drawRct;
		isAlwaysOnTop = listening;
		
		if ( fitToText ) {
			this.transform.localScale.x = OGDrawHelper.GetLabelWidth ( text, currentStyle.text );
		
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
	}


	/////////////////
	// Draw
	/////////////////
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
