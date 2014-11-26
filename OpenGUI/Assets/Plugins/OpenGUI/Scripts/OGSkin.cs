using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public enum OGStyleType {
	Basic,
	Hover,
	Active,
	Ticked,
	Thumb,
}

public enum OGWidgetType {
	NONE,
	Button,
	DropContainer,
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

[System.Serializable]
public class OGSlicedSpriteOffset {
	public float top;
	public float bottom;
	public float left;
	public float right;

	public OGSlicedSpriteOffset ( float l, float r, float t, float b ) {
		left = l;
		right = r;
		top = t;
		bottom = b;
	}

	public float horizontal {
		get {
			return left + right;
		}
	}

	public float vertical {
		get {
			return top + bottom;
		}
	}
}

[System.Serializable]
public class OGTextStyle {
	public int fontIndex = 0;
	public OGFont font;
	public int fontSize = 12;
	public Color fontColor = Color.white;
	public int shadowSize = 0;
	public Color shadowColor = Color.black;
	public TextAnchor alignment;
	public bool wordWrap = true;
	public RectOffset padding;
	public float lineHeight = 1.25f;
	public float spacing = 1f;
}

[System.Serializable]
public class OGStyle {
	public string name = "New Style";
	public Rect coordinates = new Rect ( 0, 0, 32, 32 );
	public OGSlicedSpriteOffset border = new OGSlicedSpriteOffset ( 0, 0, 0, 0 );
	public Color color = Color.white;
	public OGTextStyle text;
}

[System.Serializable]
public class OGStyleSet {
	public OGStyle basic;
	public OGStyle hover;
	public OGStyle active;
	public OGStyle ticked;
	public OGStyle thumb;

	public void Refresh ( OGSkin skin ) {
		if ( !skin ) { return; }
		
		OGStyle newStyle;
		       
		if ( basic != null ) {
			newStyle = skin.GetStyle ( basic.name );
			if ( newStyle != null ) { basic = newStyle; }
		}
		
		if ( hover != null ) {
			newStyle = skin.GetStyle ( hover.name );
			if ( newStyle != null ) { hover = newStyle; }
		}
		
		if ( active != null ) {
			newStyle = skin.GetStyle ( active.name );
			if ( newStyle != null ) { active = newStyle; }
		}

		if ( ticked != null ) {
			newStyle = skin.GetStyle ( ticked.name );
			if ( newStyle != null ) { ticked = newStyle; }
		}
		
		if ( thumb != null ) {
			newStyle = skin.GetStyle ( thumb.name );
			if ( newStyle != null ) { thumb = newStyle; }
		}
	}

	public OGStyle GetStyle ( OGStyleType typ ) {
		OGStyle result = null;
		
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
		}

		return result;
	}

	public void SetStyle ( OGStyleType typ, OGStyle stl ) {
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
		}
	}
}

[System.Serializable]
public class OGDefault {
	public OGWidgetType widgetType;
	public OGStyleSet styleSet;

	public OGDefault ( OGWidgetType t, OGStyleSet s ) {
		widgetType = t;
		styleSet = s;
	}
}

public class OGSkin : MonoBehaviour {
	public Material atlas;
	public OGFont[] fonts = new OGFont[0];
	public Shader fontShader;
	public OGStyle[] styles = new OGStyle[0];	
	public OGDefault[] defaults = new OGDefault[0];

	private static Dictionary< System.Type, OGWidgetType > widgetEnums = new Dictionary< System.Type, OGWidgetType > ();

	public static OGWidgetType GetWidgetEnum ( OGWidget w ) {
		if ( widgetEnums.Count < 1 ) {
			widgetEnums.Add ( typeof(OGButton), OGWidgetType.Button );
			widgetEnums.Add ( typeof(OGDropDown), OGWidgetType.DropDown );
			widgetEnums.Add ( typeof(OGDropContainer), OGWidgetType.DropContainer );
			widgetEnums.Add ( typeof(OGLabel), OGWidgetType.Label );
			widgetEnums.Add ( typeof(OGListItem), OGWidgetType.ListItem );
			widgetEnums.Add ( typeof(OGPopUp), OGWidgetType.PopUp );
			widgetEnums.Add ( typeof(OGProgressBar), OGWidgetType.ProgressBar );
			widgetEnums.Add ( typeof(OGScrollView), OGWidgetType.ScrollView );
			widgetEnums.Add ( typeof(OGSlider), OGWidgetType.Slider );
			widgetEnums.Add ( typeof(OGSlicedSprite), OGWidgetType.SlicedSprite );
			widgetEnums.Add ( typeof(OGSprite), OGWidgetType.Sprite );
			widgetEnums.Add ( typeof(OGTabs), OGWidgetType.Tabs );
			widgetEnums.Add ( typeof(OGTextField), OGWidgetType.TextField );
			widgetEnums.Add ( typeof(OGTickBox), OGWidgetType.TickBox );
		}

		if ( widgetEnums.ContainsKey ( w.GetType() ) ) {
			return widgetEnums [ w.GetType() ];
		} else {
			return OGWidgetType.NONE;
		}
	}

