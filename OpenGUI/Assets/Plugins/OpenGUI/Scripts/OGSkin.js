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
	public var font : OGFont;
	public var fontSize : int = 12;
	public var fontColor : Color = Color.white;
	public var shadowSize : int = 0;
	public var shadowColor : Color = Color.black;
	public var alignment : TextAnchor;
	public var wordWrap : boolean = true;
	public var padding : RectOffset;
	public var lineHeight : float = 1.25;
	public var spacing : float = 1;
}

public class OGStyle {
	public var name : String = "New Style";
	public var coordinates : Rect = new Rect ( 0, 0, 32, 32 );
	public var border : OGSlicedSpriteOffset = new OGSlicedSpriteOffset ( 0, 0, 0, 0 );
	public var color : Color = Color.white;
	public var text : OGTextStyle;
}

public class OGStyleSet {
	public var basic : OGStyle;
	public var hover : OGStyle;
	public var active : OGStyle;
	public var ticked : OGStyle;
	public var thumb : OGStyle;
	public var disabled : OGStyle;

	public function Refresh ( skin : OGSkin ) {
		if ( !skin ) { return; }
		
		if ( basic ) { basic = skin.GetStyle ( basic.name ); }
		if ( hover ) { hover = skin.GetStyle ( hover.name ); }
		if ( active ) { active = skin.GetStyle ( active.name ); }
		if ( ticked ) { ticked = skin.GetStyle ( ticked.name ); }
		if ( thumb ) { thumb = skin.GetStyle ( thumb.name ); }
		if ( disabled ) { disabled = skin.GetStyle ( disabled.name ); }
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

public class OGDefault {
	public var widgetType : OGWidgetType;
	public var styleSet : OGStyleSet;

	function OGDefault ( t : OGWidgetType, s : OGStyleSet ) {
		widgetType = t;
		styleSet = s;
	}
}

public class OGSkin extends MonoBehaviour {
	public var atlas : Material;
	public var fonts : OGFont[] = new OGFont[0];
	public var fontShader : Shader;
	public var styles : OGStyle[] = new OGStyle[0];	
	public var defaults : OGDefault[] = new OGDefault[0];

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

	public static function IsStyleUsed ( styleType : OGStyleType, widgetType : OGWidgetType ) : boolean {
		if ( widgetType == OGWidgetType.NONE ) { 
			return false;

		// All widgets use basic style
		} else if ( styleType == OGStyleType.Basic ) {
			return true;

		} else {
			var s : OGStyleType[];

			switch ( widgetType ) {
				case OGWidgetType.Button: s = [ OGStyleType.Disabled, OGStyleType.Active, OGStyleType.Hover, OGStyleType.Thumb ]; break;
				case OGWidgetType.DropDown: s = [ OGStyleType.Disabled, OGStyleType.Active, OGStyleType.Hover, OGStyleType.Ticked ]; break;
				case OGWidgetType.Label: s = [ OGStyleType.Disabled ]; break;
				case OGWidgetType.ListItem: s = [ OGStyleType.Disabled, OGStyleType.Hover, OGStyleType.Ticked ]; break;
				case OGWidgetType.PopUp: s = [ OGStyleType.Disabled, OGStyleType.Active, OGStyleType.Hover ]; break;
				case OGWidgetType.ProgressBar: s = [ OGStyleType.Thumb ]; break;
				case OGWidgetType.Slider: s = [ OGStyleType.Disabled, OGStyleType.Thumb ]; break;
				case OGWidgetType.ScrollView: s = [ OGStyleType.Thumb ]; break;
				case OGWidgetType.Tabs: s = [ OGStyleType.Disabled, OGStyleType.Active ]; break;
				case OGWidgetType.TextField: s = [ OGStyleType.Active, OGStyleType.Disabled ]; break;
				case OGWidgetType.TickBox: s = [ OGStyleType.Disabled, OGStyleType.Hover, OGStyleType.Ticked ]; break;
				default: return false;
			}

			for ( var i : int = 0; i < s.Length ; i++ ) {
				if ( styleType == s[i] ) {
					return true;
				}
			}
		}

		return false;
	}

	public function GetAllDefaults () : OGDefault[] {
		if ( defaults == null || defaults.Length < 1 ) {
			ResetDefaults ();
		}
	
		return defaults;
	}

	public function ResetDefaults () {
		defaults = [
			new OGDefault ( OGWidgetType.Button, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.DropDown, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.Label, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.ListItem, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.PopUp, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.ProgressBar, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.ScrollView, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.Slider, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.Tabs, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.TextField, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.TickBox, new OGStyleSet() )
		];
	}


	public function GetDefaultStyles ( w : OGWidget ) {
		for ( var d : OGDefault in GetAllDefaults() ) {
			if ( d.widgetType == w.ToEnum() ) {
				w.styles = new OGStyleSet();
				w.styles.basic = d.styleSet.basic;
				w.styles.active = d.styleSet.active;
				w.styles.hover = d.styleSet.hover;
				w.styles.thumb = d.styleSet.thumb;
				w.styles.disabled = d.styleSet.disabled;
				w.styles.ticked = d.styleSet.ticked;
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
