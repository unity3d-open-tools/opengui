using UnityEngine;
using UnityEditor;
using System.Collections;

[CustomEditor (typeof(OGFont))]
[InitializeOnLoad]
public class OGFontInspector : Editor {
	private void SavePrefab () {
		GameObject selectedGameObject;
		PrefabType selectedPrefabType;
		GameObject parentGameObject;
		UnityEngine.Object prefabParent;
		     
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
	
	override public void OnInspectorGUI () {
		OGFont font = (OGFont) target;
	
		if ( !font ) { return; }
		
		font.dynamicFont = (Font) EditorGUILayout.ObjectField ( "Dynamic font", font.dynamicFont, typeof(Font), false );
		font.bitmapFont = (Font) EditorGUILayout.ObjectField ( "Unicode font", font.bitmapFont, typeof(Font), false );
		font.size = EditorGUILayout.IntField ( "Font size", font.size );

		EditorGUILayout.Space ();

		/* DEBUG: Display available properties
		SerializedObject s = new SerializedObject ( font.bitmapFont );
		SerializedProperty p = s.GetIterator();

		for ( int i = 0; i < 40; i++ ) {
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
