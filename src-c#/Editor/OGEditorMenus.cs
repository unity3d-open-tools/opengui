using UnityEngine;
using UnityEditor;
using System.Collections;

public class OGEditorMenus : MonoBehaviour {

	#pragma warning disable 219

// New UI
[MenuItem ( "OpenGUI/Create New UI" )]
static void NewUI (){
	GameObject rootObj = new GameObject ( "MenuRoot" );
	OGRoot root = rootObj.AddComponent<OGRoot>();
	
	GameObject pageObj = new GameObject ( "Page" );
	OGPage page = pageObj.AddComponent<OGPage>();
	
	pageObj.transform.parent = rootObj.transform;
	
	root.currentPage = page;

	Debug.LogWarning ( "You can assign OpenGUI/Skins/OGDefault as MenuRoot's skin." );
}

// Button
[MenuItem ( "OpenGUI/Add/Button" )]
static void AddButton (){
	GameObject obj = new GameObject ( "Button" );
	OGButton com = obj.AddComponent<OGButton>();
	
	com.text = "Button";

	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 30, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// CameraWindow
[MenuItem ( "OpenGUI/Add/CameraWindow" )]
static void AddCameraWindow (){
	GameObject obj = new GameObject ( "CameraWindow" );
	OGCameraWindow com = obj.AddComponent<OGCameraWindow>();
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 100, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// DropDown
[MenuItem ( "OpenGUI/Add/DropDown" )]
static void AddDropDown (){
	GameObject obj = new GameObject ( "DropDown" );
	OGDropDown com = obj.AddComponent<OGDropDown>();
	
	com.title = "DropDown";
	com.style = "dropdown";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 30, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Image
[MenuItem ( "OpenGUI/Add/Image" )]
static void AddImage (){
	GameObject obj = new GameObject ( "Image" );
	OGImage com = obj.AddComponent<OGImage>();
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 100, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Label
[MenuItem ( "OpenGUI/Add/Label" )]
static void AddLabel (){
	GameObject obj = new GameObject ( "Label" );
	OGLabel com = obj.AddComponent<OGLabel>();
	
	com.text = "Label";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 20, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// PopUp
[MenuItem ( "OpenGUI/Add/PopUp" )]
static void AddPopUp (){
	GameObject obj = new GameObject ( "PopUp" );
	OGPopUp com = obj.AddComponent<OGPopUp>();
	
	com.title = "PopUp";
	com.style = "popup";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 30, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Rect
[MenuItem ( "OpenGUI/Add/Rect" )]
static void AddRect (){
	GameObject obj = new GameObject ( "Rect" );
	OGRect com = obj.AddComponent<OGRect>();
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 100, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Ruler
[MenuItem ( "OpenGUI/Add/Ruler" )]
static void AddRuler (){
	GameObject obj = new GameObject ( "Ruler" );
	OGRuler com = obj.AddComponent<OGRuler>();
	
	com.style = "ruler";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 1, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// ScrollView
[MenuItem ( "OpenGUI/Add/ScrollView" )]
static void AddScrollView (){
	GameObject obj = new GameObject ( "ScrollView" );
	OGScrollView com = obj.AddComponent<OGScrollView>();
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}

	obj.transform.localScale = new Vector3 ( 100, 100, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Slider
[MenuItem ( "OpenGUI/Add/Slider" )]
static void AddSlider (){
	GameObject obj = new GameObject ( "Slider" );
	OGSlider com = obj.AddComponent<OGSlider>();
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 20, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Tabs
[MenuItem ( "OpenGUI/Add/Tabs" )]
static void AddTabs (){
	GameObject obj = new GameObject ( "Tabs" );
	OGTabs com = obj.AddComponent<OGTabs>();
	
	com.style = "tab";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 30, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// TextField
[MenuItem ( "OpenGUI/Add/TextField" )]
static void AddTextField (){
	GameObject obj = new GameObject ( "TextField" );
	OGTextField com = obj.AddComponent<OGTextField>();
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 30, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// TickBox
[MenuItem ( "OpenGUI/Add/TickBox" )]
static void AddTickBox (){
	GameObject obj = new GameObject ( "TickBox" );
	OGTickBox com = obj.AddComponent<OGTickBox>();
	
	com.label = "TickBox";
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 100, 20, 1 );
	obj.transform.localPosition = Vector3.zero;
}

// Widget
[MenuItem ( "OpenGUI/Add/Widget" )]
static void AddWidget (){
	GameObject obj = new GameObject ( "Widget" );
	OGWidget com = obj.AddComponent<OGWidget>();
	
	if ( Selection.activeTransform != null ) {
		obj.transform.parent = Selection.activeTransform;
	}
	
	obj.transform.localScale = new Vector3 ( 1, 1, 1 );
	obj.transform.localPosition = Vector3.zero;
}


}