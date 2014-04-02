#pragma strict

@CustomEditor ( OGRoot )
@InitializeOnLoad
public class OGRootInspector extends Editor {
	private static function OGRootInspector () {
		OGRoot.EditorSelectWidget = function ( w : OGWidget ) {
			Selection.activeObject = w.gameObject;
		};
	}
	
	override function OnInspectorGUI () {
		var root : OGRoot = target as OGRoot;
	
		if ( OGRoot.EditorSelectWidget == null ) {
			OGRoot.EditorSelectWidget = function ( w : OGWidget ) {
				Selection.activeObject = w.gameObject;
			};
		}
		
		if ( !root ) { return; }
		
		DrawDefaultInspector ();

		EditorGUILayout.Space ();

		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "Update", GUILayout.Height ( 30 ) ) ) {
			root.SetDirty ();
		}
		GUI.backgroundColor = Color.white;

	}
}
