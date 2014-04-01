#pragma strict

public class OGTabs extends OGWidget {
	public class Tab {
		public var title : String = "Tab";
		public var content : GameObject;
	}
	
	public var activeTab : int;
	public var tabs : List.<Tab> = new List.<Tab>();
	
	
	//////////////////
	// Rects
	//////////////////
	private function GetTabRect ( i : int ) : Rect {
		var tabWidth : float = drawRct.width / tabs.Count;
		return new Rect ( drawRct.x + ( i * tabWidth ), drawRct.y, tabWidth, drawRct.height );
	}

	private function GetTabStyle ( i : int ) : OGStyle {
		if ( isDisabled ) {
			return styles.disabled;
		} else if ( i == activeTab ) {
			return styles.active;
		} else {
			return styles.basic;
		}
	}

	
	//////////////////
	// Management
	//////////////////
	public function AddTab ( tabName : String, tabObject : GameObject, switchTo : boolean ) {
		var newTab : Tab = new Tab ();

		newTab.title = tabName;
		newTab.content = tabObject;

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
		for ( var i : int = 0; i < tabs.Count; i++ ) {
			if ( CheckMouseOver ( GetTabRect ( i ) ) ) {
				SetActiveTab ( i );
			}
		}
	}

	override function OnMouseUp () {
		GetRoot().ReleaseWidget();
	}

	override function OnMouseCancel () {
		GetRoot().ReleaseWidget();
	}
	

	//////////////////
	// Update
	//////////////////
	override function UpdateWidget () {
		isSelectable = true;
	
		// Mouse
		mouseRct = drawRct;

		// Update data
		if ( activeTab >= tabs.Count && tabs.Count > 0 ) {
			SetActiveTab ( tabs.Count - 1 );
	 	}
	}

	
	//////////////////
	// Draw
	//////////////////
	override function DrawSkin () {
		for ( var i : int = 0; i < tabs.Count; i++ ) {
			OGDrawHelper.DrawSlicedSprite ( GetTabRect(i), GetTabStyle(i), drawDepth, tint, clipTo );
		}
	}

	override function DrawText () {
		for ( var i : int = 0; i < tabs.Count; i++ ) {
			OGDrawHelper.DrawLabel ( GetTabRect(i), tabs[i].title, GetTabStyle(i).text, drawDepth, tint, clipTo );
		}
	}
}
