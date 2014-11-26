using UnityEngine;
using System.Collections;

using System.Collections.Generic;

public class OGDropDown : OGWidget {	
	// Classes
	[System.Serializable]
	public class DropDownItem {
		public string name;
		public string message;
		public string argument;
		public bool tickable = false;
		public bool isTicked = false;
	}
	
	[System.Serializable]
	public class DropDownItemNested : DropDownItem {
		public bool tickoverrides = false;
	}
	
	[System.Serializable]
	public class DropDownItemRoot : DropDownItem {
		public DropDownItemNested[] nestedMenu;
	}
	
	// Vars
	public string title = "";
	public GameObject target = null;
	public float nestedOffset = -10;
	public DropDownItemRoot[] submenu = null;
	public bool isDown = false;

	private int activeNestedMenu = -1;
	private float timeStamp;
	
	
	////////////////////
	// Interaction
	////////////////////
	override public void OnMouseUp () {
		if ( isDown ) {
			// Is the mouse over any nested menu items?
			if ( activeNestedMenu != -1 ) {
				for ( int n = 0; n < submenu[activeNestedMenu].nestedMenu.Length; n++ ) {
					if ( CheckMouseOver ( GetNestedItemRect ( n ) ) ) {
						SelectNestedItem ( n );
						return;
					}
				}
			}
			
			// Is the mouse over any root menu items?
			for ( int s = 0; s < submenu.Length; s++ ) {
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

	override public void OnMouseCancel () {
		Exit ();
	}

	// Exit
	private void Exit () {
		isDown = false;
		activeNestedMenu = -1;

		root.ReleaseWidget ();
	}

	// Menu item
	public void SelectRootItem ( int i ) {
		DropDownItemRoot item = submenu[i];
		
		if ( !string.IsNullOrEmpty ( item.message ) ) {
			if ( !string.IsNullOrEmpty ( item.argument ) ) {
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
	public void SelectNestedItem ( int i ) {
		if ( activeNestedMenu < 0 ) { 
			Debug.LogWarning ( "OGDropDown | Nested menu out of bounds!" );
			return;
		}
		
		DropDownItemNested item = submenu[activeNestedMenu].nestedMenu[i];

		if ( item.tickable ) {
			if ( item.tickoverrides ) {
				for ( int o = 0; o < submenu[activeNestedMenu].nestedMenu.Length; o++ ) {
					submenu[activeNestedMenu].nestedMenu[o].isTicked = o == i;
				}
			} else {
				item.isTicked = !item.isTicked;
			}
		}
		
		Exit ();

		if ( !string.IsNullOrEmpty ( item.message ) ) {
			if ( !string.IsNullOrEmpty ( item.argument ) ) {
				target.SendMessage ( item.message, item.argument );
			} else {
				target.SendMessage ( item.message );
			}
		}
	}


	////////////////////
	// Rects
	////////////////////
	private Rect GetMouseRect () {
		return new Rect ( drawRct.x, drawRct.y, drawRct.width / 2, drawRct.height );
	}
	
	private Rect GetRootBackgroundRect () {
		return new Rect ( drawRct.x, drawRct.y - submenu.Length * drawRct.height - styles.active.text.padding.top - styles.active.text.padding.bottom, drawRct.width, drawRct.height * submenu.Length + styles.active.text.padding.top + styles.active.text.padding.bottom ); 
	}

	private Rect GetNestedBackgroundRect () {
		return new Rect ( drawRct.x + drawRct.width + nestedOffset, drawRct.y - ( activeNestedMenu + submenu[activeNestedMenu].nestedMenu.Length ) * drawRct.height - styles.active.text.padding.top - styles.active.text.padding.bottom, drawRct.width, drawRct.height * submenu[activeNestedMenu].nestedMenu.Length + styles.active.text.padding.bottom + styles.active.text.padding.top );
	}

	private Rect GetRootItemRect ( int i ) {
		return new Rect ( drawRct.x, drawRct.y - ( ( 1 + i ) * drawRct.height ) - styles.active.text.padding.top, drawRct.width, drawRct.height );
	}

	private Rect GetNestedItemRect ( int i ) {
		return new Rect ( drawRct.x + drawRct.width + nestedOffset, drawRct.y - ( 1 + activeNestedMenu + i ) * drawRct.height - styles.active.text.padding.top, drawRct.width, drawRct.height );
	}

	private Rect GetTickRect ( int i, bool isRoot ) {
		if ( isRoot ) {
			return new Rect ( drawRct.x + drawRct.width - drawRct.height - styles.ticked.text.padding.right, drawRct.y - ( ( 1 + i ) * drawRct.height + styles.ticked.text.padding.top ), drawRct.height, drawRct.height );
		} else {
			return new Rect ( drawRct.x + ( drawRct.width * 2 ) - drawRct.height - styles.ticked.text.padding.right + nestedOffset, drawRct.y - ( ( 1 + activeNestedMenu + i ) * drawRct.height + styles.ticked.text.padding.top ), drawRct.height, drawRct.height );
		}
	}
	

	////////////////////
	// Style
	////////////////////
	private OGStyle GetRootItemStyle ( int i ) {
		if ( CheckMouseOver ( GetRootItemRect ( i ) ) ) {
			return styles.hover;
		} else {
			return styles.active;
		}
	}

	private OGStyle GetNestedItemStyle ( int i ) {
		if ( CheckMouseOver ( GetNestedItemRect ( i ) ) ) {
			return styles.hover;
		} else {
			return styles.active;
		}
	}


	////////////////////
	// Update
	////////////////////
	override public void UpdateWidget () {
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
	override public void DrawSkin () {
		if ( isDown ) {
			OGDrawHelper.DrawSlicedSprite ( GetRootBackgroundRect (), styles.active, drawDepth, tint, clipTo );
		
			// Draw item graphics
			for ( int s = 0; s < submenu.Length; s++ ) {
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
				
				for ( int n = 0; n < submenu[activeNestedMenu].nestedMenu.Length; n++ ) {
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

	override public void DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, title, styles.basic.text, drawDepth, tint );

		if ( isDown ) {
			for ( int s = 0; s < submenu.Length; s++ ) {
				OGDrawHelper.DrawLabel ( GetRootItemRect ( s ), submenu[s].name, GetRootItemStyle ( s ).text, drawDepth, tint, clipTo );
			}

			if ( activeNestedMenu != -1 ) {
				for ( int n = 0; n < submenu[activeNestedMenu].nestedMenu.Length; n++ ) {
					OGDrawHelper.DrawLabel ( GetNestedItemRect ( n ), submenu[activeNestedMenu].nestedMenu[n].name, GetNestedItemStyle ( n ).text, drawDepth, tint, clipTo );
				}
			}
		}
	}
}
