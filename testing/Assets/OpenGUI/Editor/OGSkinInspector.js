#pragma strict

import System.Collections.Generic;
import System.Linq;

@CustomEditor ( OGSkin )
public class OGSkinInspector extends Editor {
	private var deleteMode : boolean = false;
	private var selectedStyle : int = -1;
	
	private function GetStyles () : String[] {
		var skin : OGSkin = target as OGSkin;
		var tempList : List.< String > = new List.< String >();
		
		tempList.Add ( "<Cancel>" );
		
		for ( var style : OGStyle in skin.styles ) {
			tempList.Add ( style.name );
		}
		
		return tempList.ToArray();
	}
	
	private function AddStyle () {
		var skin : OGSkin = target as OGSkin;
		var tempList : List.< OGStyle > = new List.< OGStyle > ( skin.styles );
		
		tempList.Add ( new OGStyle () );
		
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
	
	override function OnInspectorGUI () {		
		var skin : OGSkin = target as OGSkin;
		
		DrawDefaultInspector ();
		
		if ( !skin ) { return; }
		
		EditorGUILayout.Space();
		
		EditorGUILayout.BeginHorizontal ();
		
		// Add Style
		if ( GUILayout.Button ( "Add style" ) ) {
			AddStyle ();
		}
		
		// Delete style
		if ( deleteMode ) {
			selectedStyle = EditorGUILayout.Popup ( selectedStyle, GetStyles() );
			
			if ( selectedStyle == 0 ) {
				deleteMode = false;
			
			} else if ( selectedStyle > 1 ) {
				deleteMode = false;
				RemoveStyle ( selectedStyle - 1 );
				
			}
			
		} else {
			if ( GUILayout.Button ( "Delete style" ) ) {
				selectedStyle = -1;
				deleteMode = true;
			}
		}
		
		EditorGUILayout.EndHorizontal ();
		
		// Manual sort
		if ( GUILayout.Button ( "Sort" ) ) {
			var tempList : List.< OGStyle > = new List.< OGStyle > ( skin.styles );
			
			tempList.Sort ( CompareNames );
			
			skin.styles = tempList.ToArray ();
		}
	}
}