#pragma strict

@script AddComponentMenu ("OpenGUI/TextField")

import System.Text.RegularExpressions;

class OGTextField extends OGWidget {
	enum RegExPreset {
		None,
		OnlyNumbers,
		OnlyNumbersAndPeriod,
		OnlyASCII,
		NoSpaces
	}
	
	var locked : boolean = false;
	var text : String = "";
	var maxLength : int = 30;
	var regex : String;
	var regexPreset : RegExPreset;
	
	@HideInInspector var editor : TextEditor;
	@HideInInspector var currentPreset : RegExPreset = RegExPreset.None;
	
	override function UpdateWidget () {		
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
	
	override function Draw ( x : float, y : float ) {
		if ( !text ) { text = ""; }
		if ( !guiStyle ) { guiStyle = GUI.skin.textField; }
		
		if ( locked ) {
			GUI.TextField ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), text, maxLength, guiStyle );
			
		} else {			
			text = GUI.TextField ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), text, maxLength, guiStyle );
		
		}
		
		editor = GUIUtility.GetStateObject ( TextEditor, GUIUtility.keyboardControl ) as TextEditor;
		
		if ( regex != "" && regex != "\\" && regexPreset != RegExPreset.None ) {
			text = Regex.Replace ( text, "[" + regex + "]", "" );
		}
	}
}