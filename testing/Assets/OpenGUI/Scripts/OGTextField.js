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
	private var currentPreset : RegExPreset = RegExPreset.None;
	private var listening : boolean = false;
	private var cursorPosition : int = 0;
	private var displayedText : String;

	override function OnMouseDown () {
		listening = true;
	}

	override function OnMouseCancel () {
		listening = false;
	}

	override function UpdateWidget () {
		// Label
		if ( label == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGLabel ) ) {
				label = this.gameObject.GetComponentInChildren ( OGLabel );
				
			} else {				
				var newLabel : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
				newLabel.transform.parent = this.transform;
				newLabel.text = text;
				newLabel.style = this.style;
			}
		
		} else {
			label.text = displayedText;
			label.transform.localScale = Vector3.one;
			label.transform.localEulerAngles = Vector3.zero;
			label.transform.localPosition = Vector3.zero;
			
			label.isDrawn = isDrawn;
			label.hidden = true;
		}
		
		// Background		
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSlicedSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSlicedSprite );
				
			} else {			
				var newSprite : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newSprite.transform.parent = this.transform;
				newSprite.style = this.style;
			}
		
		} else {
			background.transform.localScale = Vector3.one;
			background.transform.localEulerAngles = Vector3.zero;
			background.transform.localPosition = Vector3.zero;
		
			background.style = this.style;
			background.isDrawn = isDrawn;
			background.hidden = true;
		
			mouseOver = CheckMouseOver ( background.drawRct );
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

		// Listen for input
		if ( listening ) {
			if ( Input.GetKeyDown ( KeyCode.LeftArrow ) && cursorPosition > 0 ) {
				cursorPosition--;
			
			} else if ( Input.GetKeyDown ( KeyCode.RightArrow ) && cursorPosition < text.Length ) {
				cursorPosition++;
			}

			if ( text.Length > 0 ) {
				displayedText = text.Substring ( 0, cursorPosition ) + "|" + text.Substring ( cursorPosition, text.Length - cursorPosition );
			} else {
				cursorPosition = 0;
				displayedText = "|";
			}

			for ( var c : char in Input.inputString ) {
				switch ( c ) {
					case "\b"[0]:
						if ( text.Length > 0 ) {
							text = text.Substring ( 0, text.Length - 1 );	
						}
						break;

					default:
						text += c;
						break;
				}
			}
		
		} else {
			displayedText = text;

		}
	}
}
