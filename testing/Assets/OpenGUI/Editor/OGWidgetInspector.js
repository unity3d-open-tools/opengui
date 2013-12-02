#pragma strict

import System.Collections.Generic;

@CustomEditor ( OGWidget, true )
public class OGWidgetInspector extends Editor {
	private var debug : boolean = true;
	
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
			EditorGUILayout.LabelField ( "This widget is not supposed to be changed manually," );
			EditorGUILayout.LabelField ( "please refer to the root widget." );

			if ( GUILayout.Button ( "Turn on debug mode" ) ) {
				debug = true;
			}
			
		} else {
			if ( widget.hidden ) {
				EditorGUILayout.BeginHorizontal();
				GUI.color = Color.red;
				EditorGUILayout.LabelField ( "[HIDDEN]", EditorStyles.boldLabel, GUILayout.Width ( 100 ) );
				GUI.color = Color.white;
				if ( GUILayout.Button ( "Turn off debug mode" ) ) {
					debug = false;
				}
				EditorGUILayout.EndHorizontal();

				EditorGUILayout.Space();
			}
			
			DrawDefaultInspector ();
			
			EditorGUILayout.Space();
			
			var wdStyleIndex : int = GetStyleIndex ( widget, widget.style );		
			EditorGUILayout.BeginHorizontal();
			EditorGUILayout.LabelField ( "Style" );
			wdStyleIndex = EditorGUILayout.Popup ( wdStyleIndex, GetStyles ( widget ) );
			EditorGUILayout.EndHorizontal ();
			widget.style = widget.GetRoot().skin.styles [ wdStyleIndex ];
		
			// OGButton
			if ( widget.GetComponent(OGButton) ) {			
				// Down
				var selectedDownIndex : int = GetStyleIndex ( widget, ( widget as OGButton ).downStyle );
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "'Down' style" );
				selectedDownIndex = EditorGUILayout.Popup ( selectedDownIndex, GetStyles ( widget ) );
				EditorGUILayout.EndHorizontal ();
				( widget as OGButton ).downStyle = widget.GetRoot().skin.styles [ selectedDownIndex ];
				
				// Hover
				var selectedHoverIndex : int = GetStyleIndex ( widget, ( widget as OGButton ).hoverStyle );
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "'Hover' style" );
				selectedHoverIndex = EditorGUILayout.Popup ( selectedHoverIndex, GetStyles ( widget ) );
				EditorGUILayout.EndHorizontal ();
				( widget as OGButton ).hoverStyle = widget.GetRoot().skin.styles [ selectedHoverIndex ];
			
			// OGPopUp
			} else if ( widget.GetComponent(OGPopUp) ) {			
				// Up
				var puUpIndex : int = GetStyleIndex ( widget, ( widget as OGPopUp ).upStyle );
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "'Up' style" );
				puUpIndex = EditorGUILayout.Popup ( puUpIndex, GetStyles ( widget ) );
				EditorGUILayout.EndHorizontal ();
				( widget as OGPopUp ).upStyle = widget.GetRoot().skin.styles [ puUpIndex ];
				
				// Hover
				var puHoverIndex : int = GetStyleIndex ( widget, ( widget as OGPopUp ).hoverStyle );
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "'Hover' style" );
				puHoverIndex = EditorGUILayout.Popup ( puHoverIndex, GetStyles ( widget ) );
				EditorGUILayout.EndHorizontal ();
				( widget as OGPopUp ).hoverStyle = widget.GetRoot().skin.styles [ puHoverIndex ];
			
			// OGDropDown
			} else if ( widget.GetComponent(OGDropDown) ) {			
				// Down
				var ddDownIndex : int = GetStyleIndex ( widget, ( widget as OGDropDown ).downStyle );
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "'Down' style" );
				ddDownIndex = EditorGUILayout.Popup ( ddDownIndex, GetStyles ( widget ) );
				EditorGUILayout.EndHorizontal ();
				( widget as OGDropDown ).downStyle = widget.GetRoot().skin.styles [ ddDownIndex ];
				
				// Hover
				var ddHoverIndex : int = GetStyleIndex ( widget, ( widget as OGDropDown ).hoverStyle );
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "'Hover' style" );
				ddHoverIndex = EditorGUILayout.Popup ( ddHoverIndex, GetStyles ( widget ) );
				EditorGUILayout.EndHorizontal ();
				( widget as OGDropDown ).hoverStyle = widget.GetRoot().skin.styles [ ddHoverIndex ];

				// Ticked
				var ddTickedIndex : int = GetStyleIndex ( widget, ( widget as OGDropDown ).tickedStyle );
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "'Ticked' style" );
				ddTickedIndex = EditorGUILayout.Popup ( ddTickedIndex, GetStyles ( widget ) );
				EditorGUILayout.EndHorizontal ();
				( widget as OGDropDown ).tickedStyle = widget.GetRoot().skin.styles [ ddTickedIndex ];

			// OGTickBox
			} else if ( widget.GetComponent(OGTickBox) ) {			
				// Ticked
				var tbTickedIndex : int = GetStyleIndex ( widget, ( widget as OGTickBox ).tickedStyle );
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "'Ticked' style" );
				tbTickedIndex = EditorGUILayout.Popup ( tbTickedIndex, GetStyles ( widget ) );
				EditorGUILayout.EndHorizontal ();
				( widget as OGTickBox ).tickedStyle = widget.GetRoot().skin.styles [ tbTickedIndex ];
				
				// Hover
				var tbHoverIndex : int = GetStyleIndex ( widget, ( widget as OGTickBox ).hoverStyle );
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "'Hover' style" );
				tbHoverIndex = EditorGUILayout.Popup ( tbHoverIndex, GetStyles ( widget ) );
				EditorGUILayout.EndHorizontal ();
				( widget as OGTickBox ).hoverStyle = widget.GetRoot().skin.styles [ tbHoverIndex ];
			
			// OGSlider
			} else if ( widget.GetComponent(OGSlider) ) {			
				// Thumb
				var slThumbIndex : int = GetStyleIndex ( widget, ( widget as OGSlider ).thumbStyle );
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "'Thumb' style" );
				slThumbIndex = EditorGUILayout.Popup ( slThumbIndex, GetStyles ( widget ) );
				EditorGUILayout.EndHorizontal ();
				( widget as OGSlider ).thumbStyle = widget.GetRoot().skin.styles [ slThumbIndex ];
			
			// OGTabs
			} else if ( widget.GetComponent(OGTabs) ) {			
				// Down
				var taDownIndex : int = GetStyleIndex ( widget, ( widget as OGTabs ).downStyle );
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "'Down' style" );
				taDownIndex = EditorGUILayout.Popup ( taDownIndex, GetStyles ( widget ) );
				EditorGUILayout.EndHorizontal ();
				( widget as OGTabs ).downStyle = widget.GetRoot().skin.styles [ taDownIndex ];
			}
			
			EditorGUILayout.Space();
			
			// Manual update
			if ( GUILayout.Button ( "Update" ) ) {
				( target as OGWidget ).UpdateWidget();
				EditorUtility.SetDirty ( target );
			}
			
			if ( GUI.changed ) {
				EditorUtility.SetDirty ( target );
			}
		}
	}
}
