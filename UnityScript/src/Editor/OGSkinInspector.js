#pragma strict

import System.Collections.Generic;
import System.Linq;

@CustomEditor ( OGSkin )
public class OGSkinInspector extends Editor {
	private var deleteMode : boolean = false;
	private var addMode : boolean = false;
	private var uvMode : boolean = false;
	private var uvScrollPosition : Vector2;
	private var addStyleName : String = "";
	
	private static var currentStyle : int = 0;
	private static var setDefaultsMode : boolean = false;
	private static var selectedStyle : int = 0;
	
	public static function SetCurrentStyle ( i : int ) {
		currentStyle = i;
	}

	public static function SetDefaultsMode () {
		setDefaultsMode = true;
	}

	private function GetStyles ( includeCancel : boolean ) : String[] {
		var skin : OGSkin = target as OGSkin;
		var tempList : List.< String > = new List.< String >();
		
		if ( includeCancel ) {
			tempList.Add ( "..." );
		}
		
		for ( var style : OGStyle in skin.styles ) {
			tempList.Add ( style.name );
		}
		
		return tempList.ToArray();
	}
	
	private function AddStyle ( n : String ) {
		var skin : OGSkin = target as OGSkin;
		var tempList : List.< OGStyle > = new List.< OGStyle > ( skin.styles );
		var newStyle : OGStyle = new OGStyle ();
		newStyle.name = n;
		
		tempList.Add ( newStyle );
		
		skin.styles = tempList.ToArray();
	
		SortStyles ( skin, newStyle );
	}
	
	private function RemoveStyle ( i : int ) {
		var skin : OGSkin = target as OGSkin;
		var tempList : List.< OGStyle > = new List.< OGStyle > ( skin.styles );
		
		tempList.RemoveAt ( i );
		
		skin.styles = tempList.ToArray();
	}
	
	private function CompareNames ( a : OGStyle, b : OGStyle ) {
		return a.name.CompareTo ( b.name );
	}
	
	private function CalcBorderLines ( controlRect : Rect, skin : OGSkin ) : Vector3[] {
		var lines : Vector3[] = new Vector3[8];
		var width : float = skin.styles[currentStyle].coordinates.width * 2;
		var height : float = skin.styles[currentStyle].coordinates.height * 2;
		
		// Left
		lines[0] = new Vector3 ( controlRect.x + skin.styles[currentStyle].border.left * width / skin.styles[currentStyle].coordinates.width, controlRect.y, 0 );
		lines[1] = lines[0] + new Vector3 ( 0, controlRect.height, 0 );
		
		// Right
		lines[2] = new Vector3 ( controlRect.x + width - skin.styles[currentStyle].border.right * width / skin.styles[currentStyle].coordinates.width, controlRect.y, 0 );
		lines[3] = lines[2] + new Vector3 ( 0, controlRect.height, 0 );
		
		// Top
		lines[4] = new Vector3 ( controlRect.x, controlRect.y + skin.styles[currentStyle].border.top * height / skin.styles[currentStyle].coordinates.height, 0 );
		lines[5] = lines[4] + new Vector3 ( controlRect.width, 0, 0 );
		
		// Bottom
		lines[6] = new Vector3 ( controlRect.x, controlRect.y + height - skin.styles[currentStyle].border.bottom * height / skin.styles[currentStyle].coordinates.height, 0 );
		lines[7] = lines[6] + new Vector3 ( controlRect.width, 0, 0 );
		
		return lines;
	}
	
	private function CalcUVBorderLines ( controlRect : Rect, style : OGStyle, atlas : Texture ) : Vector3[] {
		var lines : Vector3[] = new Vector3[8];
		var width : float = style.coordinates.width;
		var height : float = style.coordinates.height;
		var x : float = controlRect.x + style.coordinates.x;
		var y : float = controlRect.y + atlas.height - style.coordinates.y;
		
		// Left
		lines[0] = new Vector3 ( x, y, 0 );
		lines[1] = lines[0] - new Vector3 ( 0, height, 0 );
		
		// Right
		lines[2] = new Vector3 ( x + width, y, 0 );
		lines[3] = lines[2] - new Vector3 ( 0, height, 0 );
		
		// Top
		lines[4] = new Vector3 ( x, y - height, 0 );
		lines[5] = lines[4] + new Vector3 ( width, 0, 0 );
		
		// Bottom
		lines[6] = new Vector3 ( x, y, 0 );
		lines[7] = lines[6] + new Vector3 ( width, 0, 0 );
		
		return lines;
	}

