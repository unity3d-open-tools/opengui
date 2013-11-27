#pragma strict

import System.Collections.Generic;

@script ExecuteInEditMode();
class OGRoot extends MonoBehaviour {
	public static var instance : OGRoot;
	
	public var skin : OGSkin;
	public var currentPage : OGPage;
	
	private var widgets : OGWidget[];
	private var mouseOver : List.< OGWidget > = new List.< OGWidget > ();
	private var downWidget : OGWidget;
	
	public static function GetInstance () {
		return instance;
	}
	
	public function OnPostRender () {
		if ( widgets != null ) {
			GL.PushMatrix();
			skin.atlas.SetPass(0);
			GL.LoadOrtho();
			GL.Begin(GL.QUADS);
			
			for ( var w : OGWidget in widgets ) {
				if ( w == null ) { continue; }
				
				if ( w.isDrawn ) {
					w.DrawGL ();
				}
			}
			
			GL.End ();
			GL.PopMatrix();
		}
	}
	
	public function OnGUI () {
		if ( widgets != null ) {
			for ( var w : OGWidget in widgets ) {
				if ( w == null ) { continue; }
				
				if ( w.isDrawn ) {
					w.DrawGUI ();
				}
			}
		}
	}
	
	public function ReleaseWidget () {
		downWidget = null;
	}
	
	public function Update () {
		if ( instance == null ) {
			instance = this;
		}
				
		mouseOver.Clear ();
	
		widgets = currentPage.gameObject.GetComponentsInChildren.<OGWidget>();
		
		for ( var w : OGWidget in widgets ) {
			if ( w == null ) { continue; }
			
			w.Recalculate ( this );
			w.UpdateWidget ( this );
		
			if ( w.mouseOver ) {
				mouseOver.Add ( w );
			}
		}
		
		// Click
		if ( Input.GetMouseButtonDown ( 0 ) ) {
			var topWidget : OGWidget;
			
			for ( var mw : OGWidget in mouseOver ) {
				if ( topWidget == null || mw.transform.position.z < topWidget.transform.position.z ) {
					topWidget = mw;
				}
			}
			
			if ( downWidget && downWidget != topWidget ) {
				downWidget.OnMouseCancel ();
			}
			
			if ( topWidget == null ) { return; }
			
 			topWidget.OnMouseDown ();
			downWidget = topWidget;
		
		// Release
		} else if ( Input.GetMouseButtonUp ( 0 ) ) {
			if ( downWidget ) {
				if ( downWidget.mouseOver ) {
					downWidget.OnMouseUp ();
				
				} else {
					downWidget.OnMouseCancel ();
				
				}
			
			}
		
		// Dragging
		} else if ( Input.GetMouseButton ( 0 ) ) {
			if ( downWidget ) {
				downWidget.OnMouseDrag ();
			}
		
		// Escape key
		} else if ( Input.GetKeyDown ( KeyCode.Escape ) ) {
			if ( downWidget ) {
				downWidget.OnMouseCancel ();
			}
		}
	}
}