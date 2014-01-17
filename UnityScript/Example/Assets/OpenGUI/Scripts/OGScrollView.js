#pragma strict

public class OGScrollView extends OGWidget {
	public var size : Vector2;
	public var position : Vector2;
	public var padding : Vector2 = new Vector2 ( 10, 10 );
	public var elasticity : float = 2;

	// TODO: Deprecate
	@HideInInspector public var scrollLength : float = 0;
	@HideInInspector public var scrollWidth : float = 0;
	@HideInInspector public var viewHeight : float = 0;
	@HideInInspector public var inset : float = 0;

	private var widgets : OGWidget[];
	private var bounds : Vector2;
	private var inPlace : boolean = true;


	////////////////
	// Update
	////////////////
	private function UpdateChildren () {
		if ( !widgets || widgets.Length != this.gameObject.GetComponentsInChildren.<OGWidget>().Length ) {
			widgets = this.gameObject.GetComponentsInChildren.<OGWidget>();
		}

		bounds = Vector2.zero;
		
		for ( var i : int = 0; i < widgets.Length; i++ ) {
			var w : OGWidget = widgets[i];
		
			if ( w != null && w != this ) {
				w.scrollOffset = new Vector3 ( padding.x + position.x, padding.y + position.y, 0 );
				w.anchor.x = RelativeX.None;
				w.anchor.y = RelativeY.None;
				w.clipTo = this;

				var bottom : float = w.transform.localPosition.y + w.transform.localScale.y - size.y + padding.y * 2;
				var right : float = w.transform.localPosition.x + w.transform.localScale.x - size.x + padding.x * 2;

				if ( -bottom < bounds.y ) {
					bounds.y = -bottom;
				}

				if ( -right < bounds.x ) {
					bounds.x = -right;
				}
			}
		}
	}

	private function SnapBack () : IEnumerator {
		inPlace = false;

		var xInPlace : boolean = false;
		var yInPlace : boolean = false;

		// If the scoll position is not in place, keep going
		while ( !inPlace ) {
			// Out of bounds top
			if ( position.y > 0 ) {
				position.y = Mathf.Lerp ( position.y, 0, Time.deltaTime * padding.y );
				yInPlace = false;

				if ( position.y < 1 ) {
					position.y = 0;
				}
			
			// Out of bounds bottom
			} else if ( position.y < bounds.y ) {
				position.y = Mathf.Lerp ( position.y, bounds.y, Time.deltaTime * padding.y );
				yInPlace = false;

				if ( position.y > bounds.y - 1 ) {
					position.y = bounds.y;
				}

			} else {
				yInPlace = true;
			}
			
			// Out of bounds left
			if ( position.x > 0 ) {
				position.x = Mathf.Lerp ( position.x, 0, Time.deltaTime * padding.x );
				xInPlace = false;

				if ( position.x < 1 ) {
					position.x = 0;
				}
			
			// Out of bounds right
			} else if ( position.x < bounds.x ) {
				position.x = Mathf.Lerp ( position.x, bounds.x, Time.deltaTime * padding.x );
				xInPlace = false;

				if ( position.x > bounds.x - 1 ) {
					position.x = bounds.x;
				}
			
			} else {
				xInPlace = true;
			}

			if ( yInPlace && xInPlace ) {
				inPlace = true;
			}

			UpdateChildren();

			yield;
		}
	}

	//////////////////
	// Mouse
	//////////////////
	override function OnMouseDrag () {
		if ( !isDraggable ) { return; }

		var drag : Vector2;
		var amount : Vector2;
		drag.x = Input.GetAxis ( "Mouse X" ); 
		drag.y = Input.GetAxis ( "Mouse Y" );
		
		amount.x = Mathf.Floor ( drag.x * 20 );
		amount.y = -Mathf.Floor ( drag.y * 20 );
		
		// Elasticity
		if ( position.x + amount.x > 0 || position.x + amount.x < bounds.x ) {
			amount.x *= elasticity / 100;
		} 

		if ( position.y + amount.y > 0 || position.y + amount.y < bounds.y ) {
			amount.y *= elasticity / 100;
		} 
		
		position.x += amount.x;
		position.y += amount.y;

	}

	override function OnMouseCancel () {
		StartCoroutine ( SnapBack () );
	
		GetRoot().ReleaseWidget ();
	}

	override function OnMouseUp () {
		StartCoroutine ( SnapBack () );
	
		GetRoot().ReleaseWidget ();
	}

	override function OnMouseOver () {
		var amount : Vector2;
		var scroll : float = Input.GetAxis ( "Mouse ScrollWheel" );

		if ( scroll > 0 && inPlace ) {
			if ( Input.GetKey ( KeyCode.LeftShift ) ) {
				if ( position.x > bounds.x ) {
					amount.x = -20;
				}
			} else {
				if ( position.y < 0 ) {
					amount.y = 20;
				}
			}
		
		} else if ( scroll < 0 && inPlace ) {
			if ( Input.GetKey ( KeyCode.LeftShift ) ) {
				if ( position.x < 0 ) {
					amount.x = 20;
				}
			} else {
				if ( position.y > bounds.y ) {
					amount.y = -20;
				}
			}
		}

		position += amount;

		UpdateChildren ();	
	}

	override function UpdateWidget () {
		isSelectable = true;
		
		mouseRct = drawRct;

		// Reset scale	
		this.transform.localScale = Vector3.one;
		
		// Update all widgets in scroll view
		UpdateChildren ();
	}
	
	override function DrawSkin () {
		OGDrawHelper.DrawSprite ( drawRct, drawCrd, drawDepth - 10 );
	}
}
