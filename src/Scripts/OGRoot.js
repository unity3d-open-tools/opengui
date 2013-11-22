#pragma strict

@script AddComponentMenu ("OpenGUI/Root")

class OGRoot extends MonoBehaviour {
	var _currentPage : OGPage;
	var _skin : GUISkin;
					
	static var currentPage : OGPage;
	static var mouseOver : boolean = false;
	static var thisTransform : Transform;
	static var skin : GUISkin;
					
	static function GoToPage ( name : String ) {				
		if ( currentPage ) {
			if ( name == currentPage.pageName ) {
				return;
			}
			
			currentPage.ExitPage ();
			
			currentPage.gameObject.SetActive ( false );
			currentPage = null;
		}
		
		if ( name == "" ) { return; }
								
		for ( var i = 0; i < thisTransform.childCount; i++ ) {
			if ( thisTransform.GetChild( i ).GetComponent ( OGPage ) ) {
				var p = thisTransform.GetChild( i ).GetComponent ( OGPage );

				if ( p.pageName == name ) {
					currentPage = p;
					p.gameObject.SetActive ( true );
					p.StartPage ();
					return;
				}
			}
		}
		
		if ( currentPage == null ) {
			Debug.LogError ( "OGRoot | invalid page: " + name );
		}
	}
	
	function Update () {
		if ( currentPage ) {					
			currentPage.UpdatePage ();
		}		
	}
	
	function OnGUI () {
		if ( currentPage ) {
			mouseOver = false;
			
			var anyRects : int = 0;
			
			for ( var w : Component in currentPage.transform.GetComponentsInChildren ( OGWidget ) ) {
				if ( (w as OGWidget).mouseOver ) {
					anyRects++;
				}
			}
					
			mouseOver = anyRects > 0;
		}
	}
	
	function Start () {		
		currentPage = _currentPage;
		skin = _skin;
		thisTransform = this.transform;
		
		if ( currentPage ) {
			currentPage.gameObject.SetActive ( true );
			currentPage.StartPage ();
		}
	}
}