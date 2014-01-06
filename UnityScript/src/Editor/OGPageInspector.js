
#pragma strict

@CustomEditor ( OGPage, true )
public class OGPageInspector extends Editor {
	override function OnInspectorGUI () {
		var page : OGPage = target as OGPage;

		if ( !page ) { return; }
		
		DrawDefaultInspector ();
	
		EditorGUILayout.Space ();

		if ( GUILayout.Button ( "Reset styles" ) ) {
			page.ResetStyles (); 
		}
		
		if ( GUILayout.Button ( "Clear clipping" ) ) {
			page.ClearClipping (); 
		}
				
		GUI.backgroundColor = Color.green;
		if ( OGRoot.GetInstance().currentPage == page ) {
			if ( GUILayout.Button ( "Update", GUILayout.Height(30) ) ) {
				OGRoot.GetInstance().SetDirty();
			}

		} else {
			if ( GUILayout.Button ( "Set current page", GUILayout.Height(30) ) ) {
				OGRoot.GetInstance().SetCurrentPage ( page );
				page.gameObject.SetActive ( true );	
				OGRoot.GetInstance().SetDirty();
			}
		}	
		GUI.backgroundColor = Color.white;

	}	
}
