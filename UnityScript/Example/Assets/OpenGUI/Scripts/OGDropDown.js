#pragma strict

import System.Collections.Generic;

class OGDropDown extends OGWidget {	
	// Classes
	public class DropDownItem {
		public var name : String;
		public var message : String;
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
	public var padding : RectOffset;
	public var submenu : DropDownItemRoot[];
	public var isDown : boolean = false;

	private var container : GameObject;
	private var background : OGSlicedSprite;
	private var label : OGLabel;
	private var activeNestedMenu : int = -1;
	private var timeStamp : float;
	
	
	////////////////////
	// Interaction
	////////////////////
	override function OnMouseUp () {
		CheckTicked ();

		isDown = !isDown;
		SetSelectedItem ( -1 );
		activeNestedMenu = -1;

		SetDrawn ( isDrawn );
	}

	override function OnMouseCancel () {
		Exit ();
	}

	// Exit
	private function Exit () {
		if ( isDown ) {
			isDown = false;
			SetSelectedItem ( -1 );

			SetDrawn ( isDrawn );
		}
	}

	// Check ticked
	private function CheckTicked () {
		var i : int = 0;
		var o : int = 0;
		var btn : OGListItem;

		for ( i = 0; i < container.transform.childCount; i++ ) {
			btn = container.transform.GetChild(i).Find("Button").GetComponent(OGListItem);
			btn.isTicked = submenu[i].isTicked;
			var nested : Transform = container.transform.GetChild(i).Find("NestedMenu");
			for ( o = 0; o < nested.childCount; o++ ) {
				btn = nested.GetChild(o).GetComponent(OGListItem);
				btn.isTicked = submenu[i].nestedMenu[o].isTicked;
			}
		}
	}

	// Set selected item
	private function SetSelectedItem ( i : int ) {
		var o : int = 0;
		
		for ( o = 0; o < container.transform.childCount; o++ ) {
			var entry : Transform = container.transform.GetChild(o);
			entry.Find("Button").GetComponent(OGListItem).selected = o == i;
			
			for ( var k = 0; k < entry.Find("NestedMenu").childCount; k++ ) {
				entry.Find("NestedMenu").GetChild(k).GetComponent(OGListItem).selected = false;
			}
		}
	}

	// Menu item
	public function SelectItem ( n : String ) {
		var i : int = int.Parse ( n );
		var item : DropDownItemRoot = submenu[i];
		
		if ( !String.IsNullOrEmpty ( item.message ) ) {
			target.SendMessage ( item.message );
		}
		
		if ( item.tickable ) {
			item.isTicked = !item.isTicked;
			container.transform.GetChild(i).Find("Button").GetComponent(OGListItem).isTicked = item.isTicked;
		}
	}

	public function HoverItem ( n : String ) {
		var i : int = int.Parse ( n );

		SetSelectedItem ( i );

		if ( submenu[i].nestedMenu.Length > 0 ) {
			activeNestedMenu = i;
		} else {
			activeNestedMenu = -1;
		}
		
		SetDrawn ( isDrawn );
	}

