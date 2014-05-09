#pragma strict

class OGDropContainer extends OGWidget {
	public var displayName : boolean = true;
	public var containedObject : OGWidget;
	public var containedScale : float = 1;
	public var target : GameObject;
	public var droppedMessage : String;
	public var clearedMessage : String;

	
	////////////////////
	// Interact
	////////////////////
	private function GetTouch () : TouchPhase {
		if ( Input.touchCount < 1 ) {
			return -1;
		
		} else {
			var touch : Touch = Input.GetTouch ( 0 );

			return touch.phase;
		}
	}
	
	public function Clear () {
		if ( containedObject ) {
			Destroy ( containedObject.gameObject );
		
			if ( target && !String.IsNullOrEmpty ( clearedMessage ) ) {
				target.SendMessage ( clearedMessage );
			}
		}
	}


	////////////////////
	// Update
	////////////////////
	override function UpdateWidget () {
		// Persistent vars
		isSelectable = true;

		if ( CheckMouseOver () ) {
			currentStyle = styles.hover;
		} else {
			currentStyle = styles.basic;
		}
			
		// Mouse
		if ( Input.GetMouseButtonUp ( 0 ) || GetTouch () == TouchPhase.Ended ) {
			if ( OGRoot.GetInstance().downWidget && CheckMouseOver() ) {
				if ( containedObject ) {
					Destroy ( containedObject.gameObject ); 
				}
				
				containedObject = Instantiate ( OGRoot.GetInstance().downWidget );
				containedObject.gameObject.name = containedObject.gameObject.name.Replace ( "(Clone)", "" );
				containedObject.transform.parent = this.transform;
				containedObject.transform.localScale = new Vector3 ( containedScale, containedScale, 1 );
				containedObject.transform.localPosition = new Vector3 ( 0, 0, -1 );
				containedObject.isSelectable = false;
				containedObject.isDraggable = false;
				
				if ( target && !String.IsNullOrEmpty ( droppedMessage ) ) {
					target.SendMessage ( droppedMessage, this );
				}
			}
		}
		
		mouseRct = drawRct;
	}

	
	////////////////////
	// Draw
	////////////////////
	override function DrawSkin () {
		if ( currentStyle == null ) { return; }
		
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );
	}

	override function DrawText () {
		if ( currentStyle == null ) { return; }
		
		if ( containedObject != null && displayName ) {
			OGDrawHelper.DrawLabel ( drawRct, containedObject.gameObject.name, currentStyle.text, drawDepth, tint, clipTo );
		}
	}
}
