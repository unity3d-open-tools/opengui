using UnityEngine;
using System.Collections;

public enum RelativeX {
	None,
	Left,
	Center,
	Right,
	Factor
}
	
public enum RelativeY {
	None,
	Top,
	Center,
	Bottom,
	Factor
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

public class OGWidget : MonoBehaviour {
	[System.Serializable]
	public class Stretch {
		public ScreenSize width = ScreenSize.None;
		public float widthFactor = 1.0f;
		public float widthOffset = 0.0f;
		
		public ScreenSize height = ScreenSize.None;
		public float heightFactor = 1.0f;
		public float heightOffset = 0.0f;
	}
	
	[System.Serializable]
	public class Pivot {
		public RelativeX x;
		public RelativeY y;
	}
	
	[System.Serializable]
	public class Anchor {		
		public RelativeX x = RelativeX.None;
		public float xOffset = 0.0f;
		public float xFactor = 0.0f;
		
		public RelativeY y = RelativeY.None;
		public float yOffset = 0.0f;
		public float yFactor = 0.0f;
	}

	public OGRoot root;
	public bool isDrawn = true;
	public bool isDisabled = false;
	public bool isSelectable = false;
	public bool isDraggable = false;
	public bool resetAfterDrag = false;
	public Color tint = Color.white;
	public Pivot pivot = new Pivot();
	public Anchor anchor = new Anchor();	
	public Stretch stretch = new Stretch();
	public OGWidget clipTo;
	
	[HideInInspector] public OGStyleSet styles = new OGStyleSet();
	[HideInInspector] public OGStyle currentStyle;
	[HideInInspector] public Rect drawCrd;
	[HideInInspector] public Rect drawRct;
	[HideInInspector] public Rect mouseRct;
	[HideInInspector] public float drawDepth;
	[HideInInspector] public Vector3 scrollOffset;
	[HideInInspector] public Vector3 dragOffset;
	[HideInInspector] public Vector3 dragOrigPos;
	[HideInInspector] public Vector3 offset;
	[HideInInspector] public bool hidden = false;
	[HideInInspector] public bool outOfBounds = false;
	[HideInInspector] public bool isDirty = false;
	[HideInInspector] public bool isAlwaysOnTop = false;
	
	//////////////////
	// Calculations
	//////////////////
	// Convert to enum
	public OGWidgetType ToEnum () {
		return OGSkin.GetWidgetEnum ( this );
	}

	// Get scaled rect
	public Rect scaledRct {
		get {
			Rect result = drawRct;

			OGRoot root = OGRoot.GetInstance ();

			if ( root ) {
				result.x *= root.ratio.x;
				result.width *= root.ratio.x;
				result.y *= root.ratio.y;
				result.height *= root.ratio.y;
			}

			return result;
		}
	}

	// Find child
	public GameObject FindChild ( string n ) {
		for ( int i = 0; i < this.transform.childCount; i++ ) {
			if ( this.transform.GetChild ( i ).gameObject.name == n ) {
				return this.transform.GetChild ( i ).gameObject;
			}
		}
	
		return null;
	}

	// Combine rects
	public Rect CombineRects ( Rect a, Rect b ) {
		Rect result = new Rect ( 0, 0, 0, 0 );
		
		result.x = ( a.x < b.x ) ? a.x : b.x;
		result.y = ( a.y < b.y ) ? a.y : b.y;
		result.xMax = ( a.xMax > b.xMax ) ? a.xMax : b.xMax;
		result.yMax = ( a.yMax > b.yMax ) ? a.yMax : b.yMax;

		return result;
	}

	// Check mouseover
	public bool CheckMouseOver () {
		if ( mouseRct != new Rect (0,0,0,0) ) {
			return CheckMouseOver ( mouseRct );
		} else {
			return false;
		}	
	}
	
	public bool CheckMouseOver ( Rect rect ) {
		if ( !root ) {
			root = OGRoot.GetInstance();
		}	
		
		Vector2 pos = new Vector2 ( Input.mousePosition.x * root.reverseRatio.x, Input.mousePosition.y * root.reverseRatio.y );

		if ( SystemInfo.deviceType == DeviceType.Handheld && Input.touchCount == 0 ) {
			return false;
		}

		return rect.Contains ( pos );
	}
	
