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
		public var isDown : boolean = false;
	}
	
	// Vars
	public var title : String;
	public var target : GameObject;
	public var submenu : DropDownItemRoot[];
	
	@HideInInspector public var downStyle : OGStyle;
	@HideInInspector public var hoverStyle : OGStyle;
	
	public var isDown = false;
	private var submenuContainer : GameObject;
	private var nestedMenuContainer : GameObject;
	private var background : OGSlicedSprite;
	private var label : OGLabel;
	private var timeStamp : float;
	private var currentNestedMenu : DropDownItemNested[];
	
	private function SelectItem ( item : DropDownItem ) {
		if ( item.GetType() == DropDownItemRoot && ( item as DropDownItemRoot ).nestedMenu.Length > 0 ) {
			( item as DropDownItemRoot ).isDown = !( item as DropDownItemRoot ).isDown;
			
			if ( ( item as DropDownItemRoot ).isDown ) {
				currentNestedMenu = ( item as DropDownItemRoot ).nestedMenu;
			} else {
				currentNestedMenu = null;
			}
		
		} else {
			if ( item.tickable && item.GetType() == DropDownItemNested && ( item as DropDownItemNested ).tickOverrides && currentNestedMenu != null ) {
				for ( var i : DropDownItemNested in currentNestedMenu ) {
					i.isTicked = false;
				}
				
				item.isTicked = true;
				
			} else if ( item.tickable ) {
				item.isTicked = !item.isTicked;
			}
		
			if ( target && item.message ) {
				target.SendMessage ( item.message );
			}
		}
	}
	
	private function GetMouseOverOption () : int {
		for ( var i : int = 0; i < submenuContainer.transform.childCount; i++ ) {
			if ( CheckMouseOver ( submenuContainer.transform.GetChild(i).GetComponent(OGLabel).drawRct ) ) {
				return i;
			}
		}
		
		for ( i = 0; i < nestedMenuContainer.transform.childCount; i++ ) {
			if ( CheckMouseOver ( nestedMenuContainer.transform.GetChild(i).GetComponent(OGLabel).drawRct ) ) {
				return 1000 + i;
			}
		}
		
		return -1;
	}
	
	override function OnMouseUp () {
		var mouseOverOption : int = GetMouseOverOption ();
		
		if ( mouseOverOption != -1 ) {
			var selectedItem : DropDownItem;
			
			if ( mouseOverOption >= 1000 ) {
				selectedItem = currentNestedMenu[mouseOverOption-1000];
			} else {
				selectedItem = submenu[mouseOverOption];
			}
		
			SelectItem ( selectedItem );
		
			if ( selectedItem.GetType() == DropDownItemRoot && ( selectedItem as DropDownItemRoot ).nestedMenu.Length < 1 ) {
				OnMouseCancel ();
			} else if ( selectedItem.GetType() == DropDownItemNested ) {
				OnMouseCancel ();
			}
		
		} else if ( Time.time - timeStamp > 0.5 ) {
			OnMouseCancel ();
		}
	}
	
	override function OnMouseDown () {
		if ( !isDown && GetMouseOverOption() == -1 ) {		
			isDown = true;
			timeStamp = Time.time;
		}
	}
	
	override function OnMouseOver () {
		var l : OGLabel;
				
		if ( nestedMenuContainer.activeSelf ) {
			for ( l in nestedMenuContainer.transform.GetComponentsInChildren.<OGLabel>() ) {
				if ( CheckMouseOver ( l.drawRct ) ) {
					l.style = hoverStyle;
				} else {
					l.style = style;
				}
			}
		}
		
		for ( l in submenuContainer.transform.GetComponentsInChildren.<OGLabel>() ) {
			if ( CheckMouseOver ( l.drawRct ) ) {
				l.style = hoverStyle;
			} else {
				l.style = style;
			}
		}
	}
	
	override function OnMouseCancel () {
		isDown = false;
		currentNestedMenu = null;
		nestedMenuContainer.SetActive ( false );
		
		for ( var i : int = 0; i < submenu.Length; i++ ) {
			submenu[i].isDown = false;	
		}
		
		OGRoot.GetInstance().ReleaseWidget ();
	}
	
	override function UpdateWidget ( root : OGRoot ) {
		var i : int;
		var tempList : List.< OGLabel >;
		var lbl : OGLabel;
		
		// Nested menu container
		if ( !nestedMenuContainer && !this.transform.Find("NestedMenu") ) {
			nestedMenuContainer = new GameObject ( "NestedMenu" );
			nestedMenuContainer.transform.parent = this.transform;
			nestedMenuContainer.transform.localPosition = new Vector3 ( 1, 1.1, 0 );
			nestedMenuContainer.transform.localScale = Vector3.one;
			nestedMenuContainer.transform.localEulerAngles = Vector3.zero;
		
		} else if ( !nestedMenuContainer ) {
			nestedMenuContainer = this.transform.Find("NestedMenu").gameObject;
		
		} else if ( currentNestedMenu != null && nestedMenuContainer.transform.childCount != currentNestedMenu.Length ) {
			for ( i = 0; i < nestedMenuContainer.transform.childCount; i++ ) {
				DestroyImmediate ( nestedMenuContainer.transform.GetChild(i).gameObject );
			}
			
			tempList = new List.< OGLabel > ();
			
			for ( i = 0; i < currentNestedMenu.Length; i++ ) {
				if ( nestedMenuContainer.transform.Find ( currentNestedMenu[i].name ) ) {
					lbl = nestedMenuContainer.transform.Find ( currentNestedMenu[i].name ).GetComponent ( OGLabel );
				} else {		
					lbl = new GameObject ( currentNestedMenu[i].name, OGLabel ).GetComponent ( OGLabel );
				}
				
				lbl.transform.parent = nestedMenuContainer.transform;
				lbl.transform.localScale = Vector3.one;
				lbl.transform.localEulerAngles = Vector3.zero;
				lbl.transform.localPosition = new Vector3 ( 0, i, 0 );
				lbl.style = style;
				lbl.text = currentNestedMenu[i].name;
			}
		
		} else if ( currentNestedMenu != null ) {
			nestedMenuContainer.transform.localPosition = new Vector3 ( 1, 1.1, 0 );
			nestedMenuContainer.SetActive ( isDown );
						
			for ( i = 0; i < currentNestedMenu.Length; i++ ) {
				lbl = nestedMenuContainer.transform.GetChild ( i ).GetComponent ( OGLabel );
				lbl.transform.localScale = Vector3.one;
				lbl.transform.localEulerAngles = Vector3.zero;
				lbl.transform.localPosition = new Vector3 ( 0, i, 0 );
				lbl.style = style;
				lbl.text = currentNestedMenu[i].name;
			
				if ( currentNestedMenu[i].isTicked ) {
					lbl.text += " ✓";
				}
			}
		
		} else {
			if ( nestedMenuContainer.transform.childCount > 0 ) {
				for ( i = 0; i < nestedMenuContainer.transform.childCount; i++ ) {
					DestroyImmediate ( nestedMenuContainer.transform.GetChild(i).gameObject );
				}
			}
			
			nestedMenuContainer.SetActive ( false );
			
		}
		
		// Submenu container
		if ( !submenuContainer && !this.transform.Find("Submenu") ) {
			submenuContainer = new GameObject ( "Submenu" );
			submenuContainer.transform.parent = this.transform;
			submenuContainer.transform.localPosition = new Vector3 ( 0, 1.1, 0 );
			submenuContainer.transform.localScale = Vector3.one;
			submenuContainer.transform.localEulerAngles = Vector3.zero;
		
		} else if ( !submenuContainer ) {
			submenuContainer = this.transform.Find("Submenu").gameObject;
		
		} else if ( submenu != null && submenuContainer.transform.childCount != submenu.Length && submenuContainer.activeSelf ) {
			for ( i = 0; i < submenuContainer.transform.childCount; i++ ) {
				DestroyImmediate ( submenuContainer.transform.GetChild(i).gameObject );
			}
			
			tempList = new List.< OGLabel > ();
			
			for ( i = 0; i < submenu.Length; i++ ) {
				if ( submenuContainer.transform.Find ( submenu[i].name ) ) {
					lbl = submenuContainer.transform.Find ( submenu[i].name ).GetComponent ( OGLabel );	
				} else {
					lbl = new GameObject ( submenu[i].name, OGLabel ).GetComponent ( OGLabel );
				}
				
				lbl.transform.parent = submenuContainer.transform;
				lbl.transform.localScale = Vector3.one;
				lbl.transform.localEulerAngles = Vector3.zero;
				lbl.transform.localPosition = new Vector3 ( 0, i, 0 );
				lbl.style = style;
				lbl.text = submenu[i].name;
			}
		
		} else if ( submenu != null ) {
			submenuContainer.transform.localPosition = new Vector3 ( 0, 1.1, 0 );
			submenuContainer.SetActive ( isDown );
			
			for ( i = 0; i < submenuContainer.transform.childCount; i++ ) {
				lbl = submenuContainer.transform.GetChild ( i ).GetComponent ( OGLabel );
				lbl.transform.localScale = Vector3.one;
				lbl.transform.localEulerAngles = Vector3.zero;
				lbl.transform.localPosition = new Vector3 ( 0, i, 0 );
				lbl.style = style;
				lbl.text = submenu[i].name;
				lbl.hidden = true;
			
				if ( submenu[i].isDown ) {
					lbl.text += " >";
				
				} else if ( submenu[i].nestedMenu != null && submenu[i].nestedMenu.Length > 0 ) {
					lbl.text += " :";
				
				} else if ( submenu[i].isTicked ) {
					lbl.text += " ✓";
				}
			}
		
		}
		
		// Background
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSlicedSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSlicedSprite );
				
			} else {			
				var newSprite : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newSprite.transform.parent = this.transform;
				newSprite.style = this.style;
			}
		
		} else {
			background.transform.localEulerAngles = Vector3.zero;
			background.transform.localPosition = Vector3.zero;
			
			background.pivot.x = pivot.x;
			background.pivot.y = RelativeY.Top;
			background.hidden = true;
									
			if ( isDown ) {
				background.isDrawn = true;
				background.style = downStyle;
				background.transform.localPosition = new Vector3 ( 0, 1, 0 );
				
				if ( currentNestedMenu != null ) {
					background.transform.localScale = new Vector3 ( 2, submenuContainer.transform.childCount + 0.2, 1 );
				} else {
					background.transform.localScale = new Vector3 ( 1, submenuContainer.transform.childCount + 0.2, 1 );
				}
				
				mouseOver = CheckMouseOver ( background.drawRct, label.drawRct );
			
			} else {
				background.isDrawn = false;
				background.style = style;
				background.transform.localScale = Vector3.one;
				mouseOver = CheckMouseOver ( label.drawRct );
			
			}
		}
		
		// Label
		if ( label == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGLabel ) ) {
				label = this.gameObject.GetComponentInChildren ( OGLabel );
				
			} else {				
				var newLabel : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
				newLabel.transform.parent = this.transform;
			}
		
		} else {
			label.text = title;
			
			var labelSize : Vector2 = label.textStyle.CalcSize ( GUIContent ( label.text ) );
			
			label.transform.localScale = new Vector3 ( labelSize.x / this.transform.lossyScale.x, 1, 1 );
			label.transform.localEulerAngles = Vector3.zero;
			label.transform.localPosition = Vector3.zero;
			
			label.pivot.x = pivot.x;
			label.pivot.y = RelativeY.Top;
					
			label.isDrawn = isDrawn;
			label.hidden = true;			
		}
		
		// Mouseover
		if ( mouseOver ) {
			OnMouseOver ();
		}
	}
	
}