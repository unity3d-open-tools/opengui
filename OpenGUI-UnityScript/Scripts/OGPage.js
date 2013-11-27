#pragma strict

@script AddComponentMenu ("OpenGUI/Page")

class OGPage extends MonoBehaviour {
	
	var skin : GUISkin = null;
	var pageName : String = "";

	function Start () {
		if ( pageName == "" ) {
			pageName = name;
		}
	}

	function StartPage () {}

	function UpdatePage () {}
	
	function ExitPage () {};
}