#pragma strict

// New UI
@MenuItem ( "OpenGUI/Create New UI" )
static function NewUI () {
	var rootObj : GameObject = new GameObject ( "MenuRoot" );
	var root : OGRoot = rootObj.AddComponent ( OGRoot );
	
	var pageObj : GameObject = new GameObject ( "Page" );
	var page : OGPage = pageObj.AddComponent ( OGPage );
	
	pageObj.transform.parent = rootObj.transform;
	
	root.currentPage = page;

	Debug.LogWarning ( "You can assign OpenGUI/Skins/OGDefault as MenuRoot's skin." );
}

// Button
@MenuItem ( "OpenGUI/Add/Button" )
static function AddButton () {
	var obj : GameObject = new GameObject ( "Button" );
	var com : OGButton = obj.AddComponent ( OGButton );
	
	com.text = "Button";

	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 30, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// CameraWindow
@MenuItem ( "OpenGUI/Add/CameraWindow" )
static function AddCameraWindow () {
	var obj : GameObject = new GameObject ( "CameraWindow" );
	var com : OGCameraWindow = obj.AddComponent ( OGCameraWindow );
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 100, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// DropDown
@MenuItem ( "OpenGUI/Add/DropDown" )
static function AddDropDown () {
	var obj : GameObject = new GameObject ( "DropDown" );
	var com : OGDropDown = obj.AddComponent ( OGDropDown );
	
	com.title = "DropDown";
	com.style = "dropdown";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 30, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Image
@MenuItem ( "OpenGUI/Add/Image" )
static function AddImage () {
	var obj : GameObject = new GameObject ( "Image" );
	var com : OGImage = obj.AddComponent ( OGImage );
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 100, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Label
@MenuItem ( "OpenGUI/Add/Label" )
static function AddLabel () {
	var obj : GameObject = new GameObject ( "Label" );
	var com : OGLabel = obj.AddComponent ( OGLabel );
	
	com.text = "Label";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 20, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// PopUp
@MenuItem ( "OpenGUI/Add/PopUp" )
static function AddPopUp () {
	var obj : GameObject = new GameObject ( "PopUp" );
	var com : OGPopUp = obj.AddComponent ( OGPopUp );
	
	com.title = "PopUp";
	com.style = "popup";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 30, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Rect
@MenuItem ( "OpenGUI/Add/Rect" )
static function AddRect () {
	var obj : GameObject = new GameObject ( "Rect" );
	var com : OGRect = obj.AddComponent ( OGRect );
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 100, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Ruler
@MenuItem ( "OpenGUI/Add/Ruler" )
static function AddRuler () {
	var obj : GameObject = new GameObject ( "Ruler" );
	var com : OGRuler = obj.AddComponent ( OGRuler );
	
	com.style = "ruler";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 1, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// ScrollView
@MenuItem ( "OpenGUI/Add/ScrollView" )
static function AddScrollView () {
	var obj : GameObject = new GameObject ( "ScrollView" );
	var com : OGScrollView = obj.AddComponent ( OGScrollView );
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}

	obj.transform.localScale = new Vector3 ( 100, 100, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Slider
@MenuItem ( "OpenGUI/Add/Slider" )
static function AddSlider () {
	var obj : GameObject = new GameObject ( "Slider" );
	var com : OGSlider = obj.AddComponent ( OGSlider );
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 20, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Tabs
@MenuItem ( "OpenGUI/Add/Tabs" )
static function AddTabs () {
	var obj : GameObject = new GameObject ( "Tabs" );
	var com : OGTabs = obj.AddComponent ( OGTabs );
	
	com.style = "tab";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 30, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// TextField
@MenuItem ( "OpenGUI/Add/TextField" )
static function AddTextField () {
	var obj : GameObject = new GameObject ( "TextField" );
	var com : OGTextField = obj.AddComponent ( OGTextField );
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 30, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// TickBox
@MenuItem ( "OpenGUI/Add/TickBox" )
static function AddTickBox () {
	var obj : GameObject = new GameObject ( "TickBox" );
	var com : OGTickBox = obj.AddComponent ( OGTickBox );
	
	com.label = "TickBox";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 20, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Widget
@MenuItem ( "OpenGUI/Add/Widget" )
static function AddWidget () {
	var obj : GameObject = new GameObject ( "Widget" );
	var com : OGWidget = obj.AddComponent ( OGWidget );
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 1, 1, 1 );
	obj.transform.localPosition = Vector3.zero;
}