	private function GetStyleIndex ( skin : OGSkin, style : OGStyle ) : int {
		if ( skin && style ) {
			for ( var i : int = 0; i < skin.styles.Length; i++ ) {
				if ( skin.styles[i].name == style.name ) {
					return i;
				}
			}
		}
	
		return 0;
	}

	private function GetAnchors () : String[] {
		return System.Enum.GetNames(TextAnchor);
	}

	private function GetStyles ( skin : OGSkin ) : String[] {
		var tempList : List.< String > = new List.< String >();
		
		if ( skin ) {
			for ( var style : OGStyle in skin.styles ) {
				tempList.Add ( style.name );
			}
		}
		
		return tempList.ToArray();
	}

	private function GetFonts ( skin : OGSkin ) : String[] {
		var tempList : List.< String > = new List.< String >();
		
		if ( skin ) {
			for ( var font : Font in skin.fonts ) {
				tempList.Add ( font.name );
			}
		}
		
		return tempList.ToArray();
	}

	private function SortStyles ( skin : OGSkin, focus : OGStyle ) {
		var tempList : List.< OGStyle > = new List.< OGStyle > ( skin.styles );
				
		tempList.Sort ( CompareNames );
		
		skin.styles = tempList.ToArray ();

		for ( var i : int = 0; i < skin.styles.Length; i++ ) {
			if ( skin.styles[i] == focus ) {
				currentStyle = i;
			}
		}
	}
	
	override function OnInspectorGUI () {		
		var skin : OGSkin = target as OGSkin;
		
		// Break if null	
		if ( skin.atlas == null || skin.styles.Length < 1 || skin.styles[currentStyle] == null || skin.styles[currentStyle].text == null) { return; }
	
		if ( currentStyle >= skin.styles.Length ) {
			currentStyle = skin.styles.Length - 1;
		}

		var tempObj : Object;
		var s : OGStyle = skin.styles[currentStyle];
				
		if ( !skin ) { return; }
	
		// Set defaults	
		if ( setDefaultsMode ) {
			EditorGUILayout.BeginHorizontal ();

			EditorGUILayout.LabelField ( "Manage defaults", EditorStyles.boldLabel );

			// Reset
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "Reset", GUILayout.Width ( 50 ) ) ) {
				skin.ResetDefaults ();
			}
			
			EditorGUILayout.EndHorizontal ();
			
			EditorGUILayout.LabelField ( "Set the default widget styles" );
			
			GUILayout.Space ( 10 );
			
			// Back
			GUI.backgroundColor = Color.white;
			if ( GUILayout.Button ( "Back to inspector", GUILayout.Height ( 30 ) ) ) {
				setDefaultsMode = false;
			}

			GUILayout.Space ( 10 );

			for ( var sr : OGStyleReference in skin.defaults ) {
				if ( !sr || !sr.type || !sr.styles ) { 
					continue;
				}
				
				EditorGUILayout.LabelField ( sr.type, EditorStyles.boldLabel, GUILayout.Width ( 100 ) );
				
				EditorGUILayout.BeginVertical ();

				for ( var styleType : OGStyleType in System.Enum.GetValues(OGStyleType) as OGStyleType[] ) {
					if ( OGWidgetStyles.IsStyleUsed ( styleType, sr.type ) ) {
						var stateName : String = styleType.ToString();
						var style : OGStyle = sr.styles.GetStyle ( styleType );
						var styleIndex : int = GetStyleIndex ( skin, style );		
						
						EditorGUILayout.BeginHorizontal();
						EditorGUILayout.LabelField ( stateName, GUILayout.Width ( 80 ) );
						styleIndex = EditorGUILayout.Popup ( styleIndex, GetStyles ( skin ) );
						EditorGUILayout.EndHorizontal ();
						sr.styles.SetStyle ( styleType, skin.styles [ styleIndex ] );
					}
				}

				EditorGUILayout.EndVertical ();

				GUILayout.Space ( 20 );
			}

			// Back
			GUI.backgroundColor = Color.white;
			if ( GUILayout.Button ( "Back to inspector", GUILayout.Height ( 30 ) ) ) {
				setDefaultsMode = false;
			}

