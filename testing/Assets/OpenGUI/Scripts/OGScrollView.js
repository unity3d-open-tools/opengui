#pragma strict

public class OGScrollView extends OGWidget {
	public var scrollWindow : Vector2;
	public var scrollPosition : Vector2;
	public var padding : Vector2 = new Vector2 ( 10, 10 );
	public var elasticity : float = 2;

	override function UpdateWidget () {
		if ( stretch.width != ScreenSize.None ) {
			scrollWindow.x = RecalcScale().x * Screen.width;
		}

		if ( stretch.height != ScreenSize.None ) {
			scrollWindow.y = RecalcScale().y * Screen.height;
		}
	
		this.transform.localScale = Vector3.one;
		
		var scroll : float = Input.GetAxis ( "Mouse ScrollWheel" );
		var drag : Vector2;
		drag.x = Input.GetAxis ( "Mouse X" ); 
		drag.y = Input.GetAxis ( "Mouse Y" );
		
		if ( CheckMouseOver ( drawRct ) ) {
			var amount : Vector2;
			
			if ( scroll > 0 ) {
				amount.y = 20;
			
			} else if ( scroll < 0 ) {
				amount.y = -20;
			
			// Drag	
			} else if ( Input.GetMouseButton ( 2 ) ) {
				amount.x = Mathf.Floor ( drag.x * 20 );
				amount.y = -Mathf.Floor ( drag.y * 20 );
			}
			
			if ( scrollPosition.x + amount.x < padding.x * elasticity ) {
				scrollPosition.x += amount.x;
			}	

			if ( scrollPosition.y + amount.y < padding.x * elasticity ) {
				scrollPosition.y += amount.y;
			}	
		}
		
		for ( var w : OGWidget in this.gameObject.GetComponentsInChildren.<OGWidget>() ) {
			if ( w != this ) {
				w.scrollOffset = new Vector3 ( padding.x + scrollPosition.x, padding.y + scrollPosition.y, 0 );
				w.drawDepth -= drawDepth;
				w.clipRct = drawRct;
			}
		}

		// Snap back
		if ( !Input.GetMouseButton ( 2 ) ) {
			if ( scrollPosition.y > 0 ) {
				scrollPosition.y = Mathf.Lerp ( scrollPosition.y, 0, Time.deltaTime * padding.y );
			}
			
			if ( scrollPosition.x > 0 ) {
				scrollPosition.x = Mathf.Lerp ( scrollPosition.x, 0, Time.deltaTime * padding.x );
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
