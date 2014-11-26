using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEditor;

[CustomEditor (typeof(OGRoot))]
[InitializeOnLoad]
public class OGRootInspector : Editor {
	static OGRootInspector () {
		OGRoot.EditorSelectWidget = (w, additive) => {
			if ( !w ) {
				Selection.activeObject = null;

			} else if ( additive ) {
				List< UnityEngine.Object > list = new List< UnityEngine.Object > ( Selection.objects );
				bool remove = false;

				for ( int i = 0; i < list.Count; i++ ) {
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
	
	public static void SelectActiveObject ( OGWidget w, bool b = false )
	{
		Selection.activeObject = w.gameObject;
	}

	override public void OnInspectorGUI () {
		OGRoot root = (OGRoot) target;
	
		if ( OGRoot.EditorSelectWidget == null ) {
			OGRoot.EditorSelectWidget = SelectActiveObject;
		}
		
		if ( !root ) { return; }
		
		DrawDefaultInspector ();
	}
}
