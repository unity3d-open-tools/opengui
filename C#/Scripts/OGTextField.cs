using UnityEngine;
using System.Collections;
using System.Text.RegularExpressions;

[AddComponentMenu ("OpenGUI/TextField")]
public class OGTextField : OGWidget {

	public enum RegExPreset {
		None,
		OnlyNumbers,
		OnlyNumbersAndPeriod,
		OnlyASCII,
		NoSpaces
	}
	
	public string text = "";
	public int maxLength = 30;
	public string regex;
	public RegExPreset regexPreset;
	
	TextEditor editor;
	RegExPreset currentPreset = RegExPreset.None;
	
	public override void UpdateWidget (){		
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
	
	public override void Draw (  float x ,   float y   ){
		if ( guiStyle== null ) { guiStyle = GUI.skin.textField; }
					
		text = GUI.TextField ( new Rect( x, y, transform.localScale.x, transform.localScale.y ), text, maxLength, guiStyle );
		editor = GUIUtility.GetStateObject ( typeof(TextEditor), GUIUtility.keyboardControl ) as TextEditor;
		
		if ( regex != "" && regex != "\\" ) {
			text = Regex.Replace ( text, "[" + regex + "]", "" );
		}
	}
}
