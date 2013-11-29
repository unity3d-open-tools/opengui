#pragma strict

import System.Collections.Generic;
import System.Linq;

@CustomEditor ( OGSkin )
public class OGSkinInspector extends Editor {
	private var deleteMode : boolean = false;
	private var addMode : boolean = false;
	private var selectedStyle : int = 0;
	private var addStyleName : String = "";
	private var previewStyle : int = 0;
	private var scrollPos : Vector2;
	
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
		var width : float = skin.styles[previewStyle].coordinates.width * 2;
		var height : float = skin.styles[previewStyle].coordinates.height * 2;
		
		// Left
		lines[0] = new Vector3 ( controlRect.x + skin.styles[previewStyle].border.left * width / skin.styles[previewStyle].coordinates.width, controlRect.y, 0 );
		lines[1] = lines[0] + new Vector3 ( 0, controlRect.height, 0 );
		
		// Right
		lines[2] = new Vector3 ( controlRect.x + width - skin.styles[previewStyle].border.right * width / skin.styles[previewStyle].coordinates.width, controlRect.y, 0 );
		lines[3] = lines[2] + new Vector3 ( 0, controlRect.height, 0 );
		
		// Top
		lines[4] = new Vector3 ( controlRect.x, controlRect.y + skin.styles[previewStyle].border.top * height / skin.styles[previewStyle].coordinates.height, 0 );
		lines[5] = lines[4] + new Vector3 ( controlRect.width, 0, 0 );
		
		// Bottom
		lines[6] = new Vector3 ( controlRect.x, controlRect.y + height - skin.styles[previewStyle].border.bottom * height / skin.styles[previewStyle].coordinates.height, 0 );
		lines[7] = lines[6] + new Vector3 ( controlRect.width, 0, 0 );
		
		return lines;
	}
	
	private function SortStyles ( skin : OGSkin ) {
		var tempList : List.< OGStyle > = new List.< OGStyle > ( skin.styles );
				
		tempList.Sort ( CompareNames );
		
		skin.styles = tempList.ToArray ();
	}
	
	override function OnInspectorGUI () {		
		var skin : OGSkin = target as OGSkin;
		var tempObj : Object;
				
		if ( !skin ) { return; }
		
		
		// Styles
		EditorGUILayout.LabelField ( "Styles", EditorStyles.boldLabel );
				
		scrollPos = EditorGUILayout.BeginScrollView ( scrollPos, GUILayout.Height ( 300 ) );
		
		EditorGUILayout.BeginHorizontal();
		
		GUILayout.Space ( -5 );
		
		EditorGUILayout.BeginVertical();
		
		GUILayout.Space ( -54 );
		
		DrawDefaultInspector ();
		
		EditorGUILayout.EndVertical();
		
		EditorGUILayout.EndHorizontal();
		
		EditorGUILayout.Space();
		
		EditorGUILayout.EndScrollView ();
																		
		EditorGUILayout.Space();
	
		// ^ Make sure the font indices are not out of bounds
		for ( var s : OGStyle in skin.styles ) {
			if ( s.text.fontIndex >= skin.fonts.Length ) {
				s.text.fontIndex = skin.fonts.Length - 1;
			
			} else if ( s.text.fontIndex < 0 ) {
				s.text.fontIndex = 0;
			
			}
		}
	
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
		if ( GUILayout.Button ( "+", GUILayout.Width ( 20 ), GUILayout.Height ( 14 ) ) ) {
			tmpList = new List.< Font > ( skin.fonts );
			
			tmpList.Add ( null );
			
			skin.fonts = tmpList.ToArray ();
		}
		GUI.backgroundColor = Color.white;
		
		GUILayout.Space( 10 );
		
		GUI.color = new Color ( 0.7, 0.7, 0.7, 1.0 );
		EditorGUILayout.LabelField ( "You can set widget fonts by their index value" );
		GUI.color = Color.white;
	
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
		
			// Manual sort
			GUI.backgroundColor = Color.gray;
			if ( GUILayout.Button ( "Sort styles" ) ) {
				SortStyles ( skin );
			}
			
			GUI.backgroundColor = Color.white;
		}
		
		EditorGUILayout.Space();
		
		if ( skin.atlas == null || skin.styles.Length < 1 || skin.styles[previewStyle] == null || skin.styles[previewStyle].text == null) { return; }
		
		// Preview
		var newCoords : Rect = new Rect (
			skin.styles[previewStyle].coordinates.x / skin.atlas.mainTexture.width,
			skin.styles[previewStyle].coordinates.y / skin.atlas.mainTexture.height,
			skin.styles[previewStyle].coordinates.width / skin.atlas.mainTexture.width,
			skin.styles[previewStyle].coordinates.height / skin.atlas.mainTexture.height
		);
		
		EditorGUILayout.BeginHorizontal ();
		
		EditorGUILayout.LabelField ( "Preview", EditorStyles.boldLabel );
		previewStyle = EditorGUILayout.Popup ( previewStyle, GetStyles ( false ), GUILayout.Width ( 100 ) );
		
		EditorGUILayout.EndHorizontal ();
		
		GUI.color = skin.styles[previewStyle].text.fontColor;
		EditorGUILayout.LabelField ( "Text color" );
		GUI.color = Color.white;
		
		EditorGUILayout.BeginHorizontal ();
		
		EditorGUILayout.Space();
		
		var controlRect : Rect = EditorGUILayout.GetControlRect ( false, skin.styles[previewStyle].coordinates.height * 2, GUILayout.Width(skin.styles[previewStyle].coordinates.width * 2));
		var borderLines : Vector3[] = CalcBorderLines ( controlRect, skin );
		var previewTex : Texture = skin.atlas.mainTexture;
		
		GUI.DrawTextureWithTexCoords ( controlRect, previewTex, newCoords, true );
				
		Handles.DrawLine ( borderLines[0], borderLines[1] );
		Handles.DrawLine ( borderLines[2], borderLines[3] );
		Handles.DrawLine ( borderLines[4], borderLines[5] );
		Handles.DrawLine ( borderLines[6], borderLines[7] );
		
		EditorGUILayout.Space();
		
		EditorGUILayout.EndHorizontal ();
		
		EditorGUILayout.Space();
	}
}
