#pragma strict

public class OGTabs extends OGWidget {
	public class Tab {
		public var title : String = "Tab";
		public var content : GameObject;
	}
	
	public var activeTab : int;
	public var tabs : Tab[];
	
	private function CreateTabObject () {
		var btn : OGButton = new GameObject ( "Tab", OGButton ).GetComponent(OGButton);

		btn.transform.localScale = Vector3.one;
		btn.transform.localEulerAngles = Vector3.zero;
		btn.transform.localPosition = Vector3.zero;
		
		btn.transform.parent = this.transform;
	}

	public function AddTab ( tabName : String, tabObject : GameObject, switchTo : boolean ) {
		var list : List.< Tab > = new List.< Tab > ( tabs );
		var newTab : Tab = new Tab ();

		newTab.title = tabName;
		newTab.content = tabObject;

		list.Add ( newTab );

		if ( switchTo ) {
			activeTab = tabs.Length;
		}

		tabs = list.ToArray();
	}

	public function ClearTabs () {
		ClearTabObjects ();
		tabs = new Tab[0];
	}

	private function ClearTabObjects () {
		for ( var i : int = 0; i < this.transform.childCount; i++ ) {
			DestroyImmediate ( this.transform.GetChild ( i ).gameObject );
		}
	}
	
	private function MakeTabObjects () {		
		for ( var i : int = 0; i < tabs.Length; i++ ) {
			CreateTabObject ();
		}
	}
	
	private function UpdateTabObjects () {
		var anyMouseOver : Rect = new Rect ( 0, 0, 0, 0 );
		
		if ( this.transform.childCount == 0 ) {
			MakeTabObjects ();
		
		} else if ( this.transform.childCount != tabs.Length ) {
			ClearTabObjects ();
		
		} else {
			for ( var i : int = 0; i < this.transform.childCount; i++ ) {
				var t : Transform = this.transform.GetChild ( i );
				
				if ( t == null ) {
					ClearTabObjects ();
					break;
				}
				
				if ( i >= tabs.Length ) {
					DestroyImmediate ( t.gameObject );
					continue;
				}
				
				var btn : OGButton = t.GetComponent(OGButton);
				btn.text = tabs[i].title;
						
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
				
				btn.hidden = true;
				btn.target = this.gameObject;
				btn.message = "SetActiveTab";
				btn.argument = i.ToString();
				btn.styles.active = styles.active;

				btn.gameObject.name = i + ": " + tabs[i].title;
				btn.transform.localScale = new Vector3 ( 1.0 / this.transform.childCount, 1, 1 );
				btn.transform.localPosition = new Vector3 ( (i*1.0) / this.transform.childCount, 0, 0 );
			}
		}
	}

	public function SetActiveTab ( n : String ) {
		activeTab = int.Parse ( n );
		UpdateWidget ();
	}
	
	override function UpdateWidget () {
		if ( tabs == null ) { return; }
	
		UpdateTabObjects ();

		if ( activeTab >= tabs.Length && tabs.Length > 0 ) {
			activeTab = tabs.Length - 1;
	 	} 
	}
}