	// Nested item
	public function SelectNestedItem ( n : String ) {
		if ( activeNestedMenu < 0 ) { 
			Debug.LogWarning ( "OGDropDown | Nested menu out of bounds!" );
			return;
		}
		
		var i : int = int.Parse ( n );
		var item : DropDownItemNested = submenu[activeNestedMenu].nestedMenu[i];
		var nested : Transform = container.transform.GetChild(activeNestedMenu).Find("NestedMenu");

		if ( item.tickable ) {
			if ( item.tickOverrides ) {
				for ( var o : int = 0; o < submenu[activeNestedMenu].nestedMenu.Length; o++ ) {
					submenu[activeNestedMenu].nestedMenu[o].isTicked = o == i;
					nested.GetChild(o).GetComponent(OGListItem).isTicked = o == i;
				}
			} else {
				item.isTicked = !item.isTicked;
				nested.GetChild(i).GetComponent(OGListItem).isTicked = item.isTicked;
			}
		}

		if ( !String.IsNullOrEmpty ( item.message ) ) {
			target.SendMessage ( item.message );
		}
	}
	
	
	////////////////////
	// Set drawn
	////////////////////
	override function SetDrawn ( drawn : boolean ) {
		var i : int = 0;
		var o : int = 0;
		var lbl : OGLabel;
		
		isDrawn = drawn;
		
		label.isDrawn = isDrawn;	
		background.isDrawn = isDown && isDrawn;			
	
		// Submenu
		for ( i = 0; i < container.transform.childCount; i++ ) {
			var entry : Transform = container.transform.GetChild(i);
			var button : OGListItem = entry.Find("Button").GetComponent(OGListItem);	
			button.SetDrawn ( isDrawn && isDown );

			// Nested
			var nested : Transform = entry.Find("NestedMenu");
			var thisActive : boolean = i == activeNestedMenu;
			for ( o = 0; o < nested.childCount; o++ ) {
				var btn : OGListItem = nested.GetChild(o).GetComponent(OGListItem);
				btn.SetDrawn ( isDrawn && isDown && thisActive );	
			}

			var bg : OGSlicedSprite = entry.Find("Background").GetComponent(OGSlicedSprite);	
			bg.isDrawn = isDrawn && isDown && thisActive;
		}

		SetDirty ();
	}

	
	////////////////////
	// Build 
	////////////////////
	override function Build () {
		isSelectable = true;
		
		var i : int = 0;
		var o : int = 0;

		// Submenu container
		if ( !container && !FindChild("Submenu") ) {
			container = new GameObject ( "Submenu" );
			container.transform.parent = this.transform;
		
		} else if ( container == null ) {
			container = FindChild("Submenu");
		}

		container.transform.localPosition = new Vector3 ( 0, 1 + (padding.top*2)/this.transform.localScale.y, 0 );
		container.transform.localScale = Vector3.one;
		container.transform.localEulerAngles = Vector3.zero;
		
		// Submenu
		if ( submenu == null ) {
			submenu = new DropDownItemRoot[0];
		}
		
		// ^ Edit existing or create new ones
		for ( i = 0; i < submenu.Length; i++ ) {
			// Entry container
			var entry : Transform;

			if ( i < container.transform.childCount ) {
				entry = container.transform.GetChild(i);
			} else {
				entry = new GameObject ( i + ": " + submenu[i].name ).transform;
				entry.parent = container.transform;
			}

			entry.gameObject.name = i + ": " + submenu[i].name;
			entry.localPosition = new Vector3 ( 0, i, 0 );
			entry.localEulerAngles = Vector3.zero;
			entry.localScale = Vector3.one;

			// Entry button
			var button : OGListItem;

			if ( entry.Find("Button") ) {
				button = entry.Find("Button").GetComponent(OGListItem);
			} else {
				button = new GameObject ( "Button", OGListItem ).GetComponent(OGListItem);
				button.transform.parent = entry;
			}

			button.transform.localPosition = new Vector3 ( padding.left/this.transform.localScale.x, 0, 2 );
			button.transform.localScale = new Vector3 ( 1-(padding.left+padding.right)/this.transform.localScale.x, 1, 1 );
			button.transform.localEulerAngles = Vector3.zero;
			
			button.text = submenu[i].name;
			button.target = this.gameObject;
			button.message = "SelectItem";
			button.hoverMessage = "HoverItem";
			button.argument = i.ToString();
			button.hidden = true;
			button.styles.basic = this.styles.active;
			button.styles.active = this.styles.hover;
			button.styles.ticked = this.styles.ticked;

			// Nested menu container
			var nested : Transform;

			if ( entry.Find("NestedMenu") ) {
				nested = entry.Find("NestedMenu").transform;
			} else {
				nested = new GameObject ( "NestedMenu" ).transform;
				nested.parent = entry;
			}

			nested.localPosition = new Vector3 ( 1 - (padding.right*2)/this.transform.localScale.x, 0, 0 );
			nested.localScale = Vector3.one;
			nested.localEulerAngles = Vector3.zero;

			// Submenu
			// ^ Edit existing or create new ones
			for ( o = 0; o < submenu[i].nestedMenu.Length; o++ ) {
				var btn : OGListItem;
				var nestedItem : DropDownItemNested = submenu[i].nestedMenu[o];

				if ( o < nested.childCount ) {
					btn = nested.GetChild(o).GetComponent(OGListItem);
				} else {
					btn = new GameObject ( "", OGListItem ).GetComponent(OGListItem);
					btn.transform.parent = nested;
				}

				btn.gameObject.name = o + ": " + nestedItem.name;
				btn.text = nestedItem.name;
				btn.target = this.gameObject;
				btn.message = "SelectNestedItem";
				btn.argument = o.ToString();
				btn.hidden = true;
				btn.styles.basic = this.styles.active;
				btn.styles.active = this.styles.hover;
				btn.styles.ticked = this.styles.ticked;

				btn.transform.localPosition = new Vector3 ( padding.left/this.transform.localScale.x, o, 0 );
				btn.transform.localScale = new Vector3 ( 1-(padding.left+padding.right)/this.transform.localScale.x, 1, 1 );
				btn.transform.localEulerAngles = Vector3.zero;
			}

			// ^ Destroy remaining
			if ( nested.childCount > submenu[i].nestedMenu.Length ) {
				for ( o = submenu[i].nestedMenu.Length; o < nested.childCount; o++ ) {
					DestroyImmediate ( nested.GetChild(o).gameObject );
				}
			}

			// Nested background
			var bg : OGSlicedSprite;

			if ( entry.Find("Background") ) {
				bg = entry.Find("Background").GetComponent(OGSlicedSprite);
			} else {
				bg = new GameObject ( "Background", OGSlicedSprite ).GetComponent(OGSlicedSprite);
				bg.transform.parent = entry;
			}

			bg.styles.basic = this.styles.basic;
			bg.transform.localPosition = new Vector3 ( 1 - (padding.right*2)/this.transform.localScale.x, -padding.top/this.transform.localScale.y, 1 );
			if ( nested.childCount < 1 ) {
				bg.transform.localScale = Vector3.one;
			} else {
				bg.transform.localScale = new Vector3 ( 1, nested.childCount + (padding.top+padding.bottom)/this.transform.localScale.y, 1 );
			}
			bg.transform.localEulerAngles = Vector3.zero;
			bg.hidden = true;
		}

		// ^ Destroy remaining
		if ( container.transform.childCount > submenu.Length ) {
			for ( i = submenu.Length; i < container.transform.childCount; i++ ) {
				DestroyImmediate ( container.transform.GetChild(i).gameObject );
			}
		}

		// Background
		if ( background == null ) {
			if ( this.transform.Find( "SlicedSprite" ) ) {
				background = this.transform.Find( "SlicedSprite" ).GetComponent(OGSlicedSprite);
				
			} else {			
				var newSprite : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newSprite.transform.parent = this.transform;
				background = newSprite;
			}
		}
			
		
		background.hidden = true;
		background.styles.basic = this.styles.basic;
		background.transform.localPosition = new Vector3 ( 0, 1 + padding.top/this.transform.localScale.y, 3 );
		background.transform.localEulerAngles = Vector3.zero;
		background.transform.localScale = new Vector3 ( 1, container.transform.childCount + (padding.top+padding.bottom)/this.transform.localScale.y, 1 );
		
		// Label
		if ( label == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGLabel ) ) {
				label = this.gameObject.GetComponentInChildren ( OGLabel );
				
			} else {				
				var newLabel : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
				newLabel.transform.parent = this.transform;
				label = newLabel;
			}
		}

		label.text = title;
		label.styles.basic = this.styles.basic;		
		
		label.transform.localScale = new Vector3 ( ( label.lineWidth + label.styles.basic.text.padding.left + label.styles.basic.text.padding.right + 5 ) / this.transform.lossyScale.x, 1, 1 );
		label.transform.localEulerAngles = Vector3.zero;
		label.transform.localPosition = Vector3.zero;
		
		label.hidden = true;

		// Set drawn
		SetDrawn ( isDrawn );
	}


	////////////////////
	// Update
	////////////////////
	override function UpdateWidget () {
		// Null check
		if ( !background || !label || !container ) {
			Build ();
			return;
		}

		// Mouse
		mouseRct = label.drawRct;
	}
}
