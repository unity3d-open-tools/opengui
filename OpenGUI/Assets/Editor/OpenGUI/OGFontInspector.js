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

	}
}
