#pragma strict

public enum RelativeX {
	None,
	Left,
	Center,
	Right
}
	
public enum RelativeY {
	None,
	Top,
	Center,
	Bottom
}

public enum ScreenSize {
	None,
	ScreenWidth,
	ScreenHeight
}

public enum ButtonAction {
	OnRelease,
	OnPress,
	OnHover
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
		public var x : RelativeX = RelativeX.None;
		public var xOffset : float = 0.0;
		
		public var y : RelativeY = RelativeY.None;
		public var yOffset : float = 0.0;
	}

	public var root : OGRoot;
	public var isDrawn : boolean = true;
	public var isDisabled : boolean = false;
	public var isSelectable : boolean = false;
	public var isDraggable : boolean = false;
	public var resetAfterDrag : boolean = false;
	public var tint : Color = Color.white;
	public var pivot : Pivot = new Pivot();
	public var anchor : Anchor = new Anchor();	
	public var stretch : Stretch = new Stretch();
	public var clipTo : OGWidget;
	
	@HideInInspector public var styles : OGStyleSet = new OGStyleSet();
	@HideInInspector public var currentStyle : OGStyle;
	@HideInInspector public var drawCrd : Rect;
	@HideInInspector public var drawRct : Rect;
	@HideInInspector public var mouseRct : Rect;
	@HideInInspector public var drawDepth : float;
	@HideInInspector public var scrollOffset : Vector3;
	@HideInInspector public var dragOffset : Vector3;
	@HideInInspector public var dragOrigPos : Vector3;
	@HideInInspector public var offset : Vector3;
	@HideInInspector public var hidden : boolean = false;
	@HideInInspector public var outOfBounds : boolean = false;
	@HideInInspector public var isDirty : boolean = false;
	@HideInInspector public var isAlwaysOnTop : boolean = false;
	
	//////////////////
	// Calculations
	//////////////////
	// Convert to enum
	public function ToEnum () : OGWidgetType {
		return OGSkin.GetWidgetEnum ( this );
	}

	// Get scaled rect
	public function get scaledRct () : Rect {
		var result : Rect = drawRct;

		var root : OGRoot = OGRoot.GetInstance ();

		if ( root ) {
			result.x *= root.ratio.x;
			result.width *= root.ratio.x;
			result.y *= root.ratio.y;
			result.height *= root.ratio.y;
		}

		return result;
	}

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
		if ( !root ) {
			root = OGRoot.GetInstance();
		}	
		
		var pos : Vector2 = new Vector2 ( Input.mousePosition.x * root.reverseRatio.x, Input.mousePosition.y * root.reverseRatio.y );

		if ( SystemInfo.deviceType == DeviceType.Handheld && Input.touchCount == 0 ) {
			return false;
		}

		return rect.Contains ( pos );
	}
	
	public function CheckMouseOver ( rect1 : Rect, rect2 : Rect ) : boolean {
		return CheckMouseOver ( rect1 ) || CheckMouseOver ( rect2 );
	}
	
	// Scale (based on screen size)
	public function RecalcScale () : Vector3 {
		CalcStretch ();
		
		var scrollView : OGScrollView = this as OGScrollView;

		if ( scrollView ) {
			return new Vector3 ( scrollView.size.x, scrollView.size.y, 1 );
		} else {
			return this.transform.lossyScale;
		}
	}
	
	// Position (based on screen size, and flipped vertically because of OpenGL)
	public function RecalcPosition () : Vector3 {
		CalcAnchor ();
		CalcPivot ();
		
		var newPos : Vector3 = this.transform.position;
		var scrollView : OGScrollView = this as OGScrollView;
		
		newPos += offset;
		newPos += scrollOffset;
		
		if ( scrollView ) {
			newPos.y += scrollView.size.y;	
		} else {
			newPos.y += this.transform.lossyScale.y;
		}

		newPos.y = root.screenHeight - newPos.y;
		
		return newPos;
	}
	
	// Stretch (based on screen size)
	private function CalcStretch () {
		if ( !stretch ) { return; }
		
		var newScale : Vector3 = this.transform.localScale;
		var scrollView : OGScrollView = this as OGScrollView;

		if ( scrollView ) {
			newScale.x = scrollView.size.x;
			newScale.y = scrollView.size.y;
		}
		
		if ( stretch.width == ScreenSize.ScreenWidth ) {
			newScale.x = ( root.screenWidth * stretch.widthFactor ) + stretch.widthOffset;
		} else if ( stretch.width == ScreenSize.ScreenHeight ) {
			newScale.x = ( root.screenHeight * stretch.widthFactor ) + stretch.widthOffset;
		}
		
		if ( stretch.height == ScreenSize.ScreenWidth ) {
			newScale.y = ( root.screenWidth * stretch.heightFactor ) + stretch.heightOffset;
		} else if ( stretch.height == ScreenSize.ScreenHeight ) {
			newScale.y = ( root.screenHeight * stretch.heightFactor ) + stretch.heightOffset;
		}
		
		if ( !scrollView ) {
			this.transform.localScale = newScale;
		
		} else {
			scrollView.size.x = newScale.x;
			scrollView.size.y = newScale.y;
		}
	
	}
	
	// Anchor (based on screen size)
	private function CalcAnchor () {
		if ( !anchor ) { return; }
		
		var newPos : Vector3 = this.transform.position;
		
		if ( anchor.x == RelativeX.Left ) {
			newPos.x = anchor.xOffset;
		} else if ( anchor.x == RelativeX.Center ) {
			newPos.x = ( root.screenWidth / 2 ) + anchor.xOffset;
		} else if ( anchor.x == RelativeX.Right ) {
			newPos.x = root.screenWidth + anchor.xOffset;
		}
		
		if ( anchor.y == RelativeY.Top ) {
			newPos.y = anchor.yOffset;
		} else if ( anchor.y == RelativeY.Center ) {
			newPos.y = ( root.screenHeight / 2 ) + anchor.yOffset;
		} else if ( anchor.y == RelativeY.Bottom ) {
			newPos.y = root.screenHeight + anchor.yOffset;
		}

		this.transform.position = newPos;
	}
	
	// Pivot (based on object size)
	private function CalcPivot () {
		switch ( pivot.y ) {
			case RelativeY.Top: case RelativeY.None:
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
			
			case RelativeX.Left: case RelativeX.None:
				offset.x = 0;
				break;
		}
	}
	
	// Apply all calculations
	public function Recalculate () {
		if ( !root ) { return; }
		
		var texture : OGTexture = this as OGTexture;
		var drawScl : Vector3 = RecalcScale ();
		var drawPos : Vector3 = RecalcPosition ();
		
		if ( texture != null ) {
			drawCrd.x = 0;
			drawCrd.y = 0;
			drawCrd.width = 1;
			drawCrd.height = 1;
		
		} else if ( currentStyle != null ) {
			drawCrd = currentStyle.coordinates;
		
		} else if ( styles.basic != null ) {
			drawCrd = styles.basic.coordinates;
		}

		if ( isAlwaysOnTop ) {
			drawDepth = 0;
		} else {
			drawDepth = -this.transform.position.z;
		}

		drawRct = new Rect ( drawPos.x, drawPos.y, drawScl.x, drawScl.y );
	}	

	
	//////////////////
	// Init
	//////////////////
	public function Awake () {
		root = OGRoot.GetInstance ();
	}
	
	public function Start () {
		Recalculate ();
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
	public function ApplyDefaultStyles () {
		var skin : OGSkin = root.skin;
		
		if ( !skin ) {
			Debug.LogWarning ( "OpenGUI | No OGSkin attached to OGRoot" );
		} else {
			skin.ApplyDefaultStyles ( this );
		}
	}


	//////////////////
	// Draw
	//////////////////
	public function DrawGL () {}
	public function DrawLine () {}
	public function DrawSkin () {}
	public function DrawText () {}
}
