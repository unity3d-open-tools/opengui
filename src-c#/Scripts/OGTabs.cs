using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[AddComponentMenu ("OpenGUI/Tabs")]
public class OGTabs : OGWidget {

	public class Tab {
		public string label;
		public GameObject gobject;
	
		public Tab (  string l , GameObject o  ){
			label = l;
			gobject = o;
		}
	}
	
	public enum TabDirection {
		Horizontal,
		Vertical
	}
	
	public GameObject messageTarget;
	public List<Tab> tabs = new List<Tab>();
	public TabDirection direction = TabDirection.Horizontal;
	public float activeTab = 0;
		
	Vector2 boxPos = Vector2.zero; 
	
 	public void AddTab (  string label ,   GameObject gobject   ){
		tabs.Add ( new Tab ( label, gobject ) );
		
		if ( tabs.Count == 1 ) {
			Start ();
		}
	}
	
	public override void UpdateWidget (){

	}
	
	void ActivateTab (  Tab tab   ){
		foreach( Tab t in tabs ) {
			if ( t.gobject ) { t.gobject.SetActive ( t == tab ); }
		}
		
		if ( direction == TabDirection.Vertical ) {
			boxPos.y = tabs.IndexOf ( tab ) * ( transform.localScale.y / tabs.Count );
		} else {
			boxPos.x = tabs.IndexOf ( tab ) * ( transform.localScale.x / tabs.Count );
		}
	}
	
	void Start (){
		if ( tabs.Count > 0 ) {
			ActivateTab ( tabs[0] );
		}
	}
	
	public override void Draw (  float x ,   float y   ){
		if ( guiStyle == null ) { guiStyle = GUI.skin.box; }
		
		GUIStyle textStyle = new GUIStyle();
		textStyle.font = GUI.skin.label.font;
		textStyle.normal.textColor = guiStyle.normal.textColor;
		textStyle.fontSize = guiStyle.fontSize;
		textStyle.alignment = guiStyle.alignment;
				
		if ( direction == TabDirection.Horizontal && tabs.Count > 0 ) {
			GUI.Box ( new Rect( x + boxPos.x, y, ( transform.localScale.x / tabs.Count ), transform.localScale.y ), "", guiStyle );

			for ( int i = 0; i < tabs.Count; i++ ) {				
				if ( GUI.Button ( new Rect( x + ( i * ( transform.localScale.x / tabs.Count ) ), y, ( transform.localScale.x / tabs.Count ), transform.localScale.y ), tabs[i].label, textStyle ) ) {
					if ( tabs[i].label != "" ) {	
						ActivateTab ( tabs[i] );
						activeTab = i;
					}
				}
			}
		} else if ( tabs.Count > 0 ) {
			GUI.Box ( new Rect( x, y + boxPos.y, transform.localScale.x, transform.localScale.y ), "", guiStyle );
			for ( int i = 0; i < tabs.Count; i++ ) {				
				if ( GUI.Button ( new Rect( x, y + ( i * transform.localScale.y ), transform.localScale.x, transform.localScale.y ), tabs[i].label, textStyle ) ) {
					if ( tabs[i].label != "" ) {
						ActivateTab ( tabs[i] );
						activeTab = i;
					}
				}
			}
		}
	}
}
