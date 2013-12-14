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
	public var isDraggable : boolean = false;
	public var pivot : Pivot = new Pivot();
	public var anchor : Anchor = new Anchor();	
	public var stretch : Stretch = new Stretch();
	
	@HideInInspector public var styles : OGWidgetStyles = new OGWidgetStyles();
	@HideInInspector public var drawCrd : Rect;
	@HideInInspector public var drawRct : Rect;
	@HideInInspector public var clipRct : Rect;
	@HideInInspector public var mouseRct : Rect;
	@HideInInspector public var drawDepth : float;
	@HideInInspector public var scrollOffset : Vector3;
	@HideInInspector public var dragOffset : Vector3;
	@HideInInspector public var offset : Vector3;
	@HideInInspector public var hidden : boolean = false;
	@HideInInspector public var disabled : boolean = false;
	@HideInInspector public var selectable : boolean = false;
	@HideInInspector public var outOfBounds : boolean = false;
	@HideInInspector public var isDirty : boolean = false;
	@HideInInspector public var root : OGRoot;
	
	// TODO: Deprecate
	@HideInInspector public var styleName : String;
	
	
	//////////////////
	// Calculations
	//////////////////
	// Find child
	public function FindChild ( n : String ) : GameObject {
		for ( var i : int = 0; i < this.transform.childCount; i++ ) {
			if ( this.transform.GetChild ( i ).gameObject.name == n ) {
				return this.transform.GetChild ( i ).gameObject;
			}
		}
	
		return null;
	}

	// Combine rects
	public function CombineRects ( a : Rect, b : Rect ) : Rect {
		var result : Rect = new Rect ( 0, 0, 0, 0 );
		
		result.x = ( a.x < b.x ) ? a.x : b.x;
		result.y = ( a.y < b.y ) ? a.y : b.y;
		result.xMax = ( a.xMax > b.xMax ) ? a.xMax : b.xMax;
		result.yMax = ( a.yMax > b.yMax ) ? a.yMax : b.yMax;

		return result;
	}

	// Check mouseover
	public function CheckMouseOver () : boolean {
		if ( mouseRct != null ) {
			return CheckMouseOver ( mouseRct );
		} else {
			return false;
		}	
	}
	
	public function CheckMouseOver ( rect : Rect ) : boolean {
		var x : float = Input.mousePosition.x;
		var y : float = Input.mousePosition.y;
		
		return x > rect.x && y > rect.y && y < rect.y + rect.height && x < rect.x + rect.width;
	}
	
	public function CheckMouseOver ( rect1 : Rect, rect2 : Rect ) : boolean {
		return CheckMouseOver ( rect1 ) || CheckMouseOver ( rect2 );
	}
	
	// Coordinates (based on texture size)
	private function RecalcCoords ( coords : Rect ) : Rect {
		if ( this.GetComponent(OGTexture) ) {
			coords.x = 0;
			coords.y = 0;
			coords.width = 1;
			coords.height = 1;

		} else if ( root ) {
			coords.x /= root.texWidth;
			coords.y /= root.texHeight;
			coords.width /= root.texWidth;
			coords.height /= root.texHeight;
		}


		return coords;
	}
		
	// Scale (based on screen size)
	public function RecalcScale () : Vector3 {
		CalcStretch ();
		
		return this.transform.lossyScale;
	}
	
	// Position (based on screen size)
	public function RecalcPosition () : Vector3 {
		CalcAnchor ();
		CalcPivot ();
		
		var newPos : Vector3 = this.transform.position;
		
		newPos += offset;
		newPos += scrollOffset;
		
		newPos.y += this.transform.lossyScale.y;
								
		newPos.y = Screen.height - newPos.y;
		
		return newPos;
	}
	
	// Stretch (based on screen size)
	private function CalcStretch () {
		if ( !stretch ) { return; }
		
		var newScale : Vector3 = this.transform.localScale;
		if ( this.GetComponent(OGScrollView) ) {
			newScale.x = this.GetComponent(OGScrollView).size.x;
			newScale.y = this.GetComponent(OGScrollView).size.y;
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
			newPos.x = ( Screen.width / 2 ) + anchor.xOffset;
		} else if ( anchor.x == RelativeX.Right ) {
			newPos.x = Screen.width + anchor.xOffset;
		}
		
		if ( anchor.y == RelativeY.Center ) {
			newPos.y = ( Screen.height / 2 ) + anchor.yOffset;
		} else if ( anchor.y == RelativeY.Bottom ) {
			newPos.y = Screen.height + anchor.yOffset;
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
	
	// Calculate clipping
	private function CalcClipping () {
		var shouldClip : boolean = clipRct.width > 0 && clipRct.height > 0;

		if ( shouldClip ) {
			var leftClip : float = Mathf.Clamp ( clipRct.x - drawRct.x, 0, float.PositiveInfinity );
			var rightClip : float = Mathf.Clamp ( ( drawRct.x + drawRct.width ) - ( clipRct.x + clipRct.width ), 0, float.PositiveInfinity );
			var bottomClip : float = Mathf.Clamp ( clipRct.y - drawRct.y, 0, float.PositiveInfinity );
			var topClip : float = Mathf.Clamp ( ( drawRct.y + drawRct.height ) - ( clipRct.y + clipRct.height ), 0, float.PositiveInfinity );
		
			drawRct.x = drawRct.x + leftClip - rightClip;
			drawRct.width = drawRct.width - leftClip - rightClip;	
			drawRct.y = drawRct.y + bottomClip;
			drawRct.height = drawRct.height - topClip - bottomClip;	
		
			isDrawn = drawRct.height > 0 && drawRct.width > 0;
		}
	}
	
	
	// Apply all calculations
	public function Recalculate () {
		if ( !styles.basic ) { return; }
		
		var drawScl : Vector3 = RecalcScale ();
		var drawPos : Vector3 = RecalcPosition ();
		drawCrd = RecalcCoords ( styles.basic.coordinates );
		drawDepth = -this.transform.position.z;
			
		drawRct = new Rect ( drawPos.x, drawPos.y, drawScl.x, drawScl.y );
		//CalcClipping ();	

		scrollOffset = Vector3.zero;	
	}	

	
	//////////////////
	// Returns
	//////////////////
	public function GetRoot () : OGRoot {
		if ( !root ) {
			root = GameObject.FindObjectOfType.<OGRoot>();
		}
		
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
	public function OnEnable () {
		SetDirty();
	}
	public function OnDisable () {
		SetDirty();
	}
	public function UpdateWidget () {} 
	public function GetDefaultStyles () {
		GetRoot().skin.GetDefaultStyles ( this );
	}
	public function SetDirty () {
		if ( GetRoot() ) {
			GetRoot().SetDirty();
		}
	}

	//////////////////
	// Draw
	//////////////////
	public function DrawGL () {}
}
