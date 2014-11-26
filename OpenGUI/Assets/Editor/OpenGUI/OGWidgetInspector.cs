using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;

[CustomEditor (typeof(OGWidget), true)]
[System.Serializable]
public class OGWidgetInspector : Editor {
	private string[] GetStyles ( OGWidget widget ) {
		List< string > tempList = new List< string >();
		
		if ( widget && widget.root ) {
			foreach ( OGStyle style in widget.root.skin.styles ) {
				tempList.Add ( style.name );
			}
		}
		
		return tempList.ToArray();
	}
	
	private int GetStyleIndex ( OGWidget widget, OGStyle style ) {
		if ( widget.root && widget.root.skin ) {
			for ( int i = 0; i < widget.root.skin.styles.Length; i++ ) {
				if ( widget.root.skin.styles[i].name == style.name ) {
					return i;
				}
			}
		}
	
		return 0;
	}
	
	override public void OnInspectorGUI () {		
		OGWidget widget = (OGWidget) target;
				
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
			if ( target.GetType() != typeof(OGLineNode) && target.GetType() != typeof(OGTexture) && target.GetType() != typeof(OGCameraWindow) ) {
				EditorGUILayout.Space();
		
				EditorGUILayout.LabelField ( "Style", EditorStyles.boldLabel );

				foreach ( OGStyleType styleType in System.Enum.GetValues ( typeof(OGStyleType) ) as OGStyleType[] ) {
					if ( OGSkin.IsStyleUsed ( styleType, widget.ToEnum() ) ) {
						// Styles
						OGStyle wdStyle = widget.styles.GetStyle ( styleType ); 
						int wdStyleIndex = GetStyleIndex ( widget, wdStyle );		
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
