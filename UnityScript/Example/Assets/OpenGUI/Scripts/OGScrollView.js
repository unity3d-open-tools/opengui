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

	////////////////
	// Update
	////////////////
	private function UpdateChildren () {
		if ( !widgets || widgets.Length != this.gameObject.GetComponentsInChildren.<OGWidget>().Length ) {
			widgets = this.gameObject.GetComponentsInChildren.<OGWidget>();
		}

		for ( var i : int = 0; i < widgets.Length; i++ ) {
			var w : OGWidget = widgets[i];
			
			if ( w != null && w != this ) {
				w.scrollOffset = new Vector3 ( padding.x + position.x, padding.y + position.y, 0 );
				w.anchor.x = RelativeX.None;
				w.anchor.y = RelativeY.None;
			}
		}
	}

	private function SnapBack () : IEnumerator {
		var inPlace : boolean = false;
		
		while ( !inPlace ) {
			if ( position.y > 0 ) {
				position.y = Mathf.Lerp ( position.y, 0, Time.deltaTime * padding.y );
				inPlace = false;

				if ( position.y < 1 ) {
					position.y = 0;
				}

			} else {
				inPlace = true;
			}
			
			if ( position.x > 0 ) {
				position.x = Mathf.Lerp ( position.x, 0, Time.deltaTime * padding.x );
				inPlace = false;

				if ( position.x < 1 ) {
					position.x = 0;
				}

			} else {
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
		
		// ^ Elasticity
		if ( position.x + amount.x < padding.x * elasticity ) {
			position.x += amount.x / Mathf.Clamp ( position.x, 1, padding.x * elasticity );
		}

		if ( position.y + amount.y < padding.x * elasticity ) {
			position.y += amount.y / Mathf.Clamp ( position.y, 1, padding.y * elasticity );;
		}	
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

		if ( scroll > 0 ) {
			if ( Input.GetKey ( KeyCode.LeftShift ) ) {
				amount.x = 20;
			} else {
				amount.y = 20;
			}
		
		} else if ( scroll < 0 ) {
			if ( Input.GetKey ( KeyCode.LeftShift ) ) {
				amount.x = -20;
			} else {
				amount.y = -20;
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
