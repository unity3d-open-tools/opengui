#pragma strict

import System.Collections.Generic;

class OGDropDown extends OGWidget {	
	// Classes
	public class DropDownItem {
		public var name : String;
		public var message : String;
		public var argument : String;
		public var tickable : boolean = false;
		public var isTicked : boolean = false;
	}
	
	public class DropDownItemNested extends DropDownItem {
		public var tickOverrides : boolean = false;
	}
	
	public class DropDownItemRoot extends DropDownItem {
		public var nestedMenu : DropDownItemNested[];
	}
	
	// Vars
	public var title : String;
	public var target : GameObject;
	public var nestedOffset : float = -10;
	public var submenu : DropDownItemRoot[];
	public var isDown : boolean = false;

	private var activeNestedMenu : int = -1;
	private var timeStamp : float;
	
	
	////////////////////
	// Interaction
	////////////////////
	override function OnMouseUp () {
		if ( isDown ) {
			// Is the mouse over any nested menu items?
			if ( activeNestedMenu != -1 ) {
				for ( var n : int = 0; n < submenu[activeNestedMenu].nestedMenu.Length; n++ ) {
					if ( CheckMouseOver ( GetNestedItemRect ( n ) ) ) {
						SelectNestedItem ( n );
						return;
					}
				}
			}
			
			// Is the mouse over any root menu items?
			for ( var s : int = 0; s < submenu.Length; s++ ) {
				if ( CheckMouseOver ( GetRootItemRect ( s ) ) ) {
					SelectRootItem ( s );
					return;
				}
			}

			// Nope, exit
			Exit ();

		} else {
			isDown = true;
		
		}
	}

	override function OnMouseCancel () {
		Exit ();
	}

	// Exit
	private function Exit () {
		isDown = false;
		activeNestedMenu = -1;

		root.ReleaseWidget ();
	}

	// Menu item
	public function SelectRootItem ( i : int ) {
		var item : DropDownItemRoot = submenu[i];
		
		if ( !String.IsNullOrEmpty ( item.message ) ) {
			if ( !String.IsNullOrEmpty ( item.argument ) ) {
				target.SendMessage ( item.message, item.argument );
			} else {
				target.SendMessage ( item.message );
			}
		}
		
		if ( item.tickable ) {
			item.isTicked = !item.isTicked;
			activeNestedMenu = -1;
			Exit ();

		} else if ( item.nestedMenu.Length > 0 ) {
			if ( activeNestedMenu == i ) {
				activeNestedMenu = -1;
			} else {
				activeNestedMenu = i;
			}

		} else {
			Exit ();

		}
		
	}

	// Nested item
	public function SelectNestedItem ( i : int ) {
		if ( activeNestedMenu < 0 ) { 
			Debug.LogWarning ( "OGDropDown | Nested menu out of bounds!" );
			return;
		}
		
		var item : DropDownItemNested = submenu[activeNestedMenu].nestedMenu[i];

		if ( item.tickable ) {
			if ( item.tickOverrides ) {
				for ( var o : int = 0; o < submenu[activeNestedMenu].nestedMenu.Length; o++ ) {
					submenu[activeNestedMenu].nestedMenu[o].isTicked = o == i;
				}
			} else {
				item.isTicked = !item.isTicked;
			}
		}
		
		Exit ();

		if ( !String.IsNullOrEmpty ( item.message ) ) {
			if ( !String.IsNullOrEmpty ( item.argument ) ) {
				target.SendMessage ( item.message, item.argument );
			} else {
				target.SendMessage ( item.message );
			}
		}
	}


	////////////////////
	// Rects
	////////////////////
	private function GetMouseRect () : Rect {
		return new Rect ( drawRct.x, drawRct.y, drawRct.width / 2, drawRct.height );
	}
	
	private function GetRootBackgroundRect () {
		return new Rect ( drawRct.x, drawRct.y - submenu.Length * drawRct.height - styles.active.text.padding.top - styles.active.text.padding.bottom, drawRct.width, drawRct.height * submenu.Length + styles.active.text.padding.top + styles.active.text.padding.bottom ); 
	}

	private function GetNestedBackgroundRect () {
		return new Rect ( drawRct.x + drawRct.width + nestedOffset, drawRct.y - ( activeNestedMenu + submenu[activeNestedMenu].nestedMenu.Length ) * drawRct.height - styles.active.text.padding.top - styles.active.text.padding.bottom, drawRct.width, drawRct.height * submenu[activeNestedMenu].nestedMenu.Length + styles.active.text.padding.bottom + styles.active.text.padding.top );
	}

