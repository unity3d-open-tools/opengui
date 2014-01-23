#pragma strict
public enum OGStyleType {
	Basic,
	Hover,
	Active,
	Ticked,
	Thumb,
	Disabled
}

public enum OGWidgetType {
	NONE,
	Button,
	DropDown,
	Label,
	ListItem,
	PopUp,
	ProgressBar,
	ScrollView,
	Slider,
	SlicedSprite,
	Sprite,
	Tabs,
	TextField,
	TickBox
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

	public static function IsStyleUsed ( styleType : OGStyleType, widgetType : OGWidgetType ) : boolean {
		switch ( widgetType ) {
			case OGWidgetType.Button:
				if ( styleType == OGStyleType.Basic ) { return true; }
				if ( styleType == OGStyleType.Disabled ) { return true; }
				if ( styleType == OGStyleType.Active ) { return true; }
				if ( styleType == OGStyleType.Hover ) { return true; }
				if ( styleType == OGStyleType.Thumb ) { return true; }
				break;

			case OGWidgetType.DropDown:
				if ( styleType == OGStyleType.Basic ) { return true; }
				if ( styleType == OGStyleType.Disabled ) { return true; }
				if ( styleType == OGStyleType.Active ) { return true; }
				if ( styleType == OGStyleType.Hover ) { return true; }
				if ( styleType == OGStyleType.Ticked ) { return true; }
				break;

			case OGWidgetType.Label: case OGWidgetType.SlicedSprite: case OGWidgetType.Sprite: case OGWidgetType.ScrollView:
				if ( styleType == OGStyleType.Basic ) { return true; }
				if ( styleType == OGStyleType.Disabled ) { return true; }
				break;

			case OGWidgetType.ListItem:
				if ( styleType == OGStyleType.Basic ) { return true; }
				if ( styleType == OGStyleType.Disabled ) { return true; }
				if ( styleType == OGStyleType.Active ) { return true; }
				if ( styleType == OGStyleType.Ticked ) { return true; }
				break;

			case OGWidgetType.PopUp:
				if ( styleType == OGStyleType.Basic ) { return true; }
				if ( styleType == OGStyleType.Disabled ) { return true; }
				if ( styleType == OGStyleType.Active ) { return true; }
				if ( styleType == OGStyleType.Hover ) { return true; }
				break;

			case OGWidgetType.Tabs:
				if ( styleType == OGStyleType.Basic ) { return true; }
				if ( styleType == OGStyleType.Disabled ) { return true; }
				if ( styleType == OGStyleType.Active ) { return true; }
				break;

			case OGWidgetType.TickBox:
				if ( styleType == OGStyleType.Basic ) { return true; }
				if ( styleType == OGStyleType.Disabled ) { return true; }
				if ( styleType == OGStyleType.Hover ) { return true; }
				if ( styleType == OGStyleType.Ticked ) { return true; }
				break;

			case OGWidgetType.Slider: case OGWidgetType.TextField: case OGWidgetType.ProgressBar:
				if ( styleType == OGStyleType.Basic ) { return true; }
				if ( styleType == OGStyleType.Disabled ) { return true; }
				if ( styleType == OGStyleType.Thumb ) { return true; }
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
	public var type : OGWidgetType;
	public var styles : OGWidgetStyles;

	function OGStyleReference ( type : OGWidgetType, styles : OGWidgetStyles ) {
		this.type = type;
		this.styles = styles;
	}
}

public class OGSkin extends MonoBehaviour {
	@HideInInspector public var atlas : Material;
	@HideInInspector public var fonts : Font[];
	@HideInInspector public var fontShader : Shader;
	public var styles : OGStyle[];	
	private var defaults : OGStyleReference [] = new OGStyleReference[0];

	private static var widgetEnums : Dictionary.< System.Type, OGWidgetType > = new Dictionary.< System.Type, OGWidgetType > ();

	public static function GetWidgetEnum ( w : OGWidget ) : OGWidgetType {
		if ( widgetEnums.Count < 1 ) {
			widgetEnums.Add ( OGButton, OGWidgetType.Button );
			widgetEnums.Add ( OGDropDown, OGWidgetType.DropDown );
			widgetEnums.Add ( OGLabel, OGWidgetType.Label );
			widgetEnums.Add ( OGListItem, OGWidgetType.ListItem );
			widgetEnums.Add ( OGPopUp, OGWidgetType.PopUp );
			widgetEnums.Add ( OGProgressBar, OGWidgetType.ProgressBar );
			widgetEnums.Add ( OGScrollView, OGWidgetType.ScrollView );
			widgetEnums.Add ( OGSlider, OGWidgetType.Slider );
			widgetEnums.Add ( OGSlicedSprite, OGWidgetType.SlicedSprite );
			widgetEnums.Add ( OGSprite, OGWidgetType.Sprite );
			widgetEnums.Add ( OGTabs, OGWidgetType.Tabs );
			widgetEnums.Add ( OGTextField, OGWidgetType.TextField );
			widgetEnums.Add ( OGTickBox, OGWidgetType.TickBox );
		}

		if ( widgetEnums.ContainsKey ( w.GetType() ) ) {
			return widgetEnums [ w.GetType() ];
		} else {
			return OGWidgetType.NONE;
		}
	}

	public function GetAllDefaults () : OGStyleReference [] {
		return defaults;
	}

	public function ResetDefaults () {
		defaults = [
			new OGStyleReference ( OGWidgetType.Button, new OGWidgetStyles() ),
			new OGStyleReference ( OGWidgetType.DropDown, new OGWidgetStyles() ),
			new OGStyleReference ( OGWidgetType.Label, new OGWidgetStyles() ),
			new OGStyleReference ( OGWidgetType.ListItem, new OGWidgetStyles() ),
			new OGStyleReference ( OGWidgetType.PopUp, new OGWidgetStyles() ),
			new OGStyleReference ( OGWidgetType.ProgressBar, new OGWidgetStyles() ),
			new OGStyleReference ( OGWidgetType.ScrollView, new OGWidgetStyles() ),
			new OGStyleReference ( OGWidgetType.Slider, new OGWidgetStyles() ),
			new OGStyleReference ( OGWidgetType.Tabs, new OGWidgetStyles() ),
			new OGStyleReference ( OGWidgetType.TextField, new OGWidgetStyles() ),
			new OGStyleReference ( OGWidgetType.TickBox, new OGWidgetStyles() )
		];
	}


	public function GetDefaultStyles ( w : OGWidget ) {
		if ( defaults == null || defaults.Length < 1 ) {
			ResetDefaults ();
		}
	
		for ( var sr : OGStyleReference in defaults ) {
			if ( sr.type == w.ToEnum() ) {
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
