#pragma strict

import System.Collections.Generic;

@CustomEditor ( OGWidget, true )
public class OGWidgetInspector extends Editor {
	public static var debug : boolean = false;
	
	private function GetStyles ( widget : OGWidget ) : String[] {
		var tempList : List.< String > = new List.< String >();
		
		if ( widget && widget.GetRoot() ) {
			for ( var style : OGStyle in widget.GetRoot().skin.styles ) {
				tempList.Add ( style.name );
			}
		}
		
		return tempList.ToArray();
	}
	
	private function GetStyleIndex ( widget : OGWidget, style : OGStyle ) : int {
		if ( widget.GetRoot() && widget.GetRoot().skin ) {
			for ( var i : int = 0; i < widget.GetRoot().skin.styles.Length; i++ ) {
				if ( widget.GetRoot().skin.styles[i].name == style.name ) {
					return i;
				}
			}
		}
	
		return 0;
	}
	
	override function OnInspectorGUI () {		
		var widget : OGWidget = target as OGWidget;
				
		if ( !widget || !widget.GetRoot() ) { return; }
		
		// Check for hidden widgets
		if ( widget.hidden && !debug ) {
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "Turn on debug mode" ) ) {
				debug = true;
			}
			GUI.backgroundColor = Color.white;
			
			EditorGUILayout.Space ();

			EditorGUILayout.LabelField ( "This widget is not supposed to be changed manually," );
			EditorGUILayout.LabelField ( "please refer to the root widget." );

		} else {
			if ( widget.hidden ) {
				GUI.backgroundColor = Color.green;
				if ( GUILayout.Button ( "Turn off debug mode" ) ) {
					debug = false;
				}
				GUI.backgroundColor = Color.white;

				EditorGUILayout.Space();
			}
		
			// Default inspector
			DrawDefaultInspector ();
			
			EditorGUILayout.Space();
	
			EditorGUILayout.LabelField ( "Style", EditorStyles.boldLabel );

			var names : String [] = OGWidgetStyles.GetNames ();

			for ( var k : int = 0; k < names.Length; k++ ) {
				if ( OGWidgetStyles.IsStyleUsed ( names[k], widget.GetType().ToString() ) ) {
					// Styles
					var wdStyle : OGStyle = widget.styles.GetStyle ( names[k] ); 
					var wdStyleIndex : int = GetStyleIndex ( widget, wdStyle );		
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField ( names[k] );
					wdStyleIndex = EditorGUILayout.Popup ( wdStyleIndex, GetStyles ( widget ) );
					EditorGUILayout.EndHorizontal ();
					widget.styles.SetStyle ( names[k], widget.GetRoot().skin.styles [ wdStyleIndex ] );
				}	
			}


			EditorGUILayout.Space();
			
			// Reset style	
			if ( GUILayout.Button ( "Reset style" ) ) {
				( target as OGWidget ).GetDefaultStyles();
			}
			
			GUI.backgroundColor = Color.blue;
			if ( GUILayout.Button ( "Clean up mess (sorry!)" ) ) {
				( target as OGWidget ).ClearChildren();
			}
			
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "Update", GUILayout.Height(30) ) ) {
				( target as OGWidget ).Build();
			}
			GUI.backgroundColor = Color.white;
			
			// Automatic update	
			if ( GUI.changed ) {
				( target as OGWidget ).SetDirty();
			}
		}
	}
}
