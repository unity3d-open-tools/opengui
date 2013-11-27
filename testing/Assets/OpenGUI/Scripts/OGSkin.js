﻿#pragma strict
public class OGRectOffset {
	public var top : float;
	public var bottom : float;
	public var left : float;
	public var right : float;

	function OGRectOffset ( l : float, r : float, t : float, b : float ) {
		left = l;
		right = r;
		top = t;
		bottom = b;
	}
}

public class OGTextStyle {
	public var font : Font;
	public var fontSize : int = 12;
	public var fontColor : Color = Color.white;
	public var shadowSize : int = 0;
	public var shadowColor : Color = Color.black;
	public var alignment : TextAnchor;
	public var wordWrap : boolean = true;
	public var padding : RectOffset;
}

public class OGStyle {
	public var name : String = "New Style";
	public var coordinates : Rect = new Rect ( 0, 0, 32, 32 );
	public var border : OGRectOffset;
	public var text : OGTextStyle;
}

public class OGSkin extends MonoBehaviour {
	public var atlas : Material;
	
	public var styles : OGStyle[];
}