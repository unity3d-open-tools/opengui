#pragma strict

@CustomEditor ( OGRoot )
@InitializeOnLoad
public class OGRootInspector extends Editor {
	private static function OGRootInspector () {
		OGRoot.EditorSelectWidget = function ( w : OGWidget, additive : boolean ) {
			if ( !w ) {
				Selection.activeObject = null;

			} else if ( additive ) {
				var list : List.< UnityEngine.Object > = new List.< UnityEngine.Object > ( Selection.objects );
				var remove : boolean = false;

				for ( var i : int = 0; i < list.Count; i++ ) {
					if ( list[i] as GameObject == w.gameObject ) {
						remove = true;
						break;
					}
				}
				
				if ( remove ) {
					list.Remove ( w.gameObject );
				} else {
					list.Add ( w.gameObject );
				}

				Selection.objects = list.ToArray ();
			
			} else {
				Selection.activeObject = w.gameObject;
			
			}
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