	public static bool IsStyleUsed ( OGStyleType styleType, OGWidgetType widgetType ) {
		if ( widgetType == OGWidgetType.NONE ) { 
			return false;

		// All widgets use basic style
		} else if ( styleType == OGStyleType.Basic ) {
			return true;

		} else {
			OGStyleType[] s = null;

			switch ( widgetType ) {
				case OGWidgetType.Button: s = new OGStyleType[] { OGStyleType.Active, OGStyleType.Hover, OGStyleType.Thumb }; break;
				case OGWidgetType.DropContainer: s = new OGStyleType[] { OGStyleType.Hover }; break;
				case OGWidgetType.DropDown: s = new OGStyleType[] { OGStyleType.Active, OGStyleType.Hover, OGStyleType.Thumb, OGStyleType.Ticked }; break;
				case OGWidgetType.ListItem: s = new OGStyleType[] { OGStyleType.Hover, OGStyleType.Ticked }; break;
				case OGWidgetType.PopUp: s = new OGStyleType[] { OGStyleType.Active, OGStyleType.Hover, OGStyleType.Thumb }; break;
				case OGWidgetType.ProgressBar: s = new OGStyleType[] { OGStyleType.Thumb }; break;
				case OGWidgetType.Slider: s = new OGStyleType[] { OGStyleType.Thumb }; break;
				case OGWidgetType.ScrollView: s = new OGStyleType[] { OGStyleType.Thumb }; break;
				case OGWidgetType.Tabs: s = new OGStyleType[] { OGStyleType.Active, OGStyleType.Thumb }; break;
				case OGWidgetType.TextField: s = new OGStyleType[] { OGStyleType.Active, OGStyleType.Thumb }; break;
				case OGWidgetType.TickBox: s = new OGStyleType[] { OGStyleType.Active, OGStyleType.Ticked }; break;
				default: return false;
			}

			for ( int i = 0; i < s.Length ; i++ ) {
				if ( styleType == s[i] ) {
					return true;
				}
			}
		}

		return false;
	}

	public OGDefault[] GetAllDefaults () {
		if ( defaults == null || defaults.Length < 1 ) {
			ResetDefaults ();
		}
	
		return defaults;
	}

	public void ResetDefaults () {
		defaults = new OGDefault[] {
			new OGDefault ( OGWidgetType.Button, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.DropDown, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.DropContainer, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.Label, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.ListItem, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.PopUp, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.ProgressBar, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.ScrollView, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.Slider, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.Tabs, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.TextField, new OGStyleSet() ),
			new OGDefault ( OGWidgetType.TickBox, new OGStyleSet() )
		};
	}

	public void ApplyDefaultStyles ( OGWidget w ) {
		foreach ( OGDefault d in GetAllDefaults() ) {
			if ( d.widgetType == w.ToEnum () ) {
				if ( w.styles == null ) {
					w.styles = new OGStyleSet ();
				}
			
				w.styles.basic = d.styleSet.basic;
				w.styles.active = d.styleSet.active;
				w.styles.hover = d.styleSet.hover;
				w.styles.thumb = d.styleSet.thumb;
				w.styles.ticked = d.styleSet.ticked;

				w.styles.Refresh ( this );
			
				return;
			}
		}	
	}
	
	public OGStyle GetStyle ( string n ) {
		foreach ( OGStyle s in styles ) {
			if ( s.name == n ) {
				return s;
			}
		}

		return null;
	}	

	public Material GetAtlas () {
		return (Material) Instantiate ( atlas );
	}
}
