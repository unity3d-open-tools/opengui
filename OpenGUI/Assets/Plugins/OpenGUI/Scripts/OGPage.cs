using UnityEngine;
using System.Collections;

public class OGPage : MonoBehaviour {
	public string pageName = "New Page";

	public void StartPage () {}
	public void UpdatePage () {}
	public void ExitPage () {}
	public void DrawPage () {}

	public void UpdateStyles () {
		foreach ( OGWidget w in this.transform.GetComponentsInChildren<OGWidget>(true) ) {
			if ( w.root == null ) {
				w.root = OGRoot.GetInstance();
			}

			if ( w.styles == null ) {
				w.ApplyDefaultStyles ();
			}
			
			w.styles.Refresh ( w.root.skin );
		}
	}

	public void ResetStyles () {
		foreach ( OGWidget w in this.transform.GetComponentsInChildren<OGWidget>(true) ) {
			w.ApplyDefaultStyles ();
		}	
	}

}
