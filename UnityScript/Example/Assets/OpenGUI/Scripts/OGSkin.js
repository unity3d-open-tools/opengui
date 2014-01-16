#pragma strict
public enum OGStyleType {
	Basic,
	Hover,
	Active,
	Ticked,
	Thumb,
	Disabled
}

public class OGSlicedSpriteOffset {
	public var top : float;
	public var bottom : float;
	public var left : float;
	public var right : float;

	function OGSlicedSpriteOffset ( l : float, r : float, t : float, b : float ) {
		left = l;
		right = r;
		top = t;
		bottom = b;
	}

	public function get horizontal () : float {
		return left + right;
	}

	public function get vertical () : float {
		return top + bottom;
	}
}

public class OGTextStyle {
	public var fontIndex : int = 0;
	public var font : Font;
	public var fontSize : int = 12;
	public var fontColor : Color = Color.white;
	public var shadowSize : int = 0;
	public var shadowColor : Color = Color.black;
	public var alignment : TextAnchor;
	public var wordWrap : boolean = true;
	public var padding : RectOffset;
	public var lineHeight : float = 1.25;
	public var spacing : float = 1.25;
}

public class OGStyle {
	public var name : String = "New Style";
	public var coordinates : Rect = new Rect ( 0, 0, 32, 32 );
	public var border : OGSlicedSpriteOffset = new OGSlicedSpriteOffset ( 0, 0, 0, 0 );
	public var text : OGTextStyle;
}

public class OGWidgetStyles {
	public var basic : OGStyle;
	public var hover : OGStyle;
	public var active : OGStyle;
	public var ticked : OGStyle;
	public var thumb : OGStyle;
	public var disabled : OGStyle;

	public static function IsStyleUsed ( styleType : OGStyleType, widgetName : String ) : boolean {
		if ( styleType == OGStyleType.Basic ) { return true; }
		if ( styleType == OGStyleType.Disabled ) { return true; }
		
		switch ( widgetName ) {
			case "OGButton":
				if ( styleType == OGStyleType.Active ) { return true; }
				if ( styleType == OGStyleType.Hover ) { return true; }
				if ( styleType == OGStyleType.Thumb ) { return true; }
				break;
				
			case "OGPopUp":
				if ( styleType == OGStyleType.Active ) { return true; }
				if ( styleType == OGStyleType.Hover ) { return true; }
				break;

			case "OGDropDown":
				if ( styleType == OGStyleType.Active ) { return true; }
				if ( styleType == OGStyleType.Hover ) { return true; }
				if ( styleType == OGStyleType.Ticked ) { return true; }
				break;

			case "OGTickBox":
				if ( styleType == OGStyleType.Hover ) { return true; }
				if ( styleType == OGStyleType.Ticked ) { return true; }
				break;

			case "OGSlider": case "OGTextField": case "OGProgressBar":
				if ( styleType == OGStyleType.Thumb ) { return true; }
				break;

			case "OGTabs":
				if ( styleType == OGStyleType.Active ) { return true; }
				break;
			
			case "OGListItem":
				if ( styleType == OGStyleType.Active ) { return true; }
				if ( styleType == OGStyleType.Ticked ) { return true; }
				break;
		}

		return false;
	}

	public function GetStyle ( typ : OGStyleType ) {
		var result : OGStyle;
		
		switch ( typ ) {
			case OGStyleType.Basic:
				result = basic;
				break;

			case OGStyleType.Hover:
				result = hover;
				break;

			case OGStyleType.Active:
				result = active;
				break;

			case OGStyleType.Ticked:
				result = ticked;
				break;

			case OGStyleType.Thumb:
				result = thumb;
				break;

			case OGStyleType.Disabled:
				result = disabled;
				break;	
		}

		return result;
	}

	public function SetStyle ( typ : OGStyleType, stl : OGStyle ) {
		switch ( typ ) {
			case OGStyleType.Basic:
				basic = stl;
				break;

			case OGStyleType.Hover:
				hover = stl;
				break;

			case OGStyleType.Active:
				active = stl;
				break;

			case OGStyleType.Ticked:
				ticked = stl;
				break;

			case OGStyleType.Thumb:
				thumb = stl;
				break;
			
			case OGStyleType.Disabled:
				disabled = stl;
				break;	
		}
	}
}

public class OGStyleReference {
	public var type : String;
	public var styles : OGWidgetStyles;

	function OGStyleReference ( type : String, styles : OGWidgetStyles ) {
		this.type = type;
		this.styles = styles;
	}
}

public class OGSkin extends MonoBehaviour {
	@HideInInspector public var atlas : Material;
	@HideInInspector public var fonts : Font[];
	@HideInInspector public var fontShader : Shader;
	public var styles : OGStyle[];	
	@HideInInspector public var defaults : OGStyleReference [] = new OGStyleReference[0];
	
	public function ResetDefaults () {
		defaults = [
			new OGStyleReference ( "OGButton", new OGWidgetStyles() ),
			new OGStyleReference ( "OGDropDown", new OGWidgetStyles() ),
			new OGStyleReference ( "OGLabel", new OGWidgetStyles() ),
			new OGStyleReference ( "OGListItem", new OGWidgetStyles() ),
			new OGStyleReference ( "OGPopUp", new OGWidgetStyles() ),
			new OGStyleReference ( "OGProgressBar", new OGWidgetStyles() ),
			new OGStyleReference ( "OGScrollView", new OGWidgetStyles() ),
			new OGStyleReference ( "OGSlider", new OGWidgetStyles() ),
			new OGStyleReference ( "OGTabs", new OGWidgetStyles() ),
			new OGStyleReference ( "OGTextField", new OGWidgetStyles() ),
			new OGStyleReference ( "OGTickBox", new OGWidgetStyles() )
		];
	}

	public function GetDefaultStyles ( w : OGWidget ) {
		if ( defaults == null ) {
			ResetDefaults ();
		}
	
		for ( var sr : OGStyleReference in defaults ) {
			if ( sr.type == w.GetType().ToString() ) {
				w.styles = sr.styles;
			}
		}	
	}

	public function GetStyle ( n : String ) : OGStyle {
		for ( var s : OGStyle in styles ) {
			if ( s.name == n ) {
				return s;
			}
		}

		return null;
	}	

	public function GetAtlas () : Material {
		return Instantiate ( atlas );
	}
}
