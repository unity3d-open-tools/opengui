#pragma strict

@CustomEditor ( OGRoot )
public class OGRootInspector extends Editor {
	override function OnInspectorGUI () {
		var root : OGRoot = target as OGRoot;

		if ( !root ) { return; }
		
		DrawDefaultInspector ();

		EditorGUILayout.Space ();

		if ( GUILayout.Button ( "Reload fonts" ) ) {
			root.ReloadFonts (); 
		}
	}
}
