using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[AddComponentMenu ("OpenGUI/DropDown")]
public class OGDropDown : OGWidget {

	// Classes
	[System.Serializable]
	public class DropDownItem {
		public string name;
		public string message;
	}
	
	// Vars
	public bool isDown = false;
	public string title;
	public Vector2 offset = new Vector2 ( 0, 20 );
	
	public GameObject target;
	public DropDownItem[] submenu;
	
	// Draw
	public override void Draw (  float x ,   float y   ){	
		if ( guiStyle == null ) { guiStyle = GUI.skin.button; }
		
		// button
		if ( GUI.Button ( new Rect( x + guiStyle.padding.left, y, ( title.Length * 8 ), transform.localScale.y ), title, GUI.skin.label ) ) {
			isDown = !isDown;
		}
				
		// submenu
		if ( isDown ) {
			colliderRect = new Rect ( x - offset.x, y + offset.y, ( guiStyle.padding.left + guiStyle.padding.right ) + transform.localScale.x, ( submenu.Length * ( 12 + guiStyle.padding.top ) ) + ( guiStyle.padding.top + guiStyle.padding.bottom ) );
			GUI.Box ( colliderRect, "", guiStyle );
			
			for ( int i = 0; i < submenu.Length; i++ ) {
				var _x = x - offset.x + guiStyle.padding.left;
				var _y = y + offset.y + guiStyle.padding.top * 2f + 12 + guiStyle.padding.top * i;
				var _w = guiStyle.padding.left + guiStyle.padding.right + transform.localScale.x;
				if ( GUI.Button ( new Rect( _x, _y, _w, transform.localScale.y), submenu[i].name, GUI.skin.label ) ) {
					if ( target ) { target.SendMessage(submenu[i].message); }
					isDown = false;
				}
			}
		}
	}
	
	// Update
	public override void UpdateWidget (){
		if ( Input.GetKeyDown ( KeyCode.Escape ) ) {
			isDown = false;
		}
	}
}
