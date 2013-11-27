using UnityEngine;
using System.Collections;

[ExecuteInEditMode]
[AddComponentMenu ("OpenGUI/Widget")]
public class OGWidget : MonoBehaviour {

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
		
		public RelativeY y = RelativeY.None;
		public float yOffset = 0.0f;
	}
	
	public string style = "";
	public Pivot pivot = new Pivot();
	public Anchor anchor = new Anchor();	
	public Stretch stretch = new Stretch();
	
	[HideInInspector] public Vector2 adjustPivot = Vector2.zero;				
	[HideInInspector] public bool manualDraw = false;
	[HideInInspector] public bool mouseOver = false;
	[HideInInspector] public Rect colliderRect;
	[HideInInspector] public GUIStyle guiStyle;
	[HideInInspector] public OGRoot root;
	
	void SetX (  float x   ){
		transform.localPosition = new Vector3 ( x, transform.localPosition.y, transform.localPosition.z );
	}
	
	void SetY (  float y   ){
		transform.localPosition = new Vector3 ( transform.localPosition.x, y, transform.localPosition.z );
	}
	
	void SetWidth (  float w   ){
		transform.localScale = new Vector3 ( w, transform.localScale.y, 1.0f );
	}
	
	void SetHeight (  float h   ){
		transform.localScale = new Vector3 ( transform.localScale.x, h, 1.0f );
	}
	
	GUIStyle CheckStyle (  GUISkin skin   ){
		if ( skin.FindStyle ( style ) != null && style != "" ) {
			return skin.FindStyle ( style );
		} else {
			return null;
		}
	}
	
	// Apply stretch
	void ApplyStretch (){
		if ( stretch == null ) { return; }
		
		var modify_width= transform.localScale.x;
		var modify_height= transform.localScale.y;
		
		if ( stretch.width == ScreenSize.ScreenWidth ) {
			modify_width = ( Screen.width * stretch.widthFactor ) + stretch.widthOffset;
		} else if ( stretch.width == ScreenSize.ScreenHeight ) {
			modify_width = ( Screen.height * stretch.widthFactor ) + stretch.widthOffset;
		}
		
		if ( stretch.height == ScreenSize.ScreenWidth ) {
			modify_height = ( Screen.width * stretch.heightFactor ) + stretch.heightOffset;
		} else if ( stretch.height == ScreenSize.ScreenHeight ) {
			modify_height = ( Screen.height * stretch.heightFactor ) + stretch.heightOffset;
		}
		
		if ( stretch.width != ScreenSize.None ) { SetWidth ( modify_width ); }
		if ( stretch.height != ScreenSize.None ) { SetHeight ( modify_height ); }
	}
	
	// Apply the anchor position
	void ApplyAnchor (){
		if ( anchor == null ) { return; }
		
		float anchor_x = 0;
		float anchor_y = 0;
		
		if ( anchor.x == RelativeX.Center ) {
			anchor_x = Screen.width / 2;
		} else if ( anchor.x == RelativeX.Right ) {
			anchor_x = Screen.width;
		}
		
		if ( anchor.y == RelativeY.Center ) {
			anchor_y = Screen.height / 2;
		} else if ( anchor.y == RelativeY.Bottom ) {
			anchor_y = Screen.height;
		}

		if ( anchor.x != RelativeX.None ) { SetX ( anchor_x + anchor.xOffset ); }
		if ( anchor.y != RelativeY.None ) { SetY ( anchor_y + anchor.yOffset ); }
	}
	
	// Apply the pivot point
	void ApplyPivot (){		
		if ( pivot == null ) { return; }
		
		if ( pivot.x == RelativeX.Center ) {
			adjustPivot.x = -(transform.localScale.x / 2);
		} else if ( pivot.x == RelativeX.Right ) {
			adjustPivot.x = -transform.localScale.x;
		} else {
			adjustPivot.x = 0;
		}
		
		if ( pivot.y == RelativeY.Center ) {
			adjustPivot.y = -(transform.localScale.y / 2);
		} else if ( pivot.y == RelativeY.Bottom ) {
			adjustPivot.y = -transform.localScale.y;
		} else {
			adjustPivot.y = 0;
		}
	}
	
	public virtual void UpdateWidget (){}
	
	public virtual void Draw (  float x ,   float y   ){}
	
	void CancelParams (){
		if ( transform.localScale.z != 1 ) {
			transform.localScale = new Vector3 ( transform.localScale.x, transform.localScale.y, 1 );
		}
		
		if ( transform.localEulerAngles.x != 0 ) {
			transform.localEulerAngles = new Vector3 ( 0, transform.localEulerAngles.y, transform.localEulerAngles.z );
		}
		
		if ( transform.localEulerAngles.y != 0 ) {
			transform.localEulerAngles = new Vector3 ( transform.localEulerAngles.x, 0, transform.localEulerAngles.z );
		}
	}
	
	void Start ()
	{
		var parent = transform.parent;
		var page = parent.GetComponent<OGPage>();
		while (parent != null && page == null)
		{
			parent = parent.parent;
			page = parent.GetComponent<OGPage>();
		}
		root = page.root;
	}
	
	void OnGUI (){
		colliderRect = new Rect ( transform.position.x, transform.position.y, transform.localScale.x, transform.localScale.y );
		
		GUI.depth = (int)transform.position.z;
		
		Quaternion quat = Quaternion.identity;
		quat.eulerAngles = transform.eulerAngles;
		GUI.matrix = Matrix4x4.TRS ( new Vector3 ( transform.position.x, transform.position.y, 0 ), quat, Vector3.one );
		
		if (root != null && root.skin != null) {
			GUI.skin = root.skin;
			guiStyle = CheckStyle ( root.skin );
		}
		
		if ( !manualDraw ) {
			Draw ( adjustPivot.x, adjustPivot.y );
		}
		
		quat.eulerAngles = Vector3.zero;
		GUI.matrix = Matrix4x4.TRS ( Vector3.zero, quat, Vector3.one );
	
		mouseOver = colliderRect.Contains ( Event.current.mousePosition );
	}
	
	void Update (){		
		ApplyStretch ();
		ApplyAnchor ();
		ApplyPivot ();
		
		UpdateWidget();
		CancelParams ();
	}
}
