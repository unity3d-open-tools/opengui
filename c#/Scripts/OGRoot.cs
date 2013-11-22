using UnityEngine;
using System.Collections;

[AddComponentMenu ("OpenGUI/Root")]
public class OGRoot : MonoBehaviour {

	public OGPage currentPage;
	public GUISkin skin;

	bool  mouseOver = false;
	Transform thisTransform;

	public void GoToPage (  string name   ){	
		if ( currentPage ) {
			if ( name == currentPage.pageName ) {
				return;
			}
			
			currentPage.gameObject.SetActive ( false );
			currentPage = null;
		}
		
		if ( name == "" || thisTransform == null ) { return; }
								
		for ( int i = 0; i < thisTransform.GetChildCount(); i++ ) {
			if ( thisTransform.GetChild( i ).GetComponent<OGPage>() ) {
				var p = thisTransform.GetChild( i ).GetComponent<OGPage>();

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
	
	void Update (){
		if ( currentPage ) {					
			currentPage.UpdatePage ();
		}		
	}
	
	void OnGUI (){
		if ( currentPage ) {
			mouseOver = false;
			
			int anyRects = 0;
			
			foreach ( OGWidget w in currentPage.transform.GetComponentsInChildren<OGWidget>() ) {
				if ( w.mouseOver ) {
					anyRects++;
				}
			}
					
			mouseOver = anyRects > 0;
		}
	}
	
	void Awake (){		
		//currentPage = _currentPage;
		//skin = _skin;
		thisTransform = this.transform;
		
		if ( currentPage ) {
			currentPage.root = this;
			currentPage.gameObject.SetActive ( true );
			currentPage.StartPage ();
		}
	}
}