		// Adjust UV
		} else if ( uvMode ) {
			EditorGUILayout.BeginHorizontal ();
			EditorGUILayout.LabelField ( "Style", EditorStyles.boldLabel, GUILayout.Width ( 50 ) );
			currentStyle = EditorGUILayout.Popup ( currentStyle, GetStyles ( false ), GUILayout.Width ( 100 ));
			EditorGUILayout.EndHorizontal ();
			
			EditorGUILayout.Space ();
			
			EditorGUILayout.LabelField ( "Edit widget UV coordinates" );
			
			EditorGUILayout.Space ();
			
			// Atlas
			var uvAtlasTex : Texture = skin.atlas.mainTexture;
			var uvCoords : Rect = new Rect (
				s.coordinates.x / uvAtlasTex.width,
				s.coordinates.y / uvAtlasTex.height,
				s.coordinates.width / uvAtlasTex.width,
				s.coordinates.height / uvAtlasTex.height
			);

			s.coordinates = EditorGUILayout.RectField ( s.coordinates );
			
			EditorGUILayout.Space ();

			uvScrollPosition = GUILayout.BeginScrollView ( uvScrollPosition, GUILayout.Height ( uvAtlasTex.height + 20 ) );
			
			var uvControlRect : Rect = EditorGUILayout.GetControlRect ( false, uvAtlasTex.height, GUILayout.Width ( uvAtlasTex.width ) );
			var uvBorderLines : Vector3[] = CalcUVBorderLines ( uvControlRect, s, uvAtlasTex );
			
			GUI.DrawTexture ( uvControlRect, uvAtlasTex, ScaleMode.ScaleToFit, true );
		
			Handles.color = Color.green;

			Handles.DrawLine ( uvBorderLines[0], uvBorderLines[1] );
			Handles.DrawLine ( uvBorderLines[2], uvBorderLines[3] );
			Handles.DrawLine ( uvBorderLines[4], uvBorderLines[5] );
			Handles.DrawLine ( uvBorderLines[6], uvBorderLines[7] );
			
			Handles.color = Color.white;

			GUILayout.EndScrollView ();

			EditorGUILayout.Space ();

			// Back
			GUI.backgroundColor = Color.white;
			if ( GUILayout.Button ( "Back to inspector", GUILayout.Height ( 30 ) ) ) {
				uvMode = false;
			}

		// Edit style
		} else {	
			// Style
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Style", EditorStyles.boldLabel, GUILayout.Width ( 50 ) );
			currentStyle = EditorGUILayout.Popup ( currentStyle, GetStyles ( false ), GUILayout.Width ( 100 ));
			
			EditorGUILayout.Space ();

			// ^ Preview
			var newCoords : Rect = new Rect (
				s.coordinates.x / skin.atlas.mainTexture.width,
				s.coordinates.y / skin.atlas.mainTexture.height,
				s.coordinates.width / skin.atlas.mainTexture.width,
				s.coordinates.height / skin.atlas.mainTexture.height
			);
			
			var controlRect : Rect = EditorGUILayout.GetControlRect ( false, s.coordinates.height * 2, GUILayout.Width(s.coordinates.width * 2));
			var borderLines : Vector3[] = CalcBorderLines ( controlRect, skin );
			var previewTex : Texture = skin.atlas.mainTexture;
			
			GUI.DrawTextureWithTexCoords ( controlRect, previewTex, newCoords, true );
					
			Handles.DrawLine ( borderLines[0], borderLines[1] );
			Handles.DrawLine ( borderLines[2], borderLines[3] );
			Handles.DrawLine ( borderLines[4], borderLines[5] );
			Handles.DrawLine ( borderLines[6], borderLines[7] );
			
			EditorGUILayout.EndHorizontal ();
			
			GUILayout.Space ( 20 );
			
			// ^ Name
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Name", GUILayout.Width ( 100 ) );
			s.name = EditorGUILayout.TextField ( s.name );
			EditorGUILayout.EndHorizontal();

			// ^ Coordinates
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Coordinates", GUILayout.Width ( 100 ) );
			s.coordinates = EditorGUILayout.RectField ( s.coordinates );
			if ( GUILayout.Button ( "Edit", GUILayout.Width ( 40 ), GUILayout.Height ( 30 ) ) ) {
				uvMode = true;
			}
			EditorGUILayout.EndHorizontal();

			// ^ Border
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Border", GUILayout.Width ( 100 ) );

			EditorGUILayout.BeginVertical();
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.Space ();
			s.border.top = EditorGUILayout.FloatField ( s.border.top, GUILayout.Width ( 30 ) );
			EditorGUILayout.Space ();
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.BeginHorizontal();
			s.border.left = EditorGUILayout.FloatField ( s.border.left, GUILayout.Width ( 30 ) );
			EditorGUILayout.Space ();
			s.border.right = EditorGUILayout.FloatField ( s.border.right, GUILayout.Width ( 30 ) );
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.Space ();
			s.border.bottom = EditorGUILayout.FloatField ( s.border.bottom, GUILayout.Width ( 30 ) );
			EditorGUILayout.Space ();
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.EndVertical();
			
			EditorGUILayout.EndHorizontal();
		
			// ^ Text
			GUILayout.Space ( 20 );
			
			// ^^ Font
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Font", GUILayout.Width ( 100 ) );
			if ( s.text.fontIndex >= skin.fonts.Length ) {
				s.text.fontIndex = skin.fonts.Length - 1;
			
			} else if ( s.text.fontIndex < 0 ) {
				s.text.fontIndex = 0;
			
			}
			s.text.fontIndex = EditorGUILayout.Popup ( s.text.fontIndex, GetFonts ( skin ));
			s.text.font = skin.fonts[s.text.fontIndex];
			EditorGUILayout.EndHorizontal();
			
			// ^^ Size
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Size", GUILayout.Width ( 100 ) );
			s.text.fontSize = EditorGUILayout.IntField ( s.text.fontSize );
			EditorGUILayout.EndHorizontal();

			// ^^ Colour
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Colour", GUILayout.Width ( 100 ) );
			s.text.fontColor = EditorGUILayout.ColorField ( s.text.fontColor );
			EditorGUILayout.EndHorizontal();
			
			// ^^ Shadow
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Shadow offset", GUILayout.Width ( 100 ) );
			s.text.shadowSize = EditorGUILayout.IntField ( s.text.shadowSize );
			EditorGUILayout.EndHorizontal();

			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Shadow colour", GUILayout.Width ( 100 ) );
			s.text.shadowColor = EditorGUILayout.ColorField ( s.text.shadowColor );
			EditorGUILayout.EndHorizontal();

			// ^^ Alignment
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Alignment", GUILayout.Width ( 100 ) );
			s.text.alignment = EditorGUILayout.Popup ( s.text.alignment, GetAnchors ());
			EditorGUILayout.EndHorizontal();
			
			// ^^ Word wrap
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Word wrap", GUILayout.Width ( 100 ) );
			s.text.wordWrap = EditorGUILayout.Toggle ( s.text.wordWrap );
			EditorGUILayout.EndHorizontal();
			
			// ^^ Padding
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Padding", GUILayout.Width ( 100 ) );

			EditorGUILayout.BeginVertical();
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.Space ();
			s.text.padding.top = EditorGUILayout.FloatField ( s.text.padding.top, GUILayout.Width ( 30 ) );
			EditorGUILayout.Space ();
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.BeginHorizontal();
			s.text.padding.left = EditorGUILayout.FloatField ( s.text.padding.left, GUILayout.Width ( 30 ) );
			EditorGUILayout.Space ();
			s.text.padding.right = EditorGUILayout.FloatField ( s.text.padding.right, GUILayout.Width ( 30 ) );
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.Space ();
			s.text.padding.bottom = EditorGUILayout.FloatField ( s.text.padding.bottom, GUILayout.Width ( 30 ) );
			EditorGUILayout.Space ();
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.EndVertical();
			
			EditorGUILayout.EndHorizontal();

			// ^^ Line height
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Line height", GUILayout.Width ( 100 ) );
			s.text.lineHeight = EditorGUILayout.FloatField ( s.text.lineHeight );
			EditorGUILayout.EndHorizontal();
			
			// ^^ spacing
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Spacing", GUILayout.Width ( 100 ) );
			s.text.spacing = EditorGUILayout.FloatField ( s.text.spacing );
			EditorGUILayout.EndHorizontal();

			GUILayout.Space ( 20 );
		
			// Fonts
			EditorGUILayout.LabelField ( "Fonts", EditorStyles.boldLabel );
			var tmpList : List.< Font >;
			
			if ( skin.fonts.Length < 1 ) {
				skin.fonts = new Font[1];
			}
			
			for ( var i : int = 0; i < skin.fonts.Length; i++ ) {
				EditorGUILayout.BeginHorizontal();
			
				EditorGUILayout.LabelField ( i.ToString(), GUILayout.Width ( 30 ) );
			
				tempObj = skin.fonts[i] as Object;
				tempObj = EditorGUILayout.ObjectField ( tempObj, Font, false );
				skin.fonts[i] = tempObj as Font;
			
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "x", GUILayout.Width ( 30 ), GUILayout.Height ( 14 ) ) ) {
					tmpList = new List.< Font > ( skin.fonts );
					
					tmpList.RemoveAt ( i );
					
					skin.fonts = tmpList.ToArray ();
				}
				GUI.backgroundColor = Color.white;
			
				EditorGUILayout.EndHorizontal();
			}
			
			EditorGUILayout.BeginHorizontal();
			
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "+", GUILayout.Width ( 30 ), GUILayout.Height ( 14 ) ) ) {
				tmpList = new List.< Font > ( skin.fonts );
				
				tmpList.Add ( null );
				
				skin.fonts = tmpList.ToArray ();
			}
			GUI.backgroundColor = Color.white;
			
			EditorGUILayout.EndHorizontal();
		
			EditorGUILayout.Space();
			
			// Font shader
			EditorGUILayout.LabelField ( "Font shader", EditorStyles.boldLabel );
			tempObj = skin.fontShader as Object;
			tempObj = EditorGUILayout.ObjectField ( tempObj, Shader, false );
			skin.fontShader = tempObj as Shader;

			EditorGUILayout.Space();
		
			// Atlas
			EditorGUILayout.LabelField ( "Atlas", EditorStyles.boldLabel );
			tempObj = skin.atlas as Object;
			tempObj = EditorGUILayout.ObjectField ( tempObj, Material, false );
			skin.atlas = tempObj as Material;
		
			EditorGUILayout.Space();
		
			// Delete mode
			if ( deleteMode ) {
				EditorGUILayout.LabelField ( "Delete style", EditorStyles.boldLabel );
								
				EditorGUILayout.BeginHorizontal ();
				
				// Select
				selectedStyle = EditorGUILayout.Popup ( selectedStyle, GetStyles( true ) );
				
				// Cancel
				if ( GUILayout.Button ( "Cancel" ) ) {
					deleteMode = false;
				}
				
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "Delete" ) ) {
					deleteMode = false;
					RemoveStyle ( selectedStyle - 1 );
				}
				GUI.backgroundColor = Color.white;
				
				EditorGUILayout.EndHorizontal ();
			
			// Add mode
			} else if ( addMode ) {
				EditorGUILayout.LabelField ( "Add style", EditorStyles.boldLabel );
								
				EditorGUILayout.BeginHorizontal ();
				
				// Select
				addStyleName = EditorGUILayout.TextField ( addStyleName );
				
				// Cancel
				if ( GUILayout.Button ( "Cancel" ) ) {
					addMode = false;
				}
				
				GUI.backgroundColor = Color.green;
				if ( GUILayout.Button ( "Create" ) ) {
					addMode = false;
					AddStyle ( addStyleName );
				}
				GUI.backgroundColor = Color.white;
				
				EditorGUILayout.EndHorizontal ();
			
			// Else
			} else {
				EditorGUILayout.LabelField ( "Operations", EditorStyles.boldLabel );
								
				EditorGUILayout.BeginHorizontal ();
				
				// Add Style
				GUI.backgroundColor = Color.green;
				if ( GUILayout.Button ( "Add style" ) ) {
					addStyleName = "";
					addMode = true;
				}
				
				// Delete style
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "Delete style" ) ) {
					selectedStyle = 0;
					deleteMode = true;
				}
				
				EditorGUILayout.EndHorizontal ();
			
				// Set defaults
				GUI.backgroundColor = Color.white;
				if ( GUILayout.Button ( "Manage defaults", GUILayout.Height ( 30 ) ) ) {
					setDefaultsMode = true;
				}
				
			}
			
			EditorGUILayout.Space();
			
			
		}
	}
}
