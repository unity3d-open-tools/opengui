#pragma strict

public enum OGLabelFontSize {
	None,
	_10 = 10,
	_11 = 11,
	_12 = 12,
	_14 = 14,
	_16 = 16,
	_18 = 18,
	_20 = 20,
	_24 = 24,
	_36 = 36,
	_42 = 42,
	_48 = 48
}

public class OGLabel extends OGWidget {
	public var text : String;
	public var customFontSize : OGLabelFontSize;
	
	@HideInInspector public var textStyle : GUIStyle = new GUIStyle();
	
	override function DrawGUI () {
		if ( !style ) { return; }
		
		var x : float = this.transform.position.x + offset.x + scrollOffset.x;
		var y : float = this.transform.position.y + offset.y + scrollOffset.y;
		
		textStyle.font = style.text.font;
		
		if ( customFontSize != OGLabelFontSize.None ) {
			textStyle.fontSize = customFontSize;
		} else {
			textStyle.fontSize = style.text.fontSize;
		}
		
		textStyle.normal.textColor = style.text.fontColor;
		textStyle.alignment = style.text.alignment;
		textStyle.wordWrap = style.text.wordWrap;
		textStyle.padding = style.text.padding;
		textStyle.clipping = TextClipping.Clip;
		
		GUI.depth = -drawDepth;
		
		if ( style.text.shadowSize > 0 ) {
			textStyle.normal.textColor = style.text.shadowColor;
			
			GUI.Label ( Rect ( x + style.text.shadowSize, y + style.text.shadowSize, this.transform.lossyScale.x, this.transform.lossyScale.y ), text, textStyle );
		}
		
		textStyle.normal.textColor = style.text.fontColor;
		
		GUI.Label ( Rect ( x, y, this.transform.lossyScale.x, this.transform.lossyScale.y ), text, textStyle );
			
		GUI.depth = 0;
	}
}