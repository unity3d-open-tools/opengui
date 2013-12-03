#pragma strict

public enum RelativeX {
	Left,
	Center,
	Right
}
	
public enum RelativeY {
	Top,
	Center,
	Bottom
}

public enum ScreenSize {
	None,
	ScreenWidth,
	ScreenHeight
}

public class OGWidget extends MonoBehaviour {
	public class Stretch {
		public var width : ScreenSize = ScreenSize.None;
		public var widthFactor : float = 1.0;
		public var widthOffset : float = 0.0;
		
		public var height : ScreenSize = ScreenSize.None;
		public var heightFactor : float = 1.0;
		public var heightOffset : float = 0.0;
	}
	
	public class Pivot {
		public var x : RelativeX;
		public var y : RelativeY;
	}
	
	public class Anchor {		
		public var x : RelativeX = RelativeX.Left;
		public var xOffset : float = 0.0;
		
		public var y : RelativeY = RelativeY.Top;
		public var yOffset : float = 0.0;
	}
	
	public var isDrawn : boolean = true;
	public var pivot : Pivot = new Pivot();
	public var anchor : Anchor = new Anchor();	
	public var stretch : Stretch = new Stretch();
		
	@HideInInspector public var style : OGStyle;
	@HideInInspector public var drawPos : Vector3;
	@HideInInspector public var drawScl : Vector3;
	@HideInInspector public var drawCrd : Rect;
	@HideInInspector public var drawRct : Rect;
	@HideInInspector public var drawDepth : float;
	@HideInInspector public var mouseOver : boolean = false;
	@HideInInspector public var scrollOffset : Vector3;
	@HideInInspector public var offset : Vector3;
	@HideInInspector public var clipping : Vector2;
	@HideInInspector public var hidden : boolean = false;
	@HideInInspector public var root : OGRoot;
	
	
	//////////////////
	// Calculations
	//////////////////
	// Check mouseover
	public function CheckMouseOver ( rect : Rect ) : boolean {
		var x : float = Input.mousePosition.x / Screen.width;
		var y : float = Input.mousePosition.y / Screen.height;
		
		return x > rect.x && y > rect.y && y < rect.y + rect.height && x < rect.x + rect.width;
	}
	
	public function CheckMouseOver ( rect1 : Rect, rect2 : Rect ) : boolean {
		return CheckMouseOver ( rect1 ) || CheckMouseOver ( rect2 );
	}
	
	// Coordinates (based on texture size)
	private function RecalcCoords ( coords : Rect ) : Rect {
		coords.x /= 256;
		coords.y /= 144;
		coords.width /= 256;
		coords.height /= 144;
		
		return coords;
	}
		
	// Scale (based on screen size)
	public function RecalcScale () : Vector3 {
		CalcStretch ();
		
		var newScl : Vector3 = this.transform.lossyScale;
		
		newScl.x = newScl.x / Screen.width;
		newScl.y = newScl.y / Screen.height;
		
		return newScl;
	}
	
	// Position (based on screen size)
	private function RecalcPosition () : Vector3 {
		CalcAnchor ();
		CalcPivot ();
		
		var newPos : Vector3 = this.transform.position;
		
		newPos += offset;
		newPos += scrollOffset;
		scrollOffset = Vector3.zero;	
	
		newPos.y += this.transform.lossyScale.y;
								
		newPos.x = newPos.x / Screen.width;
		newPos.y = ( Screen.height - newPos.y ) / Screen.height;
		
		return newPos;
	}
	
	// Stretch (based on screen size)
	private function CalcStretch () {
		if ( !stretch ) { return; }
		
		var newScale : Vector3 = this.transform.localScale;
		if ( this.GetComponent(OGScrollView) ) {
			newScale.x = this.GetComponent(OGScrollView).scrollWindow.x;
			newScale.y = this.GetComponent(OGScrollView).scrollWindow.y;
		}
		
		if ( stretch.width == ScreenSize.ScreenWidth ) {
			newScale.x = ( Screen.width * stretch.widthFactor ) + stretch.widthOffset;
		} else if ( stretch.width == ScreenSize.ScreenHeight ) {
			newScale.x = ( Screen.height * stretch.widthFactor ) + stretch.widthOffset;
		}
		
		if ( stretch.height == ScreenSize.ScreenWidth ) {
			newScale.y = ( Screen.width * stretch.heightFactor ) + stretch.heightOffset;
		} else if ( stretch.height == ScreenSize.ScreenHeight ) {
			newScale.y = ( Screen.height * stretch.heightFactor ) + stretch.heightOffset;
		}
		
		this.transform.localScale = newScale;
	}
	
	// Anchor (based on screen size)
	private function CalcAnchor () {
		if ( !anchor ) { return; }
		
		var newPos : Vector3 = this.transform.position;
		
		if ( anchor.x == RelativeX.Center ) {
			newPos.x = Screen.width / 2;
		} else if ( anchor.x == RelativeX.Right ) {
			newPos.x = Screen.width;
		}
		
		if ( anchor.y == RelativeY.Center ) {
			newPos.y = Screen.height / 2;
		} else if ( anchor.y == RelativeY.Bottom ) {
			newPos.y = Screen.height;
		}

		this.transform.position = newPos;
	}
	
	// Pivot (based on object size)
	private function CalcPivot () {
		switch ( pivot.y ) {
			case RelativeY.Top:
				offset.y = 0;
				break;
								
			case RelativeY.Center:
				offset.y = -this.transform.lossyScale.y/2;
				break;
				
			case RelativeY.Bottom:
				offset.y = -this.transform.lossyScale.y;
				break;
		}
		
		switch ( pivot.x ) {	
			case RelativeX.Right:
				offset.x = -this.transform.lossyScale.x;
				break;
						
			case RelativeX.Center:	
				offset.x = -this.transform.lossyScale.x/2;
				break;
			
			case RelativeX.Left:	
				offset.x = 0;
				break;
		}
	}
	
	// Apply all calculations
	public function Recalculate () {
		if ( !style ) { return; }
		
		drawScl = RecalcScale ();
		drawPos = RecalcPosition ();
		drawCrd = RecalcCoords ( style.coordinates );
		drawDepth = -this.transform.position.z;
			
		drawRct = new Rect ( drawPos.x, drawPos.y, drawScl.x, drawScl.y );
	}	

	
	//////////////////
	// Returns
	//////////////////
	public function GetRoot () : OGRoot {
		return root;
	}
	
	
	//////////////////
	// Mouse
	//////////////////
	public function OnMouseDown () {};
	public function OnMouseUp () {};
	public function OnMouseOver () {};
	public function OnMouseDrag () {};
	public function OnMouseCancel () {};
	
	
	//////////////////
	// Update
	//////////////////
	public function UpdateWidget () {} 
	
	
	//////////////////
	// Draw
	//////////////////
	public function DrawGL () {}
	public function DrawGUI () {}
}
