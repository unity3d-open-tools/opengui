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
	
	@HideInInspector public var textStyle : GUIStyle = new GUIStyle();
	
	private var background : OGSlicedSprite;
	private var currentPreset : RegExPreset = RegExPreset.None;
	private var editor : TextEditor;
	
	override function DrawGUI () {
		if ( !style ) { return; }
		
		var x : float = this.transform.position.x + offset.x + scrollOffset.x;
		var y : float = this.transform.position.y + offset.y + scrollOffset.y;
		
		textStyle.font = style.text.font;
		textStyle.fontSize = style.text.fontSize;
		textStyle.normal.textColor = style.text.fontColor;
		textStyle.alignment = style.text.alignment;
		textStyle.wordWrap = style.text.wordWrap;
		textStyle.padding = style.text.padding;
		textStyle.clipping = TextClipping.Clip;
		
		GUI.depth = -drawDepth;
		
		if ( locked ) {
			GUI.TextField ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), text, maxLength, textStyle );
			
		} else {			
			text = GUI.TextField ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), text, maxLength, textStyle );
		
		}
		
		editor = GUIUtility.GetStateObject ( TextEditor, GUIUtility.keyboardControl ) as TextEditor;
		
		if ( regex != "" && regex != "\\" && regexPreset != RegExPreset.None ) {
			text = Regex.Replace ( text, "[" + regex + "]", "" );
		}
	}
	
	override function UpdateWidget ( root : OGRoot ) {
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
	}
}