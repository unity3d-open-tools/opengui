#pragma strict

public class OGScrollView extends OGWidget {
	public var scrollWindow : Vector2;
	public var scrollPosition : Vector2;
	public var padding : Vector2 = new Vector2 ( 10, 10 );
	public var elasticity : float = 2;

	private var dragging : boolean = false;

	override function UpdateWidget () {
		if ( stretch.width != ScreenSize.None ) {
			scrollWindow.x = RecalcScale().x * Screen.width;
		}

		if ( stretch.height != ScreenSize.None ) {
			scrollWindow.y = RecalcScale().y * Screen.height;
		}

		// Reset scale	
		this.transform.localScale = Vector3.one;
		
		// Scrolling
		var drag : Vector2;
		var amount : Vector2;
		drag.x = Input.GetAxis ( "Mouse X" ); 
		drag.y = Input.GetAxis ( "Mouse Y" );
	
		// ^ Scroll wheel	
		if ( CheckMouseOver ( drawRct ) ) {
			var scroll : float = Input.GetAxis ( "Mouse ScrollWheel" );

			if ( scroll > 0 ) {
				amount.y = 20;
			
			} else if ( scroll < 0 ) {
				amount.y = -20;
			}	
		
			if ( Input.GetMouseButtonDown ( 2 ) ) {
				dragging = true;
			}
		}
		
		// ^ Drag
		if ( dragging ) { 	
			if ( Input.GetMouseButton ( 2 ) ) {
				amount.x = Mathf.Floor ( drag.x * 20 );
				amount.y = -Mathf.Floor ( drag.y * 20 );
			}
			
			if ( Input.GetMouseButtonUp ( 2 ) ) {
				dragging = false;
			}
		
		// ^ Snap back
		} else {
			if ( scrollPosition.y > 0 ) {
				scrollPosition.y = Mathf.Lerp ( scrollPosition.y, 0, Time.deltaTime * padding.y );
			}
			
			if ( scrollPosition.x > 0 ) {
				scrollPosition.x = Mathf.Lerp ( scrollPosition.x, 0, Time.deltaTime * padding.x );
			}
		}	

		// ^ Elasticity
		if ( scrollPosition.x + amount.x < padding.x * elasticity ) {
			scrollPosition.x += amount.x / Mathf.Clamp ( scrollPosition.x, 1, padding.x * elasticity );
		}

		if ( scrollPosition.y + amount.y < padding.x * elasticity ) {
			scrollPosition.y += amount.y / Mathf.Clamp ( scrollPosition.y, 1, padding.y * elasticity );;
		}	
		
		
		// Update all widgets
		for ( var w : OGWidget in this.gameObject.GetComponentsInChildren.<OGWidget>() ) {
			if ( w != this ) {
				w.scrollOffset = new Vector3 ( padding.x + scrollPosition.x, padding.y + scrollPosition.y, 0 );
				w.drawDepth -= drawDepth;
				w.clipRct = drawRct;
			}
		}

	}
	
	override function DrawGL () {
		GL.TexCoord2 ( drawCrd.x, drawCrd.y );
		GL.Vertex3 ( drawRct.x, drawRct.y, -this.transform.position.z );
		
		GL.TexCoord2 ( drawCrd.x, drawCrd.y + drawCrd.height );
		GL.Vertex3 ( drawRct.x, drawRct.y + drawRct.height, -this.transform.position.z );
		
		GL.TexCoord2 ( drawCrd.x + drawCrd.width, drawCrd.y + drawCrd.height );
		GL.Vertex3 ( drawRct.x + drawRct.width, drawRct.y + drawRct.height, -this.transform.position.z );
		
		GL.TexCoord2 ( drawCrd.x + drawCrd.width, drawCrd.y );
		GL.Vertex3 ( drawRct.x + drawRct.width, drawRct.y, -this.transform.position.z );
	}
}
