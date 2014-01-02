#pragma strict

public class OGTabs extends OGWidget {
	public class Tab {
		public var title : String = "Tab";
		public var content : GameObject;
	}
	
	public var activeTab : int;
	public var tabs : List.<Tab> = new List.<Tab>();
	
	public function AddTab ( tabName : String, tabObject : GameObject, switchTo : boolean ) {
		var newTab : Tab = new Tab ();

		newTab.title = tabName;
		newTab.content = tabObject;

		tabs.Add ( newTab );

		if ( switchTo ) {
			activeTab = tabs.Count - 1;
		} else if ( tabs.Count < 2 ) {
			activeTab = 0;
		}
		
		Build ();
	}

	public function ClearTabs () {
		tabs.Clear ();
		activeTab = -1;
		Build ();
	}


	//////////////////
	// Set drawn
	//////////////////
	override function SetDrawn ( drawn : boolean ) {
		if ( tabs.Count != this.transform.childCount ) {
			Build ();
		}
		
		isDrawn = drawn;

		for ( var i : int = 0; i < this.transform.childCount; i++ ) {
			var btn : OGButton = this.transform.GetChild(i).GetComponent(OGButton);
			btn.SetDrawn ( isDrawn );
		}

		SetDirty ();
	}


	//////////////////
	// Build
	//////////////////
	override function Build () {
		isSelectable = true;

		var i : int = 0;
		var btn : OGButton;

		if ( !tabs ) {
			tabs = new List.<Tab>();
		}

		// Edit existing or create new ones
		for ( i = 0; i < tabs.Count; i++ ) {
			if ( i < this.transform.childCount ) {
				btn = this.transform.GetChild(i).GetComponent(OGButton);
			} else {
				btn = new GameObject ( "", OGButton ).GetComponent(OGButton);
				btn.transform.parent = this.transform;
			}

			btn.text = tabs[i].title;
			btn.hidden = true;
			btn.target = this.gameObject;
			btn.message = "SetActiveTab";
			btn.argument = i.ToString();
			btn.styles.basic = this.styles.basic;
			btn.styles.active = this.styles.active;

			btn.gameObject.name = i + ": " + tabs[i].title;
			btn.transform.localScale = new Vector3 ( 1.0 / tabs.Count, 1, 1 );
			btn.transform.localPosition = new Vector3 ( (i*1.0) / tabs.Count, 0, 0 );
		}

		// Destroy remaining
		if ( this.transform.childCount > tabs.Count ) {
			for ( i = tabs.Count; i < this.transform.childCount; i++ ) {
				DestroyImmediate ( this.transform.GetChild(i).gameObject );
			}
		}

		// Set active tab
		SetActiveTab ( activeTab );
	}

	public function SetActiveTab ( n : String ) {
		SetActiveTab ( int.Parse ( n ) );
	}

	public function SetActiveTab ( tab : int ) {
		if ( tab < 0 || tab >= tabs.Count ) { return; }
		
		activeTab = tab;
	
		for ( var i : int = 0; i < tabs.Count; i++ ) {
			var btn : OGButton = this.transform.Find(i + ": " + tabs[i].title).GetComponent(OGButton);
			
			if ( activeTab != i ) {
				btn.styles.basic = styles.basic;
				
				if ( tabs[i].content != null && tabs[i].content.activeSelf ) {
					tabs[i].content.SetActive ( false );
				}

			} else {
				btn.styles.basic = styles.active;
				
				if ( tabs[i].content != null && !tabs[i].content.activeSelf ) {
					tabs[i].content.SetActive ( true );
				}
			}
		}

		SetDirty ();
	}
	
	override function UpdateWidget () {
		// Null check
		if ( tabs.Count != this.transform.childCount ) {
			Build ();
		}

		// Update data
		if ( activeTab >= tabs.Count && tabs.Count > 0 ) {
			SetActiveTab ( tabs.Count - 1 );
	 	} 
	}
}
