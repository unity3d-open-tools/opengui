#pragma strict

public class OGProgressBar extends OGWidget {
	public var value : float = 0.5;
	public var padding : Vector2;

	private var background : OGSlicedSprite;
	private var thumb : OGSprite;

	public function SetValue ( value : float ) {
		if ( this.value == value ) { return; }
		
		this.value = value;
		value = Mathf.Clamp ( value, 0, 1 );

		SetDirty();
	}


	/////////////////
	// Set drawn
	/////////////////
	override function SetDrawn ( drawn : boolean ) {
		isDrawn = drawn;

		background.isDrawn = isDrawn;
		thumb.isDrawn = isDrawn;
	}
	
	/////////////////
	// Build
	/////////////////
	override function Build () {
		// Background		
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSlicedSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSlicedSprite );
				
			} else {			
				var newBg : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newBg.transform.parent = this.transform;
				background = newBg;
			}
		}
		
		background.transform.localScale = Vector3.one;
		background.transform.localEulerAngles = Vector3.zero;
		background.transform.localPosition = Vector3.zero;
		
		background.pivot = this.pivot;
		
		background.styles.basic = this.styles.basic;
		background.hidden = true;
		background.isDrawn = isDrawn;
		
		// Thumb		
		if ( thumb == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSprite ) ) {
				thumb = this.gameObject.GetComponentInChildren ( OGSprite );
				
			} else {			
				var newThumb : OGSprite = new GameObject ( "Sprite", OGSprite ).GetComponent ( OGSprite );
				newThumb.transform.parent = this.transform;
				thumb = newThumb;
			}
		}	

		thumb.transform.localEulerAngles = Vector3.zero;
		thumb.transform.localScale = new Vector3 ( value - ((padding.x*2)/this.transform.localScale.x), 1 - ((padding.y*2)/this.transform.localScale.y), 1 );
		thumb.transform.localPosition = new Vector3 ( padding.x / this.transform.localScale.x, padding.y / this.transform.localScale.y );
		
		thumb.pivot = this.pivot;
		
		thumb.styles.basic = this.styles.thumb;
		thumb.hidden = true;
	}


	/////////////////
	// Update
	/////////////////
	override function UpdateWidget () {
		// Null check
		if ( !background || !thumb ) {
			Build ();
			return;
		}

		// Update data
		thumb.transform.localScale = new Vector3 ( value - ((padding.x*2)/this.transform.localScale.x), 1 - ((padding.y*2)/this.transform.localScale.y), 1 );
		thumb.transform.localPosition = new Vector3 ( padding.x / this.transform.localScale.x, padding.y / this.transform.localScale.y );
	}
}
