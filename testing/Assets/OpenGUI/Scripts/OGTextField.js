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
	private var bypassDuration : float = 0.5;
	private var bypassTimer : float = 0;

	override function OnMouseDown () {
		listening = true;
	}

	override function OnMouseCancel () {
		listening = false;
	}

	private function CheckBypass ( callback : Function ) {
		if ( bypassTimer >= bypassDuration || bypassDuration <= 0 ) {
			bypassDuration /= 2;
			bypassTimer = 0;
			callback ();

		} else {
			bypassTimer += Time.deltaTime;
					
		}
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
			// Specific keys
			if ( Input.GetKey ( KeyCode.LeftArrow ) && cursorPosition > 0 ) {
				CheckBypass ( function () {
					cursorPosition--;

					if ( cursorPosition > 0 && cursorPosition < text.Length && text[cursorPosition-1] == "\\" && text[cursorPosition] == "n" ) {
						cursorPosition--;
					}
				} );
			
			} else if ( Input.GetKey ( KeyCode.RightArrow ) && cursorPosition < text.Length ) {
				CheckBypass ( function () {
					cursorPosition++;

					if ( text[cursorPosition-1] == "\\" && text[cursorPosition] == "n" ) {
						cursorPosition++;
					}
				} );
			
			} else if ( Input.GetKey ( KeyCode.DownArrow ) || Input.GetKey ( KeyCode.UpArrow ) ) {
				CheckBypass ( function () {
					var allLines : String[] = text.Split ( "\\n"[0] );
					var cursorLine : int = 0;
					var charCount : int = 0;
					var charNextLine : int = 0;	
					var charPreviousLine : int = 0;

					for ( var i : int = 0; i < allLines.Length; i++ ) {
						charCount += allLines[i].Length + 1;
					       
						if ( cursorPosition < charCount ) {
							cursorLine = i;

							var beginning : int = charCount - ( allLines[i].Length + 1 );
							var inset : int = cursorPosition - beginning;
							
							if ( cursorLine < allLines.Length - 1 ) {
								if ( allLines[i+1].Length < inset ) {
									charNextLine = charCount + allLines[i+1].Length;
								} else {
									charNextLine = charCount + inset;
								}
							}

							if ( cursorLine > 0 ) {
								if ( allLines[i-1].Length < inset ) {
									charPreviousLine = beginning - 1;
								} else {	
									charPreviousLine = beginning - ( allLines[i-1].Length + 1 ) + inset;
								}
							}						

							break;
						}	
					}

					if ( Input.GetKey ( KeyCode.DownArrow ) && allLines.Length - 1 > cursorLine  ) {
						cursorPosition = charNextLine;
						
						if ( text[cursorPosition-1] == "\\" && text[cursorPosition] == "n" ) {
							cursorPosition++;
						}
					
					} else if ( Input.GetKey ( KeyCode.UpArrow ) && cursorLine > 0  ) {
						cursorPosition = charPreviousLine;
					
						if ( cursorPosition > 0 && cursorPosition < text.Length && text[cursorPosition-1] == "\\" && text[cursorPosition] == "n" ) {
							cursorPosition--;
						}
					}
				} );

			} else if ( Input.GetKey ( KeyCode.Backspace ) ) {
				CheckBypass ( function () {
					if ( text.Length > 0 && cursorPosition > 0 ) {
						var goBack : int = 1;
						
						if ( text[cursorPosition-2] == "\\" && text[cursorPosition-1] == "n" ) {
							goBack = 2;
						}

						text = text.Substring ( 0, cursorPosition - goBack ) + text.Substring ( cursorPosition, text.Length - cursorPosition );	
						cursorPosition -= goBack;
					}
				} );

			} else if ( Input.GetKey ( KeyCode.Delete ) ) {
				CheckBypass ( function () {
					if ( text.Length > 0 && cursorPosition < text.Length ) {
						var goForward : int = 1;
						
						if ( text[cursorPosition] == "\\" && text[cursorPosition+1] == "n" ) {
							goForward = 2;
						}

						text = text.Substring ( 0, cursorPosition ) + text.Substring ( cursorPosition + goForward, text.Length - ( cursorPosition + goForward ) );	
					}
				} );
			
			} else if ( Input.GetKeyDown ( KeyCode.Return ) || Input.GetKeyDown ( KeyCode.KeypadEnter ) ) {
				text = text.Substring ( 0, cursorPosition ) + "\\n" + text.Substring ( cursorPosition, text.Length - cursorPosition );
				cursorPosition += 2;
			
			} else {
				bypassDuration = 0.5;
				bypassTimer = bypassDuration;
					
			}

			// Input string
			for ( var c : char in Input.inputString ) {
				if ( c != "\b"[0] && c != "\r"[0] && c != "\n"[0] ) {
					text = text.Substring ( 0, cursorPosition ) + c + text.Substring ( cursorPosition, text.Length - cursorPosition );
					cursorPosition++;
				}
			}

			// Cursor display
			if ( text.Length > 0 ) {
				displayedText = text.Substring ( 0, cursorPosition ) + "|" + text.Substring ( cursorPosition, text.Length - cursorPosition );
			} else {
				cursorPosition = 0;
				displayedText = "|";
			}
		
		} else {
			displayedText = text;

		}
	}
}
