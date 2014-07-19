#pragma strict

public class OGTabs extends OGWidget {
	public class Tab {
		public var title : String = "Tab";
		public var content : GameObject;
	
		function Tab ( title : String, content : GameObject ) {
			this.title = title;
			this.content = content;
		}
	}
	
	public var activeTab : int;
	public var leftArrow : String = "«";
	public var rightArrow : String = "»";
	public var tabs : List.<Tab> = new List.<Tab>();
	public var target : GameObject;
	public var message : String;
	public var argument : String;
	public var passSelectedTab : boolean = false;

	private var prevActiveTab : int = 0;
	private var overflow : boolean = false;
	private var maxTabs : int = 0;
	private var focusTab : int = 0;
	private var leftNavDown : boolean = false;
	private var rightNavDown : boolean = false;


	//////////////////
	// Rects
	//////////////////
	private function GetTotalWidth () : float {
		var width : float = 0;
		var widestTab : float = 0;

		for ( var i : int = 0; i < tabs.Count; i++ ) {
			var newWidth : float = OGDrawHelper.GetLabelWidth ( tabs[i].title, GetTabStyle ( i ).text );
			width += newWidth;

			if ( newWidth > widestTab ) {
				widestTab = newWidth;
			}
		}

		if ( width > drawRct.width ) {
			maxTabs = Mathf.Clamp ( Mathf.Floor ( drawRct.width / widestTab ), 1, tabs.Count );
		
		} else {
			maxTabs = tabs.Count;

		}

		return width;
	}
	
	private function GetTabRect ( i : int ) : Rect {
		var tabWidth : float;
		
		if ( !overflow ) {
	       		tabWidth = drawRct.width / tabs.Count;

		} else {
			var width : float = drawRct.width;
			
			if ( activeTab > 0 ) {
				width -= drawRct.height;
			}
			
			if ( activeTab < tabs.Count - 1 ) {
				width -= drawRct.height;
			}

			tabWidth = width / maxTabs;
		
		}
		
		var rect : Rect = new Rect ( drawRct.x + tabWidth * ( i - focusTab ), drawRct.y, tabWidth, drawRct.height );
		
		if ( activeTab > 0 && overflow ) {
			rect.x += drawRct.height;
		}

		return rect;
	}

	private function GetLeftRect () : Rect {
		return new Rect ( drawRct.x, drawRct.y, drawRct.height, drawRct.height );
	}
	
	private function GetRightRect () : Rect {
		return new Rect ( drawRct.xMax - drawRct.height, drawRct.y, drawRct.height, drawRct.height );
	}

	
	//////////////////
	// Styles
	//////////////////
	private function GetTabStyle ( i : int ) : OGStyle {
		if ( i == activeTab ) {
			return styles.active;
		} else {
			return styles.basic;
		}
	}

	private function GetLeftStyle () : OGStyle {
		if ( leftNavDown ) {
			return styles.active;
		} else {
			return styles.basic;
		}
	}
	
	private function GetRightStyle () : OGStyle {
		if ( rightNavDown ) {
			return styles.active;
		} else {
			return styles.basic;
		}
	}
	

	//////////////////
	// Management
	//////////////////
	public function AddTab ( tabName : String, tabObject : GameObject, switchTo : boolean ) {
		var newTab : Tab = new Tab ( tabName, tabObject );

		tabs.Add ( newTab );

		if ( switchTo ) {
			SetActiveTab ( tabs.Count - 1 );
		} else if ( tabs.Count < 2 ) {
			SetActiveTab ( 0 );
		}
	}

	public function ClearTabs () {
		tabs.Clear ();
		activeTab = -1;
	}

	public function SetActiveTab ( n : String ) {
		SetActiveTab ( int.Parse ( n ) );
	}

	public function SetActiveTab ( tab : int ) {
		activeTab = tab;
		
		for ( var i : int = 0; i < tabs.Count; i++ ) {
			if ( tabs[i].content ) {
				tabs[i].content.SetActive ( i == activeTab );
			}
		}
	}
	
	
	//////////////////
	// Mouse
	//////////////////
	override function OnMouseDown () {
		if ( CheckMouseOver ( GetLeftRect () ) && activeTab > 0 ) {
			leftNavDown = true;

		} else if ( CheckMouseOver ( GetRightRect () ) && activeTab < tabs.Count - 1 ) {
			rightNavDown = true;

		} else {
			for ( var i : int = 0; i < tabs.Count; i++ ) {
				if ( CheckMouseOver ( GetTabRect ( i ) ) ) {
					SetActiveTab ( i );

					if ( target && !String.IsNullOrEmpty ( message ) ) {
						if ( passSelectedTab ) {
							target.SendMessage ( message, i );

						} else if ( !String.IsNullOrEmpty ( argument ) ) {
							target.SendMessage ( message, argument );

						} else {
							target.SendMessage ( message );

						}
					}
				}
			}
		}
	}

	override function OnMouseUp () {
		if ( leftNavDown ) {
			SetActiveTab ( activeTab - 1 );
		
		} else if ( rightNavDown ) {
			SetActiveTab ( activeTab + 1 );

		}
		
		OnMouseCancel ();
	}

	override function OnMouseCancel () {
		leftNavDown = false;
		rightNavDown = false;

		root.ReleaseWidget();
	}
	

	//////////////////
	// Update
	//////////////////
	override function UpdateWidget () {
		isSelectable = true;
	
		// Mouse
		mouseRct = drawRct;

		// Update data
		overflow = GetTotalWidth () > drawRct.width;
		
		if ( activeTab >= tabs.Count && tabs.Count > 0 ) {
			SetActiveTab ( tabs.Count - 1 );
	 	}

		if ( !overflow ) {
			focusTab = 0;

		} else if ( activeTab < focusTab ) {
			focusTab--;
		
		} else if ( activeTab >= focusTab + maxTabs ) {
			focusTab++;

		}
	}

	
	//////////////////
	// Draw
	//////////////////
	override function DrawSkin () {
		for ( var i : int = focusTab; i < focusTab + maxTabs; i++ ) {
			OGDrawHelper.DrawSlicedSprite ( GetTabRect(i), GetTabStyle(i), drawDepth, tint, clipTo );
		}
		
		if ( overflow ) {
			if ( activeTab > 0 ) {
				OGDrawHelper.DrawSlicedSprite ( GetLeftRect (), GetLeftStyle(), drawDepth, tint, clipTo );
			}
			
			if ( activeTab < tabs.Count - 1 ) {
				OGDrawHelper.DrawSlicedSprite ( GetRightRect (), GetRightStyle(), drawDepth, tint, clipTo );
			}
		}
	}

	override function DrawText () {
		for ( var i : int = focusTab; i < focusTab + maxTabs; i++ ) {
			OGDrawHelper.DrawLabel ( GetTabRect ( i ), tabs[i].title, GetTabStyle(i).text, drawDepth, tint, clipTo );
		}
		
		if ( overflow ) {
			if ( activeTab > 0 ) {
				OGDrawHelper.DrawLabel ( GetLeftRect (), leftArrow, GetLeftStyle().text, drawDepth, tint, clipTo );
			}

			if ( activeTab < tabs.Count - 1 ) {
				OGDrawHelper.DrawLabel ( GetRightRect (), rightArrow, GetRightStyle().text, drawDepth, tint, clipTo );
			}
		}
		
	}
}
