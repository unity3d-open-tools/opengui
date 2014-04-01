#pragma strict

@CustomEditor ( OGFont )
@InitializeOnLoad
public class OGFontInspector extends Editor {
	override function OnInspectorGUI () {
		var font : OGFont = target as OGFont;
	
		if ( !font ) { return; }
		
		font.bitmapFont = EditorGUILayout.ObjectField ( "Unicide font", font.bitmapFont, Font, false ) as Font;
		font.dynamicFont = EditorGUILayout.ObjectField ( "Dynamic font", font.dynamicFont, Font, false ) as Font;
		
		EditorGUILayout.Space ();

		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "Update", GUILayout.Height ( 30 ) ) ) {
			font.UpdateData ();
		}
		GUI.backgroundColor = Color.white;

	}
}
