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
	public var text : String;
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
	private var bypassDuration : float = 0.5;
	private var bypassTimer : float = 0;

	override function OnMouseDown () {
		listening = true;
	}

	override function OnMouseCancel () {
		listening = false;
	}

	public function OnGUI () {
		if ( listening && isDrawn ) {
			//GUI.color = new Color ( 0, 0, 0, 0 );

			var invertedRct : Rect = drawRct;
			invertedRct.y = Screen.height - invertedRct.y - invertedRct.height;
			text = GUI.TextArea ( invertedRct, text );

			var controlID : int = GUIUtility.GetControlID(drawRct.GetHashCode(), FocusType.Keyboard);
			var editor : TextEditor = GUIUtility.GetStateObject(typeof(TextEditor), controlID -1 ) as TextEditor;
		
			cursorPosition = new Vector2 ( editor.graphicalCursorPos.x / this.transform.localScale.x, ( editor.graphicalCursorPos.y - 2 ) / this.transform.localScale.y );
			
			//GUI.color = new Color ( 1, 1, 1, 1 );
		}
	}

	override function UpdateWidget () {
		// Cursor
		if ( cursor == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSprite ) ) {
				cursor = this.gameObject.GetComponentInChildren ( OGSprite );
				
			} else {				
				var newCursor : OGSprite = new GameObject ( "Sprite", OGSprite ).GetComponent ( OGSprite );
				newCursor.transform.parent = this.transform;
				newCursor.styles.basic = this.styles.thumb;
				cursor = newCursor;
			}

			SetDirty ();
		
		} else {
			cursor.transform.localScale = new Vector3 ( 1.5 / this.transform.localScale.x, ( styles.basic.text.fontSize + 4 ) / this.transform.localScale.y, 1 );
			cursor.transform.localEulerAngles = Vector3.zero;
			cursor.transform.localPosition = new Vector3 ( cursorPosition.x, cursorPosition.y, 0 );
			
			cursor.isDrawn = isDrawn && listening;
			cursor.hidden = true;
			cursor.styles.basic = this.styles.thumb;
		}
		
		// Label
		if ( label == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGLabel ) ) {
				label = this.gameObject.GetComponentInChildren ( OGLabel );
				
			} else {				
				var newLabel : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
				newLabel.transform.parent = this.transform;
				newLabel.text = text;
				newLabel.styles.basic = this.styles.basic;
			}

			SetDirty ();
		
		} else {
			label.text = text;
			label.transform.localScale = Vector3.one;
			label.transform.localEulerAngles = Vector3.zero;
			label.transform.localPosition = Vector3.zero;
			
			label.isDrawn = isDrawn && !listening;
			label.hidden = true;
		}
		
		// Background		
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSlicedSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSlicedSprite );
				
			} else {			
				var newSprite : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newSprite.transform.parent = this.transform;
				newSprite.styles.basic = this.styles.basic;
			}
	
			SetDirty ();

		} else {
			background.transform.localScale = Vector3.one;
			background.transform.localEulerAngles = Vector3.zero;
			background.transform.localPosition = new Vector3 ( 0, 0, 1 );
		
			background.styles.basic = this.styles.basic;
			background.isDrawn = isDrawn;
			background.hidden = true;
		
			mouseRct = background.drawRct;
		}
				
		// Regex
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
	
		if ( listening ) {
			SetDirty ();
		}
	}
}
