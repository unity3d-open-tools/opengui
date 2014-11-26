using UnityEngine;
using System.Collections;

public class OGDropContainer : OGWidget {
	public bool displayName = true;
	public OGWidget containedObject = null;
	public float containedScale = 1;
	public GameObject target = null;
	public string droppedMessage = "";
	public string clearedMessage = "";

	
	////////////////////
	// Interact
	////////////////////
	private TouchPhase GetTouch () {
		if ( Input.touchCount < 1 ) {
			return (TouchPhase)(-1);
		
		} else {
			Touch touch = Input.GetTouch ( 0 );

			return touch.phase;
		}
	}
	
	public void Clear () {
		if ( containedObject ) {
			Destroy ( containedObject.gameObject );
		
			if ( target && !string.IsNullOrEmpty ( clearedMessage ) ) {
				target.SendMessage ( clearedMessage );
			}
		}
	}


	////////////////////
	// Update
	////////////////////
	override public void UpdateWidget () {
		// Persistent vars
		isSelectable = true;

		if ( CheckMouseOver () ) {
			currentStyle = styles.hover;
		} else {
			currentStyle = styles.basic;
		}
			
		// Mouse
		if ( Input.GetMouseButtonUp ( 0 ) || GetTouch () == TouchPhase.Ended ) {
			if ( OGRoot.GetInstance().downWidget && OGRoot.GetInstance().downWidget.isDraggable && CheckMouseOver() ) {
				if ( containedObject ) {
					Destroy ( containedObject.gameObject ); 
				}
				
				containedObject = (OGWidget)Instantiate ( OGRoot.GetInstance().downWidget );
				containedObject.gameObject.name = containedObject.gameObject.name.Replace ( "(Clone)", "" );
				containedObject.transform.parent = this.transform;
				containedObject.transform.localScale = new Vector3 ( containedScale, containedScale, 1 );
				containedObject.transform.localPosition = new Vector3 ( 1 - containedScale, 1 - containedScale, -1 );
				containedObject.isSelectable = false;
				containedObject.isDraggable = false;
				
				if ( target && !string.IsNullOrEmpty ( droppedMessage ) ) {
					target.SendMessage ( droppedMessage, this );
				}
			}
		}
		
		mouseRct = drawRct;
	}

	
	////////////////////
	// Draw
	////////////////////
	override public void DrawSkin () {
		if ( currentStyle == null ) { return; }
		
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );
	}

	override public void DrawText () {
		if ( currentStyle == null ) { return; }
		
		if ( containedObject != null && displayName ) {
			OGDrawHelper.DrawLabel ( drawRct, containedObject.gameObject.name, currentStyle.text, drawDepth, tint, clipTo );
		}
	}
}
