using UnityEngine;
using UnityEditor;
using System.Collections;

public class OGMenuItems : MonoBehaviour {
	// Helper voids
	private static void PlaceObject ( GameObject go, Vector3 scale ) {
		GameObject parent = UnityEditor.Selection.activeGameObject;
		OGRoot root = (OGRoot)GameObject.FindObjectOfType(typeof(OGRoot));
		
		if ( !parent && root ) {
			parent = root.currentPage.gameObject;
		}
		
		go.transform.parent = parent.transform;

		go.transform.localPosition = Vector3.zero;
		go.transform.localScale = scale;
		go.transform.localEulerAngles = Vector3.zero;
		
		UnityEditor.Selection.activeGameObject = go;
	}

	// Menu voids
	[MenuItem ("OpenGUI/New Root")]
	static void NewRoot () {
		new GameObject ( "Root", typeof(Camera), typeof(OGRoot) );
	}

	[MenuItem ("OpenGUI/New Page")]
	static void NewPage () {
		GameObject go = new GameObject ( "Page", typeof(OGPage) );
		OGRoot root = (OGRoot)GameObject.FindObjectOfType(typeof(OGRoot));

		if ( !root ) {
			Debug.LogWarning ( "No root in scene!" );
			DestroyImmediate ( go );
		} else {
			go.transform.parent = root.transform;
			go.transform.position = Vector3.one;
			go.transform.localScale = Vector3.one;
			go.transform.localEulerAngles = Vector3.zero;
			root.SetCurrentPage ( go.GetComponent<OGPage>() );
		}

		Selection.activeGameObject = go;
	}

	[MenuItem ("OpenGUI/Widgets/Button")]
	static void NewButton () {
		OGButton w = new GameObject ( "btn_Button", typeof(OGButton) ).GetComponent<OGButton>();

		PlaceObject ( w.gameObject, new Vector3 ( 100, 30, 1 ) );

		w.text = "Button";
		w.ApplyDefaultStyles ();
	}
	
	[MenuItem ("OpenGUI/Widgets/DropContainer")]
	static void NewDropContainer () {
		OGDropContainer w = new GameObject ( "drp_DropContainer", typeof(OGDropContainer) ).GetComponent<OGDropContainer>();

		PlaceObject ( w.gameObject, new Vector3 ( 100, 100, 1 ) );

		w.ApplyDefaultStyles ();
	}

	[MenuItem ("OpenGUI/Widgets/DropDown")]
	static void NewDropDown () {
		OGDropDown w = new GameObject ( "ddn_DropDown", typeof(OGDropDown) ).GetComponent<OGDropDown>();

		PlaceObject ( w.gameObject, new Vector3 ( 140, 20, 1 ) );

		w.title = "Dropdown Menu";
		w.ApplyDefaultStyles ();
	}
	
	[MenuItem ("OpenGUI/Widgets/Label")]
	static void NewLabel () {
		OGLabel w = new GameObject ( "lbl_Label", typeof(OGLabel) ).GetComponent<OGLabel>();

		PlaceObject ( w.gameObject, new Vector3 ( 140, 20, 1 ) );

		w.text = "New Label";
		w.ApplyDefaultStyles ();
	}
	
	[MenuItem ("OpenGUI/Widgets/PopUp")]
	static void NewPopUp () {
		OGPopUp w = new GameObject ( "pop_PopUp", typeof(OGPopUp) ).GetComponent<OGPopUp>();

		PlaceObject ( w.gameObject, new Vector3 ( 100, 20, 1 ) );

		w.title = "Popup Menu";
		w.ApplyDefaultStyles ();
	}
	
	[MenuItem ("OpenGUI/Widgets/ProgressBar")]
	static void NewProgressBar () {
		OGProgressBar w = new GameObject ( "bar_ProgressBar", typeof(OGProgressBar) ).GetComponent<OGProgressBar>();

		PlaceObject ( w.gameObject, new Vector3 ( 200, 30, 1 ) );

		w.padding = new Vector2 ( 8, 8 );
		w.ApplyDefaultStyles ();
	}
	
	[MenuItem ("OpenGUI/Widgets/ScrollView")]
	static void NewScrollView () {
		OGScrollView w = new GameObject ( "ScrollView", typeof(OGScrollView) ).GetComponent<OGScrollView>();

		PlaceObject ( w.gameObject, new Vector3 ( 1, 1, 1 ) );
		
		w.size = new Vector2 ( 400, 300 );
		w.ApplyDefaultStyles ();
	}
	
	[MenuItem ("OpenGUI/Widgets/SlicedSprite")]
	static void NewSlicedSprite () {
		OGSlicedSprite w = new GameObject ( "img_SlicedSprite", typeof(OGSlicedSprite) ).GetComponent<OGSlicedSprite>();

		PlaceObject ( w.gameObject, new Vector3 ( 200, 200, 1 ) );
		
		w.ApplyDefaultStyles ();
	}
	
	[MenuItem ("OpenGUI/Widgets/Slider")]
	static void NewSlider () {
		OGSlider w = new GameObject ( "sld_Slider", typeof(OGSlider) ).GetComponent<OGSlider>();

		PlaceObject ( w.gameObject, new Vector3 ( 200, 20, 1 ) );
		
		w.ApplyDefaultStyles ();
	}
	
	[MenuItem ("OpenGUI/Widgets/Sprite")]
	static void NewSprite () {
		OGSprite w = new GameObject ( "img_Sprite", typeof(OGSprite) ).GetComponent<OGSprite>();

		PlaceObject ( w.gameObject, new Vector3 ( 200, 20, 1 ) );
		
		w.ApplyDefaultStyles ();
	}
	
	[MenuItem ("OpenGUI/Widgets/Tabs")]
	static void NewTabs () {
		OGTabs w = new GameObject ( "tab_Tabs", typeof(OGTabs) ).GetComponent<OGTabs>();

		PlaceObject ( w.gameObject, new Vector3 ( 200, 20, 1 ) );
		
		w.ApplyDefaultStyles ();
	}
	
	[MenuItem ("OpenGUI/Widgets/TextField")]
	static void NewTextField () {
		OGTextField w = new GameObject ( "fld_TextField", typeof(OGTextField) ).GetComponent<OGTextField>();

		PlaceObject ( w.gameObject, new Vector3 ( 200, 20, 1 ) );
		
		w.ApplyDefaultStyles ();
	}
	
	[MenuItem ("OpenGUI/Widgets/Texture")]
	static void NewTexture () {
		OGTexture w = new GameObject ( "img_Texture", typeof(OGTexture) ).GetComponent<OGTexture>();

		PlaceObject ( w.gameObject, new Vector3 ( 120, 120, 1 ) );
	}
	
	[MenuItem ("OpenGUI/Widgets/TickBox")]
	static void NewTickBox () {
		OGTickBox w = new GameObject ( "tbx_TickBox", typeof(OGTickBox) ).GetComponent<OGTickBox>();

		PlaceObject ( w.gameObject, new Vector3 ( 200, 20, 1 ) );
		
		w.text = "Tickbox";
		w.ApplyDefaultStyles ();
	}
	
}