	private function GetRootItemRect ( i : int ) {
		return new Rect ( drawRct.x, drawRct.y - ( ( 1 + i ) * drawRct.height ) - styles.active.text.padding.top, drawRct.width, drawRct.height );
	}

	private function GetNestedItemRect ( i : int ) {
		return new Rect ( drawRct.x + drawRct.width + nestedOffset, drawRct.y - ( 1 + activeNestedMenu + i ) * drawRct.height - styles.active.text.padding.top, drawRct.width, drawRct.height );
	}

	private function GetTickRect ( i : int, isRoot : boolean ) : Rect {
		if ( isRoot ) {
			return new Rect ( drawRct.x + drawRct.width - drawRct.height - styles.ticked.text.padding.right, drawRct.y - ( ( 1 + i ) * drawRct.height + styles.ticked.text.padding.top ), drawRct.height, drawRct.height );
		} else {
			return new Rect ( drawRct.x + ( drawRct.width * 2 ) - drawRct.height - styles.ticked.text.padding.right + nestedOffset, drawRct.y - ( ( 1 + activeNestedMenu + i ) * drawRct.height + styles.ticked.text.padding.top ), drawRct.height, drawRct.height );
		}
	}
	

	////////////////////
	// Style
	////////////////////
	private function GetRootItemStyle ( i : int ) : OGStyle {
		if ( CheckMouseOver ( GetRootItemRect ( i ) ) ) {
			return styles.hover;
		} else {
			return styles.active;
		}
	}

	private function GetNestedItemStyle ( i : int ) : OGStyle {
		if ( CheckMouseOver ( GetNestedItemRect ( i ) ) ) {
			return styles.hover;
		} else {
			return styles.active;
		}
	}


	////////////////////
	// Update
	////////////////////
	override function UpdateWidget () {
		// Persistent vars
		isSelectable = true;

		// Mouse
		if ( isDown ) {
			if ( activeNestedMenu != -1 ) {
				mouseRct = CombineRects ( GetRootBackgroundRect(), GetNestedBackgroundRect() );
			} else {
				mouseRct = GetRootBackgroundRect ();
			}
		} else {
			mouseRct = GetMouseRect();
		}

	}
	
	
	////////////////////
	// Draw
	////////////////////
	override function DrawSkin () {
		if ( isDown ) {
			OGDrawHelper.DrawSlicedSprite ( GetRootBackgroundRect (), styles.active, drawDepth, tint, clipTo );
		
			// Draw item graphics
			for ( var s : int = 0; s < submenu.Length; s++ ) {
				if ( submenu[s].isTicked ) {
					OGDrawHelper.DrawSprite ( GetTickRect ( s, true ), styles.ticked, drawDepth, tint, clipTo );
				
				} else if ( submenu[s].nestedMenu.Length > 0 ) {
					OGDrawHelper.DrawSprite ( GetTickRect ( s, true ), styles.thumb, drawDepth, tint, clipTo );

				}

				if ( GetRootItemStyle ( s ) == styles.hover ) {
					OGDrawHelper.DrawSprite ( GetRootItemRect ( s ), styles.hover, drawDepth, tint, clipTo );
				}
			}

			if ( activeNestedMenu != -1 ) {
				OGDrawHelper.DrawSlicedSprite ( GetNestedBackgroundRect (), styles.active, drawDepth, tint, clipTo );
				
				for ( var n : int = 0; n < submenu[activeNestedMenu].nestedMenu.Length; n++ ) {
					if ( submenu[activeNestedMenu].nestedMenu[n].isTicked ) {
						OGDrawHelper.DrawSprite ( GetTickRect ( n, false ), styles.ticked, drawDepth, tint, clipTo );
					}
					
					if ( GetNestedItemStyle ( n ) == styles.hover ) {
						OGDrawHelper.DrawSprite ( GetNestedItemRect ( n ), styles.hover, drawDepth, tint, clipTo );
					}
				}
			}
		
		}
	}	

	override function DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, title, styles.basic.text, drawDepth, tint );

		if ( isDown ) {
			for ( var s : int = 0; s < submenu.Length; s++ ) {
				OGDrawHelper.DrawLabel ( GetRootItemRect ( s ), submenu[s].name, GetRootItemStyle ( s ).text, drawDepth, tint, clipTo );
			}

			if ( activeNestedMenu != -1 ) {
				for ( var n : int = 0; n < submenu[activeNestedMenu].nestedMenu.Length; n++ ) {
					OGDrawHelper.DrawLabel ( GetNestedItemRect ( n ), submenu[activeNestedMenu].nestedMenu[n].name, GetNestedItemStyle ( n ).text, drawDepth, tint, clipTo );
				}
			}
		}
	}
}
