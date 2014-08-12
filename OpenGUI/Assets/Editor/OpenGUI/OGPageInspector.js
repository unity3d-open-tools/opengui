
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
		

		for ( var p : OGPage in root.currentPages ) {
			if ( p == page ) {
				GUILayout.BeginHorizontal ();
			       	
				if ( GUILayout.Button ( "Update", GUILayout.Height(30) ) ) {
					page.UpdateStyles (); 
					GUI.backgroundColor = Color.white;
				}
				
				if ( GUILayout.Button ( "-", GUILayout.Height ( 30 ), GUILayout.Width ( 40 ) ) ) {
					OGRoot.GetInstance().RemoveFromCurrentPages ( page );
					page.gameObject.SetActive ( false );	
				}
				
				GUILayout.EndHorizontal ();
				
				return;
			}
		}
	      
		GUILayout.BeginHorizontal ();

		if ( GUILayout.Button ( "Set current page", GUILayout.Height ( 30 ) ) ) {
			OGRoot.GetInstance().SetCurrentPage ( page );
			page.gameObject.SetActive ( true );	
		}
		
		if ( GUILayout.Button ( "+", GUILayout.Height ( 30 ), GUILayout.Width ( 40 ) ) ) {
			OGRoot.GetInstance().AddToCurrentPages ( page );
			page.gameObject.SetActive ( true );	
		}

		GUILayout.EndHorizontal ();

		GUI.backgroundColor = Color.white;
	}	
}
