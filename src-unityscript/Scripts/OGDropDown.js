#pragma strict

import System.Collections.Generic;

@script AddComponentMenu ("OpenGUI/DropDown")


class OGDropDown extends OGWidget {	
	// Classes
	public class DropDownItem {
		var name : String;
		var message : String;
		var submenu : DropDownItem[];
		var isDown : boolean = false;
		var isChecked : boolean = false;
	}
	
	// Vars
	var isDown = false;
	var title : String;
	var offset : Vector2 = new Vector2 ( 0, 20 );
	
	var target : GameObject;
	var submenu : DropDownItem[];
	
	private var modifiedColliderRect : Rect = new Rect ( 0, 0, 1, 1 );
	
	// Draw
	override function Draw ( x : float, y : float ) {	
		if ( !guiStyle ) { guiStyle = GUI.skin.button; }
				
		// Submenu items
		if ( isDown ) {
			var size : Vector2 = new Vector2 ( this.transform.localScale.x, offset.y );
			GUI.Box ( modifiedColliderRect, "", guiStyle );
			
			// Title button
			if ( GUI.Button ( Rect ( x, y, ( title.Length * 8 ), transform.localScale.y ), title, GUI.skin.label ) ) {
				isDown = false;
				
				for ( var sub : DropDownItem in submenu ) {
					sub.isDown = false;
				}
			}
			
			for ( var i : int = 0; i < submenu.Length; i++ ) {
				// This submenu
				if ( GUI.Button ( Rect ( modifiedColliderRect.xMin + offset.x, modifiedColliderRect.yMin + size.y, this.transform.localScale.x, this.transform.localScale.y ), submenu[i].name, GUI.skin.label ) ) {
					if ( target && !String.IsNullOrEmpty ( submenu[i].message ) ) { target.SendMessage(submenu[i].message, submenu[i] ); }
				
					if ( submenu[i].submenu.Length < 1 ) {
						isDown = false;
						submenu[i].isDown = false;
					} else {
						submenu[i].isDown = !submenu[i].isDown;
					}
				}
				
				// Extra symbol
				var symbol : String = "";
				
				if ( submenu[i].submenu.Length > 0 ) {
					if ( submenu[i].isDown ) {
						symbol = ":";
					
					} else {
						symbol = ">";
					
					}
					
				} else if ( submenu[i].isChecked ) {
					symbol = "✓";
				
				}
				
				GUI.Label ( Rect ( modifiedColliderRect.xMin + offset.x/2 + this.transform.localScale.x, modifiedColliderRect.yMin + size.y, 20, 20 ), symbol, GUI.skin.label );
				
				// Sub-submenus
				if ( submenu[i].isDown ) {
					if ( submenu[i].submenu.Length > 0 ) {
						size.x += transform.localScale.x;
					}
					
					for ( var s : int = 0; s < submenu[i].submenu.Length; s++ ) {
						// Button
						if ( GUI.Button ( Rect ( modifiedColliderRect.center.x + offset.x, modifiedColliderRect.yMin + offset.y + s * this.transform.localScale.y, this.transform.localScale.x, this.transform.localScale.y ), submenu[i].submenu[s].name, GUI.skin.label ) ) {
							if ( target && !String.IsNullOrEmpty ( submenu[i].submenu[s].message ) ) { target.SendMessage(submenu[i].submenu[s].message, submenu[i].submenu[s]); }
							
							for ( var sm : DropDownItem in submenu[i].submenu ) {
								sm.isChecked = false;
							}
							
							submenu[i].submenu[s].isChecked = true;
							
							submenu[i].isDown = false;
							isDown = false;
						}
						
						// Symbol
						if ( submenu[i].submenu[s].isChecked ) {
							GUI.Label ( Rect ( modifiedColliderRect.center.x - 10 + this.transform.localScale.x, modifiedColliderRect.yMin + offset.y + s * this.transform.localScale.y, 20, 20 ), "✓", GUI.skin.label );
						
						}
					}
				}
				
				size.y += transform.localScale.y + offset.y;
			}
			
			modifiedColliderRect = new Rect ( x, y + this.transform.localScale.y , size.x + offset.x * 2, size.y );
			SetCollider ();
		
		} else {
			// Title button
			if ( GUI.Button ( Rect ( x, y, ( title.Length * 8 ), transform.localScale.y ), title, GUI.skin.label ) ) {
				isDown = true;
			}
		
		}
	}
	
	// Collider
	override function SetCollider () {
		colliderRect = modifiedColliderRect;
	}
	
	// Update
	override function UpdateWidget () {
		if ( Input.GetKeyDown ( KeyCode.Escape ) ) {
			isDown = false;
		}
	}
}