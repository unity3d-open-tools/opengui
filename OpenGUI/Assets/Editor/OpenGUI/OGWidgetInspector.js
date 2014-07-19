#pragma strict

import System.Collections.Generic;

@CustomEditor ( OGWidget, true )
public class OGWidgetInspector extends Editor {
	private function GetStyles ( widget : OGWidget ) : String[] {
		var tempList : List.< String > = new List.< String >();
		
		if ( widget && widget.root ) {
			for ( var style : OGStyle in widget.root.skin.styles ) {
				tempList.Add ( style.name );
			}
		}
		
		return tempList.ToArray();
	}
	
	private function GetStyleIndex ( widget : OGWidget, style : OGStyle ) : int {
		if ( widget.root && widget.root.skin ) {
			for ( var i : int = 0; i < widget.root.skin.styles.Length; i++ ) {
				if ( widget.root.skin.styles[i].name == style.name ) {
					return i;
				}
			}
		}
	
		return 0;
	}
	
	override function OnInspectorGUI () {		
		var widget : OGWidget = target as OGWidget;
				
		if ( !widget || !widget.root ) { return; }
	
		// Check for hidden widgets
		if ( widget.hidden ) {
			EditorGUILayout.LabelField ( "This widget is rubbish that somehow didn't get deleted." );
			
			// Kill!
			if ( GUILayout.Button ( "Fix" ) ) {
				DestroyImmediate ( target as GameObject );
			}

		} else {
			// Default inspector
			DrawDefaultInspector ();
			
			// OGCameraWindow, OGLineNode and OGTexture don't need styles
			if ( target.GetType != OGLineNode && target.GetType() != OGTexture && target.GetType() != OGCameraWindow ) {
				EditorGUILayout.Space();
		
				EditorGUILayout.LabelField ( "Style", EditorStyles.boldLabel );

				for ( var styleType : OGStyleType in System.Enum.GetValues ( OGStyleType ) as OGStyleType[] ) {
					if ( OGSkin.IsStyleUsed ( styleType, widget.ToEnum() ) ) {
						// Styles
						var wdStyle : OGStyle = widget.styles.GetStyle ( styleType ); 
						var wdStyleIndex : int = GetStyleIndex ( widget, wdStyle );		
						EditorGUILayout.BeginHorizontal();
						
						EditorGUILayout.LabelField ( styleType.ToString() );
						
						wdStyleIndex = EditorGUILayout.Popup ( wdStyleIndex, GetStyles ( widget ) );
						widget.styles.SetStyle ( styleType, widget.root.skin.styles [ wdStyleIndex ] );
					
						// ^ Edit
						if ( GUILayout.Button ( "Edit", GUILayout.Width ( 40 ) ) ) {
							Selection.activeObject = widget.root.skin;
							OGSkinInspector.SetCurrentStyle ( wdStyleIndex );
						}
						
						EditorGUILayout.EndHorizontal ();
					}	
				}

				EditorGUILayout.Space();
				
				EditorGUILayout.BeginHorizontal();

				// Get defaults	
				if ( GUILayout.Button ( "Apply default styles" ) ) {
					( target as OGWidget ).ApplyDefaultStyles();
				}
				
				// ^ Edit
				if ( GUILayout.Button ( "Edit", GUILayout.Width ( 40 ) ) ) {
					Selection.activeObject = widget.root.skin;
					OGSkinInspector.SetDefaultsMode();
				}
				
				EditorGUILayout.EndHorizontal ();
			}

		}
	}
}
