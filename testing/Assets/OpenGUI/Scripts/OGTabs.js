#pragma strict

public class OGTabs extends OGWidget {
	public class Tab {
		public var title : String = "Tab";
		public var content : GameObject;
	}
	
	public var activeTab : int;
	public var tabs : Tab[];
	
	@HideInInspector public var downStyle : OGStyle;
	
	private function CreateTabObject () {
		var container : GameObject = new GameObject ( "Tab" );
		var background : OGSlicedSprite = new GameObject ( "Background", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
		var label : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
		
		background.transform.parent = container.transform;
		label.transform.parent = container.transform;
		
		background.transform.localScale = Vector3.one;
		background.transform.localEulerAngles = Vector3.zero;
		background.transform.localPosition = Vector3.zero;
		
		label.transform.localScale = Vector3.one;
		label.transform.localEulerAngles = Vector3.zero;
		label.transform.localPosition = Vector3.zero;
		
		container.transform.parent = this.transform;
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
		var anyMouseOver : boolean = false;
		
		for ( var i : int = 0; i < this.transform.childCount; i++ ) {
			var t : Transform = this.transform.GetChild ( i );
			
			if ( t == null ) {
				ClearTabObjects ();
				break;
			}
			
			var container : GameObject = t.gameObject;
			
			if ( i >= tabs.Length ) {
				DestroyImmediate ( container );
				continue;
			}
			
			var label : OGLabel = container.GetComponentInChildren ( OGLabel );
			var background : OGSlicedSprite = container.GetComponentInChildren ( OGSlicedSprite );
						
			label.text = tabs[i].title;
					
			if ( activeTab != i ) {
				label.style = style;
				background.style = style;
				
				if ( tabs[i].content != null ) {
					tabs[i].content.SetActive ( false );
				}
				
			} else {
				label.style = downStyle;
				background.style = downStyle;
				
				if ( tabs[i].content != null ) {
					tabs[i].content.SetActive ( true );
				}
			}
			
			label.hidden = true;
			background.hidden = true;
			
			if ( !anyMouseOver ) {
				anyMouseOver = CheckMouseOver ( background.drawRct );
			}
									
			container.name = i + ": " + tabs[i].title;
			container.transform.localScale = new Vector3 ( 1.0 / this.transform.childCount, 1, 1 );
			container.transform.localPosition = new Vector3 ( (i*1.0) / this.transform.childCount, 0, 0 );
		}
		
		mouseOver = anyMouseOver;
	}
	
	override function OnMouseDown () {
		for ( var i : int = 0; i < this.transform.childCount; i++ ) {			
			if ( CheckMouseOver ( this.transform.GetChild(i).GetComponentInChildren(OGSlicedSprite).drawRct ) ) {
				activeTab = i;
				return;
			}
		}
	}
	
	override function UpdateWidget () {
		if ( tabs == null ) { return; }
		
		if ( this.transform.childCount == 0 ) {
			MakeTabObjects ();
		
		} else {
			UpdateTabObjects ();
		
		}
		
		if ( activeTab >= tabs.Length && tabs.Length > 0 ) {
			activeTab = tabs.Length - 1;
	 	} 
	}
}
