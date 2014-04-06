
#pragma strict

@CustomEditor ( OGPage, true )
public class OGPageInspector extends Editor {
	override function OnInspectorGUI () {
		serializedObject.Update ();
		
		var page : OGPage = target as OGPage;
		var root : OGRoot =  OGRoot.GetInstance();

		if ( !page || !root ) { return; }
		
		DrawDefaultInspector ();
	
		EditorGUILayout.Space ();

		GUI.backgroundColor = Color.red;

		if ( GUILayout.Button ( "Reset styles" ) ) {
			page.ResetStyles (); 
		}
		
		GUI.backgroundColor = Color.green;
		

		if ( root.currentPage == page ) {
			if ( GUILayout.Button ( "Update", GUILayout.Height(30) ) ) {
				OGRoot.GetInstance().SetDirty();
				page.UpdateStyles (); 
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
