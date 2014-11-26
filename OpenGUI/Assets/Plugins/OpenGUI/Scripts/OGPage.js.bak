#pragma strict

public class OGPage extends MonoBehaviour {
	public var pageName : String = "New Page";

	public function StartPage () {}
	public function UpdatePage () {}
	public function ExitPage () {}
	public function DrawPage () {}

	public function UpdateStyles () {
		for ( var w : OGWidget in this.transform.GetComponentsInChildren.<OGWidget>(true) ) {
			if ( !w.root ) {
				w.root = OGRoot.GetInstance();
			}

			if ( !w.styles ) {
				w.ApplyDefaultStyles ();
			}
			
			w.styles.Refresh ( w.root.skin );
		}
	}

	public function ResetStyles () {
		for ( var w : OGWidget in this.transform.GetComponentsInChildren.<OGWidget>(true) ) {
			w.ApplyDefaultStyles ();
		}	
	}

}
