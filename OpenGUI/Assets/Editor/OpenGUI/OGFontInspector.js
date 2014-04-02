#pragma strict

@CustomEditor ( OGFont )
@InitializeOnLoad
public class OGFontInspector extends Editor {
	private function SavePrefab () {
		var selectedGameObject : GameObject;
		var selectedPrefabType : PrefabType;
		var parentGameObject : GameObject;
		var prefabParent : UnityEngine.Object;
		     
	    	// Get currently selected object in "Hierarchy" view and store
	    	// its type, parent, and the parent's prefab origin
		selectedGameObject = Selection.gameObjects[0];
		selectedPrefabType = PrefabUtility.GetPrefabType(selectedGameObject);
		parentGameObject = selectedGameObject.transform.root.gameObject;
		prefabParent = PrefabUtility.GetPrefabParent(selectedGameObject);
		     
		// Notify the script this is modifying that something changed
		EditorUtility.SetDirty(target);
		     
		// If the selected object is an instance of a prefab
		if (selectedPrefabType == PrefabType.PrefabInstance) {
			// Replace parent's prefab origin with new parent as a prefab
			PrefabUtility.ReplacePrefab(parentGameObject, prefabParent,
			ReplacePrefabOptions.ConnectToPrefab);
	    	}
	}
	
	override function OnInspectorGUI () {
		var font : OGFont = target as OGFont;
	
		if ( !font ) { return; }
		
		font.dynamicFont = EditorGUILayout.ObjectField ( "Dynamic font", font.dynamicFont, Font, false ) as Font;
		font.bitmapFont = EditorGUILayout.ObjectField ( "Unicode font", font.bitmapFont, Font, false ) as Font;
		
		EditorGUILayout.Space ();

		/* DEBUG: Display available properties
		var s : SerializedObject = new SerializedObject ( font.bitmapFont );
		var p : SerializedProperty = s.GetIterator();

		for ( var i : int = 0; i < 40; i++ ) {
			p.Next(true);
			GUILayout.Label ( p.name + ", " + p.type );
		}
		p.Reset();*/
		

		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "Update", GUILayout.Height ( 30 ) ) ) {
			font.UpdateData ();
		}
		GUI.backgroundColor = Color.white;

		if ( GUI.changed ) {
			SavePrefab ();
		}
	}
}
