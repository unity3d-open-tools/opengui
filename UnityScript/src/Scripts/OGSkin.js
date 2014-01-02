#pragma strict
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
}

public class OGTextStyle {
	public var fontIndex : int = 0;
	public var fontSize : int = 12;
	public var fontColor : Color = Color.white;
	public var shadowSize : int = 0;
	public var shadowColor : Color = Color.black;
	public var alignment : TextAnchor;
	public var wordWrap : boolean = true;
	public var padding : RectOffset;
	public var lineHeight : float = 1.5;
	public var spacing : float = 1.0;
}

public class OGStyle {
	public var name : String = "New Style";
	public var coordinates : Rect = new Rect ( 0, 0, 32, 32 );
	public var border : OGSlicedSpriteOffset;
	public var text : OGTextStyle;
}

public class OGWidgetStyles {
	public var basic : OGStyle;
	public var hover : OGStyle;
	public var active : OGStyle;
	public var ticked : OGStyle;
	public var thumb : OGStyle;
	public var disabled : OGStyle;

	public static function IsStyleUsed ( styleName : String, widgetName : String ) : boolean {
		if ( styleName == "Basic" ) { return true; }
		if ( styleName == "Disabled" ) { return true; }
		
		switch ( widgetName ) {
			case "OGButton": case "OGPopUp":
				if ( styleName == "Active" ) { return true; }
				if ( styleName == "Hover" ) { return true; }
				if ( styleName == "Thumb" ) { return true; }
				break;

			case "OGDropDown":
				if ( styleName == "Active" ) { return true; }
				if ( styleName == "Hover" ) { return true; }
				if ( styleName == "Ticked" ) { return true; }
				break;

			case "OGTickBox":
				if ( styleName == "Hover" ) { return true; }
				if ( styleName == "Ticked" ) { return true; }
				break;

			case "OGSlider": case "OGTextField": case "OGProgressBar":
				if ( styleName == "Thumb" ) { return true; }
				break;

			case "OGTabs":
				if ( styleName == "Active" ) { return true; }
				break;
			
			case "OGListItem":
				if ( styleName == "Active" ) { return true; }
				if ( styleName == "Ticked" ) { return true; }
				break;
		}

		return false;
	}

	public static function GetNames() : String[] {
		var names : String[] = [ "Basic", "Active", "Hover", "Ticked", "Thumb", "Disabled" ];
		return names;
	}

	public function GetStyle ( str : String ) {
		var result : OGStyle;
		
		switch ( str ) {
			case "Basic":
				result = basic;
				break;

			case "Hover":
				result = hover;
				break;

			case "Active":
				result = active;
				break;

			case "Ticked":
				result = ticked;
				break;

			case "Thumb":
				result = thumb;
				break;

			case "Disabled":
				result = disabled;
				break;	
		}

		return result;
	}

	public function SetStyle ( str : String, stl : OGStyle ) {
		switch ( str ) {
			case "Basic":
				basic = stl;
				break;

			case "Hover":
				hover = stl;
				break;

			case "Active":
				active = stl;
				break;

			case "Ticked":
				ticked = stl;
				break;

			case "Thumb":
				thumb = stl;
				break;
			
			case "Disabled":
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