	public bool CheckMouseOver ( Rect rect1, Rect rect2 ) {
		return CheckMouseOver ( rect1 ) || CheckMouseOver ( rect2 );
	}
	
	// Scale (based on screen size)
	public Vector3 RecalcScale () {
		CalcStretch ();
		
		OGScrollView scrollView = this as OGScrollView;

		if ( scrollView ) {
			return new Vector3 ( scrollView.size.x, scrollView.size.y, 1 );
		} else {
			return this.transform.lossyScale;
		}
	}
	
	// Position (based on screen size and flipped vertically because of OpenGL)
	public Vector3 RecalcPosition () {
		CalcAnchor ();
		CalcPivot ();
		
		Vector3 newPos = this.transform.position;
		OGScrollView scrollView = this as OGScrollView;
		
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
	private void CalcStretch () {
		if ( stretch == null ) { return; }
		
		Vector3 newScale = this.transform.localScale;
		OGScrollView scrollView = this as OGScrollView;

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
	private void CalcAnchor () {
		if ( anchor == null ) { return; }
		
		Vector3 newPos = this.transform.position;
		
		if ( anchor.x != RelativeX.None ) {
			if ( anchor.x == RelativeX.Left ) {
				anchor.xFactor = 0f;
			} else if ( anchor.x == RelativeX.Center ) {
				anchor.xFactor = 0.5f;
			} else if ( anchor.x == RelativeX.Right ) {
				anchor.xFactor = 1f;
			}
			
			newPos.x = (root.screenWidth * anchor.xFactor) + anchor.xOffset;
		}
		
		if ( anchor.y != RelativeY.None ) {
			if ( anchor.y == RelativeY.Top ) {
				anchor.yFactor = 0f;
			} else if ( anchor.y == RelativeY.Center ) {
				anchor.yFactor = 0.5f;
			} else if ( anchor.y == RelativeY.Bottom ) {
				anchor.yFactor = 1f;
			}
			
			newPos.y = (root.screenHeight * anchor.yFactor) + anchor.yOffset;
		}

		this.transform.position = newPos;
	}
	
	// Pivot (based on object size)
	private void CalcPivot () {
		Vector2 scale;
		OGScrollView scrollview = this as OGScrollView; 
		
		if ( scrollview ) {
			scale = scrollview.size;
		} else {
			scale.x = this.transform.lossyScale.x;
			scale.y = this.transform.lossyScale.y;
		}

		switch ( pivot.y ) {
			case RelativeY.Top: case RelativeY.None:
				offset.y = 0;
				break;
								
			case RelativeY.Center:
				offset.y = -scale.y/2;
				break;
				
			case RelativeY.Bottom:
				offset.y = -scale.y;
				break;
		}
		
		switch ( pivot.x ) {	
			case RelativeX.Right:
				offset.x = -scale.x;
				break;
						
			case RelativeX.Center:	
				offset.x = -scale.x/2;
				break;
			
			case RelativeX.Left: case RelativeX.None:
				offset.x = 0;
				break;
		}
	}
	
	// Apply all calculations
	public void Recalculate () {
		if ( !root ) { return; }
		
		OGTexture texture = this as OGTexture;
		Vector3 drawScl = RecalcScale ();
		Vector3 drawPos = RecalcPosition ();
		
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
	public void Awake () {
		root = OGRoot.GetInstance ();
	}
	
	public void Start () {
		Recalculate ();
	}


	//////////////////
	// Mouse
	//////////////////
	public virtual void OnMouseDown () {}
	public virtual void OnMouseUp () {}
	public virtual void OnMouseOver () {}
	public virtual void OnMouseDrag () {}
	public virtual void OnMouseCancel () {}
	

	//////////////////
	// Update
	//////////////////
	public virtual void UpdateWidget () {} 
	public void ApplyDefaultStyles () {
		if ( !root ) {
			root = OGRoot.GetInstance();
		}
		
		OGSkin skin = root.skin;
		
		if ( !skin ) {
			Debug.LogWarning ( "OpenGUI | No OGSkin attached to OGRoot" );
		} else {
			skin.ApplyDefaultStyles ( this );
		}
	}


	//////////////////
	// Draw
	//////////////////
	public virtual void DrawGL () {}
	public virtual void DrawLine () {}
	public virtual void DrawSkin () {}
	public virtual void DrawText () {}
}
